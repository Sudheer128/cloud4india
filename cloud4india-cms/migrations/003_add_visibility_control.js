/**
 * Migration: Add Visibility Control to Homepage Sections
 * Adds is_visible column to homepage_sections_config table
 */

const up = `
-- Add is_visible column (default 1 = visible)
ALTER TABLE homepage_sections_config ADD COLUMN is_visible INTEGER DEFAULT 1;

-- Add display_order column for controlling section order
ALTER TABLE homepage_sections_config ADD COLUMN display_order INTEGER DEFAULT 0;

-- Update display_order for existing sections
UPDATE homepage_sections_config SET display_order = 1, is_visible = 1 WHERE section_name = 'why';
UPDATE homepage_sections_config SET display_order = 2, is_visible = 1 WHERE section_name = 'products';
UPDATE homepage_sections_config SET display_order = 3, is_visible = 1 WHERE section_name = 'marketplaces';
UPDATE homepage_sections_config SET display_order = 4, is_visible = 1 WHERE section_name = 'solutions';

-- Insert missing sections if they don't exist
INSERT OR IGNORE INTO homepage_sections_config (section_name, heading, description, is_visible, display_order)
VALUES 
  ('hero', 'Hero Section', 'Main banner section', 1, 0),
  ('client_logos', 'Our Clients', 'Trusted by leading companies', 1, 1),
  ('comprehensive', 'Comprehensive Cloud Solutions', 'Everything you need', 1, 2),
  ('feature_banners', 'Featured Services', 'Highlighted offerings', 1, 3);
`;

const down = `
-- SQLite doesn't support DROP COLUMN in older versions
-- This is a placeholder for down migration
SELECT 'Down migration requires manual intervention' as warning;
`;

module.exports = { up, down };
