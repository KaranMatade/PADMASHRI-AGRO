import express from 'express';
import { db } from '../db.js';

const router = express.Router();

/**
 * GET /api/products
 * Returns product catalog from SQLite database
 * Supports ?category=ploughs, ?search=keyword filters
 * Author: Anushka Shete
 */
router.get('/', (req, res) => {
  try {
    const { category, search, limit = 100 } = req.query;

    let query = 'SELECT * FROM products';
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (search) {
      conditions.push('(name LIKE ? OR name_mr LIKE ? OR description LIKE ?)');
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id LIMIT ?';
    params.push(Number(limit));

    const products = db.prepare(query).all(...params);

    // Get unique categories for filter UI
    const categories = db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all()
      .map(r => r.category).filter(Boolean);

    return res.json({
      success: true,
      count: products.length,
      categories,
      products
    });
  } catch (err) {
    console.error('[PRODUCTS] Error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: `Product '${req.params.id}' not found` });
    }
    return res.json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
