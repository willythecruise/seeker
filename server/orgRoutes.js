'use strict';
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Candidate, Test, Attempt, Organization, OrganizationSession } = require('./models');
const { requireOrg, createOrganizationSession, publicOrg } = require('./auth');
const { sendTestAssigned } = require('./mailer');

const router = express.Router();

function parseTestIds(tests) {
  if (!Array.isArray(tests)) return [];
  return tests.map(t => {
    try { return new mongoose.Types.ObjectId(String(t)); } catch (e) { return null; }
  }).filter(Boolean);
}

/* Email org candidates about test(s) newly assigned to them. */
async function notifyAssignedTests(candidate, addedIds) {
  const ids = (addedIds || []).filter(Boolean);
  if (!ids.length || !(candidate.email || '').trim()) return;
  try {
    const tests = await Test.find({ _id: { $in: ids } }).select('name').lean();
    const names = tests.map(t => t.name);
    if (names.length) {
      sendTestAssigned({ email: candidate.email, name: candidate.displayName || candidate.username, tests: names });
    }
  } catch (e) {
    console.error('[orgRoutes] notifyAssignedTests failed:', e.message);
  }
}

/* ── Auth (public) ─────────────────────────────────────────── */

/* POST /api/org/login */
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  const uname = String(username || '').trim().toLowerCase();
  const org = await Organization.findOne({ username: uname });
  if (!org || !(await bcrypt.compare(String(password || ''), org.passwordHash))) {
    return res.status(401).json({ error: 'Incorrect username or password' });
  }
  if (org.active === false) return res.status(403).json({ error: 'This organization has been disabled' });
  const token = await createOrganizationSession(org);
  res.json({ token, org: publicOrg(org) });
});

/* POST /api/org/logout */
router.post('/logout', requireOrg, async (req, res) => {
  await OrganizationSession.deleteOne({ _id: req.orgSession._id });
  res.json({ ok: true });
});

/* GET /api/org/me */
router.get('/me', requireOrg, async (req, res) => {
  res.json({ org: publicOrg(req.org) });
});

/* Everything below requires a signed-in org. */
router.use(requireOrg);

/* GET /api/org/tests — tests this org is allowed to assign */
router.get('/tests', async (req, res) => {
  const tests = await Test.find({ _id: { $in: req.org.tests || [] }, published: true }).sort({ name: 1 }).lean();
  res.json(tests.map(t => ({ ...t, id: t._id.toString() })));
});

function publicOrgCandidate(c) {
  return {
    id: c._id.toString(),
    username: c.username,
    displayName: c.displayName,
    email: c.email,
    tests: (c.tests || []).map(t => t.toString()),
    active: c.active !== false,
    viewResults: c.viewResults === true,
    createdAt: c.createdAt
  };
}

/* GET /api/org/candidates — this org's candidates */
router.get('/candidates', async (req, res) => {
  const list = await Candidate.find({ org: req.org._id }).sort({ createdAt: -1 }).lean();
  res.json(list.map(publicOrgCandidate));
});

/* POST /api/org/candidates — add a candidate to this org */
router.post('/candidates', async (req, res) => {
  const { username, displayName, email, password, tests, active } = req.body || {};
  const uname = String(username || '').trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,24}$/.test(uname)) return res.status(400).json({ error: 'Invalid username' });
  if (String(password || '').length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  if (await Candidate.exists({ username: uname })) return res.status(409).json({ error: 'Username already taken' });
  const allowed = new Set((req.org.tests || []).map(t => t.toString()));
  const granted = parseTestIds(tests).filter(t => allowed.has(t.toString()));
  const hash = await bcrypt.hash(String(password), 10);
  const cand = await Candidate.create({
    username: uname,
    displayName: String(displayName || '').trim(),
    email: String(email || '').trim().toLowerCase(),
    passwordHash: hash,
    tests: granted,
    org: req.org._id,
    active: active !== false,
    viewResults: false
  });
  notifyAssignedTests(cand, granted);
  res.status(201).json(publicOrgCandidate(cand));
});

/* PUT /api/org/candidates/:id — update a candidate in this org */
router.put('/candidates/:id', async (req, res) => {
  const cand = await Candidate.findById(req.params.id);
  if (!cand || !cand.org || cand.org.toString() !== req.org._id.toString()) {
    return res.status(404).json({ error: 'Candidate not found' });
  }
  const { displayName, email, tests, active, password } = req.body || {};
  if (displayName !== undefined) cand.displayName = String(displayName).trim();
  if (email !== undefined) cand.email = String(email).trim().toLowerCase();
  if (active !== undefined) cand.active = !!active;
  if (tests !== undefined) {
    const allowed = new Set((req.org.tests || []).map(t => t.toString()));
    const before = (cand.tests || []).map(t => t.toString());
    cand.tests = parseTestIds(tests).filter(t => allowed.has(t.toString()));
    const after = (cand.tests || []).map(t => t.toString());
    notifyAssignedTests(cand, after.filter(id => !before.includes(id)));
  }
  if (password && String(password).length) {
    if (String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    cand.passwordHash = await bcrypt.hash(String(password), 10);
  }
  await cand.save();
  res.json(publicOrgCandidate(cand));
});

/* DELETE /api/org/candidates/:id */
router.delete('/candidates/:id', async (req, res) => {
  const cand = await Candidate.findById(req.params.id);
  if (!cand || !cand.org || cand.org.toString() !== req.org._id.toString()) {
    return res.status(404).json({ error: 'Candidate not found' });
  }
  await Candidate.deleteOne({ _id: cand._id });
  res.json({ ok: true });
});

/* GET /api/org/attempts — submitted attempts by this org's candidates */
router.get('/attempts', async (req, res) => {
  const candidates = await Candidate.find({ org: req.org._id }).select('_id').lean();
  const ids = candidates.map(c => c._id);
  const list = await Attempt.find({ candidateId: { $in: ids } }).sort({ startedAt: -1 }).lean();
  res.json(list.map(a => ({ ...a, id: a._id.toString() })));
});

/* POST /api/org/password — change this org's login password */
router.post('/password', async (req, res) => {
  const { current, next } = req.body || {};
  const org = await Organization.findById(req.org._id);
  if (!org || !(await bcrypt.compare(String(current || ''), org.passwordHash))) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }
  if (String(next || '').length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
  org.passwordHash = await bcrypt.hash(String(next), 10);
  await org.save();
  res.json({ ok: true });
});

module.exports = router;
