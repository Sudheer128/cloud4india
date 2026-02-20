/**
 * Migration: Create Unit Pricings Cache Table
 * Stores per-unit pricing from Cloud4India API (CPU, memory, storage, IP, Veeam components)
 */

const up = `
CREATE TABLE IF NOT EXISTS cached_unit_pricings (
  id TEXT PRIMARY KEY,
  cloud_provider_id TEXT,
  cloud_provider_name TEXT,
  cloud_provider_setup_id TEXT,
  cloud_provider_setup_name TEXT,
  region_id TEXT,
  region_name TEXT,
  storage_category_id INTEGER,
  storage_category_name TEXT,
  cpu_price REAL DEFAULT 0,
  memory_price REAL DEFAULT 0,
  storage_price REAL DEFAULT 0,
  ip_address_price REAL DEFAULT 0,
  bandwidth_price REAL DEFAULT 0,
  data_transfer_price REAL DEFAULT 0,
  per_vm_price REAL DEFAULT 0,
  per_workstation_price REAL DEFAULT 0,
  per_server_price REAL DEFAULT 0,
  per_concurrent_task_price REAL DEFAULT 0,
  replication_price REAL DEFAULT 0,
  vb365_price REAL DEFAULT 0,
  workstation_agents_price REAL DEFAULT 0,
  server_agents_price REAL DEFAULT 0,
  subscription_user_price REAL DEFAULT 0,
  standard_storage_used_gb_price REAL DEFAULT 0,
  source_hosted_amount_of_data_gb_price REAL DEFAULT 0,
  source_remote_amount_of_data_gb_price REAL DEFAULT 0,
  replicated_vm_price REAL DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  raw_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_unit_pricings_provider ON cached_unit_pricings(cloud_provider_name);
`;

const down = `
DROP TABLE IF EXISTS cached_unit_pricings;
DROP INDEX IF EXISTS idx_unit_pricings_provider;
`;

module.exports = { up, down };
