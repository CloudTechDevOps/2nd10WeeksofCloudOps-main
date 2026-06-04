import { Router } from 'express';
import { body, query as qv, param, validationResult } from 'express-validator';
import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { query, queryOne } from '../db/pool.js';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = Router();

const coverUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error('Only JPG, PNG, WEBP, and GIF cover images are allowed.'));
  },
});

function coverDataUrl(file) {
  if (!file) return null;
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}

// GET /api/books — list with search, filter, sort, pagination
router.get('/', optionalAuth, [
  qv('page').optional().isInt({ min: 1 }).toInt(),
  qv('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  qv('search').optional().trim().escape(),
  qv('category').optional().isInt({ min: 1 }).toInt(),
  qv('sort').optional().isIn(['created_at', 'price', 'title', 'rating']),
  qv('order').optional().isIn(['asc', 'desc']),
  qv('status').optional().isIn(['active', 'archived', 'draft']),
], async (req, res, next) => {
  try {
    const parsedPage = Number.parseInt(req.query.page, 10);
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const limit = Number.isInteger(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 100)
      : 12;
    const offset   = (page - 1) * limit;
    const search   = req.query.search;
    const category = req.query.category;
    const sort     = req.query.sort  || 'created_at';
    const order    = req.query.order || 'desc';
    const status   = req.query.status || 'active';

    let where = ['b.status = ?'];
    let params = [status];

    if (search) {
      where.push('MATCH(b.title, b.description, b.author) AGAINST(? IN BOOLEAN MODE)');
      params.push(`${search}*`);
    }
    if (category) {
      where.push('b.category_id = ?');
      params.push(category);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const safeSort = ['created_at','price','title','rating'].includes(sort) ? sort : 'created_at';
    const safeOrder = order === 'asc' ? 'ASC' : 'DESC';

    const countSql = `SELECT COUNT(*) as total FROM books b ${whereClause}`;
    const [countRow] = await query(countSql, params);
    const total = countRow?.total || 0;

    const booksSql = `
      SELECT b.*, c.name AS category_name, c.color AS category_color,
             u.username AS created_by_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.created_by = u.id
      ${whereClause}
      ORDER BY b.${safeSort} ${safeOrder}
      LIMIT ${limit} OFFSET ${offset}
    `;
    const books = await query(booksSql, params);

    res.json({
      success: true,
      data: books,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) { next(err); }
});

// GET /api/books/stats
router.get('/stats', async (req, res, next) => {
  try {
    const [stats] = await query(`
      SELECT
        COUNT(*) AS total_books,
        SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) AS active_books,
        SUM(stock) AS total_stock,
        AVG(price) AS avg_price,
        MAX(price) AS max_price,
        MIN(price) AS min_price
      FROM books
    `);
    const categories = await query(`
      SELECT c.name, c.color, COUNT(b.id) as count
      FROM categories c
      LEFT JOIN books b ON b.category_id = c.id AND b.status = 'active'
      GROUP BY c.id ORDER BY count DESC
    `);
    res.json({ success: true, data: { ...stats, categories } });
  } catch (err) { next(err); }
});

// GET /api/books/:id
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const book = await queryOne(`
      SELECT b.*, c.name AS category_name, c.color AS category_color,
             u.username AS created_by_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.created_by = u.id
      WHERE b.id = ?
    `, [req.params.id]);

    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, data: book });
  } catch (err) { next(err); }
});

// POST /api/books
router.post('/', authenticate, coverUpload.single('cover_file'), [
  body('title').trim().isLength({ min: 1, max: 300 }).withMessage('Title is required'),
  body('description').optional().trim().isLength({ max: 5000 }),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('cover_url').optional().isURL().withMessage('Cover must be a valid URL'),
  body('author').optional().trim().isLength({ max: 200 }),
  body('isbn').optional().trim().isLength({ max: 20 }),
  body('category_id').optional().isInt({ min: 1 }),
  body('stock').optional().isInt({ min: 0 }),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const { title, description, price, cover_url, author, isbn, category_id, stock } = req.body;
    const id = randomUUID();
    const coverUrl = coverDataUrl(req.file) || cover_url || null;

    await query(`
      INSERT INTO books (
        id, title, description, price, cover_url,
        author, isbn, category_id, stock, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      title,
      description || null,
      price,
      coverUrl,
      author || null,
      isbn || null,
      category_id || null,
      stock || 0,
      req.user.id,
    ]);

    const book = await queryOne(`
      SELECT b.*, c.name AS category_name, c.color AS category_color
      FROM books b LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `, [id]);

    res.status(201).json({ success: true, data: book });
  } catch (err) { next(err); }
});

// PUT /api/books/:id
router.put('/:id', authenticate, coverUpload.single('cover_file'), [
  body('title').optional().trim().isLength({ min: 1, max: 300 }),
  body('price').optional().isFloat({ min: 0 }),
  body('cover_url').optional().isURL(),
  body('stock').optional().isInt({ min: 0 }),
  body('status').optional().isIn(['active', 'archived', 'draft']),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const existing = await queryOne('SELECT id, created_by FROM books WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Book not found' });
    if (existing.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this book' });
    }

    const uploadedCover = coverDataUrl(req.file);
    if (uploadedCover) req.body.cover_url = uploadedCover;

    const allowed = [
      'title','description','price','cover_url','author','isbn',
      'category_id','stock','status','published_at'
    ];
    const updates = [];
    const values  = [];
    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }
    if (!updates.length) return res.status(400).json({ success: false, message: 'No fields to update' });

    await query(`UPDATE books SET ${updates.join(', ')} WHERE id = ?`, [...values, req.params.id]);
    const book = await queryOne(`
      SELECT b.*, c.name AS category_name, c.color AS category_color
      FROM books b LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `, [req.params.id]);

    res.json({ success: true, data: book });
  } catch (err) { next(err); }
});

// DELETE /api/books/:id
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const existing = await queryOne('SELECT id, created_by FROM books WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Book not found' });
    if (existing.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this book' });
    }

    await query('DELETE FROM books WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (err) { next(err); }
});

// GET /api/books/categories/list
router.get('/categories/list', async (req, res, next) => {
  try {
    const cats = await query('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, data: cats });
  } catch (err) { next(err); }
});

export default router;
