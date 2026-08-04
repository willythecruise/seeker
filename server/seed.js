'use strict';
const { Question, Admin } = require('./models');
const bcrypt = require('bcryptjs');

const BUILTIN = require('./data/questions.cjs');

/* Seed the built-in question bank. Custom questions are preserved. */
async function seedQuestions() {
  await Question.deleteMany({ source: 'builtin' });
  const docs = BUILTIN.map(q => {
    const doc = {
      qid: q.id,
      cat: q.cat,
      diff: q.diff,
      type: q.type,
      q: q.q,
      code: q.code || '',
      options: q.options,
      pairs: q.pairs,
      ordered: q.ordered,
      codeLang: q.codeLang,
      codeStub: q.codeStub,
      testCases: q.testCases,
      answer: q.answer,
      explain: q.explain,
      source: 'builtin'
    };
    if (q.type === 'matching' && !doc.options && Array.isArray(q.pairs)) doc.options = q.pairs.map(pr => pr.r);
    if (q.type === 'matching') doc.answer = q.pairs.map((_, i) => i);
    if (q.type === 'ordering') doc.answer = q.ordered.map((_, i) => i);
    if (q.type === 'code' && !doc.answer) doc.answer = [];
    return doc;
  });
  await Question.insertMany(docs);
  return docs.length;
}

/* Create the first admin (superadmin) if the collection is empty. */
async function bootstrapAdmin(env) {
  const count = await Admin.countDocuments();
  if (count > 0) return null;
  const username = (env.ADMIN_USERNAME || 'admin').toLowerCase().trim();
  const password = env.ADMIN_PASSWORD || 'admin1234';
  const email = env.ADMIN_EMAIL || '';
  const hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    username,
    displayName: 'Administrator',
    email,
    passwordHash: hash,
    role: 'superadmin'
  });
  console.log(`✓ Bootstrapped first admin: "${username}" (password from ADMIN_PASSWORD, default "admin1234")`);
  return admin;
}

module.exports = { seedQuestions, bootstrapAdmin };
