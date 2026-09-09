import express from 'express';
import { db } from '../db.js';

const router = express.Router();

/**
 * GET /api/branches
 * Fetch branch locations from SQLite database
 */
router.get('/', (req, res) => {
  try {
    const branches = db.prepare('SELECT * FROM branches ORDER BY is_head_office DESC').all();
    return res.json({ success: true, count: branches.length, branches });
  } catch (err) {
    console.error('Error fetching branches:', err);
    return res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

export default router;
