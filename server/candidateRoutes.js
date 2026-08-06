'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const { Question, Test, Attempt, EventLog, Candidate, CandidateSession } = require('./models');
const { sampleAttempt, sanitizeQuestion, gradeAttempt } = require('./lib');
const { runCase } = require('./codeRunner');
const { requireCandidate, createCandidateSession, publicCandidate } = require('./auth');

const router = express.Router();

function clientInfo(req) {
  return {
    ip: String(req.ip || (req.socket && req.socket.remoteAddress) || '').replace(/^::ffff:/, ''),
    ua: String(req.get('user-agent') || '').slice(0, 300)
  };
}

/* Is this attempt owned by the signed-in candidate? Legacy attempts
   created before per-candidate accounts are never resumable. */
function owns(att, cand) {
  return !!att && !!att.candidateId && att.candidateId.toString() === cand._id.toString();
}

function isGranted(cand, testId) {
  const tid = testId.toString();
  return (cand.tests || []).some(t => t.toString() === tid);
}

/* ── Auth (public) ─────────────────────────────────────────── */

/* POST /api/candidate/login */
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  const uname = String(username || '').trim().toLowerCase();
  const cand = await Candidate.findOne({ username: uname });
  if (!cand || !(await bcrypt.compare(String(password || ''), cand.passwordHash))) {
    return res.status(401).json({ error: 'Incorrect username or password' });
  }
  if (cand.active === false) return res.status(403).json({ error: 'This account has been disabled' });
  const token = await createCandidateSession(cand);
  res.json({ token, user: publicCandidate(cand) });
});

/* POST /api/candidate/logout */
router.post('/logout', requireCandidate, async (req, res) => {
  await CandidateSession.deleteOne({ _id: req.candSession._id });
  res.json({ ok: true });
});

/* GET /api/candidate/me */
router.get('/me', requireCandidate, async (req, res) => {
  res.json({ user: publicCandidate(req.candidate) });
});

/* Everything below requires a signed-in candidate. */
router.use(requireCandidate);

/* GET /api/candidate/tests — tests granted to this candidate that are published */
router.get('/tests', async (req, res) => {
  const tests = await Test.find({ _id: { $in: req.candidate.tests || [] }, published: true }).sort({ createdAt: -1 });
  res.json(tests);
});

/* GET /api/candidate/attempts/active — this candidate's latest live attempt, if any */
router.get('/attempts/active', async (req, res) => {
  const att = await Attempt.findOne({ status: 'in-progress', candidateId: req.candidate._id }).sort({ startedAt: -1 });
  if (!att) return res.json({ attempt: null, questions: {} });
  const qids = att.order || [];
  const questions = await Question.find({ qid: { $in: qids } });
  const byId = {};
  questions.forEach(q => { byId[q.qid] = sanitizeQuestion(q, att.optionOrder[q.qid], false); });
  att.remainingSec = Math.max(0, att.durationSec - Math.round((Date.now() - new Date(att.startedAt).getTime()) / 1000));
  res.json({ attempt: att, questions: byId });
});

/* POST /api/candidate/tests/:id/start — sample questions, create the attempt */
router.post('/tests/:id/start', async (req, res) => {
  const test = await Test.findById(req.params.id);
  if (!test) return res.status(404).json({ error: 'Test not found' });
  if (!test.published) return res.status(403).json({ error: 'This test is not published yet' });
  if (!isGranted(req.candidate, test._id)) return res.status(403).json({ error: 'You do not have access to this test' });
  const name = (req.candidate.displayName || req.candidate.username || 'Candidate').trim();
  const { ip, ua } = clientInfo(req);
  const dup = await Attempt.findOne({ testId: test._id, candidateId: req.candidate._id, status: 'in-progress' });
  if (dup) {
    return res.status(409).json({ error: 'You already have this test in progress. Resume it instead' });
  }
  const { order, optionOrder } = await sampleAttempt(test, Question);
  if (!order.length) return res.status(400).json({ error: 'No questions match this test\u2019s configuration' });
  const att = await Attempt.create({
    testId: test._id,
    testName: test.name,
    candidateId: req.candidate._id,
    candidate: name,
    email: req.candidate.email || '',
    ip, ua,
    leaves: 0,
    durationSec: test.durationMin * 60,
    passPct: test.passPct,
    order,
    optionOrder,
    answers: {},
    flagged: order.map(() => false),
    autoSubmit: test.autoSubmit !== false,
    showAnswers: test.showAnswers !== false
  });
  await EventLog.create({
    kind: 'start',
    attemptId: att._id,
    testId: test._id,
    testName: test.name,
    candidate: name,
    email: req.candidate.email || '',
    ip, ua
  });
  const qids = order;
  const questions = await Question.find({ qid: { $in: qids } }).lean();
  const byId = {};
  questions.forEach(q => { byId[q.qid] = sanitizeQuestion(q, optionOrder[q.qid], false); });
  res.status(201).json({ attempt: att, questions: byId });
});

