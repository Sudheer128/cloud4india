-- Create tables for main Products and Solutions pages CMS functionality

-- Main Products page hero content
CREATE TABLE IF NOT EXISTS main_products_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT 'Our Products',
    subtitle TEXT DEFAULT 'Cloud Services - Made in India',
    description TEXT DEFAULT 'Discover our comprehensive suite of cloud computing services designed to power your business transformation. From basic cloud servers to specialized computing solutions, we have everything you need to scale your operations.',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Main Solutions page hero content  
CREATE TABLE IF NOT EXISTS main_solutions_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT 'Our Solutions',
    subtitle TEXT DEFAULT 'Enterprise Solutions - Made in India',
    description TEXT DEFAULT 'Explore our enterprise-grade solutions designed to transform your business operations. From cloud migration to digital transformation, we provide comprehensive solutions tailored to your industry needs.',
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

-- Individual solution sections on main solutions page
CREATE TABLE IF NOT EXISTS main_solutions_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    solution_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_visible INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (solution_id) REFERENCES solutions (id) ON DELETE CASCADE
);

-- Insert default hero content for main products page
INSERT OR IGNORE INTO main_products_content (id, title, subtitle, description) VALUES (
    1,
    'Our Products',
    'Cloud Services - Made in India',
    'Discover our comprehensive suite of cloud computing services designed to power your business transformation. From basic cloud servers to specialized computing solutions, we have everything you need to scale your operations.'
);

-- Insert default hero content for main solutions page
INSERT OR IGNORE INTO main_solutions_content (id, title, subtitle, description) VALUES (
    1,
    'Our Solutions', 
    'Enterprise Solutions - Made in India',
    'Explore our enterprise-grade solutions designed to transform your business operations. From cloud migration to digital transformation, we provide comprehensive solutions tailored to your industry needs.'
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

-- Create sections for existing solutions (auto-populate)
INSERT OR IGNORE INTO main_solutions_sections (solution_id, title, description, order_index)
SELECT 
    id,
    name,
    description,
    id
FROM solutions 
WHERE id IS NOT NULL;
