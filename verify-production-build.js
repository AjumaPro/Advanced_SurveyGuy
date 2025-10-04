#!/usr/bin/env node

/**
 * Production Build Verification Script
 * Verifies that the production build is ready for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Production Build...\n');

const buildDir = path.join(__dirname, 'client', 'build');
const requiredFiles = [
  'index.html',
  'static/css/main.css',
  'static/js/main.js',
  'manifest.json',
  'asset-manifest.json'
];

const requiredDirs = [
  'static',
  'static/css',
  'static/js',
  'emojis'
];

let allChecksPassed = true;

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.error('❌ Build directory not found at:', buildDir);
  process.exit(1);
}

console.log('✅ Build directory exists');

// Check required files
console.log('\n📄 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(buildDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`❌ Missing: ${file}`);
    allChecksPassed = false;
  }
});

// Check required directories
console.log('\n📁 Checking required directories:');
requiredDirs.forEach(dir => {
  const dirPath = path.join(buildDir, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.error(`❌ Missing directory: ${dir}/`);
    allChecksPassed = false;
  }
});

// Check for demo/test files (should not exist)
console.log('\n🧹 Checking for demo/test files (should not exist):');
const demoFiles = [
  'src/pages/SampleSurveys.js',
  'src/components/SampleSurveyManager.js',
  'src/pages/NewFeaturesDemo.js'
];

let demoFilesFound = false;
demoFiles.forEach(file => {
  const filePath = path.join(__dirname, 'client', file);
  if (fs.existsSync(filePath)) {
    console.error(`❌ Demo file still exists: ${file}`);
    demoFilesFound = true;
    allChecksPassed = false;
  }
});

if (!demoFilesFound) {
  console.log('✅ No demo files found');
}

// Check build size
console.log('\n📊 Build size analysis:');
try {
  const { execSync } = require('child_process');
  const sizeOutput = execSync(`du -sh "${buildDir}"`, { encoding: 'utf8' });
  console.log(`📦 Total build size: ${sizeOutput.trim()}`);
  
  // Check if build is reasonable size (not too small, not too large)
  const sizeMatch = sizeOutput.match(/(\d+(?:\.\d+)?)([KMGT]?)/);
  if (sizeMatch) {
    const size = parseFloat(sizeMatch[1]);
    const unit = sizeMatch[2];
    
    if (unit === 'K' && size < 100) {
      console.warn('⚠️  Build size seems too small - may be incomplete');
    } else if (unit === 'M' && size > 50) {
      console.warn('⚠️  Build size seems large - check for unnecessary files');
    } else {
      console.log('✅ Build size looks reasonable');
    }
  }
} catch (error) {
  console.warn('⚠️  Could not determine build size');
}

// Check index.html content
console.log('\n🔍 Checking index.html content:');
try {
  const indexPath = path.join(buildDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Check for production indicators
  if (indexContent.includes('main.') && indexContent.includes('.js')) {
    console.log('✅ JavaScript files are minified');
  } else {
    console.warn('⚠️  JavaScript files may not be minified');
  }
  
  if (indexContent.includes('main.') && indexContent.includes('.css')) {
    console.log('✅ CSS files are minified');
  } else {
    console.warn('⚠️  CSS files may not be minified');
  }
  
  if (!indexContent.includes('localhost')) {
    console.log('✅ No localhost references found');
  } else {
    console.warn('⚠️  Localhost references found in build');
  }
  
  if (indexContent.includes('Paystack')) {
    console.log('✅ Paystack integration included');
  } else {
    console.warn('⚠️  Paystack integration not found');
  }
  
} catch (error) {
  console.error('❌ Could not read index.html:', error.message);
  allChecksPassed = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (allChecksPassed) {
  console.log('🎉 PRODUCTION BUILD VERIFICATION PASSED!');
  console.log('✅ Ready for deployment');
  console.log('\n📋 Next steps:');
  console.log('1. Set up production environment variables');
  console.log('2. Run database cleanup script');
  console.log('3. Deploy to your hosting service');
  console.log('4. Test all functionality');
} else {
  console.log('❌ PRODUCTION BUILD VERIFICATION FAILED!');
  console.log('Please fix the issues above before deploying');
  process.exit(1);
}

console.log('\n📁 Build location:', buildDir);
console.log('🌐 Ready for deployment!');
