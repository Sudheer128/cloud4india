/**
 * Migration: Add display_order to cached_services
 * Allows admin to control the display order of services on the Cloud Pricing page.
 * Default 0 means "no custom order" (falls back to alphabetical).
 */

const up = `
ALTER TABLE cached_services ADD COLUMN display_order INTEGER DEFAULT 0;
`;

const down = `
-- SQLite doesn't support DROP COLUMN directly in older versions.
-- This is a no-op; the column will be ignored if unused.
`;

module.exports = { up, down };
