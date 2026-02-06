/**
 * Migration: Create API Cache Tables
 * Creates tables for caching Cloud4India API data locally
 */

const up = `
-- Table: api_cache_metadata (tracks sync status)
CREATE TABLE IF NOT EXISTS api_cache_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cache_key TEXT UNIQUE NOT NULL,
  last_synced_at DATETIME,
  sync_status TEXT DEFAULT 'pending',
  record_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: cached_services
CREATE TABLE IF NOT EXISTS cached_services (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  status INTEGER,
  category TEXT,
  category_name TEXT,
  billing_rule TEXT,
  config TEXT,
  plan_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: cached_plans
CREATE TABLE IF NOT EXISTS cached_plans (
  id INTEGER PRIMARY KEY,
  service_name TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT,
  status INTEGER,
  cpu INTEGER DEFAULT 0,
  memory INTEGER DEFAULT 0,
  storage INTEGER DEFAULT 0,
  size INTEGER DEFAULT 0,
  bandwidth INTEGER DEFAULT 0,
  bucket_limit INTEGER DEFAULT 0,
  network_rate INTEGER DEFAULT 0,
  data_transfer_out INTEGER DEFAULT 0,
  hourly_price REAL DEFAULT 0,
  monthly_price REAL DEFAULT 0,
  yearly_price REAL DEFAULT 0,
  plan_category_id INTEGER,
  plan_category_name TEXT,
  storage_category_id INTEGER,
  storage_category_name TEXT,
  attribute TEXT,
  prices TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster plan lookups by service
CREATE INDEX IF NOT EXISTS idx_cached_plans_service_name ON cached_plans(service_name);

-- Table: cached_templates (OS images, marketplace apps, ISOs)
CREATE TABLE IF NOT EXISTS cached_templates (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  os_type TEXT,
  image_type TEXT,
  file_type TEXT,
  operating_system_id INTEGER,
  operating_system TEXT,
  operating_system_version TEXT,
  icon_url TEXT,
  status INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: cached_products
CREATE TABLE IF NOT EXISTS cached_products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  status INTEGER,
  monthly_price REAL DEFAULT 0,
  prices TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: cached_licences
CREATE TABLE IF NOT EXISTS cached_licences (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  pricing_unit TEXT,
  status INTEGER,
  monthly_price REAL DEFAULT 0,
  prices TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: cached_rate_cards
CREATE TABLE IF NOT EXISTS cached_rate_cards (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  status INTEGER,
  is_default INTEGER DEFAULT 0,
  card_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: cached_billing_cycles
CREATE TABLE IF NOT EXISTS cached_billing_cycles (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  duration INTEGER,
  unit TEXT,
  is_enabled INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: cached_storage_categories
CREATE TABLE IF NOT EXISTS cached_storage_categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  status INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: cached_plan_categories
CREATE TABLE IF NOT EXISTS cached_plan_categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  short_name TEXT,
  status INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: cached_operating_systems
CREATE TABLE IF NOT EXISTS cached_operating_systems (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  status INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

const down = `
DROP TABLE IF EXISTS api_cache_metadata;
DROP TABLE IF EXISTS cached_services;
DROP TABLE IF EXISTS cached_plans;
DROP TABLE IF EXISTS cached_templates;
DROP TABLE IF EXISTS cached_products;
DROP TABLE IF EXISTS cached_licences;
DROP TABLE IF EXISTS cached_rate_cards;
DROP TABLE IF EXISTS cached_billing_cycles;
DROP TABLE IF EXISTS cached_storage_categories;
DROP TABLE IF EXISTS cached_plan_categories;
DROP TABLE IF EXISTS cached_operating_systems;
DROP INDEX IF EXISTS idx_cached_plans_service_name;
`;

module.exports = { up, down };
