-- Create table for Feature Banners Carousel CMS functionality

-- Feature banners for carousel section
CREATE TABLE IF NOT EXISTS feature_banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    cta_text TEXT,
    cta_link TEXT DEFAULT '#',
    gradient_start TEXT,
    gradient_mid TEXT,
    gradient_end TEXT,
    accent_gradient_start TEXT,
    accent_gradient_end TEXT,
    order_index INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default feature banners
INSERT OR IGNORE INTO feature_banners (id, category, title, subtitle, cta_text, cta_link, gradient_start, gradient_mid, gradient_end, accent_gradient_start, accent_gradient_end, order_index) VALUES
    (1, 'Event', 'Join us at Cloud4India Summit 2025—India''s largest cloud infrastructure event', 'Connect with industry leaders and explore the future of cloud computing', 'Register Now', '#', 'phulkari-fuchsia', 'phulkari-red', 'phulkari-gold', 'phulkari-fuchsia', 'phulkari-red', 1),
    (2, 'Innovation', 'Accelerate your digital transformation with AI-powered cloud Apps', 'Discover how leading enterprises are scaling with Cloud4India''s intelligent infrastructure', 'Learn More', '#', 'saree-teal', 'phulkari-turquoise', 'saree-lime', 'saree-teal', 'phulkari-turquoise', 2),
    (3, 'Security', 'Enterprise-grade security meets unmatched performance', 'Protect your data with ISO-certified infrastructure and 99.99% uptime SLA', 'Explore Security', '#', 'saree-rose', 'saree-coral', 'phulkari-peach', 'saree-rose', 'saree-coral', 3),
    (4, 'Savings', 'Save up to 40% on cloud infrastructure with flexible pricing', 'Get enterprise features at startup-friendly prices with transparent billing', 'View Pricing', '/pricing', 'phulkari-turquoise', 'phulkari-blue-light', 'saree-teal', 'phulkari-turquoise', 'saree-teal', 4),
    (5, 'Performance', 'Lightning-fast NVMe storage and dedicated CPU resources', 'Experience 3x faster performance with our next-gen infrastructure', 'Get Started', '#', 'phulkari-gold', 'saree-amber', 'phulkari-peach', 'phulkari-gold', 'saree-amber', 5);


