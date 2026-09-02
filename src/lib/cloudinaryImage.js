/**
 * Enhanced Cloudinary image URL builder with responsive transformations
 */

/**
 * Parse Cloudinary URL to extract base and path components
 * @param {string} url - Cloudinary URL
 * @returns {{base: string, version: string, path: string} | null}
 */
export function parseCloudinaryUrl(url) {
  if (!url || !url.includes('res.cloudinary.com')) {
    return null;
  }

  // Handle URLs with existing transformations: 
  // https://res.cloudinary.com/CLOUD/image/upload/f_auto/q_auto/v123456/path
  // OR simple URLs:
  // https://res.cloudinary.com/CLOUD/image/upload/v123456/path
  
  const basePattern = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)/;
  const baseMatch = url.match(basePattern);
  
  if (!baseMatch) return null;
  
  const base = baseMatch[1];
  const afterUpload = url.substring(base.length);
  
  // Find version number (v followed by digits)
  const versionMatch = afterUpload.match(/(v\d+)\//);
  
  if (!versionMatch) return null;
  
  const versionIndex = afterUpload.indexOf(versionMatch[0]);
  const path = afterUpload.substring(versionIndex + versionMatch[0].length);
  
  return {
    base: base,
    version: versionMatch[0], // "v1786167228/"
    path: path // "padmashri-agro/products/hydraulic_trailer_1.jpg"
  };
}

/**
 * Apply transformations to Cloudinary URL
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @param {number} options.width - Image width in pixels
 * @param {string} options.quality - Quality (auto, auto:low, auto:good, auto:best)
 * @param {string} options.format - Format (auto for WebP/fallback)
 * @param {string} options.crop - Crop mode (fill, fit, scale)
 * @param {boolean} options.blur - Apply blur effect for placeholder
 * @returns {string} Transformed Cloudinary URL
 */
export function getCloudinaryUrl(url, options = {}) {
  const parsed = parseCloudinaryUrl(url);
  
  // If not a Cloudinary URL, return as-is
  if (!parsed) return url;

  const transformations = [];

  // Format (WebP with fallback)
  if (options.format !== false) {
    transformations.push('f_auto');
  }

  // Quality
  transformations.push(options.quality || 'q_auto');

  // Width
  if (options.width) {
    transformations.push(`w_${options.width}`);
  }

  // Crop mode
  if (options.crop) {
    transformations.push(`c_${options.crop}`);
  }

  // Blur for placeholder
  if (options.blur) {
    transformations.push('e_blur:1000', 'q_auto:low', 'w_50');
  }

  const transformString = transformations.join(',');
  
  // Rebuild URL: base + transformations + version + path
  return `${parsed.base}${transformString}/${parsed.version}${parsed.path}`;
}

/**
 * Generate srcset string for responsive images
 * @param {string} url - Original Cloudinary URL
 * @param {number[]} widths - Array of widths [400, 800, 1200]
 * @param {object} options - Additional transformation options
 * @returns {string} srcset string
 */
export function generateSrcSet(url, widths = [400, 800, 1200], options = {}) {
  const parsed = parseCloudinaryUrl(url);
  
  if (!parsed) {
    // Not a Cloudinary URL, return empty
    return '';
  }

  return widths
    .map(width => {
      const transformedUrl = getCloudinaryUrl(url, { ...options, width });
      return `${transformedUrl} ${width}w`;
    })
    .join(', ');
}

/**
 * Get tiny blur placeholder URL
 * @param {string} url - Original Cloudinary URL
 * @returns {string} Blur placeholder URL
 */
export function getBlurPlaceholder(url) {
  return getCloudinaryUrl(url, { blur: true });
}

/**
 * Preset configurations for common use cases
 */
export const IMAGE_PRESETS = {
  product: {
    widths: [400, 600, 800],
    sizes: '(max-width: 640px) 400px, (max-width: 1024px) 600px, 800px',
    quality: 'q_auto:good'
  },
  gallery: {
    widths: [600, 900, 1200],
    sizes: '(max-width: 640px) 600px, (max-width: 1024px) 900px, 1200px',
    quality: 'q_auto:best'
  },
  thumbnail: {
    widths: [150, 300],
    sizes: '(max-width: 640px) 150px, 300px',
    quality: 'q_auto'
  },
  hero: {
    widths: [800, 1200, 1600],
    sizes: '(max-width: 768px) 800px, (max-width: 1280px) 1200px, 1600px',
    quality: 'q_auto:best'
  }
};
