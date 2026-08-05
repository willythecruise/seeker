'use strict';
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Question, Test, Attempt, Admin, Session, EventLog, Candidate, CandidateSession } = require('./models');
const { requireAuth, requireSuperadmin, publicAdmin, publicCandidate } = require('./auth');
const { gradeAttempt, DIFF_WEIGHTS, sanitizeQuestion } = require('./lib');
const { seedQuestions } = require('./seed');

const router = express.Router();
router.use(requireAuth);

/* ── Dashboard stats ───────────────────────────────────────── */
router.get('/stats', async (req, res) => {
  const [questions, tests, attempts, submitted, admins] = await Promise.all([
    Question.countDocuments(),
    Test.countDocuments(),
    Attempt.countDocuments(),
    Attempt.countDocuments({ status: 'submitted' }),
    Admin.countDocuments()
  ]);
  const published = await Test.countDocuments({ published: true });
  const active = attempts - submitted;
  const scored = await Attempt.find({ status: 'submitted' }).select('pct passed').lean();
  const avgPct = scored.length ? Math.round(scored.reduce((a, x) => a + (x.pct || 0), 0) / scored.length) : 0;
  const passRate = scored.length ? Math.round(scored.filter(x => x.passed).length / scored.length * 100) : 0;
  // one aggregation instead of one query per category
  const grouped = await Question.aggregate([
    { $group: {
        _id: '$cat',
        total: { $sum: 1 },
        beginner: { $sum: { $cond: [{ $eq: ['$diff', 'beginner'] }, 1, 0] } },
        intermediate: { $sum: { $cond: [{ $eq: ['$diff', 'intermediate'] }, 1, 0] } },
        advanced: { $sum: { $cond: [{ $eq: ['$diff', 'advanced'] }, 1, 0] } }
    } }
  ]);
  const CAT_ORDER = ['system-design', 'frontend', 'backend', 'db-mongodb', 'db-postgres', 'coding', 'devops', 'solutions', 'cs', 'java', 'python', 'dotnet', 'springboot', 'backend-eng', 'django', 'typescript', 'go', 'rust', 'dsa'];
  const byCatMap = {};
  grouped.forEach(g => { byCatMap[g._id] = g; });
  const coverage = CAT_ORDER.map(c => ({
    cat: c,
    total: (byCatMap[c] && byCatMap[c].total) || 0,
    beginner: (byCatMap[c] && byCatMap[c].beginner) || 0,
    intermediate: (byCatMap[c] && byCatMap[c].intermediate) || 0,
    advanced: (byCatMap[c] && byCatMap[c].advanced) || 0
  }));
  const recent = await Attempt.find().sort({ startedAt: -1 }).limit(4)
    .select('candidate testName pct passed status startedAt submittedAt').lean();
  res.json({ questions, tests, published, attempts, active, submitted, avgPct, passRate, admins, coverage, recent });
});

/* ── Questions CRUD ────────────────────────────────────────── */
router.get('/questions', async (req, res) => {
  const qs = await Question.find().sort({ qid: 1 }).lean();
  res.json(qs.map(q => ({ ...q, id: q.qid })));
});

