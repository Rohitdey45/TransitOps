const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { comparePassword, generateToken } = require('../utils/auth');
const { requireAuth } = require('../middleware/auth');

const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const passwordMatches = await comparePassword(password, user.password);
    if (!passwordMatches) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
