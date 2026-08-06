'use strict';
/* Public candidate signup + admin approval of signup requests.
   Mounted at /api/signup. */
const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Candidate, SignupRequest } = require('./models');
const { requireAuth } = require('./auth');
const { notifyNewSignup, sendSignupReceived, sendApproval, sendRejection } = require('./mailer');

const router = express.Router();

const USERNAME_RE = /^[a-z0-9._-]{3,24}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Known tech fields, kept in sync with the frontend CATS list. */
const KNOWN_CATS = new Set([
  'system-design', 'frontend', 'backend', 'db-mongodb', 'db-postgres', 'coding',
  'devops', 'solutions', 'cs', 'java', 'python', 'dotnet', 'springboot',
  'django', 'typescript', 'go', 'rust', 'dsa', 'backend-eng'
]);

/* ── Public ────────────────────────────────────────────────── */

/* POST /api/signup/check-username { username } -> { available } */
router.post('/check-username', async (req, res) => {
  const uname = String((req.body || {}).username || '').trim().toLowerCase();
  if (!USERNAME_RE.test(uname)) {
    return res.json({ valid: false, available: false, error: 'Usernames are 3–24 letters, digits, dots, dashes or underscores' });
  }
  const [cand, pending] = await Promise.all([
    Candidate.findOne({ username: uname }).select('_id').lean(),
    SignupRequest.findOne({ username: uname, status: 'pending' }).select('_id').lean()
  ]);
  res.json({ valid: true, available: !cand && !pending, taken: !!(cand || pending) });
});

/* POST /api/signup/requests { username, displayName, email, categories } */
router.post('/requests', async (req, res) => {
  const b = req.body || {};
  const uname = String(b.username || '').trim().toLowerCase();
  const displayName = String(b.displayName || '').trim().slice(0, 80);
  const email = String(b.email || '').trim().toLowerCase();
  const cats = Array.isArray(b.categories) ? b.categories.filter(c => KNOWN_CATS.has(c)) : [];
  if (!USERNAME_RE.test(uname)) return res.status(400).json({ error: 'Username must be 3–24 letters, digits, dots, dashes or underscores' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter a valid email address' });
  if (!cats.length) return res.status(400).json({ error: 'Pick at least one tech field' });

  const [takenCand, takenReq] = await Promise.all([
    Candidate.findOne({ username: uname }).select('_id').lean(),
    SignupRequest.findOne({ username: uname, status: 'pending' }).select('_id').lean()
  ]);
  if (takenCand || takenReq) return res.status(409).json({ error: 'That username is already taken' });

  let rec;
  try {
    rec = await SignupRequest.create({ username: uname, displayName, email, categories: cats });
  } catch (e) {
    if (e && e.code === 11000) return res.status(409).json({ error: 'That username is already taken' });
    throw e;
  }
  notifyNewSignup({ username: uname, displayName, email, categories: cats });
  sendSignupReceived({ username: uname, displayName, email, categories: cats });
  res.status(201).json({ ok: true, id: rec._id.toString() });
});

/* ── Admin ─────────────────────────────────────────────────── */
router.use(requireAuth);

function publicRequest(r) {
  return {
    id: r._id.toString(),
    username: r.username,
    displayName: r.displayName,
    email: r.email,
    categories: r.categories || [],
    status: r.status,
    createdAt: r.createdAt
  };
}

/* GET /api/signup/requests — pending requests, newest first */
router.get('/requests', async (req, res) => {
  const list = await SignupRequest.find({ status: 'pending' }).sort({ createdAt: -1 }).lean();
  res.json(list.map(publicRequest));
});

function tempPassword() {
  const set = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 12 }, () => set[crypto.randomInt(set.length)]).join('');
}

/* POST /api/signup/requests/:id/approve — create the candidate, show temp password once */
router.post('/requests/:id/approve', async (req, res) => {
  const rec = await SignupRequest.findById(req.params.id);
  if (!rec) return res.status(404).json({ error: 'Request not found' });
  if (rec.status !== 'pending') return res.status(409).json({ error: 'This request was already reviewed' });
  const dup = await Candidate.findOne({ username: rec.username }).select('_id').lean();
  if (dup) {
    await SignupRequest.deleteOne({ _id: rec._id });
    return res.status(409).json({ error: 'That username is already taken by a candidate' });
  }
  const pw = tempPassword();
  const hash = await bcrypt.hash(pw, 10);
  const cand = await Candidate.create({
    username: rec.username,
    displayName: rec.displayName || rec.username,
    email: rec.email,
    passwordHash: hash,
    tests: [],
    active: true,
    viewResults: false
  });
  rec.status = 'approved';
  rec.note = 'Approved';
  rec.reviewedBy = req.admin._id;
  rec.reviewedAt = new Date();
  await rec.save();
  sendApproval({ email: rec.email, username: rec.username, displayName: rec.displayName, tempPassword: pw });
  res.json({ tempPassword: pw, candidate: { id: cand._id.toString(), username: cand.username, displayName: cand.displayName, email: cand.email } });
});

/* POST /api/signup/requests/:id/reject — delete the request, optionally notify */
router.post('/requests/:id/reject', async (req, res) => {
  const rec = await SignupRequest.findById(req.params.id);
  if (!rec) return res.status(404).json({ error: 'Request not found' });
  const notify = (req.body || {}).notify !== false;
  if (rec.status === 'pending' && notify) {
    sendRejection({ email: rec.email, username: rec.username });
  }
  await SignupRequest.deleteOne({ _id: rec._id });
  res.json({ ok: true });
});

module.exports = router;
