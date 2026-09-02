import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, ShadingType, PageBreak
} from 'docx';
import fs from 'fs';

// ─── Helper functions ─────────────────────────────────────────────────────────
const heading1 = (text) => new Paragraph({
  text,
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 },
  thematicBreak: false,
  run: { bold: true, color: '15803D', size: 32 }
});

const heading2 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 26, color: '166534' })],
  spacing: { before: 300, after: 150 },
});

const body = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, size: 22, ...opts })],
  spacing: { before: 80, after: 80 },
});

const bullet = (text) => new Paragraph({
  children: [new TextRun({ text: `• ${text}`, size: 22 })],
  spacing: { before: 60, after: 60 },
  indent: { left: 360 },
});

const pageBreak = () => new Paragraph({
  children: [new PageBreak()],
});

const centered = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, ...opts })],
  alignment: AlignmentType.CENTER,
  spacing: { before: 100, after: 100 },
});

// ─── Table helper ──────────────────────────────────────────────────────────────
const makeTable = (headers, rows) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    // Header row
    new TableRow({
      children: headers.map(h => new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: h, bold: true, size: 22, color: 'FFFFFF' })],
          alignment: AlignmentType.CENTER,
        })],
        shading: { type: ShadingType.CLEAR, fill: '15803D' },
      })),
      tableHeader: true,
    }),
    // Data rows
    ...rows.map((row, ri) => new TableRow({
      children: row.map(cell => new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: cell, size: 22 })],
        })],
        shading: { type: ShadingType.CLEAR, fill: ri % 2 === 0 ? 'F0FDF4' : 'FFFFFF' },
      })),
    })),
  ],
});

