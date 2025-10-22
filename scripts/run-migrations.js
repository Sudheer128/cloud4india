#!/usr/bin/env node

/**
 * Cloud4India Migration Runner
 * This script runs all database migrations for the Cloud4India CMS
 */

const path = require('path');
const { spawn } = require('child_process');

// Configuration
const CMS_DIR = path.join(__dirname, '..', 'cloud4india-cms');
const MIGRATION_SCRIPT = path.join(CMS_DIR, 'migration-runner.js');

console.log('🚀 Cloud4India Migration Runner');
console.log('=' .repeat(50));
console.log(`📁 CMS Directory: ${CMS_DIR}`);
console.log(`📄 Migration Script: ${MIGRATION_SCRIPT}`);
console.log('');

// Change to CMS directory and run migrations
process.chdir(CMS_DIR);

const migrationProcess = spawn('node', ['migration-runner.js'], {
  stdio: 'inherit',
  cwd: CMS_DIR,
  env: {
    ...process.env,
    DB_PATH: process.env.DB_PATH || './cms.db'
  }
});

migrationProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ All migrations completed successfully!');
    console.log('🌐 You can now start your application:');
    console.log('   cd cloud4india-cms && npm start');
    console.log('   OR');
    console.log('   docker-compose up --build -d');
  } else {
    console.error(`\n❌ Migration process exited with code ${code}`);
    console.log('🔍 Please check the error messages above and fix any issues.');
  }
  process.exit(code);
});

migrationProcess.on('error', (error) => {
  console.error('❌ Failed to start migration process:', error.message);
  process.exit(1);
});
