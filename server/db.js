import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure server data directory exists
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'padmashri.db');
export const db = new DatabaseSync(dbPath);

// Enable Foreign Keys & WAL mode for performance
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initialize Database Tables
 */
export function initDatabase() {
  // 1. Inquiries / Leads Table (Anushka Shete's Core Backend Module)
  db.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_no TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      village TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      branch TEXT NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'Pending',
      source TEXT DEFAULT 'Web Inquiry Form',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Products Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_mr TEXT NOT NULL,
      category TEXT NOT NULL,
      category_name TEXT NOT NULL,
      price_min INTEGER NOT NULL,
      price_max INTEGER NOT NULL,
      badge TEXT,
      tractor_hp TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Branches Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS branches (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      lat REAL,
      lng REAL,
      is_head_office INTEGER DEFAULT 0
    );
  `);

  // Seed initial products if table is empty
  seedInitialData();

  console.log('✅ SQLite Database initialized at:', dbPath);
}

function seedInitialData() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (countRow.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (id, name, name_mr, category, category_name, price_min, price_max, badge, tractor_hp, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleProducts = [
      ['hydro-plough', 'Hydraulic Reversible MB Plough', 'हायड्रॉलिक रिव्हर्सिबल नांगर', 'ploughs', 'Ploughs / नांगर', 72000, 88000, 'BESTSELLER / सर्वाधिक विक्री', '40 - 55 HP', 'https://res.cloudinary.com/bthbndrq/image/upload/v1786167598/padmashri-agro/products/hydraulic-reversible-plough.jpg'],
      ['mech-plough', 'Mechanical Reversible MB Plough', 'मेकॅनिकल रिव्हर्सिबल नांगर', 'ploughs', 'Ploughs / नांगर', 48000, 62000, 'POPULAR / लोकप्रिय', '35 - 50 HP', 'https://res.cloudinary.com/bthbndrq/image/upload/v1786167598/padmashri-agro/products/mechanical-reversible-plough.jpg'],
      ['rotavator', 'Heavy Duty Multi-Speed Rotavator', 'हेव्ही ड्युटी रोटाव्हेटर', 'tillage', 'Tillage / मशागत', 82000, 115000, 'HEAVY DUTY / मजबूत', '45 - 65 HP', 'https://res.cloudinary.com/bthbndrq/image/upload/v1786167598/padmashri-agro/products/rotavator.jpg'],
      ['cultivator', 'Rigid 9-Tyne Cultivator', '९-फाशी कल्टिव्हेटर', 'tillage', 'Tillage / मशागत', 28000, 38000, 'ECONOMICAL / किफायतशीर', '35 - 55 HP', 'https://res.cloudinary.com/bthbndrq/image/upload/v1786167598/padmashri-agro/products/cultivator.jpg'],
      ['seed-drill', 'Automatic Seed cum Fertilizer Drill', 'स्वयंचलित टोकण/पेरणी यंत्र', 'sowing', 'Sowing / पेरणी यंत्र', 55000, 72000, 'PRECISION / अचूक पेरणी', '40 - 55 HP', 'https://res.cloudinary.com/bthbndrq/image/upload/v1786167598/padmashri-agro/products/seed-drill.jpg'],
      ['tipping-trailer', 'Hydraulic Tipping Tractor Trailer', 'हायड्रॉलिक ट्रॅक्टर ट्रॉली', 'haulage', 'Haulage / ट्रॉली व ट्रेलर', 145000, 195000, 'HIGH LOAD / भरभक्कम', '45+ HP', 'https://res.cloudinary.com/bthbndrq/image/upload/v1786167598/padmashri-agro/products/tractor-trailer.jpg'],
      ['laser-leveler', 'Laser Land Leveler Kit', 'लेझर लँड लेव्हलर', 'tillage', 'Tillage / मशागत', 185000, 240000, 'TECH SAVER / पाणी बचत', '50+ HP', 'https://res.cloudinary.com/bthbndrq/image/upload/v1786167598/padmashri-agro/products/laser-leveler.jpg'],
      ['bund-former', 'Adjustable Bund Former', 'अ‍ॅडजस्टेबल सारे यंत्र / बांध यंत्र', 'tillage', 'Tillage / मशागत', 22000, 30000, 'FAST WORK / सुलभ काम', '35 - 50 HP', 'https://res.cloudinary.com/bthbndrq/image/upload/v1786167598/padmashri-agro/products/bund-former.jpg']
    ];

    for (const p of sampleProducts) {
      insertProduct.run(...p);
    }
  }

  const branchCount = db.prepare('SELECT COUNT(*) as count FROM branches').get();
  if (branchCount.count === 0) {
    const insertBranch = db.prepare(`
      INSERT INTO branches (id, name, address, phone, lat, lng, is_head_office)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleBranches = [
      ['sadatpur-main', 'Sadatpur Works & Factory (सादतपूर कारखाना)', 'Loni-Sadatpur Road, Sadatpur, Sangamner, Ahilyanagar', '+91 92262 53710', 19.5761, 74.3655, 1],
      ['rahata-branch', 'Rahata Sales & Service (राहाता शाखा)', 'Nagar-Manmad Highway, Near Bus Stand, Rahata', '+91 94222 25880', 19.6974, 74.4828, 0],
      ['vaijapur-branch', 'Vaijapur Regional Depot (वैजापूर शाखा)', 'Station Road, Opp. Market Yard, Vaijapur', '+91 98220 11440', 19.9272, 74.7289, 0],
      ['khultabad-branch', 'Khultabad Service Point (खुलताबाद शाखा)', 'Aurangabad-Dhule Road, Khultabad', '+91 97631 88990', 20.0076, 75.1873, 0]
    ];

    for (const b of sampleBranches) {
      insertBranch.run(...b);
    }
  }
}
