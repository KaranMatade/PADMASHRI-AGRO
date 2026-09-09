import express from 'express';
import { db } from '../db.js';

const router = express.Router();

/**
 * Generate unique reference tracking ID (e.g. PAD-2026-9482)
 */
function generateReferenceNo() {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `PAD-${year}-${randomDigits}`;
}

/**
 * POST /api/inquiries
 * Submit a customer quote request / lead into the database
 */
router.post('/', (req, res) => {
  try {
    const { name, phone, village, product, branch, message } = req.body;

    // Server-side validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    if (!phone || !phone.trim() || phone.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ error: 'Valid 10-digit mobile number is required' });
    }

    if (!village || !village.trim()) {
      return res.status(400).json({ error: 'Village or Taluka location is required' });
    }

    const cleanPhone = phone.trim();
    const cleanName = name.trim();
    const cleanVillage = village.trim();
    const cleanBranch = branch || 'Main Factory (Sadatpur, Sangamner)';
    const cleanMessage = message ? message.trim() : 'Quotation and discount callback requested.';

    // Lookup product name from products table
    let productName = product || 'Heavy Duty Farm Implement';
    try {
      const productRow = db.prepare('SELECT name, name_mr FROM products WHERE id = ?').get(product);
      if (productRow) {
        productName = `${productRow.name} (${productRow.name_mr})`;
      }
    } catch {
      // Keep default
    }

    const referenceNo = generateReferenceNo();

    const insertStmt = db.prepare(`
      INSERT INTO inquiries (
        reference_no, name, phone, village, product_id, product_name, branch, message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      referenceNo,
      cleanName,
      cleanPhone,
      cleanVillage,
      product || 'general',
      productName,
      cleanBranch,
      cleanMessage,
      'Pending'
    );

    const createdInquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(result.lastInsertRowid);

    console.log(`[INQUIRY CREATED] ${referenceNo} from ${cleanName} (${cleanPhone})`);

    return res.status(201).json({
      success: true,
      message: 'Quotation inquiry saved to database successfully',
      inquiry: createdInquiry
    });
  } catch (err) {
    console.error('Error inserting inquiry:', err);
    return res.status(500).json({ error: 'Internal server error while saving inquiry' });
  }
});

/**
 * GET /api/inquiries
 * List all saved quotation leads (for Admin / Factory Lead Dashboard)
 */
router.get('/', (req, res) => {
  try {
    const { status, limit = 50 } = req.query;

    let query = 'SELECT * FROM inquiries';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY id DESC LIMIT ?';
    params.push(Number(limit));

    const inquiries = db.prepare(query).all(...params);
    const stats = {
      total: db.prepare('SELECT COUNT(*) as c FROM inquiries').get().c,
      pending: db.prepare("SELECT COUNT(*) as c FROM inquiries WHERE status = 'Pending'").get().c,
      contacted: db.prepare("SELECT COUNT(*) as c FROM inquiries WHERE status != 'Pending'").get().c
    };

    return res.json({
      success: true,
      count: inquiries.length,
      stats,
      inquiries
    });
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    return res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

/**
 * GET /api/inquiries/:id
 * Retrieve single inquiry by ID or Reference Number
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const isRef = id.startsWith('PAD-');

    const inquiry = isRef
      ? db.prepare('SELECT * FROM inquiries WHERE reference_no = ?').get(id)
      : db.prepare('SELECT * FROM inquiries WHERE id = ?').get(Number(id));

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry record not found' });
    }

    return res.json({ success: true, inquiry });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve inquiry' });
  }
});

/**
 * PATCH /api/inquiries/:id/status
 * Update lead status (e.g. Pending -> Contacted / Quoted / Closed)
 */
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'New status is required' });
    }

    const updateStmt = db.prepare('UPDATE inquiries SET status = ? WHERE id = ?');
    const result = updateStmt.run(status, Number(id));

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Inquiry record not found' });
    }

    const updated = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(Number(id));
    return res.json({ success: true, message: 'Status updated', inquiry: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
