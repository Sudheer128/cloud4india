/**
 * Migration: Create Global Features Visibility Table
 * Controls visibility of main features across the entire website
 * (Navbar, Homepage sections, Footer, etc.)
 */

const up = `
-- Table: global_features_visibility
CREATE TABLE IF NOT EXISTS global_features_visibility (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  feature_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  is_visible INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default features with current Header.jsx values
INSERT OR IGNORE INTO global_features_visibility (feature_name, display_name, description, is_visible, display_order)
VALUES 
  ('home', 'Home', 'Homepage link', 0, 1),
  ('about_us', 'About Us', 'About Us page', 0, 2),
  ('marketplace', 'Marketplace', 'Marketplace/Apps section', 1, 3),
  ('products', 'Products', 'Products section', 0, 4),
  ('solutions', 'Solutions', 'Solutions section', 1, 5),
  ('pricing', 'Pricing', 'Pricing page', 0, 6),
  ('price_estimator', 'Price Estimator', 'Cloud pricing calculator', 1, 7),
  ('contact_us', 'Contact Us', 'Contact page', 0, 8);
`;

const down = `
DROP TABLE IF EXISTS global_features_visibility;
`;

module.exports = { up, down };
