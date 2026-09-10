import express from 'express';
import { db } from '../db.js';

const router = express.Router();

/**
 * Generate unique reference tracking ID (e.g. PAD-2026-9482)
 * Author: Anushka Shete
 */
function generateReferenceNo() {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `PAD-${year}-${randomDigits}`;
}

/**
 * Sanitize input to prevent injection attacks
 */
function sanitize(str) {
  if (!str) return '';
  return String(str).trim().replace(/<[^>]*>/g, '').substring(0, 500);
}

/**
 * POST /api/inquiries
 * Submit a customer quote request into the SQLite database
 */
router.post('/', (req, res) => {
  try {
    const { name, phone, village, product, branch, message } = req.body;

    // Server-side validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Customer name must be at least 2 characters' });
    }

    const cleanPhone = String(phone || '').replace(/[\s\-\+]/g, '').replace(/^91/, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ error: 'Valid 10-digit Indian mobile number required (starts with 6-9)' });
    }

    if (!village || village.trim().length < 2) {
      return res.status(400).json({ error: 'Village or Taluka location is required (min 2 chars)' });
    }

    if (message && message.trim().length > 500) {
      return res.status(400).json({ error: 'Message must be 500 characters or less' });
    }

    const cleanName    = sanitize(name);
    const cleanVillage = sanitize(village);
    const cleanBranch  = sanitize(branch) || 'Main Factory (Sadatpur, Sangamner)';
    const cleanMessage = sanitize(message) || 'Quotation and discount callback requested.';

    // Lookup product name from DB
    let productName = sanitize(product) || 'Heavy Duty Farm Implement';
    try {
      const productRow = db.prepare('SELECT name, name_mr FROM products WHERE id = ?').get(product);
      if (productRow) productName = `${productRow.name} (${productRow.name_mr})`;
    } catch { /* keep default */ }

    // Generate unique reference number
    let referenceNo = generateReferenceNo();
    // Retry once if collision (rare)
    const existing = db.prepare('SELECT id FROM inquiries WHERE reference_no = ?').get(referenceNo);
    if (existing) referenceNo = generateReferenceNo();

    const result = db.prepare(`
      INSERT INTO inquiries (reference_no, name, phone, village, product_id, product_name, branch, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(referenceNo, cleanName, cleanPhone, cleanVillage, product || 'general', productName, cleanBranch, cleanMessage, 'Pending');

    const created = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(result.lastInsertRowid);

    console.log(`[INQUIRY] ✅ ${referenceNo} — ${cleanName} (${cleanPhone}) — ${productName}`);

    return res.status(201).json({
      success: true,
      message: 'Quotation inquiry saved to database successfully',
      inquiry: created
    });
  } catch (err) {
    console.error('[INQUIRY] ❌ Error inserting inquiry:', err.message);
    return res.status(500).json({ error: 'Internal server error while saving inquiry' });
  }
});

/**
 * GET /api/inquiries
 * List all saved quotation leads with status stats
 */
router.get('/', (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM inquiries';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const inquiries = db.prepare(query).all(...params);

    const stats = {
      total:     db.prepare('SELECT COUNT(*) as c FROM inquiries').get().c,
      pending:   db.prepare("SELECT COUNT(*) as c FROM inquiries WHERE status = 'Pending'").get().c,
      contacted: db.prepare("SELECT COUNT(*) as c FROM inquiries WHERE status = 'Contacted'").get().c,
      converted: db.prepare("SELECT COUNT(*) as c FROM inquiries WHERE status = 'Converted'").get().c,
    };

    return res.json({ success: true, count: inquiries.length, page: Number(page), stats, inquiries });
  } catch (err) {
    console.error('[INQUIRY] ❌ Error fetching inquiries:', err.message);
    return res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

/**
 * GET /api/inquiries/:id
 * Retrieve single inquiry by ID or Reference Number (PAD-XXXX-XXXX)
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const isRef = id.startsWith('PAD-');

    const inquiry = isRef
      ? db.prepare('SELECT * FROM inquiries WHERE reference_no = ?').get(id)
      : db.prepare('SELECT * FROM inquiries WHERE id = ?').get(Number(id));

    if (!inquiry) {
      return res.status(404).json({ error: `Inquiry '${id}' not found` });
    }

    return res.json({ success: true, inquiry });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve inquiry' });
  }
});

/**
 * PATCH /api/inquiries/:id/status
 * Update lead status: Pending → Contacted → Quoted → Converted / Closed
 */
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Contacted', 'Quoted', 'Converted', 'Closed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const result = db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, Number(id));

    if (result.changes === 0) {
      return res.status(404).json({ error: `Inquiry ID ${id} not found` });
    }

    const updated = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(Number(id));
    console.log(`[INQUIRY] 🔄 Status updated: ${id} → ${status}`);
    return res.json({ success: true, message: `Status updated to '${status}'`, inquiry: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update status' });
  }
});

/**
 * DELETE /api/inquiries/:id
 * Remove an inquiry record (admin action)
 */
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM inquiries WHERE id = ?').run(Number(req.params.id));
    if (result.changes === 0) {
      return res.status(404).json({ error: `Inquiry ID ${req.params.id} not found` });
    }
    return res.json({ success: true, message: `Inquiry ${req.params.id} deleted` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

export default router;
