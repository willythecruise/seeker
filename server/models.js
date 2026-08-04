'use strict';
const mongoose = require('mongoose');
const { Schema } = mongoose;

/* ── Admin ─────────────────────────────────────────────────── */
const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  displayName: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, lowercase: true, default: '' },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });
AdminSchema.set('toJSON', { virtuals: false, transform: (d, r) => {
  r.id = r._id.toString(); delete r._id; delete r.passwordHash; return r;
} });

/* ── Session ───────────────────────────────────────────────── */
const SessionSchema = new Schema({
  token: { type: String, required: true, unique: true },
  admin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
}, { versionKey: false });

/* ── Question ──────────────────────────────────────────────── */
const QuestionSchema = new Schema({
  qid: { type: String, required: true, unique: true },   // 'b01' | 'c01' | 'c-<rand>'
  cat: { type: String, required: true },
  diff: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  type: { type: String, enum: ['mcq', 'fill', 'multi', 'matching', 'ordering', 'code'], required: true },
  q: { type: String, required: true },
  code: { type: String, default: '' },
  options: { type: [String], default: undefined },        // mcq / multi / matching right-values
  pairs: { type: Schema.Types.Mixed, default: undefined },  // matching: [{ l, r }]
  ordered: { type: [String], default: undefined },          // ordering: items in correct order
  codeLang: { type: String, enum: ['javascript', 'python'], default: 'javascript' }, // code challenges
  codeStub: { type: String, default: '' },                 // starter code defining solution()
  testCases: { type: Schema.Types.Mixed, default: undefined }, // [{ args, expected, lang? }]
  answer: { type: Schema.Types.Mixed, required: true },   // index (mcq) | [accepted] (fill) | [] (code)
  explain: { type: String, default: '' },
  source: { type: String, enum: ['builtin', 'custom'], default: 'custom' },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });
QuestionSchema.set('toJSON', { virtuals: false, transform: (d, r) => {
  r.id = r.qid; delete r._id; delete r.qid; return r;
} });

/* ── Test ──────────────────────────────────────────────────── */
const TestSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  durationMin: { type: Number, min: 1, max: 240, default: 30 },
  passPct: { type: Number, min: 0, max: 100, default: 70 },
  categories: { type: [String], default: [] },
  diffFocus: { type: String, enum: ['beginner', 'balanced', 'advanced'], default: 'balanced' },
  count: { type: Number, min: 1, default: 20 },
  shuffle: { type: Boolean, default: true },
  autoSubmit: { type: Boolean, default: true },
  showAnswers: { type: Boolean, default: true },
  published: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });
TestSchema.set('toJSON', { virtuals: false, transform: (d, r) => {
  r.id = r._id.toString(); delete r._id; return r;
} });

/* ── Attempt ───────────────────────────────────────────────── */
const AttemptSchema = new Schema({
  testId: { type: Schema.Types.ObjectId, ref: 'Test' },
  testName: { type: String },
  candidate: { type: String, required: true },
  email: { type: String, default: '' },
  ip: { type: String, default: '' },             // proctoring: client IP at start
  ua: { type: String, default: '' },             // proctoring: user agent at start
  leaves: { type: Number, default: 0 },          // proctoring: tab/window switches
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  durationSec: { type: Number },
  remainingSec: { type: Number },
  passPct: { type: Number },
  status: { type: String, enum: ['in-progress', 'submitted'], default: 'in-progress' },
  order: { type: [String], default: [] },            // qids in presentation order
  optionOrder: { type: Schema.Types.Mixed, default: () => ({}) }, // qid -> permuted indices
  answers: { type: Schema.Types.Mixed, default: () => ({}) },    // qid -> shown index | string
  flagged: { type: [Boolean], default: [] },
  autoSubmit: { type: Boolean, default: true },
  showAnswers: { type: Boolean, default: true },
  /* grading (computed server-side on submit) */
  pct: { type: Number },
  correct: { type: Number },
  total: { type: Number },
  passed: { type: Boolean },
  results: { type: Schema.Types.Mixed, default: () => ({}) },   // qid -> { value, correct }
  byCat: { type: Schema.Types.Mixed, default: () => ({}) }
}, { versionKey: false });
AttemptSchema.set('toJSON', { virtuals: false, transform: (d, r) => {
  r.id = r._id.toString(); delete r._id; return r;
} });

/* ── Event log (proctoring / audit trail) ──────────────────── */
const EventLogSchema = new Schema({
  kind: { type: String, enum: ['identify', 'start', 'discard', 'submit'], required: true },
  attemptId: { type: Schema.Types.ObjectId, ref: 'Attempt' },
  testId: { type: Schema.Types.ObjectId, ref: 'Test' },
  testName: { type: String },
  candidate: { type: String },
  email: { type: String },
  ip: { type: String, default: '' },
  ua: { type: String, default: '' },
  leaves: { type: Number, default: 0 },
  at: { type: Date, default: Date.now }
}, { versionKey: false });
EventLogSchema.set('toJSON', { virtuals: false, transform: (d, r) => {
  r.id = r._id.toString(); delete r._id; return r;
} });

module.exports = {
  Admin: mongoose.model('Admin', AdminSchema),
  Session: mongoose.model('Session', SessionSchema),
  Question: mongoose.model('Question', QuestionSchema),
  Test: mongoose.model('Test', TestSchema),
  Attempt: mongoose.model('Attempt', AttemptSchema),
  EventLog: mongoose.model('EventLog', EventLogSchema)
};
