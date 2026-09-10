# Anushka Shete — UI/UX Design & Backend Inquiry Module

**GitHub Username:** `anushkashete27`  
**Role:** UI/UX Designer & Backend Integration Lead (Inquiry Module)  
**Branch:** `feature/backend-inquiry-module`

---

## 📁 My Contributions (Folder Structure)

```
PADMASHRI-AGRO/
│
├── 📂 src/
│   ├── 📂 components/
│   │   ├── Header.jsx              ← Responsive Navigation (My UI work)
│   │   ├── Footer.jsx              ← Global Footer (My UI work)
│   │   ├── HeroSection.jsx         ← Hero Section (Accessibility fixes)
│   │   ├── InquiryModal.jsx        ← 🔑 Core: Connected to Backend API
│   │   ├── ProductCatalog.jsx      ← Accessibility & ARIA improvements
│   │   ├── ProductDetailModal.jsx  ← Focus trap & scroll lock
│   │   └── BranchLocator.jsx       ← Map links & accessibility
│   │
│   └── index.css                  ← Master Stylesheet (2900+ lines, my design)
│
├── 📂 server/                      ← 🔑 My Backend Module
│   ├── index.js                    ← Express Server (port 5000)
│   ├── db.js                       ← SQLite Database Setup & Schemas
│   └── 📂 routes/
│       ├── inquiries.js            ← 🔑 MY CORE MODULE (POST/GET inquiries)
│       ├── products.js             ← Products REST API
│       └── branches.js             ← Branches REST API
│
├── vite.config.js                  ← API Proxy configuration
└── package.json                    ← Added npm run server script
```

---

## 🛠️ My UI/UX Work

### Design System (`src/index.css`)
- Complete CSS design system with color tokens (`--primary`, `--secondary`)
- Dark Mode support via `[data-theme="dark"]`
- Mobile-first responsive layout (2900+ lines)
- Marathi Devanagari text overflow prevention
- Focus rings, accessibility utilities (`.sr-only`, `.skip-to-content`)

### Header Navigation (`src/components/Header.jsx`)
- Fixed semantic heading hierarchy (no duplicate `<h1>`)
- Bilingual toggle: English ↔ Marathi
- Mobile hamburger drawer with backdrop overlay
- Keyboard navigation with `Escape` key close
- ARIA labels for screen readers

### Inquiry Modal (`src/components/InquiryModal.jsx`)
- Body scroll lock when modal is open
- Focus trapping (keyboard stays in modal)
- Real-time form validation with field-level errors
- **Connected to real backend database API** ✅

---

## 🔌 My Backend Module

### Inquiries REST API (`server/routes/inquiries.js`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/inquiries` | Save customer quote request to SQLite DB |
| `GET` | `/api/inquiries` | List all leads with stats (Pending/Contacted) |
| `GET` | `/api/inquiries/:id` | Get single inquiry by ID or Reference No |
| `PATCH` | `/api/inquiries/:id/status` | Update lead status |

### Database Schema (`server/db.js`)
```sql
CREATE TABLE inquiries (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  reference_no  TEXT UNIQUE,     -- e.g. PAD-2026-9482
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  village       TEXT NOT NULL,
  product_id    TEXT,
  product_name  TEXT,
  branch        TEXT,
  message       TEXT,
  status        TEXT DEFAULT 'Pending',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 How to Run

```bash
# Terminal 1 — Backend API
npm run server
# → http://localhost:5000/api/health

# Terminal 2 — Frontend
npm run dev
# → http://localhost:5173
```

---

## ✅ API Testing

```bash
# Test: Submit inquiry
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Ramesh Patil","phone":"9876543210","village":"Sangamner","product":"hydro-plough","branch":"Main Factory"}'

# Test: View all leads
curl http://localhost:5000/api/inquiries

# Test: Health check
curl http://localhost:5000/api/health
```

---

*Developed by Anushka Shete | Padmashri Agro Engineering Works | 2026*
