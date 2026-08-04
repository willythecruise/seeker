#!/usr/bin/env node
/* Verify multi-select (choose-all-that-apply) end-to-end via the live API. */
const mongoose = require('mongoose');
const BASE = 'http://localhost:3000';
const URI = process.env.MONGO_URI || 'mongodb+srv://willythedev:poAAAi6hLZ55cEm6@cluster0.1umip.mongodb.net/?appName=Cluster0';

let failures = 0;
const ok = (c, m) => { if (c) console.log('  ✓ ' + m); else { failures++; console.log('  ✗ FAIL: ' + m); } };

(async () => {
  const mongoose2 = await mongoose.connect(URI, { dbName: 'orion' });
  const db = mongoose2.connection.db;

  // 1. Create a temp test covering the whole dotnet pool (includes 4 multi)
  const test = await db.collection('tests').insertOne({
    name: 'Multi Verify Test', description: '', durationMin: 10, passPct: 50,
    categories: ['dotnet'], diffFocus: 'balanced', count: 58, shuffle: true,
    autoSubmit: true, showAnswers: true, published: true, createdAt: new Date(), updatedAt: new Date()
  });
  const testId = test.insertedId.toString();

  // 2. Start an attempt
  const start = await (await fetch(BASE + '/api/tests/' + testId + '/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ candidate: 'Multi Tester' }) })).json();
  const att = start.attempt, qs = start.questions;
  ok(att.order.length === 58, 'attempt has 58 questions');

  // 3. Locate a multi question; verify runner payload has no answers leaked
  const multiQids = att.order.filter(id => qs[id] && qs[id].type === 'multi');
  ok(multiQids.length >= 1, 'at least 1 multi-select question in sample (' + multiQids.length + ' found)');
  const mqid = multiQids[0];
  ok(qs[mqid].correct === undefined, 'runner payload does NOT leak the correct answer');
  ok(qs[mqid].options.length === 4, 'multi question options present');

  // 4. Answer the multi question with shown indices [0,2] (whatever they are)
  await fetch(BASE + '/api/attempts/' + att.id + '/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: mqid, value: [0, 2] }) });

  // 5. Submit and check grading of the multi question via results
  const sub = await (await fetch(BASE + '/api/attempts/' + att.id + '/submit', { method: 'POST' })).json();
  const res = sub.attempt.results[mqid];
  ok('correct' in res, 'multi question graded server-side: ' + JSON.stringify(res));
  ok(qs[mqid] && sub.questions[mqid].correct !== undefined, 'post-submit payload includes shown-space correct answer');
  const shownCorrect = sub.questions[mqid].correct;
  ok(Array.isArray(shownCorrect), 'correct is an array of shown indices');

  // 6. Verify permutation consistency: shown correct maps to the stored real answer set
  const realQ = await db.collection('questions').findOne({ qid: mqid });
  const perm = att.optionOrder[mqid];
  const mapped = shownCorrect.map(i => perm[i]).sort((a, b) => a - b);
  const expected = realQ.answer.slice().sort((a, b) => a - b);
  ok(JSON.stringify(mapped) === JSON.stringify(expected), 'shown-correct maps back to the real answer set');

  // 7. Cleanup
  await db.collection('attempts').deleteOne({ _id: att._id });
  await db.collection('tests').deleteOne({ _id: test.insertedId });
  console.log('\n' + (failures === 0 ? 'MULTI-SELECT VERIFICATION PASSED ✅' : failures + ' FAILURES ❌'));
  await mongoose.disconnect();
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => { console.error('CRASH:', e.message); process.exit(1); });
