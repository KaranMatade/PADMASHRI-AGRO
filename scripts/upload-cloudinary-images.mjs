import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = resolve(fileURLToPath(new URL('.', import.meta.url)));
const projectDirectory = resolve(scriptDirectory, '..');
const publicDirectory = join(projectDirectory, 'public');
const manifestPath = join(projectDirectory, 'src', 'data', 'cloudinaryAssets.js');
const indexHtmlPath = join(projectDirectory, 'index.html');
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif'
};

function requiredEnvironmentValue(name) {
  const value = process.env[name]?.trim();
  if (!value || value.startsWith('your_')) {
    throw new Error(`Missing ${name}. Create .env.local from .env.example, then add your Cloudinary credentials.`);
  }
  return value;
}

async function loadLocalEnvironment() {
  for (const fileName of ['.env.local', '.env']) {
    try {
      const contents = await readFile(join(projectDirectory, fileName), 'utf8');
      for (const line of contents.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
        if (!match || line.trimStart().startsWith('#')) continue;

        const [, key, rawValue] = match;
        const value = rawValue.replace(/^(['"])(.*)\1$/, '$2');
        if (process.env[key] === undefined) process.env[key] = value;
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

function slug(segment) {
  return segment
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function publicIdFor(relativeFilePath) {
  const pathWithoutExtension = relativeFilePath.slice(0, -extname(relativeFilePath).length);
  const normalizedSegments = pathWithoutExtension
    .split(/[\\/]/)
    .map(slug)
    .filter(Boolean);

  return `padmashri-agro/${normalizedSegments.join('/')}`;
}

function localUrlFor(relativeFilePath) {
  return `/${relativeFilePath.split(sep).join('/')}`;
}

function cloudinarySignature(parameters, apiSecret) {
  const parameterString = Object.entries(parameters)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return createHash('sha1').update(`${parameterString}${apiSecret}`).digest('hex');
}

function optimizedUrl(url) {
  return url.replace('/image/upload/', '/image/upload/f_auto/q_auto/');
}

function fallbackDeliveryUrl(cloudName, publicId, extension) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto/q_auto/${publicId}${extension}`;
}

async function cloudinaryTimestamp() {
  // The Upload API permits timestamps only within a short window. Use the
  // provider's response header so migrations remain reliable on a machine with
  // an incorrect system clock.
  const response = await fetch('https://api.cloudinary.com/', { method: 'HEAD' });
  const dateHeader = response.headers.get('date');
  const timestamp = dateHeader ? Date.parse(dateHeader) : Number.NaN;

  if (Number.isNaN(timestamp)) {
    throw new Error('Cloudinary did not return a usable server time. Check your network connection and try again.');
  }

  return Math.floor(timestamp / 1000).toString();
}

async function findImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findImages(fullPath));
    } else if (entry.isFile() && supportedExtensions.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

async function uploadImage({ filePath, cloudName, apiKey, apiSecret, overwrite, timestamp }) {
  const relativeFilePath = relative(publicDirectory, filePath);
  const extension = extname(filePath).toLowerCase();
  const publicId = publicIdFor(relativeFilePath);
  const signedParameters = {
    invalidate: 'true',
    overwrite: String(overwrite),
    public_id: publicId,
    timestamp
  };
  const form = new FormData();
  const file = await readFile(filePath);

  form.set('file', new Blob([file], { type: mimeTypes[extension] }), relativeFilePath.split(sep).pop());
  for (const [key, value] of Object.entries(signedParameters)) {
    form.set(key, value);
  }
  form.set('api_key', apiKey);
  form.set('signature', cloudinarySignature(signedParameters, apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form
  });
  const payload = await response.json();

  if (response.ok) {
    return {
      localUrl: localUrlFor(relativeFilePath),
      status: 'uploaded',
      url: optimizedUrl(payload.secure_url)
    };
  }

  // Re-running with overwrite=false can report that the deterministic public ID
  // already exists. Its CDN URL is known, so keep the migration idempotent.
  if (response.status === 409 && !overwrite) {
    return {
      localUrl: localUrlFor(relativeFilePath),
      status: 'already exists',
      url: fallbackDeliveryUrl(cloudName, publicId, extension)
    };
  }

  throw new Error(payload.error?.message ?? `Cloudinary returned HTTP ${response.status}`);
}

async function writeManifest(assetMap) {
  const contents = [
    '// Generated by `npm run upload:cloudinary`. Do not edit manually.',
    `export const cloudinaryAssets = ${JSON.stringify(assetMap, null, 2)};`,
    ''
  ].join('\n');
  await writeFile(manifestPath, contents, 'utf8');
}

async function updateSocialPreview(imageUrl) {
  const html = await readFile(indexHtmlPath, 'utf8');
  const updatedHtml = html
    .replace(/(<meta property="og:image" content=")[^"]+("\s*\/>)/, `$1${imageUrl}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]+("\s*\/>)/, `$1${imageUrl}$2`);

  await writeFile(indexHtmlPath, updatedHtml, 'utf8');
}

async function main() {
  await loadLocalEnvironment();
  const cloudName = requiredEnvironmentValue('CLOUDINARY_CLOUD_NAME');
  const apiKey = requiredEnvironmentValue('CLOUDINARY_API_KEY');
  const apiSecret = requiredEnvironmentValue('CLOUDINARY_API_SECRET');
  const overwrite = process.env.CLOUDINARY_OVERWRITE === 'true';
  const images = await findImages(publicDirectory);
  const timestamp = await cloudinaryTimestamp();
  const assetMap = {};
  let uploaded = 0;
  let existing = 0;

  console.log(`Uploading ${images.length} images to Cloudinary (${overwrite ? 'overwrite enabled' : 'existing files preserved'})...`);

  for (const filePath of images) {
    const result = await uploadImage({ filePath, cloudName, apiKey, apiSecret, overwrite, timestamp });
    assetMap[result.localUrl] = result.url;
    uploaded += result.status === 'uploaded' ? 1 : 0;
    existing += result.status === 'already exists' ? 1 : 0;
    console.log(`${result.status}: ${result.localUrl}`);
  }

  await writeManifest(assetMap);
  const socialPreviewImage = assetMap['/Product_images/reversible_plough_2.jpeg'];
  if (socialPreviewImage) await updateSocialPreview(socialPreviewImage);
  console.log(`Cloudinary manifest written: ${uploaded} uploaded, ${existing} already existed.`);
}

main().catch((error) => {
  console.error(`Cloudinary migration failed: ${error.message}`);
  process.exitCode = 1;
});
