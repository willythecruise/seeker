#!/usr/bin/env node
/* ============================================================
   Orion — seed demo tests into an existing database.
   Idempotent: tests are matched by name and skipped if present.
   Usage: node tools/seed-demo-tests.js
   ============================================================ */
'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const DEMO_TESTS = require('../server/data/demoTests');
const { Test } = require('../server/models');

const URI = process.env.MONGO_URI ||
  'mongodb+srv://willythedev:poAAAi6hLZ55cEm6@cluster0.1umip.mongodb.net/?appName=Cluster0';

(async () => {
  await mongoose.connect(URI, { dbName: process.env.DB_NAME || 'orion', serverSelectionTimeoutMS: 15000 });
  let added = 0, skipped = 0;
  for (const t of DEMO_TESTS) {
    const exists = await Test.findOne({ name: t.name });
    if (exists) { skipped++; continue; }
    await Test.create({ ...t, createdAt: new Date(), updatedAt: new Date() });
    added++;
  }
  const total = await Test.countDocuments();
  console.log(`✓ Added ${added} demo tests (${skipped} already present). Total tests: ${total}`);
  await mongoose.disconnect();
  process.exit(0);
})().catch(e => { console.error('Seeding failed:', e.message); process.exit(1); });
