# 🌾 Padmashri Agro Engineering Works
### पद्मश्री ॲग्रो इंजिनिअरिंग वर्क्स

> **Live Site:** [padmashri-agro.vercel.app](https://padmashri-agro.vercel.app)  
> **GitHub Repo:** [github.com/KaranMatade/PADMASHRI-AGRO](https://github.com/KaranMatade/PADMASHRI-AGRO)  
> **Images CDN:** [Cloudinary — Cloud: bthbndrq](https://cloudinary.com)

---

## 📋 Project Overview

A **production-ready, bilingual (Marathi + English) business website** for Padmashri Agro Engineering Works — a manufacturer of heavy-duty agricultural implements based in Sadatpur, Sangamner, Maharashtra (Est. 1998).

This project was built as part of a **Full-Stack Web Development Course** and covers real-world industry practices including responsive design, CDN image hosting, CI/CD deployment, version control, and more.

---

## 🗓️ Course Lesson Plan Alignment

This section maps each lesson topic to what was **actually built and practiced** in this project.

---

### 📌 Week 1 — Introduction (10-Jul-2026)
**Topic:** Introduction to software development

**Applied in this project:**
- Understood the client's business requirements (Padmashri Agro — agricultural implements manufacturer)
- Identified the target audience: farmers, dealers, B2B buyers across Maharashtra
- Defined the problem: No digital presence, no way for customers to see products or request quotes online

---

### 📌 Week 2 — Software Development Process & MVP (17-Jul-2026)
**Topic:** Software development process, MVP (Minimum Viable Product)

**Applied in this project:**
- Defined the **MVP** as: Home page + Product Catalog + WhatsApp inquiry button
- Chose a lean tech stack (React + Vite) — no backend needed for MVP
- Delivered a working site within the first sprint

**MVP Features Delivered:**
- ✅ Hero section with call-to-action buttons
- ✅ Product catalog with 8 products
- ✅ WhatsApp direct order link
- ✅ Bilingual support (Marathi / English)

---

### 📌 Week 3 — Project Planning, Squad Roles & Design Document (24-Jul-2026)
**Topic:** Project planning, design documents, roles & responsibilities

**Applied in this project:**

| Role | Responsibility |
|------|---------------|
| Frontend Developer | React components, CSS, responsiveness |
| UI/UX Designer | Layout, color palette, typography |
| Content Writer | Marathi + English product content |
| DevOps | Vercel deployment, GitHub, Cloudinary CDN |

**Design Decisions:**
- Color palette: Green (`#15803d`) + Amber (`#d97706`) — agricultural brand identity
- Fonts: Rajdhani (headings) + Inter + Noto Sans Devanagari (Marathi support)
- Mobile-first responsive layout (hamburger drawer, sticky action bar)

---

### 📌 Week 4 — Q&A, Presentations & Design Documents (31-Jul-2026)
**Topic:** Q&A, presentations on design documents

**Applied in this project:**
- Completed full design document covering:
  - Component hierarchy (Header → HeroSection → ProductCatalog → Gallery → Calculator → Branches → Footer)
  - Data flow (static JS data files → React components → rendered UI)
  - User journeys: Browse products → View specs → WhatsApp/Quote

---

### 📌 Week 5 — Development Best Practices (05-Aug-2026)
**Topic:** Development process best practices

**Best practices applied:**
- ✅ **Component-based architecture** — 10 reusable React components
- ✅ **Separation of concerns** — data files (`/src/data/`) separate from UI
- ✅ **DRY principle** — shared CSS variables in `:root {}`
- ✅ **Mobile-first CSS** — all layouts start at mobile, scale up
- ✅ **Semantic HTML** — `<section>`, `<nav>`, `<footer>`, `<h1>-<h4>`
- ✅ **SEO** — meta tags, Open Graph, JSON-LD structured data, canonical URL
- ✅ **Accessibility** — aria-labels, keyboard navigation, pinch-zoom enabled

---

### 📌 Week 6 — Agile, Jira, Git, Unit Testing (14-Aug-2026)
**Topic:** Agile, Jira, Git, unit testing, coding best practices

**Git workflow applied:**

```bash
# Feature development flow
git checkout -b feature/mobile-navbar
# ... make changes ...
git add -A
git commit -m "feat: add responsive hamburger drawer for mobile nav"
git push origin main
```

**Commits in this project follow best practices:**
- `feat:` — new features
- `fix:` — bug fixes
- `refactor:` — code improvements

**Git highlights:**
- All image binary files removed from repo (replaced with Cloudinary CDN URLs)
- `.gitignore` properly configured (node_modules, dist/, *.log)
- Clean commit history with descriptive messages

---

### 📌 Week 7 — Local Development & Sprint Planning (21-Aug-2026)
**Topic:** Local development, sprint planning

**Local development setup:**

```bash
# Clone the repository
git clone https://github.com/KaranMatade/PADMASHRI-AGRO.git
cd PADMASHRI-AGRO

# Install dependencies
npm install

# Start local development server
npm run dev
# Opens at http://localhost:5173
```

**Sprints completed:**

| Sprint | Goal | Status |
|--------|------|--------|
| Sprint 1 | Hero + Navbar + Mobile drawer | ✅ Done |
| Sprint 2 | Product Catalog + Detail Modal | ✅ Done |
| Sprint 3 | Photo Gallery + Price Calculator | ✅ Done |
| Sprint 4 | Branch Locator + Footer + SEO | ✅ Done |
| Sprint 5 | Cloudinary CDN migration + Bug fixes | ✅ Done |

---

### 📌 Week 8 — Sprint Demo & Local Deployment (28-Aug-2026)
**Topic:** Sprint demo, local deployment by groups

**Build & deployment commands:**

```bash
# Build production bundle
npm run build
# Output in dist/ folder

# Preview production build locally
npm run preview
# Opens at http://localhost:4173
```

**Deployment:** Vercel (auto-deploys on every `git push origin main`)

---

### 📌 Week 9 & 10 — REST API Development (04-Sep & 11-Sep-2026)
**Topic:** REST API (Node/Express/Laravel/Java)

**Current state:** This project uses **static data files** (no backend needed for MVP).  
**Future enhancement planned:**
- Build a Node.js + Express REST API for:
  - `GET /api/products` — return all products as JSON
  - `GET /api/products/:id` — return single product
  - `POST /api/inquiry` — submit inquiry form
  - `GET /api/branches` — return branch data

**Planned API structure:**
```
/api
  /products      GET (list all), POST (add new)
  /products/:id  GET (detail), PUT (update), DELETE
  /gallery       GET (all images)
  /inquiry       POST (submit quote request)
  /branches      GET (all branches)
```

---

### 📌 Week 11 — Express.js Framework (18-Sep-2026)
**Topic:** Express JS — A Node.js Framework

**Planned implementation:**
```javascript
// server.js (planned)
import express from 'express';
import productsRouter from './routes/products.js';

const app = express();
app.use(express.json());
app.use('/api/products', productsRouter);
app.listen(3000, () => console.log('API running on port 3000'));
```

---

### 📌 Week 12 — MongoDB / No-SQL (09-Oct-2026)
**Topic:** Introduction to No-SQL (MongoDB)

**Planned MongoDB schema:**
```javascript
// Product Schema (planned)
{
  _id: ObjectId,
  name: String,
  nameMr: String,          // Marathi name
  category: String,
  priceMin: Number,
  priceMax: Number,
  images: [String],        // Cloudinary CDN URLs
  specs: Object,
  features: [String],
  featuresMr: [String],    // Marathi features
  createdAt: Date
}
```

---

### 📌 Week 13 — AWS Introduction (16-Oct-2026)
**Topic:** EC2, S3, RDS, Load Balancer

**Mapping to this project:**

| AWS Service | Usage in Padmashri Agro |
|------------|------------------------|
| **S3** | Store product images (currently using Cloudinary) |
| **EC2** | Host the Node/Express REST API server |
| **RDS** | PostgreSQL DB for products, inquiries, branches |
| **Load Balancer** | Distribute traffic across multiple EC2 instances |
| **CloudFront CDN** | Serve images faster (similar to Cloudinary) |

---

### 📌 Week 14 — Azure Introduction (23-Oct-2026)
**Topic:** Azure Web App, Virtual Machines, Load Balancer

**Mapping to this project:**

| Azure Service | Usage |
|--------------|-------|
| **Azure Web App** | Deploy the React frontend |
| **Azure VM** | Host the Express API backend |
| **Azure Blob Storage** | Alternative to Cloudinary for images |
| **Azure Load Balancer** | High-availability for API servers |

---

### 📌 Week 15 — CI/CD Pipeline & Cloud Deployment (30-Oct-2026)
**Topic:** Jenkins/Azure/Bitbucket CI/CD, deploy mini project on cloud

**Current CI/CD already implemented (Vercel):**

```
Developer pushes code
        ↓
   GitHub (main branch)
        ↓
   Vercel detects push automatically
        ↓
   Auto-build (npm run build)
        ↓
   Deploy to global CDN edge nodes
        ↓
   padmashri-agro.vercel.app LIVE ✅
```

**Planned Jenkins Pipeline (future):**
```groovy
pipeline {
  agent any
  stages {
    stage('Install') { steps { sh 'npm install' } }
    stage('Test')    { steps { sh 'npm test' } }
    stage('Build')   { steps { sh 'npm run build' } }
    stage('Deploy')  { steps { sh 'vercel --prod' } }
  }
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, JSX |
| **Build Tool** | Vite 5 |
| **Styling** | Vanilla CSS (mobile-first, 2400+ lines) |
| **Icons** | Lucide React |
| **Image CDN** | Cloudinary (`cloud: bthbndrq`) |
| **Hosting / CI-CD** | Vercel (auto-deploy from GitHub push) |
| **Version Control** | Git + GitHub |
| **Language** | JavaScript (ES Modules) |
| **Fonts** | Google Fonts (Rajdhani, Inter, Noto Sans Devanagari) |

---

## 📁 Project Structure

```
PADMASHRI-AGRO/
├── public/
│   ├── Product_images/            # Product images (served via Cloudinary)
│   ├── Padma Shri Photo Gallery/  # Gallery images (served via Cloudinary)
│   ├── Frontpage_background.png
│   └── logo.jpeg
├── src/
│   ├── components/
│   │   ├── Header.jsx             # Navbar + mobile hamburger drawer
│   │   ├── HeroSection.jsx        # Landing hero with background image
│   │   ├── ProductCatalog.jsx     # Product grid + B2B list view + search
│   │   ├── ProductDetailModal.jsx # Product specs popup modal
│   │   ├── PriceCalculator.jsx    # Equipment price estimator tool
│   │   ├── PhotoGallery.jsx       # Image gallery with lightbox
│   │   ├── BranchLocator.jsx      # Branch offices & contact info
│   │   ├── Footer.jsx             # Footer with links & contact
│   │   ├── InquiryModal.jsx       # Quote request form
│   │   └── MobileStickyActionBar.jsx  # Mobile sticky CTA bar
│   ├── data/
│   │   ├── productsData.js        # 8 products with Cloudinary URLs
│   │   ├── galleryData.js         # 27 gallery images with Cloudinary URLs
│   │   └── branchesData.js        # 4 branch locations + contact info
│   ├── App.jsx                    # Root React component
│   ├── main.jsx                   # React DOM entry point
│   └── index.css                  # Master stylesheet (mobile-first)
├── scripts/
│   ├── upload-to-cloudinary.js    # Cloudinary image migration script
│   └── cloudinary-url-map.json    # filename → CDN URL mapping
├── index.html                     # Entry HTML with full SEO meta tags
├── vite.config.js                 # Vite build configuration
├── package.json                   # npm dependencies & scripts
└── README.md                      # This file ← You are here
```

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/KaranMatade/PADMASHRI-AGRO.git
cd PADMASHRI-AGRO

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# → http://localhost:5173

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview

# 6. Deploy (auto-triggered on git push)
git push origin main
```

---

## 📊 Key Features

| Feature | Description |
|---------|-------------|
| 🌐 **Bilingual** | Full Marathi + English toggle |
| 📱 **Mobile-First** | Hamburger drawer, sticky action bar, responsive grids |
| 🖼️ **Cloudinary CDN** | Auto-WebP, 30-50% smaller images, global fast delivery |
| 💰 **Price Calculator** | Interactive equipment price estimator by size + transport |
| 🔍 **Product Search** | Filter by category + keyword search |
| 💬 **WhatsApp Orders** | Direct WhatsApp order links per product |
| 📍 **Branch Locator** | 4 office locations with phone numbers |
| 🔒 **SEO Ready** | JSON-LD structured data, Open Graph, meta descriptions |
| 🌙 **Dark Mode** | Full dark/light theme toggle |

---

## 📞 Business Contact

**Padmashri Agro Engineering Works**  
Loni-Sadatpur Road, Sadatpur, Tal: Sangamner  
Dist: Ahilyanagar, Maharashtra — 413736  
📞 +91 92262 53710  
📧 contact@padmashreeagro.com  
🌐 [IndiaMART Verified Seller](https://www.indiamart.com/padmashriagroengworks/)

---

*Built with ❤️ for Indian Farmers | © 2026 Padmashri Agro Engineering Works*
