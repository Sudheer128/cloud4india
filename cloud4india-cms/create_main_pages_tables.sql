-- Create tables for main Products and Marketplaces pages CMS functionality

-- Main Products page hero content
CREATE TABLE IF NOT EXISTS main_products_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT 'Our Products',
    subtitle TEXT DEFAULT 'Cloud Services - Made in India',
    description TEXT DEFAULT 'Discover our comprehensive suite of cloud computing services designed to power your business transformation. From basic cloud servers to specialized computing Apps, we have everything you need to scale your operations.',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Main Marketplaces page hero content  
CREATE TABLE IF NOT EXISTS main_marketplaces_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT 'Our Marketplaces',
    subtitle TEXT DEFAULT 'Enterprise Marketplaces - Made in India',
    description TEXT DEFAULT 'Explore our enterprise-grade Apps designed to transform your business operations. From cloud migration to digital transformation, we provide comprehensive Apps tailored to your industry needs.',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Individual product sections on main products page
CREATE TABLE IF NOT EXISTS main_products_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_visible INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

-- Individual marketplace sections on main marketplaces page
CREATE TABLE IF NOT EXISTS main_marketplaces_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    marketplace_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_visible INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (marketplace_id) REFERENCES marketplaces (id) ON DELETE CASCADE
);

-- Insert default hero content for main products page
INSERT OR IGNORE INTO main_products_content (id, title, subtitle, description) VALUES (
    1,
    'Our Products',
    'Cloud Services - Made in India',
    'Discover our comprehensive suite of cloud computing services designed to power your business transformation. From basic cloud servers to specialized computing Apps, we have everything you need to scale your operations.'
);

-- Insert default hero content for main marketplaces page
INSERT OR IGNORE INTO main_marketplaces_content (id, title, subtitle, description) VALUES (
    1,
    'Our Marketplaces', 
    'Enterprise Marketplaces - Made in India',
    'Explore our enterprise-grade Apps designed to transform your business operations. From cloud migration to digital transformation, we provide comprehensive Apps tailored to your industry needs.'
);

-- Create sections for existing products (auto-populate)
INSERT OR IGNORE INTO main_products_sections (product_id, title, description, order_index)
SELECT 
    id,
    name,
    description,
    id
FROM products 
WHERE id IS NOT NULL;

-- Create sections for existing marketplaces (auto-populate)
INSERT OR IGNORE INTO main_marketplaces_sections (marketplace_id, title, description, order_index)
SELECT 
    id,
    name,
    description,
    id
FROM marketplaces 
WHERE id IS NOT NULL;
