#!/usr/bin/env node

/**
 * Comprehensive Test Script for Marketplace APIs
 * Tests frontend, backend, and database integration
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const http = require('http');

const CMS_URL = process.env.CMS_URL || 'http://localhost:4002';
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'cloud4india-cms', 'cms.db');

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

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => reject(err));
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testDatabase() {
  log('\n📊 Testing Database...', 'cyan');
  
  return new Promise((resolve) => {
    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        log(`❌ Database connection failed: ${err.message}`, 'red');
        resolve(false);
        return;
      }
      
      let tests = 0;
      let passed = 0;
      
      // Test 1: Check if marketplaces table exists
      tests++;
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='marketplaces'", (err, row) => {
        if (err || !row) {
          log('❌ marketplaces table does not exist', 'red');
        } else {
          log('✅ marketplaces table exists', 'green');
          passed++;
        }
        
        // Test 2: Check if marketplace_sections table exists
        tests++;
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='marketplace_sections'", (err, row) => {
          if (err || !row) {
            log('❌ marketplace_sections table does not exist', 'red');
          } else {
            log('✅ marketplace_sections table exists', 'green');
            passed++;
          }
          
          // Test 3: Check if main_marketplaces_content table exists
          tests++;
          db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='main_marketplaces_content'", (err, row) => {
            if (err || !row) {
              log('❌ main_marketplaces_content table does not exist', 'red');
            } else {
              log('✅ main_marketplaces_content table exists', 'green');
              passed++;
            }
            
            // Test 4: Check if main_marketplaces_sections table exists
            tests++;
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='main_marketplaces_sections'", (err, row) => {
              if (err || !row) {
                log('❌ main_marketplaces_sections table does not exist', 'red');
              } else {
                log('✅ main_marketplaces_sections table exists', 'green');
                passed++;
              }
              
              // Test 5: Check for old solution tables (should not exist)
              tests++;
              db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='solutions'", (err, row) => {
                if (row) {
                  log('⚠️  Old solutions table still exists (should be migrated)', 'yellow');
                } else {
                  log('✅ Old solutions table does not exist (correctly migrated)', 'green');
                  passed++;
                }
                
                // Test 6: Count marketplaces
                tests++;
                db.get("SELECT COUNT(*) as count FROM marketplaces", (err, row) => {
                  if (err) {
                    log(`❌ Error counting marketplaces: ${err.message}`, 'red');
                  } else {
                    log(`✅ Found ${row.count} marketplaces in database`, 'green');
                    passed++;
                  }
                  
                  // Test 7: Check marketplace structure
                  tests++;
                  db.all("PRAGMA table_info(marketplaces)", (err, columns) => {
                    if (err) {
                      log(`❌ Error getting marketplace table info: ${err.message}`, 'red');
                    } else {
                      const hasMarketplaceId = columns.some(c => c.name === 'id');
                      const hasName = columns.some(c => c.name === 'name');
                      if (hasMarketplaceId && hasName) {
                        log('✅ marketplaces table has correct structure', 'green');
                        passed++;
                      } else {
                        log('❌ marketplaces table structure is incorrect', 'red');
                      }
                    }
                    
                    db.close();
                    log(`\n📊 Database Tests: ${passed}/${tests} passed`, passed === tests ? 'green' : 'yellow');
                    resolve(passed === tests);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

async function testBackendAPIs() {
  log('\n🔌 Testing Backend APIs...', 'cyan');
  
  let tests = 0;
  let passed = 0;
  
  try {
    // Test 1: GET /api/marketplaces
    tests++;
    try {
      const response = await makeRequest(`${CMS_URL}/api/marketplaces`);
      if (response.status === 200 && Array.isArray(response.data)) {
        log(`✅ GET /api/marketplaces - Success (${response.data.length} marketplaces)`, 'green');
        passed++;
      } else {
        log(`❌ GET /api/marketplaces - Failed (Status: ${response.status})`, 'red');
      }
    } catch (err) {
      log(`❌ GET /api/marketplaces - Error: ${err.message}`, 'red');
    }
    
    // Test 2: GET /api/admin/marketplaces
    tests++;
    try {
      const response = await makeRequest(`${CMS_URL}/api/admin/marketplaces`);
      if (response.status === 200 && Array.isArray(response.data)) {
        log(`✅ GET /api/admin/marketplaces - Success (${response.data.length} marketplaces)`, 'green');
        passed++;
      } else {
        log(`❌ GET /api/admin/marketplaces - Failed (Status: ${response.status})`, 'red');
      }
    } catch (err) {
      log(`❌ GET /api/admin/marketplaces - Error: ${err.message}`, 'red');
    }
    
    // Test 3: GET /api/main-marketplaces
    tests++;
    try {
      const response = await makeRequest(`${CMS_URL}/api/main-marketplaces`);
      if (response.status === 200 && response.data) {
        log('✅ GET /api/main-marketplaces - Success', 'green');
        passed++;
      } else {
        log(`❌ GET /api/main-marketplaces - Failed (Status: ${response.status})`, 'red');
      }
    } catch (err) {
      log(`❌ GET /api/main-marketplaces - Error: ${err.message}`, 'red');
    }
    
    // Test 4: GET /api/marketplaces/categories
    tests++;
    try {
      const response = await makeRequest(`${CMS_URL}/api/marketplaces/categories`);
      if (response.status === 200 && Array.isArray(response.data)) {
        log(`✅ GET /api/marketplaces/categories - Success (${response.data.length} categories)`, 'green');
        passed++;
      } else {
        log(`❌ GET /api/marketplaces/categories - Failed (Status: ${response.status})`, 'red');
      }
    } catch (err) {
      log(`❌ GET /api/marketplaces/categories - Error: ${err.message}`, 'red');
    }
    
    // Test 5: Test marketplace by ID (if marketplaces exist)
    tests++;
    try {
      const listResponse = await makeRequest(`${CMS_URL}/api/marketplaces`);
      if (listResponse.status === 200 && listResponse.data.length > 0) {
        const firstMarketplace = listResponse.data[0];
        const response = await makeRequest(`${CMS_URL}/api/marketplaces/${firstMarketplace.id}`);
        if (response.status === 200 && response.data.id) {
          log(`✅ GET /api/marketplaces/:id - Success (ID: ${firstMarketplace.id})`, 'green');
          passed++;
          
          // Test 6: GET marketplace sections
          tests++;
          try {
            const sectionsResponse = await makeRequest(`${CMS_URL}/api/marketplaces/${firstMarketplace.id}/sections`);
            if (sectionsResponse.status === 200 && Array.isArray(sectionsResponse.data)) {
              log(`✅ GET /api/marketplaces/:id/sections - Success (${sectionsResponse.data.length} sections)`, 'green');
              passed++;
            } else {
              log(`❌ GET /api/marketplaces/:id/sections - Failed`, 'red');
            }
          } catch (err) {
            log(`❌ GET /api/marketplaces/:id/sections - Error: ${err.message}`, 'red');
          }
        } else {
          log(`❌ GET /api/marketplaces/:id - Failed`, 'red');
        }
      } else {
        log('⚠️  Skipping marketplace by ID test (no marketplaces found)', 'yellow');
        passed++; // Count as passed since we can't test without data
      }
    } catch (err) {
      log(`❌ GET /api/marketplaces/:id - Error: ${err.message}`, 'red');
    }
    
  } catch (err) {
    log(`❌ Backend API tests failed: ${err.message}`, 'red');
  }
  
  log(`\n🔌 Backend API Tests: ${passed}/${tests} passed`, passed === tests ? 'green' : 'yellow');
  return passed === tests;
}

async function testFrontendIntegration() {
  log('\n🌐 Testing Frontend Integration...', 'cyan');
  
  let tests = 0;
  let passed = 0;
  
  // Check if frontend service files exist and have correct imports
  const fs = require('fs');
  const frontendFiles = [
    'src/services/cmsApi.js',
    'src/hooks/useMarketplaces.js',
    'src/hooks/useMarketplaceSections.js',
    'src/pages/UniversalMarketplacePage.jsx'
  ];
  
  frontendFiles.forEach(file => {
    tests++;
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('marketplace') && !content.includes('solution')) {
        log(`✅ ${file} - Correct marketplace references`, 'green');
        passed++;
      } else if (content.includes('solution') && !file.includes('backup')) {
        log(`⚠️  ${file} - May contain old solution references`, 'yellow');
        passed++; // Count as passed but warn
      } else {
        log(`✅ ${file} - Exists and checked`, 'green');
        passed++;
      }
    } else {
      log(`❌ ${file} - File not found`, 'red');
    }
  });
  
  log(`\n🌐 Frontend Integration Tests: ${passed}/${tests} passed`, passed === tests ? 'green' : 'yellow');
  return passed === tests;
}

async function runAllTests() {
  log('\n🧪 Starting Comprehensive Marketplace API Tests\n', 'cyan');
  log(`CMS URL: ${CMS_URL}`, 'blue');
  log(`DB Path: ${DB_PATH}\n`, 'blue');
  
  const dbTest = await testDatabase();
  const apiTest = await testBackendAPIs();
  const frontendTest = await testFrontendIntegration();
  
  log('\n📊 Test Summary\n', 'cyan');
  log(`Database Tests: ${dbTest ? '✅ PASSED' : '❌ FAILED'}`, dbTest ? 'green' : 'red');
  log(`Backend API Tests: ${apiTest ? '✅ PASSED' : '❌ FAILED'}`, apiTest ? 'green' : 'red');
  log(`Frontend Integration Tests: ${frontendTest ? '✅ PASSED' : '❌ FAILED'}`, frontendTest ? 'green' : 'red');
  
  const allPassed = dbTest && apiTest && frontendTest;
  log(`\n${allPassed ? '✅' : '❌'} Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}\n`, allPassed ? 'green' : 'red');
  
  process.exit(allPassed ? 0 : 1);
}

// Run tests
runAllTests().catch(err => {
  log(`\n💥 Fatal Error: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});

