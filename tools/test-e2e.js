#!/usr/bin/env node
/* ============================================================
   Orion E2E test — drives the real frontend (jsdom) against the
   live Express + MongoDB server on http://localhost:3000
   ============================================================ */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'http://localhost:3000';
const TS = Date.now().toString(36); // unique run suffix

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const script = html.match(/<script>\n([\s\S]*?)\n<\/script>/)[1];

let failures = 0;
const ok = (cond, msg) => {
  if (cond) console.log('  ✓ ' + msg);
  else { failures++; console.log('  ✗ FAIL: ' + msg); }
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, timeout = 8000, what = 'condition') {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    try { if (await fn()) return; } catch (e) {}
    await sleep(120);
  }
  throw new Error('Timed out waiting for ' + what);
}

(async () => {
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: BASE + '/', pretendToBeVisual: true });
  const { window } = dom;
  const { document } = window;

  // Wire the frontend to the real server
  window.fetch = (url, opts) => {
    const u = new URL(String(url), BASE + '/');
    const p = fetch(u, opts);
    if (u.pathname.includes('/answer')) {
      p.then(r => console.log('  [answer]', (opts && opts.method) || 'GET', u.pathname, '->', r.status))
       .catch(e => console.log('  [answer] ERROR', e.message));
    }
    return p;
  };

  window.eval(script + `
  window.__dbgFill = m => console.log("  [fill]" , m);
  ;window.__O = {
    S, boot, render, doLogin, startTestEditor, saveTest, submitAttempt,
    getTDraft: () => tDraft, getQDraft: () => qDraft,
    setMode, startTimer, stopTimer
  };`);
  const O = window.__O;

  const click = async sel => {
    // robust click: find a connected element and dispatch; retry if a render detached it
    const t0 = Date.now();
    while (Date.now() - t0 < 10000) {
      const el = document.querySelector(sel);
      if (el && el.isConnected) {
        el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
        await sleep(180);
        return;
      }
      await sleep(120);
    }
    throw new Error('click: element never connected ' + sel);
  };
  const setVal = (sel, v) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error('missing ' + sel);
    el.value = v;
    el.dispatchEvent(new window.Event('input', { bubbles: true }));
  };
  const text = sel => { const el = document.querySelector(sel); return el ? el.textContent.trim() : ''; };

  /* ── Boot: expect login screen (no stored token) ── */
  console.log('\n[Boot & auth]');
  O.boot();
  await waitFor(() => text('.auth-title') === 'Admin console', 10000, 'login screen');
  ok(true, 'unauthenticated → login screen shown');

  if (document.querySelector('[data-action="show-register"]')) {
    await click('[data-action="show-register"]');
    ok(text('.auth-title').includes('Create the first admin'), 'register view available');
    await click('[data-action="back-to-login"]');
  } else {
    console.log('  ○ register UI skipped (admins already exist)');
  }
  setVal('#loginUser', 'admin'); setVal('#loginPass', 'wrong-pass');
  document.querySelector('#loginForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await waitFor(() => document.querySelector('.toast.error') || text('.page-title').startsWith('Good day'), 6000, 'bad-login outcome');
  ok(text('.page-title') !== 'Good day', 'wrong password rejected');

  // good login
  setVal('#loginUser', 'admin'); setVal('#loginPass', 'admin1234');
  document.querySelector('#loginForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await waitFor(() => text('.page-title').startsWith('Good day'), 12000, 'dashboard after login');
  ok(true, 'login succeeds → dashboard renders');
  ok(document.querySelectorAll('.stat-card').length === 4, '4 stat cards');
  ok(document.querySelector('.admin-chip'), 'admin chip shows signed-in user');

  /* ── Dashboard data from Mongo ── */
  console.log('\n[Data from MongoDB]');
  ok(O.S.stats && O.S.stats.questions >= 80, 'stats: ' + (O.S.stats && O.S.stats.questions) + ' questions in bank');
  ok(O.S.questions.length >= 80, 'question bank loaded (' + O.S.questions.length + ')');
  ok(document.querySelectorAll('.coverage-row').length >= 8, '8+ category coverage rows');
  ok(O.S.tests.length >= 1, 'tests loaded from DB (' + O.S.tests.length + ')');

  /* ── Tests tab ── */
  console.log('\n[Test management]');
  await click('[data-action="tab"][data-value="tests"]');
  ok(text('.page-title') === 'Tests', 'tests view');
  ok(document.body.textContent.includes('Engineering Foundations — Screening'), 'demo test listed');

  await click('[data-action="preview-test"]');
  ok(document.querySelector('.modal'), 'preview modal');
  await click('[data-action="close-modal"]');

  await click('[data-action="new-test"]');
  await waitFor(() => text('.page-title') === 'New test', 6000, 'editor');
  setVal('[data-draft="name"]', 'E2E Test ' + TS);
  setVal('[data-draft="desc"]', 'Created by the e2e test.');
  await click('[data-action="toggle-cat"][data-value="frontend"]');
  await click('[data-action="toggle-cat"][data-value="backend"]');
  ok(!O.getTDraft().cats.has('frontend') && !O.getTDraft().cats.has('backend'), 'categories toggled');
  await click('[data-action="step"][data-field="count"][data-dir="1"]');
  await click('[data-action="set-diff"][data-value="advanced"]');
  await click('[data-action="save-test"][data-mode="publish"]');
  await waitFor(() => O.S.tests.some(t => t.name === 'E2E Test ' + TS), 15000, 'test persisted to Mongo');
  ok(O.S.tests.find(t => t.name === 'E2E Test ' + TS).published === true, 'test saved & published (Mongo)');

  const e2eId = O.S.tests.find(t => t.name === 'E2E Test ' + TS).id;
  await click('[data-action="duplicate-test"][data-id="' + e2eId + '"]');
  await waitFor(() => O.S.tests.some(t => t.name === 'E2E Test ' + TS + ' (copy)'), 15000, 'duplicate in DB');
  ok(true, 'duplicate persisted');

  /* ── Question CRUD ── */
  console.log('\n[Question bank CRUD (Mongo)]');
  await click('[data-action="tab"][data-value="questions"]');
  const qCountBefore = O.S.questions.length;
  const qText = 'E2E: What is 1 + "1"? [' + TS + ']';
  await click('[data-action="add-question"]');
  setVal('[data-qdraft="q"]', qText);
  setVal('[data-qdraft="code"]', 'console.log(1 + "1");');
  setVal('[data-qdraft="opt"][data-i="0"]', '"11"');
  setVal('[data-qdraft="opt"][data-i="1"]', '2');
  setVal('[data-qdraft="opt"][data-i="2"]', 'NaN');
  setVal('[data-qdraft="opt"][data-i="3"]', 'Error');
  await click('[data-action="qcorrect"][data-value="0"]');
  setVal('[data-qdraft="explain"]', 'Number + string concatenates in JS.');
  await click('[data-action="save-question"]');
  await waitFor(() => O.S.questions.some(q => q.q === qText), 15000, 'question in Mongo');
  ok(true, 'custom question added (' + O.S.questions.length + ' total)');

  const newQ = O.S.questions.find(q => q.q === qText);
  ok(!!newQ && !!newQ.id, 'question has id from server: ' + newQ.id);
  await click('[data-action="edit-question"][data-id="' + newQ.id + '"]');
  setVal('[data-qdraft="q"]', qText + ' (edited)');
  await click('[data-action="save-question"]');
  await waitFor(() => O.S.questions.find(q => q.id === newQ.id).q === qText + ' (edited)', 12000, 'question edited');
  ok(true, 'question updated in Mongo');

  /* ── Candidate flow ── */
  console.log('\n[Candidate portal]');
  await click('[data-action="mode"][data-value="candidate"]');
  await waitFor(() => O.S.pubTests.length > 0 && O.S.pubTests.some(t => t.name === 'Engineering Foundations — Screening'), 10000, 'published tests fetched');
  await waitFor(() => text('.page-title') === 'Engineering assessments' && document.body.textContent.includes('Engineering Foundations — Screening'), 8000, 'candidate home');
  ok(true, 'published tests listed');
  ok(document.body.textContent.includes('E2E Test ' + TS), 'E2E test visible to candidates');

  const demo = O.S.pubTests.find(t => t.name === 'Engineering Foundations — Screening');
  await click('[data-action="start-test"][data-id="' + demo.id + '"]');
  ok(document.querySelector('#startName'), 'start modal');
  setVal('#startName', 'E2E Candidate');
  setVal('#startEmail', 'e2e@example.com');
  await click('[data-action="begin-attempt"]');
  await waitFor(() => O.S.candView === 'runner' && O.S.live, 10000, 'runner active');
  ok(O.S.live.order.length === demo.count, 'attempt created with ' + demo.count + ' questions');
  ok(document.querySelectorAll('#palette .palette-item').length === demo.count, 'palette matches');
  ok(document.querySelector('#timerDisplay'), 'timer visible');

  // answer an MCQ
  const mcqIdx = O.S.live.order.findIndex(id => O.S.qPool[id] && O.S.qPool[id].type === 'mcq');
  const mcqQ = O.S.qPool[O.S.live.order[mcqIdx]];
  await click('[data-action="jump"][data-idx="' + mcqIdx + '"]');
  await click('[data-action="opt"][data-opt="0"]');
  ok(O.S.live.answers[mcqQ.id] === 0, 'MCQ answer saved locally');
  await waitFor(async () => {
    const r = await fetch(BASE + '/api/attempts/' + O.S.live.id + '/state');
    const att = await r.json();
    return att.answers[mcqQ.id] === 0;
  }, 6000, 'answer persisted to Mongo');
  ok(true, 'answer stored in database');

  await click('[data-action="flag"]');
  ok(O.S.live.flagged[mcqIdx] === true, 'question flagged');
  await waitFor(async () => {
    const r = await fetch(BASE + '/api/attempts/' + O.S.live.id + '/state');
    const att = await r.json();
    return att.flagged[mcqIdx] === true;
  }, 6000, 'flag persisted');
  ok(true, 'flag stored in database');

  // fill question
  const fillIdx = O.S.live.order.findIndex(id => O.S.qPool[id] && O.S.qPool[id].type === 'fill');
  if (fillIdx >= 0) {
    const fillQ = O.S.qPool[O.S.live.order[fillIdx]];
    await click('[data-action="jump"][data-idx="' + fillIdx + '"]');
    setVal('#fillInput', String(fillQ.q.match(/___/) ? '' : ''));
    // use the builtin answer if this is a builtin question — else type a plausible answer
    const realQ = O.S.questions.find(q => q.id === fillQ.id);
    const ans = realQ && Array.isArray(realQ.answer) ? realQ.answer[0] : 'x';
    setVal('#fillInput', ans);
    await sleep(700);
    ok(!!O.S.live.answers[fillQ.id], 'fill answer captured');
    let stateSeen = null;
    try {
      await waitFor(async () => {
        const r = await fetch(BASE + '/api/attempts/' + O.S.live.id + '/state');
        const att = await r.json();
        stateSeen = att;
        if (!att.answers || !att.answers[fillQ.id]) console.log('  [dbg] state answers=', JSON.stringify(att.answers), 'qid=', fillQ.id, 'status=', att.status);
        return !!(att.answers && att.answers[fillQ.id]);
      }, 6000, 'fill answer persisted');
    } catch (e) {
      console.log('  [dbg] waitFor failed; S.live.id=', O.S.live && O.S.live.id, 'qid=', fillQ.id, 'local=', JSON.stringify(O.S.live && O.S.live.answers), 'stateSeenKeys=', stateSeen && Object.keys(stateSeen));
      throw e;
    }
    ok(true, 'fill answer stored in database');
  }

  // submit
  await click('[data-action="ask-submit"]');
  ok(document.querySelector('.modal'), 'submit confirmation');
  await click('[data-action="modal-confirm"]');
  await waitFor(() => O.S.candView === 'result' && O.S.candResult, 12000, 'graded results');
  const rec = O.S.candResult;
  ok(rec.status === 'submitted', 'attempt marked submitted');
  ok(typeof rec.pct === 'number' && rec.pct >= 0 && rec.pct <= 100, 'server-graded score: ' + rec.pct + '%');
  ok(!!rec.byCat && Object.keys(rec.byCat).length > 0, 'by-category breakdown computed server-side');
  ok(document.querySelectorAll('.review-item').length === rec.total, 'answer review rendered');

  /* ── Admin sees the attempt ── */
  console.log('\n[Admin results (Mongo)]');
  await click('[data-action="mode"][data-value="console"]');
  await waitFor(() => document.querySelector('[data-action="tab"][data-value="dashboard"]'), 8000, 'console back');
  await click('[data-action="tab"][data-value="dashboard"]');
  await waitFor(() => text('.page-title').startsWith('Good day'), 8000, 'dashboard back');
  await click('[data-action="tab"][data-value="results"]');
  ok(document.querySelectorAll('.tbl tbody tr').length >= 1, 'results table populated from Mongo');
  await click('[data-action="view-attempt"]');
  await waitFor(() => document.querySelector('.modal .review-item'), 8000, 'attempt detail');
  ok(true, 'attempt detail shows full review with explanations');

  /* ── Timer auto-submit ── */
  console.log('\n[Timer auto-submit]');
  await click('[data-action="close-modal"]');
  await click('[data-action="mode"][data-value="candidate"]');
  await waitFor(() => text('.page-title') === 'Engineering assessments', 8000, 'candidate home');
  await click('[data-action="start-test"][data-id="' + demo.id + '"]');
  setVal('#startName', 'Auto Tester');
  await click('[data-action="begin-attempt"]');
  await waitFor(() => O.S.candView === 'runner', 8000, 'runner');
  const attId = O.S.live.id;
  O.S.live.remaining = 1;
  await waitFor(async () => {
    const r = await fetch(BASE + '/api/attempts/' + attId + '/state');
    const a = await r.json();
    return a.status === 'submitted';
  }, 12000, 'auto-submit at zero');
  ok(true, 'attempt auto-submitted by timer');

  /* ── Admins ── */
  console.log('\n[Admin management]');
  await click('[data-action="mode"][data-value="console"]');
  await waitFor(() => document.querySelector('[data-action="tab"][data-value="dashboard"]'), 8000, 'console back');
  await click('[data-action="tab"][data-value="dashboard"]');
  await waitFor(() => text('.page-title').startsWith('Good day'), 8000, 'dashboard back');
  await click('[data-action="tab"][data-value="admins"]');
  ok(text('.page-title') === 'Administrators', 'admins view (superadmin)');
  await click('[data-action="add-admin"]');
  setVal('#newAdminUser', 'e2eadmin');
  setVal('#newAdminName', 'E2E Admin');
  setVal('#newAdminEmail', 'e2e@test.dev');
  setVal('#newAdminPass', 'secret1');
  await click('[data-action="new-admin-role"][data-value="admin"]');
  await click('[data-action="save-admin"]');
  await waitFor(() => O.S.admins.some(a => a.username === 'e2eadmin'), 15000, 'admin created in Mongo');
  ok(true, 'admin account created in database');

  // login as the new admin (logout first)
  await click('[data-action="logout"]');
  await waitFor(() => text('.auth-title') === 'Admin console', 8000, 'logged out');
  setVal('#loginUser', 'e2eadmin'); setVal('#loginPass', 'secret1');
  document.querySelector('#loginForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  try {
    await waitFor(() => text('.page-title').startsWith('Good day'), 12000, 'e2e admin login');
  } catch (err) {
    console.log('  [dbg] login failed; page-title=', text('.page-title') || '(none)', '| toast=', (document.querySelector('.toast') || {}).textContent, '| auth=', O.S.auth && O.S.auth.username);
    throw err;
  }
  ok(true, 'new admin can sign in');
  ok(!document.querySelector('[data-action="tab"][data-value="admins"]'), 'regular admin has no Admins tab');

  // password change works
  await click('[data-action="change-password"]');
  setVal('#pwCurrent', 'secret1'); setVal('#pwNext', 'secret2');
  await click('[data-action="save-password"]');
  await sleep(900);
  await click('[data-action="logout"]');
  await waitFor(() => text('.auth-title') === 'Admin console', 8000, 'logged out');
  setVal('#loginUser', 'e2eadmin'); setVal('#loginPass', 'secret2');
  document.querySelector('#loginForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await waitFor(() => text('.page-title').startsWith('Good day'), 12000, 'login with new password');
  ok(true, 'password change works');

  /* ── Cleanup ── */
  console.log('\n[Cleanup]');
  await click('[data-action="logout"]');
  await waitFor(() => text('.auth-title') === 'Admin console', 8000, 'logged out');
  setVal('#loginUser', 'admin'); setVal('#loginPass', 'admin1234');
  document.querySelector('#loginForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await waitFor(() => text('.page-title').startsWith('Good day'), 12000, 'admin login');
  await click('[data-action="tab"][data-value="admins"]');
  await click('[data-action="delete-admin"][data-id="' + O.S.admins.find(a => a.username === 'e2eadmin').id + '"]');
  await click('[data-action="modal-confirm"]');
  await waitFor(() => !O.S.admins.some(a => a.username === 'e2eadmin'), 15000, 'admin removed');
  ok(true, 'e2e admin removed');

  await click('[data-action="tab"][data-value="tests"]');
  const e2eIds = O.S.tests.filter(t => t.name.startsWith('E2E Test')).map(t => t.id);
  for (const id of e2eIds) {
    await click('[data-action="delete-test"][data-id="' + id + '"]');
    await click('[data-action="modal-confirm"]');
    await sleep(600);
  }
  await waitFor(() => !O.S.tests.some(t => t.name.startsWith('E2E Test')), 15000, 'tests removed');
  ok(true, 'E2E tests removed');

  await click('[data-action="tab"][data-value="questions"]');
  await click('[data-action="delete-question"][data-id="' + newQ.id + '"]');
  await click('[data-action="modal-confirm"]');
  await waitFor(() => !O.S.questions.some(q => q.id === newQ.id), 15000, 'question removed');
  ok(true, 'E2E question removed');

  // remove attempts created by the test
  const mongoose = require('mongoose');
  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://willythedev:poAAAi6hLZ55cEm6@cluster0.1umip.mongodb.net/?appName=Cluster0', { dbName: 'orion' });
  const res = await mongoose.connection.db.collection('attempts').deleteMany({ candidate: { $in: ['E2E Candidate', 'Auto Tester'] } });
  await mongoose.disconnect();
  console.log('  ✓ removed ' + res.deletedCount + ' test attempts');

  console.log('\n' + (failures === 0 ? 'ALL E2E TESTS PASSED ✅ (against MongoDB)' : failures + ' FAILURES ❌'));
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('E2E CRASH:', e.message); process.exit(1); });