// ─── Document ─────────────────────────────────────────────────────────────────
const doc = new Document({
  creator: 'Karan Matade',
  title: 'Padmashri Agro Engineering Works — Project Design Document',
  description: 'IT Based Skill Enhancement Course — Project Design Document',
  styles: {
    paragraphStyles: [
      {
        id: 'Normal',
        name: 'Normal',
        run: { font: 'Calibri', size: 22 },
      }
    ]
  },
  sections: [{
    properties: {},
    children: [

      // ══════════════════════════════════════════
      // COVER PAGE
      // ══════════════════════════════════════════
      new Paragraph({ spacing: { before: 800, after: 200 }, children: [] }),
      centered('SANJIVANI COLLEGE OF ENGINEERING', { bold: true, size: 32, color: '15803D' }),
      centered('IT Based Skill Enhancement Course', { size: 24, color: '475569' }),
      new Paragraph({ spacing: { before: 600, after: 200 }, children: [] }),
      centered('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { color: '15803D' }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [] }),
      centered('Project Proposal / Design Document', { bold: true, size: 28, color: '1e293b' }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [] }),
      centered('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { color: '15803D' }),
      new Paragraph({ spacing: { before: 600, after: 100 }, children: [] }),

      centered('Project Title:', { bold: true, size: 24, color: '475569' }),
      centered('Padmashri Agro Engineering Works', { bold: true, size: 32, color: '15803D' }),
      centered('Business Website', { bold: true, size: 28, color: '15803D' }),
      new Paragraph({ spacing: { before: 400, after: 100 }, children: [] }),

      centered('Prepared By:', { bold: true, size: 24, color: '475569' }),
      centered('Karan Matade', { size: 24, bold: true }),
      new Paragraph({ spacing: { before: 400, after: 100 }, children: [] }),

      centered('Guide:', { bold: true, size: 24, color: '475569' }),
      centered('Prof. [Guide Name]', { size: 24 }),
      new Paragraph({ spacing: { before: 400, after: 100 }, children: [] }),

      centered('Academic Year: 2026', { size: 22, color: '475569' }),

      pageBreak(),

      // ══════════════════════════════════════════
      // 1. PROJECT TITLE
      // ══════════════════════════════════════════
      heading1('1. Project Title'),
      body('Padmashri Agro Engineering Works — Business Website', { bold: true, size: 24 }),
      new Paragraph({ spacing: { before: 200 }, children: [] }),
      body('This is the official business website for Padmashri Agro Engineering Works, a manufacturer of heavy-duty agricultural implements located at Sadatpur, Sangamner, Maharashtra (Est. 1998).'),
      new Paragraph({ spacing: { before: 100 }, children: [] }),
      body('The website is bilingual (Marathi + English) and serves as a digital product catalog, inquiry platform, and business identity tool for farmers, dealers, and B2B buyers across Maharashtra.'),

      pageBreak(),

      // ══════════════════════════════════════════
      // 2. PROBLEM STATEMENT
      // ══════════════════════════════════════════
      heading1('2. Problem Statement'),
      heading2('"Why are we developing this project?"'),
      new Paragraph({ spacing: { before: 100 }, children: [] }),
      body('Padmashri Agro Engineering Works, despite being a well-established agricultural equipment manufacturer since 1998, had no online digital presence. This created several problems:'),
      new Paragraph({ spacing: { before: 100 }, children: [] }),
      bullet('Farmers and dealers could not browse products or check specifications without physically visiting the factory.'),
      bullet('No way for out-of-town or rural customers to inquire about pricing or place orders.'),
      bullet('The business was losing potential customers to competitors who had websites or IndiaMART presence.'),
      bullet('All inquiries were handled manually via phone calls, leading to delays and missed opportunities.'),
      bullet('No platform to showcase new product launches, gallery, or branch locations.'),
      new Paragraph({ spacing: { before: 200 }, children: [] }),
      body('Therefore, a professional bilingual business website was required to:'),
      bullet('Display all products with images, specifications, and pricing.'),
      bullet('Enable customers to directly inquiry via WhatsApp.'),
      bullet('Establish an online identity that builds trust with B2B buyers.'),
      bullet('Showcase the company\'s 25+ years of expertise and IndiaMART verified seller status.'),

      pageBreak(),

      // ══════════════════════════════════════════
      // 3. OBJECTIVES
      // ══════════════════════════════════════════
      heading1('3. Objectives'),
      heading2('"What do we want to achieve?"'),
      new Paragraph({ spacing: { before: 100 }, children: [] }),
      bullet('Develop a bilingual (Marathi + English) responsive business website.'),
      bullet('Display 8 product categories with photos, specs, and price ranges.'),
      bullet('Enable customers to send WhatsApp inquiries directly from product pages.'),
      bullet('Build a price calculator tool for farmers to estimate equipment costs.'),
      bullet('Create a photo gallery showcasing 27 manufacturing images.'),
      bullet('Show all 4 branch office locations with contact information.'),
      bullet('Achieve fast image loading using Cloudinary CDN.'),
      bullet('Ensure full mobile-phone compatibility for rural farmer users.'),
      bullet('Deploy on Vercel with auto CI/CD from GitHub.'),
      bullet('Implement SEO best practices for Google discoverability.'),

      pageBreak(),

      // ══════════════════════════════════════════
      // 4. USERS
      // ══════════════════════════════════════════
      heading1('4. Users'),
      body('The following users interact with the Padmashri Agro website:'),
      new Paragraph({ spacing: { before: 200 }, children: [] }),
      makeTable(
        ['User Type', 'Responsibilities / Actions'],
        [
          ['Farmer / End Customer', 'Browse products, view specs, check prices, send WhatsApp inquiry'],
          ['Dealer / Distributor', 'View B2B product list, check bulk pricing, contact branch offices'],
          ['Business Owner', 'View inquiries received via WhatsApp, manage product catalog updates'],
          ['Developer (Karan)', 'Maintain codebase, update products, deploy via GitHub + Vercel'],
          ['Admin (future)', 'Upload images, add new products, update prices via admin panel'],
        ]
      ),

      pageBreak(),

      // ══════════════════════════════════════════
      // 5. MVP FEATURES
      // ══════════════════════════════════════════
      heading1('5. MVP Features'),
      body('The following are the core features built and delivered in the Minimum Viable Product:'),
      new Paragraph({ spacing: { before: 200 }, children: [] }),
      makeTable(
        ['Feature', 'Description', 'Status'],
        [
          ['Hero Section', 'Landing page with background image, tagline, CTA buttons', '✅ Done'],
          ['Responsive Navbar', 'Sticky header with hamburger drawer on mobile', '✅ Done'],
          ['Product Catalog', 'Grid view of 8 product categories with images & specs', '✅ Done'],
          ['Product Detail Modal', 'Popup with full specifications, image gallery, WhatsApp order', '✅ Done'],
          ['WhatsApp Integration', 'Direct WhatsApp links per product with Marathi message', '✅ Done'],
          ['Price Calculator', 'Interactive tool to estimate equipment cost by size & transport', '✅ Done'],
          ['Photo Gallery', 'Lightbox gallery with 27 manufacturing images', '✅ Done'],
          ['Branch Locator', '4 office locations with phone numbers & maps', '✅ Done'],
          ['Bilingual Toggle', 'Full Marathi ↔ English content switch', '✅ Done'],
          ['SEO & Meta Tags', 'Title, description, Open Graph, JSON-LD structured data', '✅ Done'],
        ]
      ),

      pageBreak(),

      // ══════════════════════════════════════════
      // 6. FUTURE SCOPE
      // ══════════════════════════════════════════
      heading1('6. Future Scope'),
      body('These are features that can be added in future development sprints:'),
      new Paragraph({ spacing: { before: 100 }, children: [] }),
      bullet('Admin Panel — Upload new products, images, and prices from a browser without code changes.'),
      bullet('REST API Backend — Node.js + Express API for products, inquiries, branches.'),
      bullet('MongoDB Database — Store product data, inquiries, and customer information.'),
      bullet('Online Payment — Accept advance payments via Razorpay / UPI.'),
      bullet('Customer Review System — Allow buyers to leave ratings and reviews.'),
      bullet('SMS / Email Notifications — Alert owner when a new inquiry is received.'),
      bullet('Google Maps Integration — Embedded map for each branch location.'),
      bullet('Dealer Portal — Login system for dealers to view pricing and place bulk orders.'),
      bullet('AWS Deployment — EC2 instance for backend API, S3 for image storage, CloudFront CDN.'),
      bullet('Mobile App — React Native app for farmers to browse and order on Android.'),
      bullet('AI Chatbot — Answer farmer queries about product specifications automatically.'),

      pageBreak(),

      // ══════════════════════════════════════════
      // 7. TECHNOLOGY STACK
      // ══════════════════════════════════════════
      heading1('7. Technology Stack'),
      body('Technologies used in this project:'),
      new Paragraph({ spacing: { before: 200 }, children: [] }),
      makeTable(
        ['Layer', 'Technology', 'Purpose'],
        [
          ['Frontend', 'React 18 + JSX', 'UI component framework'],
          ['Build Tool', 'Vite 5', 'Fast dev server and production bundler'],
          ['Styling', 'Vanilla CSS (2400+ lines)', 'Mobile-first responsive design, no frameworks'],
          ['Icons', 'Lucide React', 'SVG icons throughout the site'],
          ['Image CDN', 'Cloudinary (cloud: bthbndrq)', 'Auto WebP, global fast image delivery'],
          ['Hosting', 'Vercel', 'Auto-deploy from GitHub push'],
          ['Version Control', 'Git + GitHub', 'Source code management and history'],
          ['Language', 'JavaScript (ES Modules)', 'Frontend logic and data'],
          ['Fonts', 'Google Fonts', 'Rajdhani, Inter, Noto Sans Devanagari (Marathi)'],
          ['External API', 'WhatsApp wa.me API', 'Direct inquiry via WhatsApp'],
          ['Package Manager', 'npm', 'Dependency management'],
          ['IDE', 'VS Code', 'Code editor with Antigravity AI assistant'],
        ]
      ),

      pageBreak(),

      // ══════════════════════════════════════════
      // 8. MODULES
      // ══════════════════════════════════════════
      heading1('8. Modules'),
      body('The website is broken into the following reusable modules (React components):'),
      new Paragraph({ spacing: { before: 200 }, children: [] }),
      makeTable(
        ['Module No.', 'Module Name', 'File', 'Features'],
        [
          ['1', 'Header / Navbar', 'Header.jsx', 'Logo, nav links, mobile hamburger drawer, language toggle'],
          ['2', 'Hero Section', 'HeroSection.jsx', 'Background image, tagline, CTA buttons, stats bar'],
          ['3', 'Product Catalog', 'ProductCatalog.jsx', 'Product grid, category filter, keyword search, B2B view'],
          ['4', 'Product Detail Modal', 'ProductDetailModal.jsx', 'Image slideshow, specs table, WhatsApp order button'],
          ['5', 'Price Calculator', 'PriceCalculator.jsx', 'Size selector, transport toggle, price estimate output'],
          ['6', 'Photo Gallery', 'PhotoGallery.jsx', 'Masonry grid, lightbox viewer, 27 Cloudinary images'],
          ['7', 'Branch Locator', 'BranchLocator.jsx', '4 branch cards with phone, address, WhatsApp'],
          ['8', 'Inquiry Modal', 'InquiryModal.jsx', 'Quote request form → WhatsApp message'],
          ['9', 'Mobile Action Bar', 'MobileStickyActionBar.jsx', 'Sticky bottom bar on mobile: Call, WhatsApp, Catalog'],
          ['10', 'Footer', 'Footer.jsx', 'Company info, links, address, social links'],
        ]
      ),

      pageBreak(),

      // ══════════════════════════════════════════
      // 9. BASIC WORKFLOW
      // ══════════════════════════════════════════
      heading1('9. Basic Workflow'),
      heading2('User Journey (Farmer / Customer):'),
      new Paragraph({ spacing: { before: 100 }, children: [] }),
      body('Farmer visits padmashri-agro.vercel.app', { bold: true }),
      body('          ↓'),
      body('Views Hero Section — reads company tagline, clicks "View Products"'),
      body('          ↓'),
      body('Browses Product Catalog — filters by category (e.g., "Plough")'),
      body('          ↓'),
      body('Clicks on a product card → Product Detail Modal opens'),
      body('          ↓'),
      body('Views images, specifications, price range'),
      body('          ↓'),
      body('Clicks "Order on WhatsApp" → WhatsApp opens with pre-filled Marathi message'),
      body('          ↓'),
      body('Business owner receives WhatsApp inquiry → confirms and processes order'),
      new Paragraph({ spacing: { before: 300 }, children: [] }),
      heading2('Developer / CI-CD Workflow:'),
      new Paragraph({ spacing: { before: 100 }, children: [] }),
      body('Developer writes code in VS Code (local machine)', { bold: true }),
      body('          ↓'),
      body('npm run dev → Tests on localhost:5173'),
      body('          ↓'),
      body('git add -A && git commit -m "feat: ..." && git push origin main'),
      body('          ↓'),
      body('GitHub detects push → triggers Vercel auto-build'),
      body('          ↓'),
      body('Vercel runs: npm run build → bundles React + CSS'),
      body('          ↓'),
      body('Deploy to global CDN edge nodes → padmashri-agro.vercel.app LIVE ✅'),

      pageBreak(),

      // ══════════════════════════════════════════
      // 10. DATABASE ENTITIES (DATA STRUCTURE)
      // ══════════════════════════════════════════
      heading1('10. Data Structure (Database Entities)'),
      body('Currently data is stored in static JavaScript files. Planned MongoDB schema:'),
      new Paragraph({ spacing: { before: 200 }, children: [] }),
      heading2('Products Collection:'),
      makeTable(
        ['Field', 'Type', 'Description'],
        [
          ['_id', 'ObjectId', 'Unique product ID'],
          ['name', 'String', 'Product name in English'],
          ['nameMr', 'String', 'Product name in Marathi'],
          ['category', 'String', 'Product category (Plough, Cultivator, etc.)'],
          ['priceMin', 'Number', 'Minimum price (₹)'],
          ['priceMax', 'Number', 'Maximum price (₹)'],
          ['images', '[String]', 'Array of Cloudinary CDN URLs'],
          ['specs', 'Object', 'Technical specifications (HP, weight, size, etc.)'],
          ['features', '[String]', 'Key features in English'],
          ['featuresMr', '[String]', 'Key features in Marathi'],
          ['createdAt', 'Date', 'Date product was added'],
        ]
      ),
      new Paragraph({ spacing: { before: 300 }, children: [] }),
      heading2('Inquiries Collection (Future):'),
      makeTable(
        ['Field', 'Type', 'Description'],
        [
          ['_id', 'ObjectId', 'Unique inquiry ID'],
          ['customerName', 'String', 'Customer full name'],
          ['phone', 'String', 'Customer mobile number'],
          ['productId', 'ObjectId', 'Product they are inquiring about'],
          ['message', 'String', 'Inquiry message'],
          ['status', 'String', 'pending / contacted / closed'],
          ['createdAt', 'Date', 'Inquiry submission timestamp'],
        ]
      ),

      pageBreak(),

      // ══════════════════════════════════════════
      // 11. WIREFRAME (TEXT REPRESENTATION)
      // ══════════════════════════════════════════
      heading1('11. Wireframe (Page Layout)'),
      body('Note: Actual wireframes designed in the browser. Text representation below.'),
      new Paragraph({ spacing: { before: 200 }, children: [] }),
      heading2('Home Page Layout:'),
      new Paragraph({
        children: [new TextRun({
          text: [
            '┌──────────────────────────────────────────────┐',
            '│  HEADER: Logo | Nav Links | Lang Toggle       │',
            '├──────────────────────────────────────────────┤',
            '│                                              │',
            '│  HERO: Background Image (Tractor/Plough)     │',
            '│  [Company Name] [Tagline]                    │',
            '│  [View Products] [WhatsApp Us]               │',
            '│  Stats: 25 Years | 8 Products | 1000+ Farms  │',
            '│                                              │',
            '├──────────────────────────────────────────────┤',
            '│  PRODUCT CATALOG                             │',
            '│  [Filter: All | Plough | Cultivator | ...]   │',
            '│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │',
            '│  │Prod 1│ │Prod 2│ │Prod 3│ │Prod 4│       │',
            '│  └──────┘ └──────┘ └──────┘ └──────┘       │',
            '├──────────────────────────────────────────────┤',
            '│  PRICE CALCULATOR                            │',
            '│  Select Product → Select Size → See Price    │',
            '├──────────────────────────────────────────────┤',
            '│  PHOTO GALLERY (27 images grid)              │',
            '├──────────────────────────────────────────────┤',
            '│  BRANCH LOCATOR (4 office cards)             │',
            '├──────────────────────────────────────────────┤',
            '│  FOOTER: Address | Links | Contact           │',
            '└──────────────────────────────────────────────┘',
          ].join('\n'),
          font: 'Courier New',
          size: 18,
        })],
        spacing: { before: 100, after: 100 },
      }),

      pageBreak(),

      // ══════════════════════════════════════════
      // 12. REFERENCES
      // ══════════════════════════════════════════
      heading1('12. References'),
      bullet('React Documentation — https://react.dev'),
      bullet('Vite Build Tool — https://vitejs.dev'),
      bullet('Cloudinary Image CDN — https://cloudinary.com'),
      bullet('Vercel Deployment — https://vercel.com'),
      bullet('GitHub Repository — https://github.com/KaranMatade/PADMASHRI-AGRO'),
      bullet('Live Website — https://padmashri-agro.vercel.app'),
      bullet('IndiaMART Verified Profile — https://www.indiamart.com/padmashriagroengworks/'),
      bullet('WhatsApp Business API — https://wa.me/919226253710'),
      bullet('Lucide Icons — https://lucide.dev'),
      bullet('Google Fonts — https://fonts.google.com'),
      new Paragraph({ spacing: { before: 400 }, children: [] }),
      centered('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { color: '15803D' }),
      centered('Padmashri Agro Engineering Works — Project Design Document', { size: 20, color: '475569' }),
      centered('© 2026 | Karan Matade | IT Based Skill Enhancement Course', { size: 18, color: '94a3b8' }),
    ]
  }]
});

// ─── Write DOCX file ──────────────────────────────────────────────────────────
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('Padmashri_Agro_Design_Document.docx', buffer);
  console.log('✅ Document created: Padmashri_Agro_Design_Document.docx');
});