router.post('/questions', async (req, res) => {
  const b = req.body || {};
  if (!b.q || !b.cat || !b.diff || !b.type) return res.status(400).json({ error: 'Missing required fields' });
  if ((b.type === 'mcq' || b.type === 'multi') && (!Array.isArray(b.options) || b.options.length < 2)) return res.status(400).json({ error: 'Choice questions need options' });
  if (b.type === 'multi' && (!Array.isArray(b.answer) || !b.answer.length)) return res.status(400).json({ error: 'Multi-select questions need at least one correct option' });
  if (b.type === 'matching' && (!Array.isArray(b.pairs) || b.pairs.length < 2 || !b.pairs.every(pr => pr.l && pr.r))) return res.status(400).json({ error: 'Matching questions need at least two complete pairs' });
  if (b.type === 'ordering' && (!Array.isArray(b.ordered) || b.ordered.length < 2)) return res.status(400).json({ error: 'Ordering questions need at least two items' });
  if (b.type === 'code' && (!b.codeStub || !Array.isArray(b.testCases) || !b.testCases.length)) return res.status(400).json({ error: 'Coding questions need starter code and at least one test case' });
  if (b.type === 'fill' && (!Array.isArray(b.answer) || !b.answer.length)) return res.status(400).json({ error: 'Fill questions need at least one accepted answer' });
  const qid = b.id && /^[a-zA-Z0-9_-]+$/.test(b.id) ? b.id : 'c-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  if (await Question.exists({ qid })) return res.status(409).json({ error: 'Question id already exists' });
  const q = await Question.create({
    qid, cat: b.cat, diff: b.diff, type: b.type, q: b.q, code: b.code || '',
    options: (b.type === 'mcq' || b.type === 'multi') ? b.options : b.type === 'matching' ? (b.options && b.options.length ? b.options : b.pairs.map(pr => pr.r)) : undefined,
    pairs: b.type === 'matching' ? b.pairs : undefined,
    ordered: b.type === 'ordering' ? b.ordered : undefined,
    codeLang: b.type === 'code' ? (b.codeLang || 'javascript') : undefined,
    codeStub: b.type === 'code' ? (b.codeStub || '') : undefined,
    testCases: b.type === 'code' ? b.testCases : undefined,
    answer: b.type === 'matching' ? b.pairs.map((pr, i) => i) : b.type === 'code' ? [] : b.answer,
    explain: b.explain || '', source: 'custom'
  });
  res.status(201).json(q);
});

router.put('/questions/:id', async (req, res) => {
  const b = req.body || {};
  const q = await Question.findOne({ qid: req.params.id });
  if (!q) return res.status(404).json({ error: 'Question not found' });
  if (!b.q || !b.cat || !b.diff || !b.type) return res.status(400).json({ error: 'Missing required fields' });
  q.q = b.q; q.cat = b.cat; q.diff = b.diff; q.type = b.type; q.code = b.code || ''; q.explain = b.explain || '';
  if (b.type === 'mcq' || b.type === 'multi') { q.options = b.options; q.answer = b.answer; }
  else if (b.type === 'matching') { q.options = b.options && b.options.length ? b.options : b.pairs.map(pr => pr.r); q.pairs = b.pairs; q.answer = b.pairs.map((pr, i) => i); }
  else if (b.type === 'ordering') { q.ordered = b.ordered; q.answer = b.ordered.map((_, i) => i); }
  else if (b.type === 'code') { q.codeLang = b.codeLang || 'javascript'; q.codeStub = b.codeStub || ''; q.testCases = b.testCases; q.answer = []; }
  else { q.options = undefined; q.answer = Array.isArray(b.answer) ? b.answer : [String(b.answer)]; }
  await q.save();
  res.json(q);
});

router.delete('/questions/:id', async (req, res) => {
  await Question.deleteOne({ qid: req.params.id });
  res.json({ ok: true });
});

router.post('/reseed', async (req, res) => {
  const n = await seedQuestions();
  res.json({ ok: true, seeded: n });
});

/* ── Tests CRUD ────────────────────────────────────────────── */
router.get('/tests', async (req, res) => {
  const tests = await Test.find().sort({ createdAt: -1 }).lean();
  res.json(tests.map(t => ({ ...t, id: t._id.toString() })));
});

router.post('/tests', async (req, res) => {
  const b = req.body || {};
  if (!b.name || !Array.isArray(b.categories) || !b.categories.length) return res.status(400).json({ error: 'Test needs a name and at least one category' });
  const t = await Test.create({
    name: String(b.name).trim(),
    description: String(b.description || '').trim(),
    durationMin: Math.min(240, Math.max(1, Number(b.durationMin) || 30)),
    passPct: Math.min(100, Math.max(0, Number(b.passPct) || 70)),
    categories: b.categories,
    diffFocus: b.diffFocus || 'balanced',
    count: Math.max(1, Number(b.count) || 20),
    shuffle: b.shuffle !== false,
    autoSubmit: b.autoSubmit !== false,
    showAnswers: b.showAnswers !== false,
    published: !!b.published,
    createdBy: req.admin._id
  });
  res.status(201).json(t);
});

