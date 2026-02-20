/**
 * Migration: Create API Configurations Table
 * Allows admins to configure Cloud4India API settings from the admin panel
 */

const up = `
-- Table: api_configurations (singleton pattern with id=1)
CREATE TABLE IF NOT EXISTS api_configurations (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL DEFAULT 'Cloud4India API',
  api_base_url TEXT NOT NULL DEFAULT 'https://portal.cloud4india.com/backend/api',
  api_key TEXT,
  default_rate_card TEXT DEFAULT 'default',
  sync_interval_minutes INTEGER DEFAULT 15,
  is_enabled INTEGER DEFAULT 1,
  last_tested_at DATETIME,
  test_status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default row if not exists
INSERT OR IGNORE INTO api_configurations (id, name, api_base_url, default_rate_card, sync_interval_minutes, is_enabled)
VALUES (1, 'Cloud4India API', 'https://portal.cloud4india.com/backend/api', 'default', 15, 1);
`;

const down = `
DROP TABLE IF EXISTS api_configurations;
`;

module.exports = { up, down };
