#!/usr/bin/env node

/**
 * Production Verification Script
 * Checks that the application is ready for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Production Readiness...\n');

let issues = [];
let warnings = [];

// Check for test routes in App.js
function checkTestRoutes() {
  console.log('📋 Checking test routes...');
  
  const appPath = path.join(__dirname, 'client/src/App.js');
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  // Check if test routes are wrapped with AdminOnly
  const testRoutes = [
    '/wizard-test',
    '/test',
    '/simple',
    '/auth-test',
    '/network-test',
    '/login-test',
    '/supabase-test',
    '/survey-debugger',
    '/database-inspector'
  ];
  
  testRoutes.forEach(route => {
    if (appContent.includes(`path="${route}"`)) {
      if (appContent.includes(`AdminOnly`)) {
        console.log(`  ✅ ${route} - Protected with AdminOnly`);
      } else {
        issues.push(`❌ ${route} - Not protected with AdminOnly`);
      }
    }
  });
}

// Check for console.log statements
function checkConsoleLogs() {
  console.log('\n📝 Checking console.log statements...');
  
  const srcDir = path.join(__dirname, 'client/src');
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(filePath);
      } else if (file.endsWith('.js') && !file.includes('.test.') && !file.includes('.spec.')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for console.log (but allow console.error and console.warn)
        const consoleLogMatches = content.match(/console\.log\(/g);
        const consoleWarnMatches = content.match(/console\.warn\(/g);
        const consoleErrorMatches = content.match(/console\.error\(/g);
        
        if (consoleLogMatches && consoleLogMatches.length > 0) {
          warnings.push(`⚠️  ${path.relative(__dirname, filePath)} - Contains ${consoleLogMatches.length} console.log statements`);
        }
        
        if (consoleWarnMatches && consoleWarnMatches.length > 5) {
          warnings.push(`⚠️  ${path.relative(__dirname, filePath)} - Contains ${consoleWarnMatches.length} console.warn statements`);
        }
        
        if (consoleErrorMatches && consoleErrorMatches.length > 10) {
          warnings.push(`⚠️  ${path.relative(__dirname, filePath)} - Contains ${consoleErrorMatches.length} console.error statements`);
        }
      }
    });
  }
  
  scanDirectory(srcDir);
}

// Check for production utilities
function checkProductionFiles() {
  console.log('\n🛠️  Checking production utilities...');
  
  const requiredFiles = [
    'client/src/utils/adminUtils.js',
    'client/src/utils/logger.js',
    'client/src/config/production.js'
  ];
  
  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file} - Exists`);
    } else {
      issues.push(`❌ ${file} - Missing`);
    }
  });
}

// Check for mock data
function checkMockData() {
  console.log('\n🎭 Checking for mock data...');
  
  const srcDir = path.join(__dirname, 'client/src');
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(filePath);
      } else if (file.endsWith('.js')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for common mock data patterns
        const mockPatterns = [
          /mockData\s*=/,
          /generateMock/,
          /fakeData/,
          /sampleData/,
          /testData/
        ];
        
        mockPatterns.forEach(pattern => {
          if (pattern.test(content) && !file.includes('.test.') && !file.includes('.spec.')) {
            warnings.push(`⚠️  ${path.relative(__dirname, filePath)} - May contain mock data`);
          }
        });
      }
    });
  }
  
  scanDirectory(srcDir);
}

// Check package.json scripts
function checkPackageScripts() {
  console.log('\n📦 Checking package.json scripts...');
  
  const packagePath = path.join(__dirname, 'client/package.json');
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    if (packageJson.scripts && packageJson.scripts.build) {
      console.log('  ✅ Build script exists');
    } else {
      issues.push('❌ Build script missing from package.json');
    }
    
    if (packageJson.scripts && packageJson.scripts.start) {
      console.log('  ✅ Start script exists');
    } else {
      issues.push('❌ Start script missing from package.json');
    }
  } else {
    issues.push('❌ package.json not found');
  }
}

// Run all checks
checkTestRoutes();
checkConsoleLogs();
checkProductionFiles();
checkMockData();
checkPackageScripts();

// Summary
console.log('\n📊 Production Readiness Summary:');
console.log('================================');

if (issues.length === 0 && warnings.length === 0) {
  console.log('🎉 All checks passed! Application is ready for production.');
  process.exit(0);
} else {
  if (issues.length > 0) {
    console.log('\n❌ Critical Issues (must fix before production):');
    issues.forEach(issue => console.log(`  ${issue}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings (recommended to fix):');
    warnings.forEach(warning => console.log(`  ${warning}`));
  }
  
  console.log(`\n📈 Status: ${issues.length > 0 ? 'NOT READY' : 'READY WITH WARNINGS'}`);
  process.exit(issues.length > 0 ? 1 : 0);
}