router.put('/tests/:id', async (req, res) => {
  const b = req.body || {};
  const t = await Test.findById(req.params.id);
  if (!t) return res.status(404).json({ error: 'Test not found' });
  if (!b.name || !Array.isArray(b.categories) || !b.categories.length) return res.status(400).json({ error: 'Test needs a name and at least one category' });
  t.name = String(b.name).trim();
  t.description = String(b.description || '').trim();
  t.durationMin = Math.min(240, Math.max(1, Number(b.durationMin) || 30));
  t.passPct = Math.min(100, Math.max(0, Number(b.passPct) || 70));
  t.categories = b.categories;
  t.diffFocus = b.diffFocus || 'balanced';
  t.count = Math.max(1, Number(b.count) || 20);
  t.shuffle = b.shuffle !== false;
  t.autoSubmit = b.autoSubmit !== false;
  t.showAnswers = b.showAnswers !== false;
  t.published = !!b.published;
  t.updatedAt = new Date();
  await t.save();
  res.json(t);
});

router.delete('/tests/:id', async (req, res) => {
  await Test.deleteOne({ _id: req.params.id });
  res.json({ ok: true });
});

router.post('/tests/:id/duplicate', async (req, res) => {
  const t = await Test.findById(req.params.id);
  if (!t) return res.status(404).json({ error: 'Test not found' });
  const copy = await Test.create({
    ...t.toObject(),
    _id: undefined,
    name: t.name + ' (copy)',
    published: false,
    createdBy: req.admin._id,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  res.status(201).json(copy);
});

router.patch('/tests/:id/publish', async (req, res) => {
  const t = await Test.findById(req.params.id);
  if (!t) return res.status(404).json({ error: 'Test not found' });
  t.published = !!req.body.published;
  await t.save();
  res.json(t);
});

/* ── Attempts (admin) ──────────────────────────────────────── */
router.get('/attempts', async (req, res) => {
  const status = req.query.status;
  const filter = status === 'submitted' ? { status: 'submitted' }
    : status === 'in-progress' ? { status: 'in-progress' }
    : {};
  const list = await Attempt.find(filter).sort({ startedAt: -1 }).lean();
  res.json(list.map(a => ({ ...a, id: a._id.toString() })));
});

router.get('/attempts/:id', async (req, res) => {
  const att = await Attempt.findById(req.params.id);
  if (!att) return res.status(404).json({ error: 'Attempt not found' });
  const qids = att.order || [];
  const questions = await Question.find({ qid: { $in: qids } });
  const byId = {};
  questions.forEach(q => { byId[q.qid] = sanitizeQuestion(q, att.optionOrder[q.qid], true); });
  res.json({ attempt: att, questions: byId });
});

/* Force-submit a stale in-progress attempt (e.g. candidate abandoned it). */
router.post('/attempts/:id/force-submit', async (req, res) => {
  const att = await Attempt.findById(req.params.id);
  if (!att) return res.status(404).json({ error: 'Attempt not found' });
  if (att.status === 'submitted') return res.json(att);
  const qids = att.order;
  const questions = await Question.find({ qid: { $in: qids } }).lean();
  const byId = new Map(questions.map(q => [q.qid, q]));
  att.remainingSec = Math.max(0, att.durationSec - Math.round((Date.now() - new Date(att.startedAt).getTime()) / 1000));
  const grade = gradeAttempt(att, byId);
  Object.assign(att, grade, { status: 'submitted', submittedAt: new Date() });
  await att.save();
  res.json(att);
});

/* ── Proctoring / activity log ─────────────────────────────── */
router.get('/events', async (req, res) => {
  const limit = Math.min(500, Number(req.query.limit) || 200);
  const kind = req.query.kind;
  const filter = kind ? { kind } : {};
  const events = await EventLog.find(filter).sort({ at: -1 }).limit(limit);
  res.json(events);
});

/* ── Password change (any admin, for self) ─────────────────── */
router.post('/password', async (req, res) => {
  const { current, next } = req.body || {};
  const admin = await Admin.findById(req.admin._id);
  if (!admin || !(await bcrypt.compare(String(current || ''), admin.passwordHash))) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }
  if (String(next || '').length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
  admin.passwordHash = await bcrypt.hash(String(next), 10);
  await admin.save();
  res.json({ ok: true });
});

/* ── Admins (superadmin) ───────────────────────────────────── */
router.get('/admins', requireSuperadmin, async (req, res) => {
  const admins = await Admin.find().sort({ createdAt: 1 }).lean();
  res.json(admins.map(publicAdmin));
});

router.post('/admins', requireSuperadmin, async (req, res) => {
  const { username, displayName, email, password, role } = req.body || {};
  const uname = String(username || '').trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,24}$/.test(uname)) return res.status(400).json({ error: 'Invalid username' });
  if (String(password || '').length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  if (await Admin.exists({ username: uname })) return res.status(409).json({ error: 'Username already taken' });
  const hash = await bcrypt.hash(String(password), 10);
  const admin = await Admin.create({
    username: uname,
    displayName: String(displayName || '').trim(),
    email: String(email || '').trim().toLowerCase(),
    passwordHash: hash,
    role: role === 'admin' ? 'admin' : 'superadmin'
  });
  res.status(201).json(publicAdmin(admin));
});

router.delete('/admins/:id', requireSuperadmin, async (req, res) => {
  if (req.params.id === req.admin._id.toString()) return res.status(400).json({ error: 'You cannot delete your own account' });
  await Admin.deleteOne({ _id: req.params.id });
  await Session.deleteMany({ admin: req.params.id });
  res.json({ ok: true });
});

/* ── Candidates (granted candidate accounts) ───────────────── */
function parseTestIds(tests) {
  if (!Array.isArray(tests)) return [];
  return tests.map(t => {
    try { return new mongoose.Types.ObjectId(String(t)); } catch (e) { return null; }
  }).filter(Boolean);
}

router.get('/candidates', async (req, res) => {
  const list = await Candidate.find().sort({ createdAt: -1 }).lean();
  res.json(list.map(publicCandidate));
});

router.post('/candidates', async (req, res) => {
  const { username, displayName, email, password, tests, active, viewResults } = req.body || {};
  const uname = String(username || '').trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,24}$/.test(uname)) return res.status(400).json({ error: 'Invalid username' });
  if (String(password || '').length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  if (await Candidate.exists({ username: uname })) return res.status(409).json({ error: 'Username already taken' });
  const hash = await bcrypt.hash(String(password), 10);
  const cand = await Candidate.create({
    username: uname,
    displayName: String(displayName || '').trim(),
    email: String(email || '').trim().toLowerCase(),
    passwordHash: hash,
    tests: parseTestIds(tests),
    active: active !== false,
    viewResults: viewResults === true
  });
  res.status(201).json(publicCandidate(cand));
});

router.put('/candidates/:id', async (req, res) => {
  const cand = await Candidate.findById(req.params.id);
  if (!cand) return res.status(404).json({ error: 'Candidate not found' });
  const { displayName, email, tests, active, password, viewResults } = req.body || {};
  if (displayName !== undefined) cand.displayName = String(displayName).trim();
  if (email !== undefined) cand.email = String(email).trim().toLowerCase();
  if (active !== undefined) cand.active = !!active;
  if (viewResults !== undefined) cand.viewResults = !!viewResults;
  if (tests !== undefined) cand.tests = parseTestIds(tests);
  if (password && String(password).length) {
    if (String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    cand.passwordHash = await bcrypt.hash(String(password), 10);
  }
  await cand.save();
  res.json(publicCandidate(cand));
});

router.delete('/candidates/:id', async (req, res) => {
  await Candidate.deleteOne({ _id: req.params.id });
  await CandidateSession.deleteMany({ candidate: req.params.id });
  res.json({ ok: true });
});

module.exports = router;
