const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'hackathon-secret-change-me';

async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 10);
}

async function comparePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { hashPassword, comparePassword, generateToken, verifyToken };
