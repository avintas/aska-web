/**
 * Generate PWA app icons for OnlyHockey.com
 * 
 * This script creates icon-192.png and icon-512.png
 * Run with: node scripts/generate-icons.js
 * 
 * Requires: npm install sharp --save-dev
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Error: sharp library not found.');
  console.log('\n📦 Please install sharp first:');
  console.log('   npm install sharp --save-dev\n');
  process.exit(1);
}

// Brand colors from BRAND.md
const COLORS = {
  navy: '#0a0e1a',
  orange: '#ff6b35',
  cyan: '#4cc9f0',
  white: '#ffffff',
};

// Create SVG icon
function createSVGIcon(size) {
  const center = size / 2;
  const fontSize = size * 0.4;
  const strokeWidth = size * 0.05;
  
  return `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="${COLORS.navy}" rx="${size * 0.2}"/>
  
  <!-- Hockey stick icon (simplified) -->
  <g transform="translate(${center}, ${center})">
    <!-- Stick blade -->
    <path d="M -${size * 0.25} ${size * 0.15} 
             Q -${size * 0.15} ${size * 0.1} -${size * 0.05} ${size * 0.15}
             L ${size * 0.05} ${size * 0.2}
             Q ${size * 0.1} ${size * 0.25} ${size * 0.05} ${size * 0.3}
             L -${size * 0.05} ${size * 0.35}
             Q -${size * 0.15} ${size * 0.3} -${size * 0.25} ${size * 0.25}
             Z"
          fill="${COLORS.orange}"
          stroke="${COLORS.white}"
          stroke-width="${strokeWidth}"/>
    
    <!-- Stick shaft -->
    <rect x="-${size * 0.02}" y="-${size * 0.35}" 
          width="${size * 0.04}" height="${size * 0.5}"
          fill="${COLORS.white}"
          rx="${size * 0.01}"/>
    
    <!-- Hockey puck -->
    <ellipse cx="${size * 0.2}" cy="${size * 0.25}" 
             rx="${size * 0.08}" ry="${size * 0.05}"
             fill="${COLORS.white}"
             stroke="${COLORS.cyan}"
             stroke-width="${strokeWidth}"/>
  </g>
  
  <!-- Text "OH" for OnlyHockey -->
  <text x="${center}" y="${center + fontSize * 0.35}" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold"
        fill="${COLORS.white}"
        text-anchor="middle">OH</text>
</svg>`.trim();
}

// Generate icons
async function generateIcons() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const sizes = [192, 512];
  
  console.log('🎨 Generating PWA app icons...\n');
  
  for (const size of sizes) {
    const svg = createSVGIcon(size);
    const svgBuffer = Buffer.from(svg);
    const outputPath = path.join(publicDir, `icon-${size}.png`);
    
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created icon-${size}.png (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Error creating icon-${size}.png:`, error.message);
      process.exit(1);
    }
  }
  
  console.log('\n✨ Icons generated successfully!');
  console.log(`📁 Location: ${publicDir}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Review the generated icons');
  console.log('   2. Deploy your site');
  console.log('   3. Test PWA installation on mobile devices\n');
}

// Run
generateIcons().catch(console.error);

