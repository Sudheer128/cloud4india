/**
 * Migration: Create Pricing Settings Table
 * Stores configurable pricing parameters (GST rate, currency rates, billing discounts, default unit rates)
 */

const up = `
CREATE TABLE IF NOT EXISTS pricing_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  gst_rate REAL NOT NULL DEFAULT 18,
  currency_rates TEXT NOT NULL DEFAULT '{"INR":1,"USD":0.012,"EUR":0.011,"GBP":0.0095}',
  billing_discounts TEXT NOT NULL DEFAULT '{"yearly":0.9,"bi-annually":0.85,"tri-annually":0.8}',
  default_unit_rates TEXT NOT NULL DEFAULT '{"cpu":200,"memory":100,"storage":8,"ip":150}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO pricing_settings (id) VALUES (1);
`;

const down = `
DROP TABLE IF EXISTS pricing_settings;
`;

module.exports = { up, down };
