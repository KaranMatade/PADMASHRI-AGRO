import { cloudinaryAssets } from '../data/cloudinaryAssets';

/**
 * Uses the Cloudinary delivery URL after migration and keeps the local public
 * image available as a safe fallback before Cloudinary is configured.
 */
export function imageUrl(localUrl) {
  return cloudinaryAssets[localUrl] ?? localUrl;
}
