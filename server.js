'use strict';
require('dotenv').config();
const path = require('path');
const express = require('express');
const { connect } = require('./server/db');
const { seedQuestions, bootstrapAdmin } = require('./server/seed');
const { router: authRouter } = require('./server/auth');
const adminRouter = require('./server/adminRoutes');
const candidateRouter = require('./server/candidateRoutes');

const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI ||
  'mongodb+srv://willythedev:poAAAi6hLZ55cEm6@cluster0.1umip.mongodb.net/?appName=Cluster0';

async function main() {
  await connect(MONGO_URI, process.env.DB_NAME || 'orion');

  // Seed the built-in question bank on first run.
  const { Question, Test } = require('./server/models');
  const count = await Question.countDocuments();
  if (count === 0) {
    const n = await seedQuestions();
    console.log(`✓ Seeded ${n} built-in questions`);
  }
  // Seed demo tests on first run so the candidate flow works immediately.
  const DEMO_TESTS = require('./server/data/demoTests');
  const existingTests = await Test.countDocuments();
  if (existingTests === 0) {
    await Test.insertMany(DEMO_TESTS.map(t => ({ ...t, createdAt: new Date(), updatedAt: new Date() })));
    console.log(`✓ Seeded ${DEMO_TESTS.length} demo tests`);
  }
  await bootstrapAdmin(process.env);

  const app = express();
  app.set('trust proxy', 1);   // real client IP behind Render's proxy
  app.use(express.json({ limit: '1mb' }));

  // Health + API
  app.get('/api/health', (req, res) => res.json({ ok: true }));
  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api', candidateRouter);

  // Landing page (built Vite app) at the root
  const landingDist = path.join(__dirname, 'landing', 'dist');
  app.use(express.static(landingDist));
  app.get('/', (req, res) => res.sendFile(path.join(landingDist, 'index.html')));

  // App (single self-contained bundle) at /app
  app.get('/app', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Server error' });
  });

  app.listen(PORT, () => console.log(`✓ Orion running at http://localhost:${PORT}`));
}

main().catch(err => {
  console.error('Failed to start:', err.message);
  process.exit(1);
});
