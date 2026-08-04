'use strict';
const crypto = require('crypto');

/* Grading constants shared with the frontend */
const DIFF_WEIGHTS = {
  beginner: { beginner: 0.6,  intermediate: 0.3, advanced: 0.1 },
  balanced: { beginner: 0.34, intermediate: 0.33, advanced: 0.33 },
  advanced: { beginner: 0.1,  intermediate: 0.3, advanced: 0.6 }
};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function permutedIndices(n) { return shuffle(Array.from({ length: n }, (_, i) => i)); }

function normalize(s) {
  return String(s == null ? '' : s).trim().toLowerCase()
    .replace(/[.,;:!?'")\]]+$/g, '')
    .replace(/\s+/g, ' ');
}

function gradeAnswer(question, value) {
  if (value === undefined || value === null || value === '') return null;
  if (question.type === 'mcq') return value === question.answer;
  if (question.type === 'multi') {
    const want = (question.answer || []).slice().sort((a, b) => a - b);
    const got = Array.isArray(value) ? value.slice().sort((a, b) => a - b) : null;
    if (!got) return null;
    return want.length === got.length && want.every((v, i) => v === got[i]);
  }
  if (question.type === 'matching') {
    // value: array of real option indices (one per left item); -1/null = unanswered row
    if (!Array.isArray(value)) return null;
    const pairs = question.pairs || [];
    if (pairs.length === 0) return null;
    const answered = value.every(v => v !== undefined && v !== null && v !== -1 && v !== '');
    if (!answered) return null;
    const opts = question.options || [];
    return pairs.every((p, i) => opts[value[i]] === p.r);
  }
  if (question.type === 'ordering') {
    // value: array of real item indices in the candidate-chosen order
    if (!Array.isArray(value) || value.length === 0) return null;
    const ordered = question.ordered || [];
    if (ordered.length === 0) return null;
    if (value.length !== ordered.length) return false;
    return value.every((idx, pos) => idx === pos);
  }
  if (question.type === 'code') {
    if (!value || !String(value).trim()) return null;   // unanswered
    return question.passed != null ? question.passed === question.total : true;
  }
  return (question.answer || []).some(a => normalize(a) === normalize(value));
}

function newToken() { return crypto.randomBytes(32).toString('hex'); }

/* Build the sampled question order for an attempt. */
async function sampleAttempt(test, Question) {
  const w = DIFF_WEIGHTS[test.diffFocus] || DIFF_WEIGHTS.balanced;
  const diffs = Object.keys(w).filter(k => w[k] > 0);
  const pool = await Question.find({ cat: { $in: test.categories }, diff: { $in: diffs } });
  const picked = shuffle(pool).slice(0, Math.min(test.count, pool.length));
  const order = picked.map(q => q.qid);
  const optionOrder = {};
  picked.forEach(q => {
    if ((q.type === 'mcq' || q.type === 'multi' || q.type === 'matching') && Array.isArray(q.options)) optionOrder[q.qid] = permutedIndices(q.options.length);
    if (q.type === 'ordering' && Array.isArray(q.ordered)) optionOrder[q.qid] = permutedIndices(q.ordered.length);
  });
  const finalOrder = test.shuffle === false ? order : shuffle(order);
  return { order: finalOrder, optionOrder };
}

/* Present a question to a candidate. Options are permuted; when
   includeAnswer is true the shown-space correct answer is included
   for post-submission review (never during the runner). */
function sanitizeQuestion(q, permutation, includeAnswer) {
  const out = { id: q.qid, cat: q.cat, diff: q.diff, type: q.type, q: q.q };
  if (q.code) out.code = q.code;
  const p = permutation || (q.options ? q.options.map((_, i) => i) : null);
  if (q.type === 'mcq' || q.type === 'multi') {
    const opts = q.options.slice();
    out.options = p.map(i => opts[i]);
    if (includeAnswer && q.type === 'mcq') out.correct = p.indexOf(q.answer);
    if (includeAnswer && q.type === 'multi') out.correct = (q.answer || []).map(a => p.indexOf(a)).sort((a, b) => a - b);
  }
  if (q.type === 'matching') {
    const opts = (q.options || []).slice();
    out.options = p.map(i => opts[i]);                    // shuffled right-column values
    out.pairsLeft = (q.pairs || []).map(pr => pr.l);      // left labels only (no leak)
    if (includeAnswer) out.correctPairs = (q.pairs || []).map(pr => pr.l + ' → ' + pr.r);
  }
  if (q.type === 'code') {
    out.codeLang = q.codeLang || 'javascript';
    out.codeStub = q.codeStub || '';
    // expose only the first visible case as a sample for self-testing
    const cases = Array.isArray(q.testCases) ? q.testCases : [];
    const sample = cases.find(tc => !tc.hidden) || cases[0];
    if (sample) out.sample = { args: sample.args, expected: sample.expected };
  }
  if (q.type === 'ordering') {
    const items = (q.ordered || []).slice();
    out.items = p.map(i => items[i]);                     // shuffled items for the candidate
    if (includeAnswer) out.correctOrder = (q.ordered || []).map(it => p.indexOf(it)); // shown-space indices of correct sequence
  }
  if (includeAnswer && q.type === 'fill') out.answer = q.answer;
  return out;
}

/* Recover the real option index (or indices) from the shown permutation. */
function realIndex(q, shown) {
  const order = q.optionOrder || [];
  if (Array.isArray(shown)) return shown.map(i => order[i]);
  return order[shown];
}

function gradeAttempt(attempt, questionsById) {
  const total = attempt.order.length;
  let correct = 0;
  const results = {};
  const byCat = {};
  const answers = attempt.answers || {};
  const { gradeCode } = require('./codeRunner');
  for (const qid of attempt.order) {
    const q = questionsById.get(qid);
    const raw = answers[qid];
    const value = q && (q.type === 'mcq' || q.type === 'multi' || q.type === 'matching' || q.type === 'ordering') ? realIndex({ optionOrder: attempt.optionOrder[qid] }, raw) : raw;
    let isCorrect = null;
    let detail = null;
    if (q && q.type === 'code') {
      const g = gradeCode(raw, q.testCases, q.codeLang || 'javascript');
      isCorrect = g.correct;
      detail = { passed: g.passed, total: g.total, info: g.detail };
    } else {
      isCorrect = q ? gradeAnswer(q, value) : null;
    }
    if (isCorrect === true) correct++;
    results[qid] = { value: raw, correct: isCorrect, detail };
    if (q) {
      if (!byCat[q.cat]) byCat[q.cat] = { t: 0, c: 0 };
      byCat[q.cat].t++;
      if (isCorrect) byCat[q.cat].c++;
    }
  }
  const pct = total ? Math.round((correct / total) * 100) : 0;
  return { total, correct, pct, passed: pct >= (attempt.passPct || 70), results, byCat };
}

module.exports = {
  DIFF_WEIGHTS, shuffle, permutedIndices, normalize, gradeAnswer,
  newToken, sampleAttempt, sanitizeQuestion, realIndex, gradeAttempt
};
