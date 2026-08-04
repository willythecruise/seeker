'use strict';
const mongoose = require('mongoose');

async function connect(uri, dbName) {
  mongoose.connection.on('connected', () => console.log('✓ MongoDB connected (' + (dbName || 'orion') + ')'));
  mongoose.connection.on('error', err => console.error('✗ MongoDB error:', err.message));
  await mongoose.connect(uri, {
    dbName: dbName || 'orion',
    serverSelectionTimeoutMS: 15000
  });
  return mongoose.connection;
}

module.exports = { connect };
