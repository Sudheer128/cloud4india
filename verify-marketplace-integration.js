#!/usr/bin/env node

/**
 * Verification Script for Marketplace Integration
 * Checks code structure, API routes, and database references
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, checks) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    return { exists: false, passed: false, issues: [`File not found: ${filePath}`] };
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const issues = [];
  let passed = true;
  
  checks.forEach(check => {
    if (check.type === 'contains' && !content.includes(check.value)) {
      issues.push(`Missing: ${check.description || check.value}`);
      passed = false;
    } else if (check.type === 'notContains' && content.includes(check.value)) {
      issues.push(`Should not contain: ${check.description || check.value}`);
      passed = false;
    } else if (check.type === 'regex' && !check.pattern.test(content)) {
      issues.push(`Pattern not found: ${check.description || check.pattern}`);
      passed = false;
    }
  });
  
  return { exists: true, passed, issues };
}

async function verifyBackend() {
  log('\n🔌 Verifying Backend API Routes...', 'cyan');
  
  const serverFile = 'cloud4india-cms/server.js';
  const checks = [
    { type: 'contains', value: '/api/marketplaces', description: 'GET /api/marketplaces endpoint' },
    { type: 'contains', value: '/api/admin/marketplaces', description: 'GET /api/admin/marketplaces endpoint' },
    { type: 'contains', value: '/api/marketplaces/:id/sections', description: 'GET marketplace sections endpoint' },
    { type: 'contains', value: 'marketplace_sections', description: 'marketplace_sections table reference' },
    { type: 'contains', value: 'marketplace_id', description: 'marketplace_id column reference' },
    { type: 'notContains', value: 'solution_sections', description: 'Old solution_sections reference' },
    { type: 'notContains', value: 'solution_id', description: 'Old solution_id reference' }
  ];
  
  const result = checkFile(serverFile, checks);
  if (result.passed) {
    log('✅ Backend API routes correctly configured', 'green');
  } else {
    log('❌ Backend API routes have issues:', 'red');
    result.issues.forEach(issue => log(`   - ${issue}`, 'red'));
  }
  
  return result.passed;
}

async function verifyFrontend() {
  log('\n🌐 Verifying Frontend Integration...', 'cyan');
  
  const files = [
    {
      path: 'src/services/cmsApi.js',
      checks: [
        { type: 'contains', value: 'getMarketplaces', description: 'getMarketplaces function' },
        { type: 'contains', value: 'getMarketplaceByName', description: 'getMarketplaceByName function' },
        { type: 'contains', value: '/marketplaces', description: 'Marketplace API endpoint' },
        { type: 'notContains', value: 'getSolutions', description: 'Old getSolutions function' }
      ]
    },
    {
      path: 'src/hooks/useMarketplaces.js',
      checks: [
        { type: 'contains', value: 'useMarketplaces', description: 'useMarketplaces hook' },
        { type: 'contains', value: 'getMarketplaces', description: 'getMarketplaces import' },
        { type: 'notContains', value: 'useSolutions', description: 'Old useSolutions hook' }
      ]
    },
    {
      path: 'src/hooks/useMarketplaceSections.js',
      checks: [
        { type: 'contains', value: 'useMarketplaceSections', description: 'useMarketplaceSections hook' },
        { type: 'contains', value: '/marketplaces/', description: 'Marketplace API endpoint' },
        { type: 'notContains', value: 'useSolutionSections', description: 'Old useSolutionSections hook' }
      ]
    },
    {
      path: 'src/pages/UniversalMarketplacePage.jsx',
      checks: [
        { type: 'contains', value: 'UniversalMarketplacePage', description: 'Component name' },
        { type: 'contains', value: 'useMarketplaceSections', description: 'useMarketplaceSections hook' },
        { type: 'contains', value: 'getMarketplaceByName', description: 'getMarketplaceByName function' },
        { type: 'notContains', value: 'UniversalSolutionPage', description: 'Old component name' }
      ]
    },
    {
      path: 'src/App.jsx',
      checks: [
        { type: 'contains', value: 'UniversalMarketplacePage', description: 'UniversalMarketplacePage import' },
        { type: 'contains', value: '/marketplace/', description: 'Marketplace route' },
        { type: 'notContains', value: '/solutions/', description: 'Old solutions route' }
      ]
    }
  ];
  
  let allPassed = true;
  files.forEach(file => {
    const result = checkFile(file.path, file.checks);
    if (result.passed) {
      log(`✅ ${file.path} - Correct`, 'green');
    } else {
      log(`❌ ${file.path} - Issues found:`, 'red');
      result.issues.forEach(issue => log(`   - ${issue}`, 'red'));
      allPassed = false;
    }
  });
  
  return allPassed;
}

async function verifyDatabaseSchema() {
  log('\n📊 Verifying Database Schema References...', 'cyan');
  
  const serverFile = 'cloud4india-cms/server.js';
  const content = fs.readFileSync(path.join(__dirname, serverFile), 'utf8');
  
  const requiredTables = [
    'marketplaces',
    'marketplace_sections',
    'marketplace_categories',
    'main_marketplaces_content',
    'main_marketplaces_sections'
  ];
  
  const oldTables = [
    'solutions',
    'solution_sections',
    'solution_categories',
    'main_solutions_content',
    'main_solutions_sections'
  ];
  
  let passed = true;
  
  requiredTables.forEach(table => {
    if (content.includes(table)) {
      log(`✅ ${table} table referenced`, 'green');
    } else {
      log(`❌ ${table} table not found in server.js`, 'red');
      passed = false;
    }
  });
  
  oldTables.forEach(table => {
    // Check if old tables are only in migration script or comments
    const regex = new RegExp(`\\b${table}\\b`, 'g');
    const matches = content.match(regex);
    if (matches && matches.length > 0) {
      // Check if it's in a comment or migration context
      const lines = content.split('\n');
      let foundInCode = false;
      lines.forEach((line, index) => {
        if (line.includes(table) && !line.trim().startsWith('//') && !line.includes('migration')) {
          foundInCode = true;
          log(`⚠️  ${table} found in active code at line ${index + 1}`, 'yellow');
        }
      });
      if (foundInCode) {
        passed = false;
      }
    }
  });
  
  return passed;
}

async function verifyRoutes() {
  log('\n🛣️  Verifying Routes...', 'cyan');
  
  const appFile = 'src/App.jsx';
  const content = fs.readFileSync(path.join(__dirname, appFile), 'utf8');
  
  const checks = [
    { type: 'contains', value: 'path="/marketplace"', description: 'Main marketplace route' },
    { type: 'contains', value: 'path="/marketplace/:appName"', description: 'Marketplace detail route' },
    { type: 'notContains', value: 'path="/solutions"', description: 'Old solutions route' }
  ];
  
  const result = checkFile(appFile, checks);
  if (result.passed) {
    log('✅ Routes correctly configured', 'green');
  } else {
    log('❌ Route configuration issues:', 'red');
    result.issues.forEach(issue => log(`   - ${issue}`, 'red'));
  }
  
  return result.passed;
}

async function runVerification() {
  log('\n🧪 Starting Marketplace Integration Verification\n', 'cyan');
  
  const backend = await verifyBackend();
  const frontend = await verifyFrontend();
  const database = await verifyDatabaseSchema();
  const routes = await verifyRoutes();
  
  log('\n📊 Verification Summary\n', 'cyan');
  log(`Backend API: ${backend ? '✅ PASSED' : '❌ FAILED'}`, backend ? 'green' : 'red');
  log(`Frontend Integration: ${frontend ? '✅ PASSED' : '❌ FAILED'}`, frontend ? 'green' : 'red');
  log(`Database Schema: ${database ? '✅ PASSED' : '❌ FAILED'}`, database ? 'green' : 'red');
  log(`Routes: ${routes ? '✅ PASSED' : '❌ FAILED'}`, routes ? 'green' : 'red');
  
  const allPassed = backend && frontend && database && routes;
  log(`\n${allPassed ? '✅' : '❌'} Overall: ${allPassed ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'}\n`, allPassed ? 'green' : 'red');
  
  if (allPassed) {
    log('✅ Marketplace integration is properly configured!', 'green');
    log('\n📝 Next Steps:', 'cyan');
    log('1. Start the backend: cd cloud4india-cms && npm start', 'blue');
    log('2. Start the frontend: npm run dev', 'blue');
    log('3. Test the APIs using the running services', 'blue');
  } else {
    log('⚠️  Please fix the issues above before testing with running services', 'yellow');
  }
  
  process.exit(allPassed ? 0 : 1);
}

runVerification().catch(err => {
  log(`\n💥 Fatal Error: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});

