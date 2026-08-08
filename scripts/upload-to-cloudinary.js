/**
 * Padmashri Agro — Cloudinary Image Migration Script
 * Uploads all product & gallery images to Cloudinary and
 * generates updated productsData.js and galleryData.js with CDN URLs.
 *
 * Run: node scripts/upload-to-cloudinary.js
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ─── Cloudinary Config ───────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: 'bthbndrq',
  api_key:    '249846657459437',
  api_secret: 'Su0e2TYx2Ta455xXSQ3B0avWy3s',
});

// ─── Folders to upload ───────────────────────────────────────────────────────
const UPLOAD_JOBS = [
  {
    localDir:    path.join(ROOT, 'public', 'Product_images'),
    cloudFolder: 'padmashri-agro/products',
    label:       'Product Images',
  },
  {
    localDir:    path.join(ROOT, 'public', 'Padma Shri Photo Gallery'),
    cloudFolder: 'padmashri-agro/gallery',
    label:       'Gallery Images',
  },
  {
    // Root public files (logo, hero bg)
    localDir:    path.join(ROOT, 'public'),
    cloudFolder: 'padmashri-agro/site',
    label:       'Site Assets',
    filesOnly:   ['logo.jpeg', 'Frontpage_background.png'],
  },
];

// ─── Upload helper ────────────────────────────────────────────────────────────
async function uploadFile(filePath, folder) {
  const publicId = path.basename(filePath, path.extname(filePath));
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      // Auto-quality and auto-format (WebP on modern browsers)
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });
    return { localName: path.basename(filePath), url: result.secure_url, publicId: result.public_id };
  } catch (err) {
    console.error(`  ✗ FAILED: ${path.basename(filePath)} — ${err.message}`);
    return null;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const urlMap = {}; // filename → cloudinary URL

async function run() {
  console.log('\n🚀 Starting Cloudinary upload for Padmashri Agro...\n');

  for (const job of UPLOAD_JOBS) {
    console.log(`\n📁 ${job.label} → cloud folder: ${job.cloudFolder}`);

    let files;
    if (job.filesOnly) {
      files = job.filesOnly.map(f => path.join(job.localDir, f)).filter(fs.existsSync);
    } else {
      files = fs.readdirSync(job.localDir)
        .filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f))
        .map(f => path.join(job.localDir, f));
    }

    console.log(`   Found ${files.length} image(s).`);

    for (const filePath of files) {
      const name = path.basename(filePath);
      process.stdout.write(`  ↑ Uploading: ${name} ... `);
      const result = await uploadFile(filePath, job.cloudFolder);
      if (result) {
        urlMap[name] = result.url;
        console.log(`✓`);
      }
    }
  }

  // ─── Save URL mapping JSON ─────────────────────────────────────────────────
  const mapPath = path.join(ROOT, 'scripts', 'cloudinary-url-map.json');
  fs.writeFileSync(mapPath, JSON.stringify(urlMap, null, 2), 'utf-8');
  console.log(`\n✅ URL map saved → scripts/cloudinary-url-map.json`);

  // ─── Patch productsData.js ─────────────────────────────────────────────────
  const productsPath = path.join(ROOT, 'src', 'data', 'productsData.js');
  let productsContent = fs.readFileSync(productsPath, 'utf-8');

  let productPatched = 0;
  for (const [filename, cdnUrl] of Object.entries(urlMap)) {
    // Match both /Product_images/filename and bare filename in image paths
    const escaped = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`"/Product_images/${escaped}"`, 'g');
    if (regex.test(productsContent)) {
      productsContent = productsContent.replace(
        new RegExp(`"/Product_images/${escaped}"`, 'g'),
        `"${cdnUrl}"`
      );
      productPatched++;
    }
  }
  fs.writeFileSync(productsPath, productsContent, 'utf-8');
  console.log(`\n📝 productsData.js — patched ${productPatched} image reference(s)`);

  // ─── Patch galleryData.js ──────────────────────────────────────────────────
  const galleryPath = path.join(ROOT, 'src', 'data', 'galleryData.js');
  let galleryContent = fs.readFileSync(galleryPath, 'utf-8');

  let galleryPatched = 0;
  for (const [filename, cdnUrl] of Object.entries(urlMap)) {
    const escaped = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`"/Padma Shri Photo Gallery/${escaped}"`, 'g');
    if (regex.test(galleryContent)) {
      galleryContent = galleryContent.replace(
        new RegExp(`"/Padma Shri Photo Gallery/${escaped}"`, 'g'),
        `"${cdnUrl}"`
      );
      galleryPatched++;
    }
  }
  fs.writeFileSync(galleryPath, galleryContent, 'utf-8');
  console.log(`📝 galleryData.js  — patched ${galleryPatched} image reference(s)`);

  // ─── Patch HeroSection for background image ────────────────────────────────
  const heroCssPath = path.join(ROOT, 'src', 'index.css');
  let cssContent = fs.readFileSync(heroCssPath, 'utf-8');
  const bgUrl = urlMap['Frontpage_background.png'];
  if (bgUrl) {
    cssContent = cssContent.replace(
      /url\(['"]?\/Frontpage_background\.png['"]?\)/g,
      `url('${bgUrl}')`
    );
    fs.writeFileSync(heroCssPath, cssContent, 'utf-8');
    console.log(`📝 index.css       — hero background updated to Cloudinary URL`);
  }

  // ─── Patch logo in Header ──────────────────────────────────────────────────
  const logoUrl = urlMap['logo.jpeg'];
  if (logoUrl) {
    const headerPath = path.join(ROOT, 'src', 'components', 'Header.jsx');
    let headerContent = fs.readFileSync(headerPath, 'utf-8');
    headerContent = headerContent.replace(/["']\/logo\.jpeg["']/g, `"${logoUrl}"`);
    fs.writeFileSync(headerPath, headerContent, 'utf-8');
    console.log(`📝 Header.jsx      — logo updated to Cloudinary URL`);
  }

  console.log('\n🎉 All done! Now run: npm run build && git add -A && git commit -m "Migrate images to Cloudinary CDN" && git push origin main\n');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
