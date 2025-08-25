#!/usr/bin/env node

/**
 * MuaSamViet Setup Test Script
 * Tests if the project is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing MuaSamViet Setup...\n');

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, type = 'info') {
  const color = colors[type] || colors.reset;
  console.log(`${color}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  try {
    if (fs.existsSync(filePath)) {
      log(`✅ ${description}`, 'green');
      return true;
    } else {
      log(`❌ ${description} - File not found`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${description} - Error: ${error.message}`, 'red');
    return false;
  }
}

function checkDirectory(dirPath, description) {
  try {
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      log(`✅ ${description}`, 'green');
      return true;
    } else {
      log(`❌ ${description} - Directory not found`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${description} - Error: ${error.message}`, 'red');
    return false;
  }
}

function checkPackageJson(dirPath, description) {
  const packagePath = path.join(dirPath, 'package.json');
  const nodeModulesPath = path.join(dirPath, 'node_modules');
  
  const hasPackage = checkFile(packagePath, `${description} - package.json`);
  const hasNodeModules = checkDirectory(nodeModulesPath, `${description} - node_modules`);
  
  return hasPackage && hasNodeModules;
}

// Test results
let testsPassed = 0;
let totalTests = 0;

function runTest(testFn, description) {
  totalTests++;
  if (testFn()) {
    testsPassed++;
  }
}

// Test 1: Root package.json
runTest(() => checkFile('package.json', 'Root package.json'), 'Root package.json');

// Test 2: Database schema
runTest(() => checkFile('muasamviet_database.sql', 'Database schema file'), 'Database schema');

// Test 3: Backend setup
runTest(() => checkPackageJson('server', 'Backend'), 'Backend setup');

// Test 4: Frontend setup
runTest(() => checkPackageJson('client', 'Frontend'), 'Frontend setup');

// Test 5: Environment examples
runTest(() => checkFile('server/env.example', 'Backend env.example'), 'Backend env.example');
runTest(() => checkFile('client/env.example', 'Frontend env.example'), 'Frontend env.example');

// Test 6: Setup guides
runTest(() => checkFile('SETUP_GUIDE.md', 'Setup guide'), 'Setup guide');
runTest(() => checkFile('QUICK_START.md', 'Quick start guide'), 'Quick start guide');

// Test 7: Upload directories
runTest(() => checkDirectory('server/src/uploads', 'Uploads directory'), 'Uploads directory');
runTest(() => checkDirectory('server/src/uploads/avatars', 'Avatars directory'), 'Avatars directory');
runTest(() => checkDirectory('server/src/uploads/products', 'Products directory'), 'Products directory');

// Test 8: Setup script
runTest(() => checkFile('server/scripts/setup.sh', 'Setup script'), 'Setup script');

console.log('\n📊 Test Results:');
log(`${testsPassed}/${totalTests} tests passed`, testsPassed === totalTests ? 'green' : 'yellow');

if (testsPassed === totalTests) {
  console.log('\n🎉 All tests passed! Your MuaSamViet project is ready.');
  console.log('\n📝 Next steps:');
  log('1. Setup database: mysql -u root -p < muasamviet_database.sql', 'blue');
  log('2. Configure environment: cp server/env.example server/.env', 'blue');
  log('3. Start development: npm run dev', 'blue');
  log('4. Access: http://localhost:5173', 'blue');
} else {
  console.log('\n⚠️  Some tests failed. Please check the setup guide: SETUP_GUIDE.md');
  console.log('\n🔧 Quick fix:');
  log('npm run install:all', 'blue');
  log('bash server/scripts/setup.sh', 'blue');
}

console.log('\n📚 Documentation:');
log('• Quick Start: QUICK_START.md', 'blue');
log('• Full Setup: SETUP_GUIDE.md', 'blue');
log('• Social Login: SOCIAL_LOGIN_SETUP.md', 'blue');
