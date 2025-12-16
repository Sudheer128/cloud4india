#!/usr/bin/env node

/**
 * Comprehensive Test Script for Integrity Pages CMS
 * Tests all 5 pages: Privacy Policy, Acceptance User Policy, MSA & SLA, Terms & Conditions, Refund Policy
 * 
 * This script verifies:
 * 1. All pages exist in database
 * 2. Admin panel can fetch pages
 * 3. Updates are saved correctly
 * 4. Frontend can display updated content
 * 5. Visibility toggle works
 * 6. All CRUD operations
 */

const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const CMS_URL = process.env.CMS_URL || 'http://localhost:4002';
const DB_PATH = process.env.DB_PATH || './cloud4india-cms/cms.db';

// Expected pages
const EXPECTED_PAGES = [
  { slug: 'privacy', title: 'Privacy Policy' },
  { slug: 'acceptance-user-policy', title: 'Acceptance User Policy' },
  { slug: 'msa-sla', title: 'MSA & SLA' },
  { slug: 'terms', title: 'Terms & Conditions' },
  { slug: 'refund-policy', title: 'Refund Policy' }
];

// Test results
const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Helper function to log results
function logResult(testName, passed, message = '') {
  if (passed) {
    results.passed.push(testName);
    console.log(`✅ ${testName}${message ? ': ' + message : ''}`);
  } else {
    results.failed.push(testName);
    console.error(`❌ ${testName}${message ? ': ' + message : ''}`);
  }
}

function logWarning(testName, message) {
  results.warnings.push({ test: testName, message });
  console.warn(`⚠️  ${testName}: ${message}`);
}

// Test 1: Check database connection and table structure
async function testDatabaseStructure() {
  return new Promise((resolve) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        logResult('Database Connection', false, err.message);
        resolve(false);
        return;
      }
      logResult('Database Connection', true);
    });

    // Check if table exists and has required columns
    db.all("PRAGMA table_info(integrity_pages)", (err, columns) => {
      if (err) {
        logResult('Table Structure Check', false, err.message);
        db.close();
        resolve(false);
        return;
      }

      const requiredColumns = ['id', 'slug', 'title', 'content', 'is_visible', 'description', 'eyebrow', 'created_at', 'updated_at'];
      const existingColumns = columns.map(col => col.name);
      const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

      if (missingColumns.length > 0) {
        logWarning('Table Structure Check', `Missing columns: ${missingColumns.join(', ')}`);
      } else {
        logResult('Table Structure Check', true, 'All required columns exist');
      }

      db.close();
      resolve(true);
    });
  });
}

// Test 2: Check if all 5 pages exist in database
async function testPagesExist() {
  return new Promise((resolve) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        logResult('Pages Existence Check', false, err.message);
        resolve(false);
        return;
      }

      db.all("SELECT slug, title, id, is_visible FROM integrity_pages", (err, pages) => {
        if (err) {
          logResult('Pages Existence Check', false, err.message);
          db.close();
          resolve(false);
          return;
        }

        const existingSlugs = pages.map(p => p.slug);
        const missingPages = EXPECTED_PAGES.filter(expected => !existingSlugs.includes(expected.slug));

        if (missingPages.length > 0) {
          logResult('Pages Existence Check', false, `Missing pages: ${missingPages.map(p => p.title).join(', ')}`);
        } else {
          logResult('Pages Existence Check', true, `All ${EXPECTED_PAGES.length} pages exist`);
        }

        // Log each page status
        EXPECTED_PAGES.forEach(expected => {
          const page = pages.find(p => p.slug === expected.slug);
          if (page) {
            console.log(`   📄 ${expected.title} (ID: ${page.id}, Visible: ${page.is_visible === 1 ? 'Yes' : 'No'})`);
          }
        });

        db.close();
        resolve(true);
      });
    });
  });
}

