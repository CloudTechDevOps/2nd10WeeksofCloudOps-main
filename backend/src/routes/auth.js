import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { query, queryOne } from '../db/pool.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

function makeToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

// POST /api/auth/register
router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3–50 characters'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const { username, email, password } = req.body;
    const existing = await queryOne('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing) return res.status(409).json({ success: false, message: 'Email or username already in use' });

    const hash = await bcrypt.hash(password, 12);
    const id = crypto.randomUUID();
    await query('INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)', [id, username, email, hash]);

    const user = await queryOne('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [id]);
    const token = makeToken(user);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await queryOne('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const { password: _, ...safeUser } = user;
    const token = makeToken(safeUser);
    res.json({ success: true, data: { user: safeUser, token } });
  } catch (err) { next(err); }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await queryOne('SELECT id, username, email, role, avatar_url, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

export default router;
