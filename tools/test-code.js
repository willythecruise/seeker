#!/usr/bin/env node
/* Verify write-code challenges: sample run + submit grading via the live API. */
const mongoose = require('mongoose');
const BASE = 'http://localhost:3000';
const URI = process.env.MONGO_URI || 'mongodb+srv://willythedev:poAAAi6hLZ55cEm6@cluster0.1umip.mongodb.net/?appName=Cluster0';

let failures = 0;
const ok = (c, m) => { if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ FAIL: ' + m); } };

(async () => {
  await mongoose.connect(URI, { dbName: 'orion' });
  const db = mongoose.connection.db;

  const cq = await db.collection('questions').findOne({ type: 'code' });
  ok(!!cq, 'found a coding question: ' + cq.qid + ' (' + cq.codeLang + ')');

  // Create an attempt directly
  const att = await db.collection('attempts').insertOne({
    testId: undefined, testName: 'Code Verify', candidate: 'Code Tester', email: '', startedAt: new Date(),
    durationSec: 600, passPct: 50, status: 'in-progress', order: [cq.qid], optionOrder: {},
    answers: {}, flagged: [false], autoSubmit: true, showAnswers: true
  });
  const attId = att.insertedId.toString();

  // 1. run-code endpoint with correct code (uses the sample)
  const goodCode = cq.qid === 'dsac01'
    ? 'function solution(nums, target) { const m = new Map(); for (let i = 0; i < nums.length; i++) { const c = target - nums[i]; if (m.has(c)) return [m.get(c), i]; m.set(nums[i], i); } return []; }'
    : 'function solution(a, b) { return a + b; }';
  const sample = cq.testCases[0];
  const run1 = await (await fetch(BASE + '/api/attempts/' + attId + '/run-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: cq.qid, code: goodCode, args: sample.args, expected: sample.expected }) })).json();
  ok(run1.pass === true, 'run-code passes the sample');

  // 2. wrong code fails the run
  const badCode = 'function solution(a, b) { return a - b; }';
  const run2 = await (await fetch(BASE + '/api/attempts/' + attId + '/run-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: cq.qid, code: badCode, args: sample.args, expected: sample.expected }) })).json();
  ok(run2.pass === false, 'run-code detects a wrong answer');

  // 3. submit with a correct solution → all tests pass
  const realAns = db.collection('questions').findOne({ qid: cq.qid }).then(q => q);
  // try to solve generically: if it's the two-sum question, provide the right impl; else use JS eval of stub name? We'll attempt a correct generic by testing each case.
  // Simplest robust check: submit the KNOWN-good code only if the question is a+b; otherwise test grading mechanics with a purpose-built question.
  if (cq.qid === 'dsac01') {
    const twoSum = 'function solution(nums, target) { const m = new Map(); for (let i = 0; i < nums.length; i++) { const c = target - nums[i]; if (m.has(c)) return [m.get(c), i]; m.set(nums[i], i); } return []; }';
    await fetch(BASE + '/api/attempts/' + attId + '/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: cq.qid, value: twoSum }) });
    const sub = await (await fetch(BASE + '/api/attempts/' + attId + '/submit', { method: 'POST' })).json();
    const res = sub.attempt.results[cq.qid];
    ok(res.correct === true, 'two-sum correct solution passes ALL hidden tests: ' + JSON.stringify(res.detail));
    ok(res.detail && res.detail.passed === res.detail.total, 'passed/total detail present (' + res.detail.passed + '/' + res.detail.total + ')');
    ok(sub.questions[cq.qid].codeStub !== undefined && sub.questions[cq.qid].testCases === undefined, 'post-submit exposes stub but NOT test cases');
  } else {
    // build a scratch code question to verify grading mechanics
    const scratch = await db.collection('questions').insertOne({
      qid: 'c-scratch-test', cat: 'dsa', diff: 'beginner', type: 'code', q: 'add two numbers',
      codeLang: 'javascript', codeStub: 'function solution(a, b) {}',
      testCases: [{ args: [1, 2], expected: 3 }, { args: [10, 20], expected: 30, hidden: true }, { args: [-1, 1], expected: 0, hidden: true }],
      answer: [], explain: 'addition', source: 'custom'
    });
    const att2 = await db.collection('attempts').insertOne({ testId: undefined, testName: 'Code Verify 2', candidate: 'Code Tester 2', startedAt: new Date(), durationSec: 600, passPct: 50, status: 'in-progress', order: ['c-scratch-test'], optionOrder: {}, answers: {}, flagged: [false], autoSubmit: true, showAnswers: true });
    await fetch(BASE + '/api/attempts/' + att2.insertedId.toString() + '/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: 'c-scratch-test', value: 'function solution(a, b) { return a + b; }' }) });
    const sub2 = await (await fetch(BASE + '/api/attempts/' + att2.insertedId.toString() + '/submit', { method: 'POST' })).json();
    const r2 = sub2.attempt.results['c-scratch-test'];
    ok(r2.correct === true && r2.detail.passed === 3, 'scratch question: all 3 tests pass');
    await db.collection('questions').deleteOne({ qid: 'c-scratch-test' });
    await db.collection('attempts').deleteOne({ _id: att2.insertedId });
  }

  // 4. Python code question grading
  const py = await db.collection('questions').findOne({ type: 'code', codeLang: 'python' });
  if (py) {
    const att3 = await db.collection('attempts').insertOne({ testId: undefined, testName: 'Code Verify 3', candidate: 'Code Tester 3', startedAt: new Date(), durationSec: 600, passPct: 50, status: 'in-progress', order: [py.qid], optionOrder: {}, answers: {}, flagged: [false], autoSubmit: true, showAnswers: true });
    const pyCode = 'def solution(n):\n    return n * 2';
    const run3 = await (await fetch(BASE + '/api/attempts/' + att3.insertedId.toString() + '/run-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: py.qid, code: pyCode, args: py.testCases[0].args, expected: py.testCases[0].expected }) })).json();
    ok('pass' in run3, 'python run-code endpoint responds (' + (run3.pass ? 'pass' : 'fail') + ')');
    await db.collection('attempts').deleteOne({ _id: att3.insertedId });
  }

  // cleanup
  await db.collection('attempts').deleteMany({ candidate: { $in: ['Code Tester', 'Code Tester 2', 'Code Tester 3'] } });
  console.log('\n' + (failures === 0 ? 'CODE-CHALLENGE VERIFICATION PASSED ✅' : failures + ' FAILURES ❌'));
  await mongoose.disconnect();
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('CRASH:', e.message); process.exit(1); });
