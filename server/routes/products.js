import express from 'express';
import { db } from '../db.js';

const router = express.Router();

/**
 * GET /api/products
 * Fetch all products from SQLite database
 */
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];

    if (category && category !== 'all') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    const rows = db.prepare(query).all(...params);
    return res.json({ success: true, count: rows.length, products: rows });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/:id
 * Fetch product detail by ID
 */
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