/* GET /api/candidate/attempts/:id/state — resume an attempt */
router.get('/attempts/:id/state', async (req, res) => {
  const att = await Attempt.findById(req.params.id);
  if (!owns(att, req.candidate)) return res.status(404).json({ error: 'Attempt not found' });
  att.remainingSec = Math.max(0, att.durationSec - Math.round((Date.now() - new Date(att.startedAt).getTime()) / 1000));
  res.json(att);
});

/* POST /api/candidate/attempts/:id/answer */
router.post('/attempts/:id/answer', async (req, res) => {
  const att = await Attempt.findById(req.params.id);
  if (!owns(att, req.candidate)) return res.status(404).json({ error: 'Attempt not found' });
  if (att.status !== 'in-progress') return res.status(409).json({ error: 'Attempt already submitted' });
  const { qid, value } = req.body || {};
  if (!att.order.includes(qid)) return res.status(400).json({ error: 'Unknown question' });
  if (value === undefined || value === null) delete att.answers[qid];
  else att.answers[qid] = value;
  att.markModified('answers');   // Mixed fields need explicit dirty marking
  await att.save();
  res.json({ ok: true });
});

/* POST /api/candidate/attempts/:id/run-code — test candidate code against sample/hidden cases without persisting */
router.post('/attempts/:id/run-code', async (req, res) => {
  const att = await Attempt.findById(req.params.id);
  if (!owns(att, req.candidate)) return res.status(404).json({ error: 'Attempt not found' });
  const { qid, code, lang, args, expected } = req.body || {};
  if (!att.order.includes(qid)) return res.status(400).json({ error: 'Unknown question' });
  const q = await Question.findOne({ qid });
  if (!q || q.type !== 'code') return res.status(400).json({ error: 'Not a coding question' });
  if (code === undefined || code === null || !String(code).trim()) return res.status(400).json({ error: 'No code to run' });
  const allowed = (q.languages && q.languages.length) ? q.languages : [q.codeLang || 'javascript'];
  const language = allowed.includes(lang) ? lang : (q.codeLang || 'javascript');
  const r = runCase(language, code, args !== undefined ? args : [], expected !== undefined ? expected : null);
  res.json(r);
});

/* POST /api/candidate/attempts/:id/flag */
router.post('/attempts/:id/flag', async (req, res) => {
  const att = await Attempt.findById(req.params.id);
  if (!owns(att, req.candidate)) return res.status(404).json({ error: 'Attempt not found' });
  const idx = Number(req.body.idx);
  if (!Number.isInteger(idx) || idx < 0 || idx >= att.order.length) return res.status(400).json({ error: 'Invalid index' });
  att.flagged[idx] = !!req.body.flagged;
  await att.save();
  res.json({ ok: true });
});

