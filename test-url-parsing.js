// Test Cloudinary URL Parsing Fix
// Copy this to browser console to verify

import { parseCloudinaryUrl, getCloudinaryUrl } from './src/lib/cloudinaryImage.js';

// Test URLs from your data
const testUrls = [
  'https://res.cloudinary.com/bthbndrq/image/upload/v1786167228/padmashri-agro/products/hydraulic_trailer_1.jpg',
  'https://res.cloudinary.com/bthbndrq/image/upload/f_auto/q_auto/v1786167228/padmashri-agro/products/hydraulic_trailer_1.jpg'
];

console.log('🧪 Testing Cloudinary URL Parsing...\n');

testUrls.forEach((url, i) => {
  console.log(`\nTest ${i + 1}:`);
  console.log('Original:', url);
  
  try {
    const parsed = parseCloudinaryUrl(url);
    console.log('✅ Parsed successfully:', parsed);
    
    const transformed = getCloudinaryUrl(url, { width: 400, quality: 'q_auto:good' });
    console.log('✅ Transformed:', transformed);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
});

console.log('\n✅ URL Parsing Test Complete!');
