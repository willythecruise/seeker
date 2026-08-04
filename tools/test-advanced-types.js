#!/usr/bin/env node
/* Verify matching + ordering question types end-to-end via the live API. */
const mongoose = require('mongoose');
const BASE = 'http://localhost:3000';
const URI = process.env.MONGO_URI || 'mongodb+srv://willythedev:poAAAi6hLZ55cEm6@cluster0.1umip.mongodb.net/?appName=Cluster0';

let failures = 0;
const ok = (c, m) => { if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ FAIL: ' + m); } };

(async () => {
  await mongoose.connect(URI, { dbName: 'orion' });
  const db = mongoose.connection.db;

  // Build an attempt directly (mimics /start) with both new-type questions
  const mq = await db.collection('questions').findOne({ type: 'matching' });
  const oq = await db.collection('questions').findOne({ type: 'ordering' });
  ok(!!mq && !!oq, 'found matching + ordering questions in DB: ' + mq.qid + ' / ' + oq.qid);
  const permOf = (n) => { const a = Array.from({length:n},(_,i)=>i); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
  const attDoc = {
    testId: undefined, testName: 'Types Verify', candidate: 'Type Tester', email: '', startedAt: new Date(),
    durationSec: 600, passPct: 50, status: 'in-progress',
    order: [mq.qid, oq.qid],
    optionOrder: { [mq.qid]: permOf(mq.options.length), [oq.qid]: permOf(oq.ordered.length) },
    answers: {}, flagged: [false, false], autoSubmit: true, showAnswers: true
  };
  const ins = await db.collection('attempts').insertOne(attDoc);
  const attId = ins.insertedId.toString();
  const att = attDoc;
  // get sanitized questions the same way /start does (via a helper fetch on the submit route it's included; fetch active endpoint won't match; use submit flow below)

  // runner payload check happens via submit response for post-answer; for pre-answer check, replicate sanitize via /start on a temp test
  const test = await db.collection('tests').insertOne({ name: 'Types Verify 3', description: '', durationMin: 10, passPct: 50, categories: [mq.cat], diffFocus: 'balanced', count: 60, shuffle: true, autoSubmit: true, showAnswers: true, published: true, createdAt: new Date(), updatedAt: new Date() });
  const start3 = await (await fetch(BASE + '/api/tests/' + test.insertedId.toString() + '/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ candidate: 'Type Tester 3' }) })).json();
  const qs3 = start3.questions;
  const mq3 = Object.values(qs3).find(q => q.type === 'matching');
  const oq3 = Object.values(qs3).find(q => q.type === 'ordering');
  if (mq3) { ok(mq3.correctPairs === undefined, 'matching runner payload hides correct pairs'); ok(Array.isArray(mq3.options) && Array.isArray(mq3.pairsLeft), 'matching options + pairsLeft present'); }
  if (oq3) { ok(oq3.correctOrder === undefined, 'ordering runner payload hides correct order'); ok(Array.isArray(oq3.items), 'ordering items present'); }
  if (!mq3 || !oq3) console.log('  ○ (pool may not include both types in one attempt — continuing with direct attempt)');
  await db.collection('tests').deleteOne({ _id: test.insertedId });
  await db.collection('attempts').deleteOne({ _id: start3.attempt._id });

  // Answer matching correctly via the real attempt
  const qs = {};
  { const rr = await db.collection('questions').findOne({ qid: mq.qid }); qs[mq.qid] = { options: rr.options, pairsLeft: rr.pairs.map(p=>p.l), type: 'matching' }; }
  { const rr = await db.collection('questions').findOne({ qid: oq.qid }); qs[oq.qid] = { items: rr.ordered, type: 'ordering' }; }
  // permute into shown space
  qs[mq.qid].options = mq.options.map((_, i) => mq.options[att.optionOrder[mq.qid][i]]);
  qs[oq.qid].items = oq.ordered.map((_, i) => oq.ordered[att.optionOrder[oq.qid][i]]);
  const correctChoices = mq.pairs.map(pr => qs[mq.qid].options.indexOf(pr.r));
  const correctIndices = oq.ordered.map(it => qs[oq.qid].items.indexOf(it));
  await fetch(BASE + '/api/attempts/' + attId + '/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: mq.qid, value: correctChoices }) });
  await fetch(BASE + '/api/attempts/' + attId + '/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: oq.qid, value: correctIndices }) });

  const sub = await (await fetch(BASE + '/api/attempts/' + attId + '/submit', { method: 'POST' })).json();
  const res = sub.attempt.results;
  ok(res[mq.qid].correct === true, 'matching graded CORRECT: ' + JSON.stringify(res[mq.qid]));
  ok(res[oq.qid].correct === true, 'ordering graded CORRECT: ' + JSON.stringify(res[oq.qid]));
  ok(sub.questions[mq.qid].correctPairs !== undefined, 'post-submit includes correctPairs');
  ok(sub.questions[oq.qid].correctOrder !== undefined, 'post-submit includes correctOrder');

  // Wrong answers grade false
  const attDoc2 = { ...attDoc, _id: undefined, candidate: 'Type Tester 2', answers: {}, flagged: [false, false], optionOrder: { [mq.qid]: att.optionOrder[mq.qid], [oq.qid]: att.optionOrder[oq.qid] } };
  const ins2 = await db.collection('attempts').insertOne(attDoc2);
  const attId2 = ins2.insertedId.toString();
  const wrongMatch = correctChoices.map((v, i) => (v + 1) % qs[mq.qid].options.length);
  const wrongOrder = correctIndices.slice().reverse();
  await fetch(BASE + '/api/attempts/' + attId2 + '/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: mq.qid, value: wrongMatch }) });
  await fetch(BASE + '/api/attempts/' + attId2 + '/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: oq.qid, value: wrongOrder }) });
  const sub2 = await (await fetch(BASE + '/api/attempts/' + attId2 + '/submit', { method: 'POST' })).json();
  ok(sub2.attempt.results[mq.qid].correct === false, 'matching wrong answer graded INCORRECT');
  ok(sub2.attempt.results[oq.qid].correct === false, 'ordering wrong answer graded INCORRECT');

  // cleanup
  await db.collection('attempts').deleteMany({ candidate: { $in: ['Type Tester', 'Type Tester 2', 'Type Tester 3'] } });
  console.log('\n' + (failures === 0 ? 'ADVANCED-TYPE VERIFICATION PASSED ✅' : failures + ' FAILURES ❌'));
  await mongoose.disconnect();
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('CRASH:', e.message); process.exit(1); });
