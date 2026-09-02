import React, { useState, useEffect, useRef } from 'react';
import { getCloudinaryUrl, generateSrcSet, getBlurPlaceholder, IMAGE_PRESETS } from '../lib/cloudinaryImage';

/**
 * Responsive image component with lazy loading and blur-up placeholder
 * @param {object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.preset - Preset configuration (product, gallery, thumbnail, hero)
 * @param {string} props.className - CSS class name
 * @param {boolean} props.eager - Load immediately without lazy loading
 * @param {function} props.onClick - Click handler
 * @param {object} props.style - Inline styles
 */
export default function ResponsiveImage({ 
  src, 
  alt, 
  preset = 'product', 
  className = '', 
  eager = false,
  onClick,
  style = {}
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(eager);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (eager || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before element enters viewport
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [eager]);

  // Safety check for src
  if (!src) {
    console.warn('ResponsiveImage: No src provided');
    return null;
  }

  const config = IMAGE_PRESETS[preset] || IMAGE_PRESETS.product;
  
  // Wrap transformation calls in try-catch for safety
  let blurPlaceholder = src;
  let srcSet = '';
  let defaultSrc = src;
  
  try {
    blurPlaceholder = getBlurPlaceholder(src);
    srcSet = generateSrcSet(src, config.widths, { quality: config.quality });
    defaultSrc = getCloudinaryUrl(src, { width: config.widths[1], quality: config.quality });
  } catch (error) {
    console.error('ResponsiveImage: Error generating URLs', error);
    // Fallback to original src
    blurPlaceholder = src;
    defaultSrc = src;
    srcSet = '';
  }

  // If error loading image, show fallback
  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`responsive-image-wrapper ${className}`}
        style={{ 
          position: 'relative', 
          overflow: 'hidden', 
          background: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style 
        }}
        onClick={onClick}
      >
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {alt || 'Image'}
        </span>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`responsive-image-wrapper ${className}`}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      onClick={onClick}
    >
      {/* Blur placeholder - always loaded */}
      <img
        src={blurPlaceholder}
        alt=""
        aria-hidden="true"
        className="responsive-image-placeholder"
        onError={() => {
          console.warn('ResponsiveImage: Placeholder failed to load');
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(10px)',
          transform: 'scale(1.1)',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoaded ? 0 : 1,
        }}
      />
      
      {/* Main image - loaded when in view */}
      {isInView && (
        <img
          src={defaultSrc}
          srcSet={srcSet}
          sizes={config.sizes}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            console.error('ResponsiveImage: Failed to load image', defaultSrc);
            setHasError(true);
          }}
          className="responsive-image-main"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease-in-out',
            opacity: isLoaded ? 1 : 0,
          }}
        />
      )}
    </div>
  );
}
