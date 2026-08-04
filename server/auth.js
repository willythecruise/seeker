'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const { Admin, Session } = require('./models');
const { newToken } = require('./lib');

const router = express.Router();
const SESSION_DAYS = 7;

async function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  const session = await Session.findOne({ token, expiresAt: { $gt: new Date() } });
  if (!session) return res.status(401).json({ error: 'Session expired — please sign in again' });
  const admin = await Admin.findById(session.admin);
  if (!admin) return res.status(401).json({ error: 'Account not found' });
  req.admin = admin;
  req.session = session;
  next();
}

function requireSuperadmin(req, res, next) {
  if (req.admin.role !== 'superadmin') return res.status(403).json({ error: 'Superadmin role required' });
  next();
}

async function createSession(admin) {
  const token = newToken();
  await Session.create({ token, admin: admin._id, expiresAt: new Date(Date.now() + SESSION_DAYS * 864e5) });
  // housekeeping: drop expired sessions and cap old ones per admin
  await Session.deleteMany({ expiresAt: { $lt: new Date() } });
  const old = await Session.find({ admin: admin._id }).sort({ createdAt: -1 }).skip(20).select('_id').lean();
  if (old.length) await Session.deleteMany({ _id: { $in: old.map(s => s._id) } });
  return token;
}

function publicAdmin(admin) {
  return { id: admin._id.toString(), username: admin.username, displayName: admin.displayName, email: admin.email, role: admin.role, createdAt: admin.createdAt };
}

/* GET /api/auth/bootstrap — is a first admin needed? */
router.get('/bootstrap', async (req, res) => {
  const count = await Admin.countDocuments();
  res.json({ needsBootstrap: count === 0 });
});

/* POST /api/auth/register — create the first superadmin */
router.post('/register', async (req, res) => {
  const count = await Admin.countDocuments();
  if (count > 0) return res.status(403).json({ error: 'An administrator already exists — sign in instead' });
  const { username, email, password } = req.body || {};
  const uname = String(username || '').trim().toLowerCase();
  const pw = String(password || '');
  if (!/^[a-z0-9._-]{3,24}$/.test(uname)) return res.status(400).json({ error: 'Username must be 3–24 letters, digits, dots, dashes or underscores' });
  if (pw.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const hash = await bcrypt.hash(pw, 10);
  const admin = await Admin.create({ username: uname, email: String(email || '').trim(), passwordHash: hash, role: 'superadmin', displayName: uname });
  const token = await createSession(admin);
  res.status(201).json({ token, admin: publicAdmin(admin) });
});

/* POST /api/auth/login */
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  const uname = String(username || '').trim().toLowerCase();
  const admin = await Admin.findOne({ username: uname });
  if (!admin || !(await bcrypt.compare(String(password || ''), admin.passwordHash))) {
    return res.status(401).json({ error: 'Incorrect username or password' });
  }
  const token = await createSession(admin);
  res.json({ token, admin: publicAdmin(admin) });
});

/* POST /api/auth/logout */
router.post('/logout', requireAuth, async (req, res) => {
  await Session.deleteOne({ _id: req.session._id });
  res.json({ ok: true });
});

/* GET /api/auth/me */
router.get('/me', requireAuth, async (req, res) => {
  res.json({ admin: publicAdmin(req.admin) });
});

module.exports = { router, requireAuth, requireSuperadmin, publicAdmin };
