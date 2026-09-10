import express from 'express';
import cors from 'cors';
import { initDatabase } from './db.js';
import inquiriesRouter from './routes/inquiries.js';
import productsRouter from './routes/products.js';
import branchesRouter from './routes/branches.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize SQLite database
initDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging for development & demonstration to sir
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Padmashri Agro Backend API',
    version: '1.0.0',
    database: 'SQLite (node:sqlite native)',
    author: 'Anushka Shete & Team',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/inquiries', inquiriesRouter); // Anushka Shete's Core Module
app.use('/api/products', productsRouter);
app.use('/api/branches', branchesRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🌾 Padmashri Agro Backend Server is running on: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Inquiries API: http://localhost:${PORT}/api/inquiries`);
  console.log(`🚜 Products API: http://localhost:${PORT}/api/products`);
});
