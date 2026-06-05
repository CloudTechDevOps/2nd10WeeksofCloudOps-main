import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { testConnection } from './src/db/pool.js';
import authRoutes  from './src/routes/auth.js';
import booksRoutes from './src/routes/books.js';
import { errorHandler, notFound } from './src/middleware/errors.js';

const app    = express();
const server = createServer(app);
const PORT   = process.env.APP_PORT || 80;

app.set('trust proxy', 1);

function isAllowedOrigin(origin) {
  return true;
}

// ── Security ──────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: (origin, cb) => {
    if (isAllowedOrigin(origin)) return cb(null, true);
    cb(new Error(`CORS policy violation: ${origin}`));
  },
  credentials: true,
}));

// ── Rate limiting ─────────────────────────────────────────
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts. Try again later.' }
}));
app.use('/api', rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests. Slow down.' }
}));

// ── Parsing ───────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Health ────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({
  status: 'ok', version: '2.0.0', timestamp: new Date().toISOString()
}));

// ── API Routes ────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/books', booksRoutes);

// Redirect root to API docs placeholder
app.get('/', (_, res) => res.json({
  name: 'BookShelf Pro API',
  version: '2.0.0',
  docs: '/api/docs',
  health: '/health',
}));

app.use(notFound);
app.use(errorHandler);

// ── Socket.IO (real-time) ─────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 30000,
});

// Attach io to app so routes can emit
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`);

  socket.on('join:library', () => {
    socket.join('library');
    socket.emit('connected', { message: 'Welcome to BookShelf Pro live feed' });
  });

  socket.on('disconnect', () => {
    console.log(`[WS] Client disconnected: ${socket.id}`);
  });
});

// Patch routes to emit real-time events after mutations
// We intercept the response by monkey-patching after route definitions
import { query } from './src/db/pool.js';

// Middleware to broadcast after book mutations
app.use('/api/books', (req, res, next) => {
  const original = res.json.bind(res);
  res.json = (body) => {
    if (body?.success && body?.data && ['POST','PUT','DELETE'].includes(req.method)) {
      const event = {
        POST:   'book:created',
        PUT:    'book:updated',
        DELETE: 'book:deleted',
      }[req.method];
      io.to('library').emit(event, body.data || { id: req.params.id });
    }
    return original(body);
  };
  next();
});

// ── Start ─────────────────────────────────────────────────
async function main() {
  const dbOk = await testConnection();
  if (!dbOk && process.env.NODE_ENV === 'production') {
    console.error('Cannot start without database in production');
    process.exit(1);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 BookShelf Pro API running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Health: http://localhost:${PORT}/health\n`);
  });
}

main().catch(console.error);