/* POST /api/candidate/attempts/:id/submit — server-side grading */
router.post('/attempts/:id/submit', async (req, res) => {
  const att = await Attempt.findById(req.params.id);
  if (!owns(att, req.candidate)) return res.status(404).json({ error: 'Attempt not found' });
  if (att.status === 'submitted') {
    return res.status(409).json({ error: 'This attempt was already submitted' });
  }
  const { ip, ua } = clientInfo(req);
  if (Number.isFinite(req.body && req.body.leaves)) att.leaves = Math.max(0, Math.round(req.body.leaves));
  const qids = att.order;
  const questions = await Question.find({ qid: { $in: qids } }).lean();
  const byId = new Map(questions.map(q => [q.qid, q]));
  att.remainingSec = Math.max(0, att.durationSec - Math.round((Date.now() - new Date(att.startedAt).getTime()) / 1000));
  const grade = gradeAttempt(att, byId);
  Object.assign(att, grade, { status: 'submitted', submittedAt: new Date() });
  await att.save();
  await EventLog.create({
    kind: 'submit',
    attemptId: att._id,
    testId: att.testId,
    testName: att.testName,
    candidate: att.candidate,
    email: att.email,
    leaves: att.leaves,
    ip, ua
  });
  const byIdOut = {};
  if (req.candidate.viewResults === true) {
    questions.forEach(q => { byIdOut[q.qid] = sanitizeQuestion(q, att.optionOrder[q.qid], true); });
    return res.json({ attempt: att, questions: byIdOut });
  }
  res.json({ submitted: true });
});

/* GET /api/candidate/stats — metrics for candidates with results access enabled */
router.get('/stats', async (req, res) => {
  if (req.candidate.viewResults !== true) return res.json({ enabled: false });
  const attempts = await Attempt.find({ candidateId: req.candidate._id, status: 'submitted' }).sort({ submittedAt: -1 }).lean();
  const total = attempts.length;
  const passed = attempts.filter(a => a.passed).length;
  const pcts = attempts.map(a => a.pct || 0);
  const byCat = {};
  attempts.forEach(a => {
    Object.entries(a.byCat || {}).forEach(([cat, v]) => {
      if (!byCat[cat]) byCat[cat] = { t: 0, c: 0 };
      byCat[cat].t += (v && v.t) || 0;
      byCat[cat].c += (v && v.c) || 0;
    });
  });
  const avg = total ? Math.round(pcts.reduce((s, p) => s + p, 0) / total) : 0;

  const dayKey = d => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  const days = new Set(attempts.map(a => dayKey(new Date(a.submittedAt))));
  let streak = 0;
  const cur = new Date();
  if (!days.has(dayKey(cur))) cur.setDate(cur.getDate() - 1);
  while (days.has(dayKey(cur))) { streak++; cur.setDate(cur.getDate() - 1); }

  const all = await Attempt.find({ status: 'submitted' }).select('pct').lean();
  const below = all.filter(a => (a.pct || 0) < avg).length;
  const percentile = total && all.length ? Math.round((below / all.length) * 100) : null;

  res.json({
    enabled: true,
    total,
    passed,
    passRate: total ? Math.round((passed / total) * 100) : 0,
    avg,
    best: total ? Math.max(...pcts) : 0,
    streak,
    percentile,
    byCat,
    attempts: attempts.map(a => ({
      id: a._id.toString(),
      testName: a.testName,
      pct: a.pct || 0,
      passed: !!a.passed,
      correct: a.correct || 0,
      total: a.total || 0,
      submittedAt: a.submittedAt
    }))
  });
});

/* POST /api/candidate/attempts/:id/discard */
router.post('/attempts/:id/discard', async (req, res) => {
  const att = await Attempt.findById(req.params.id);
  if (!owns(att, req.candidate)) return res.status(404).json({ error: 'Attempt not found' });
  if (att.status === 'in-progress') {
    const { ip, ua } = clientInfo(req);
    const leaves = Number.isFinite(req.body && req.body.leaves) ? Math.max(0, Math.round(req.body.leaves)) : (att.leaves || 0);
    await EventLog.create({
      kind: 'discard',
      attemptId: att._id,
      testId: att.testId,
      testName: att.testName,
      candidate: att.candidate,
      email: att.email,
      leaves,
      ip, ua
    });
    await Attempt.deleteOne({ _id: att._id });
  }
  res.json({ ok: true });
});

module.exports = router;
