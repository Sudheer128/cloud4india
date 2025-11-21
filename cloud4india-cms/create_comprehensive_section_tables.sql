-- Create tables for Comprehensive Section CMS functionality

-- Main comprehensive section header content
CREATE TABLE IF NOT EXISTS comprehensive_section_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT 'The most comprehensive cloud platform',
    description TEXT DEFAULT 'From infrastructure technologies like compute, storage, and databases to emerging technologies like machine learning, artificial intelligence, and data analytics.',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Feature cards for comprehensive section
CREATE TABLE IF NOT EXISTS comprehensive_section_features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    button_text TEXT,
    icon_type TEXT DEFAULT 'chart', -- chart, users, lightning, checkmark
    order_index INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Statistics for comprehensive section
CREATE TABLE IF NOT EXISTS comprehensive_section_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT NOT NULL, -- e.g., "200+", "120", "38", "500+"
    label TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default header content
INSERT OR IGNORE INTO comprehensive_section_content (id, title, description) VALUES (
    1,
    'The most comprehensive cloud platform',
    'From infrastructure technologies like compute, storage, and databases to emerging technologies like machine learning, artificial intelligence, and data analytics.'
);

-- Insert default feature cards
INSERT OR IGNORE INTO comprehensive_section_features (id, title, description, button_text, icon_type, order_index) VALUES
    (1, 'Scale with confidence', 'Cloud4India has the most operational experience, at greater scale, of any cloud provider', '10+ years of experience', 'chart', 1),
    (2, 'Trusted by millions', 'Join millions of customers who trust Cloud4India to power their businesses', '1M+ active customers', 'users', 2),
    (3, 'Fast and reliable', '99.99% availability SLA with global infrastructure and redundancy', '99.99% uptime', 'lightning', 3),
    (4, 'Industry recognition', 'Recognized as a leader in cloud infrastructure and innovation', 'Top rated provider', 'checkmark', 4);

-- Insert default statistics
INSERT OR IGNORE INTO comprehensive_section_stats (id, value, label, order_index) VALUES
    (1, '200+', 'Cloud Services', 1),
    (2, '120', 'Availability Zones', 2),
    (3, '38', 'Geographic Regions', 3),
    (4, '500+', 'Edge Locations', 4);


