// Quick Test Script for Cloudinary Optimization
// Run this in browser console after starting dev server

console.log('🧪 Testing Cloudinary Responsive Images...\n');

// Test 1: Check if ResponsiveImage components exist
const responsiveWrappers = document.querySelectorAll('.responsive-image-wrapper');
console.log(`✅ Found ${responsiveWrappers.length} ResponsiveImage components`);

// Test 2: Check for srcset attributes
const imagesWithSrcset = document.querySelectorAll('img[srcset]');
console.log(`✅ Found ${imagesWithSrcset.length} images with srcset`);

// Test 3: Check for blur placeholders
const blurPlaceholders = document.querySelectorAll('.responsive-image-placeholder');
console.log(`✅ Found ${blurPlaceholders.length} blur placeholders`);

// Test 4: Check if images have Cloudinary transformations
let transformedImages = 0;
document.querySelectorAll('img').forEach(img => {
  if (img.src.includes('cloudinary') && img.src.includes('w_')) {
    transformedImages++;
  }
});
console.log(`✅ Found ${transformedImages} images with width transformations`);

// Test 5: Show sample transformed URLs
console.log('\n📸 Sample Transformed URLs:');
document.querySelectorAll('img[srcset]').forEach((img, i) => {
  if (i < 3) { // Show first 3
    console.log(`\nImage: ${img.alt || 'No alt'}`);
    console.log(`Current: ${img.currentSrc}`);
    console.log(`srcset: ${img.srcset.substring(0, 100)}...`);
  }
});

// Test 6: Check mobile optimization
console.log('\n📱 Mobile Optimization Check:');
const viewportWidth = window.innerWidth;
console.log(`Viewport width: ${viewportWidth}px`);
if (viewportWidth <= 640) {
  console.log('✅ Mobile view - should load 400-600px images');
} else if (viewportWidth <= 1024) {
  console.log('✅ Tablet view - should load 600-900px images');
} else {
  console.log('✅ Desktop view - should load 800-1200px images');
}

// Test 7: Estimate data savings
console.log('\n💾 Estimated Data Savings:');
let totalOriginalSize = 0;
let totalOptimizedSize = 0;
document.querySelectorAll('img[srcset]').forEach(img => {
  // Rough estimate: original ~1200px = 300KB, optimized varies
  totalOriginalSize += 300;
  const width = parseInt(img.currentSrc.match(/w_(\d+)/)?.[1] || 800);
  totalOptimizedSize += (width / 1200) * 300;
});
const savings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(0);
console.log(`Original: ~${(totalOriginalSize / 1024).toFixed(1)} MB`);
console.log(`Optimized: ~${(totalOptimizedSize / 1024).toFixed(1)} MB`);
console.log(`Savings: ${savings}% reduction`);

console.log('\n✅ Cloudinary Optimization Test Complete!');
