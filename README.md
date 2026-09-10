# Padmashri Agro Engineering Works
## Fullstack Web Application — Team Project

> Agricultural equipment dealership platform with bilingual (English/Marathi) support, product catalog, inquiry management, and branch locator.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 |
| Styling | Vanilla CSS (2900+ lines, dark mode) |
| Backend | Node.js 22 + Express.js |
| Database | SQLite (native `node:sqlite`) |
| Icons | Lucide React |
| Fonts | Google Fonts (Outfit) |

---

## 👥 Team Contributions

| Member | Role | Module |
|--------|------|--------|
| **Karan Matade** | Team Lead / Full Stack | Architecture, Deployment |
| **Anushka Shete** | UI/UX + Backend Inquiry | InquiryModal, REST API (Inquiries Module) |
| **Member 3** | Backend Products | Products API, ProductCatalog |
| **Member 4** | Backend Branches | Branch Locator, Maps |
| **Member 5** | Testing & Documentation | QA, README |

---

## 📁 Project Structure

```
PADMASHRI-AGRO/
├── src/                         # React Frontend
│   ├── components/              # UI Components
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   ├── ProductCatalog.jsx
│   │   ├── InquiryModal.jsx     ← Anushka Shete
│   │   ├── InquirySuccessScreen.jsx ← Anushka Shete
│   │   ├── BranchLocator.jsx
│   │   └── Footer.jsx
│   ├── data/                    # Static seed data
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Validation & helpers (Anushka Shete)
│   └── index.css                # Master stylesheet
│
├── server/                      # Node.js Express Backend
│   ├── index.js                 # Server entry point
│   ├── db.js                    # SQLite database setup
│   ├── README.md                # API Docs (Anushka Shete)
│   └── routes/
│       ├── inquiries.js         ← Anushka Shete (Core Module)
│       ├── products.js
│       └── branches.js
│
├── vite.config.js               # Vite + API proxy config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v22+

### Install Dependencies
```bash
npm install
```

### Run Backend Server (Port 5000)
```bash
npm run server
# OR
node server/index.js
```

### Run Frontend Dev Server (Port 5173)
```bash
npm run dev
```

### Open Browser
```
http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/inquiries` | Submit customer quote request |
| GET | `/api/inquiries` | List all leads with stats |
| GET | `/api/inquiries/:id` | Get single inquiry by ID or Ref No |
| PATCH | `/api/inquiries/:id/status` | Update lead status |
| GET | `/api/products` | Get product catalog |
| GET | `/api/products?category=ploughs` | Filter by category |
| GET | `/api/branches` | Get branch locations |

---

## ✨ Features

- 🌐 Bilingual: English + Marathi (मराठी)
- 🌙 Dark Mode / Light Mode toggle
- 📱 Fully Responsive (mobile-first)
- 🗄️ Real SQLite Database Integration
- 📋 Lead tracking with reference numbers (PAD-XXXX-XXXX)
- ♿ WCAG Accessibility: ARIA labels, focus trap, keyboard navigation
- 💬 WhatsApp direct inquiry integration
- 🗺️ Branch Locator with Google Maps links

---

*Padmashri Agro Engineering Works, Sangamner, Maharashtra*