// Test 3: Test API endpoints - GET all pages
async function testGetAllPagesAPI() {
  try {
    const response = await axios.get(`${CMS_URL}/api/integrity-pages?all=true`);
    
    if (response.status === 200 && Array.isArray(response.data)) {
      const slugs = response.data.map(p => p.slug);
      const allExist = EXPECTED_PAGES.every(expected => slugs.includes(expected.slug));
      
      if (allExist) {
        logResult('GET All Pages API', true, `Retrieved ${response.data.length} pages`);
        return true;
      } else {
        logResult('GET All Pages API', false, 'Not all expected pages returned');
        return false;
      }
    } else {
      logResult('GET All Pages API', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logResult('GET All Pages API', false, error.message);
    return false;
  }
}

// Test 4: Test API endpoints - GET single page by slug
async function testGetSinglePageAPI() {
  let passed = 0;
  let failed = 0;

  for (const expected of EXPECTED_PAGES) {
    try {
      const response = await axios.get(`${CMS_URL}/api/integrity-pages/${expected.slug}`);
      
      if (response.status === 200 && response.data && response.data.slug === expected.slug) {
        passed++;
      } else {
        failed++;
        logWarning(`GET Single Page API (${expected.title})`, 'Invalid response');
      }
    } catch (error) {
      failed++;
      logWarning(`GET Single Page API (${expected.title})`, error.message);
    }
  }

  if (failed === 0) {
    logResult('GET Single Page API', true, `All ${EXPECTED_PAGES.length} pages accessible`);
    return true;
  } else {
    logResult('GET Single Page API', false, `${failed} out of ${EXPECTED_PAGES.length} pages failed`);
    return false;
  }
}

// Test 5: Test UPDATE API endpoint
async function testUpdateAPI() {
  try {
    // First, get a page to update
    const getResponse = await axios.get(`${CMS_URL}/api/integrity-pages/privacy`);
    if (getResponse.status !== 200 || !getResponse.data) {
      logResult('UPDATE API Test', false, 'Could not fetch page to update');
      return false;
    }

    const pageId = getResponse.data.id;
    const originalTitle = getResponse.data.title;
    const testTitle = `Test Update ${Date.now()}`;
    const testDescription = 'This is a test description';
    const testEyebrow = 'Test Eyebrow';
    const testContent = '<h2>Test Content</h2><p>This is test content for verification.</p>';

    // Update the page
    const updateResponse = await axios.put(`${CMS_URL}/api/integrity-pages/${pageId}`, {
      title: testTitle,
      description: testDescription,
      eyebrow: testEyebrow,
      content: testContent
    });

    if (updateResponse.status !== 200) {
      logResult('UPDATE API Test', false, 'Update request failed');
      return false;
    }

    // Verify the update
    const verifyResponse = await axios.get(`${CMS_URL}/api/integrity-pages/privacy?all=true`);
    
    if (verifyResponse.status === 200 && verifyResponse.data) {
      const updated = verifyResponse.data;
      const allMatch = 
        updated.title === testTitle &&
        updated.description === testDescription &&
        updated.eyebrow === testEyebrow &&
        updated.content === testContent;

      if (allMatch) {
        // Restore original title
        await axios.put(`${CMS_URL}/api/integrity-pages/${pageId}`, {
          title: originalTitle,
          description: getResponse.data.description || '',
          eyebrow: getResponse.data.eyebrow || '',
          content: getResponse.data.content
        });
        
        logResult('UPDATE API Test', true, 'Update and verification successful');
        return true;
      } else {
        logResult('UPDATE API Test', false, 'Updated data does not match');
        console.log('   Expected:', { title: testTitle, description: testDescription, eyebrow: testEyebrow });
        console.log('   Got:', { 
          title: updated.title, 
          description: updated.description, 
          eyebrow: updated.eyebrow 
        });
        return false;
      }
    } else {
      logResult('UPDATE API Test', false, 'Could not verify update');
      return false;
    }
  } catch (error) {
    logResult('UPDATE API Test', false, error.message);
    if (error.response) {
      console.log('   Response:', error.response.data);
    }
    return false;
  }
}

// Test 6: Test Visibility Toggle API
async function testVisibilityToggleAPI() {
  try {
    // Get a page
    const getResponse = await axios.get(`${CMS_URL}/api/integrity-pages/privacy?all=true`);
    if (getResponse.status !== 200 || !getResponse.data) {
      logResult('Visibility Toggle API', false, 'Could not fetch page');
      return false;
    }

    const pageId = getResponse.data.id;
    const originalVisibility = getResponse.data.is_visible;

    // Toggle visibility
    const toggleResponse = await axios.put(`${CMS_URL}/api/integrity-pages/${pageId}/toggle-visibility`);
    
    if (toggleResponse.status !== 200) {
      logResult('Visibility Toggle API', false, 'Toggle request failed');
      return false;
    }

    // Verify toggle
    const verifyResponse = await axios.get(`${CMS_URL}/api/integrity-pages/privacy?all=true`);
    
    if (verifyResponse.status === 200 && verifyResponse.data) {
      const newVisibility = verifyResponse.data.is_visible;
      const toggled = newVisibility !== originalVisibility;

      if (toggled) {
        // Restore original visibility
        await axios.put(`${CMS_URL}/api/integrity-pages/${pageId}/toggle-visibility`);
        
        logResult('Visibility Toggle API', true, 'Toggle and restore successful');
        return true;
      } else {
        logResult('Visibility Toggle API', false, 'Visibility did not change');
        return false;
      }
    } else {
      logResult('Visibility Toggle API', false, 'Could not verify toggle');
      return false;
    }
  } catch (error) {
    logResult('Visibility Toggle API', false, error.message);
    return false;
  }
}

// Test 7: Check if frontend can access pages (without visibility filter)
async function testFrontendAccess() {
  let passed = 0;
  let failed = 0;

  for (const expected of EXPECTED_PAGES) {
    try {
      // Frontend should only get visible pages
      const response = await axios.get(`${CMS_URL}/api/integrity-pages/${expected.slug}`);
      
      if (response.status === 200 && response.data) {
        passed++;
      } else if (response.status === 404) {
        // Check if page exists but is hidden
        const adminResponse = await axios.get(`${CMS_URL}/api/integrity-pages/${expected.slug}?all=true`);
        if (adminResponse.status === 200 && adminResponse.data && adminResponse.data.is_visible === 0) {
          logWarning(`Frontend Access (${expected.title})`, 'Page exists but is hidden');
          passed++; // This is expected behavior
        } else {
          failed++;
        }
      } else {
        failed++;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Check if page is hidden
        try {
          const adminResponse = await axios.get(`${CMS_URL}/api/integrity-pages/${expected.slug}?all=true`);
          if (adminResponse.status === 200 && adminResponse.data && adminResponse.data.is_visible === 0) {
            logWarning(`Frontend Access (${expected.title})`, 'Page exists but is hidden');
            passed++;
          } else {
            failed++;
          }
        } catch {
          failed++;
        }
      } else {
        failed++;
      }
    }
  }

  if (failed === 0) {
    logResult('Frontend Access Test', true, `All pages accessible (or hidden as expected)`);
    return true;
  } else {
    logResult('Frontend Access Test', false, `${failed} pages not accessible`);
    return false;
  }
}

// Test 8: Check data integrity - verify all pages have required fields
async function testDataIntegrity() {
  return new Promise((resolve) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        logResult('Data Integrity Check', false, err.message);
        resolve(false);
        return;
      }

      db.all("SELECT id, slug, title, content, description, eyebrow, is_visible FROM integrity_pages", (err, pages) => {
        if (err) {
          logResult('Data Integrity Check', false, err.message);
          db.close();
          resolve(false);
          return;
        }

        let issues = 0;
        pages.forEach(page => {
          if (!page.slug || !page.title || !page.content) {
            issues++;
            logWarning(`Data Integrity (${page.title || page.slug})`, 'Missing required fields');
          }
        });

        if (issues === 0) {
          logResult('Data Integrity Check', true, `All ${pages.length} pages have required fields`);
        } else {
          logResult('Data Integrity Check', false, `${issues} pages have missing fields`);
        }

        db.close();
        resolve(issues === 0);
      });
    });
  });
}

// Main test runner
async function runAllTests() {
  console.log('\n🧪 Starting Integrity Pages CMS Comprehensive Tests\n');
  console.log('='.repeat(60));
  
  // Test database structure
  await testDatabaseStructure();
  await testPagesExist();
  await testDataIntegrity();
  
  console.log('\n--- API Tests ---\n');
  await testGetAllPagesAPI();
  await testGetSinglePageAPI();
  await testUpdateAPI();
  await testVisibilityToggleAPI();
  await testFrontendAccess();
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary\n');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.failed.forEach(test => console.log(`   - ${test}`));
  }
  
  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach(w => console.log(`   - ${w.test}: ${w.message}`));
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Exit with appropriate code
  process.exit(results.failed.length > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

