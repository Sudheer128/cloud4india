-- =========================================================
-- TECHNICAL SPECIFICATIONS - SAMPLE DATA FOR ALL PRODUCTS
-- =========================================================
-- This script adds 6 detailed specification cards for each product
-- Run this after products are created in the database
-- =========================================================

-- =========================================================
-- MICROSOFT 365 LICENSES - Technical Specifications
-- =========================================================

-- First, create the specifications section for Microsoft 365
INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Technical Specifications',
    'Detailed technical specifications and requirements',
    'specifications',
    3,
    1
FROM products 
WHERE route = 'microsoft-365-licenses'
AND NOT EXISTS (
    SELECT 1 FROM product_sections 
    WHERE product_id = products.id 
    AND section_type = 'specifications'
);

-- Add 6 specification items for Microsoft 365
INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Mailbox Size',
    'Professional business email storage',
    '{"features": ["50GB per user mailbox for email storage", "Expandable to 100GB with In-Place Archiving", "Unlimited archive storage for compliance", "Support for large attachments up to 150MB"]}',
    'specification',
    'ServerIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Mailbox Size'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'OneDrive Storage',
    'Cloud storage for file sync and sharing',
    '{"features": ["1TB cloud storage per user included", "File versioning and recovery options", "Advanced sharing and collaboration controls", "Automatic photo and video backup from mobile devices"]}',
    'specification',
    'CircleStackIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'OneDrive Storage'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'User Limit',
    'Flexible user management and scalability',
    '{"features": ["Up to 300 users per subscription plan", "Scalable to unlimited users with enterprise plans", "Flexible license management and assignment", "Easy addition or removal of users as needed"]}',
    'specification',
    'UsersIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'User Limit'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Support',
    '24/7 Microsoft support and assistance',
    '{"features": ["24/7 Microsoft support included with all plans", "Phone and web-based support channels", "Community forums and knowledge base access", "Priority support for enterprise customers"]}',
    'specification',
    'ShieldCheckIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Support'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'System Requirements',
    'Compatible devices and platforms',
    '{"features": ["Windows 10 or later, macOS 10.14 or later", "Mobile apps available for iOS and Android", "Web browser access from any device", "Offline mode available for desktop applications"]}',
    'specification',
    'CpuChipIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'System Requirements'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Service Uptime',
    'Reliability and availability guarantee',
    '{"features": ["99.9% uptime SLA guarantee", "24/7 service availability worldwide", "Automatic updates and security patches", "Redundant data centers for business continuity"]}',
    'specification',
    'ClockIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Service Uptime'
);

-- =========================================================
-- ACRONIS SERVER BACKUP - Technical Specifications
-- =========================================================

INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Technical Specifications',
    'Comprehensive backup solution specifications',
    'specifications',
    3,
    1
FROM products 
WHERE route = 'acronis-server-backup'
AND NOT EXISTS (
    SELECT 1 FROM product_sections 
    WHERE product_id = products.id 
    AND section_type = 'specifications'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Storage Capacity',
    'Flexible backup storage options',
    '{"features": ["Unlimited backup storage capacity", "Incremental and differential backup support", "Cloud and local backup storage options", "Compression reduces storage by up to 50%"]}',
    'specification',
    'CircleStackIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Storage Capacity'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Data Protection',
    'Military-grade security features',
    '{"features": ["256-bit AES encryption for data at rest and in transit", "Advanced ransomware protection with AI detection", "Blockchain-based data authentication", "Secure key management and access controls"]}',
    'specification',
    'ShieldCheckIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Data Protection'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Supported Systems',
    'Wide platform compatibility',
    '{"features": ["Windows Server 2008 R2 through 2022", "All major Linux distributions (Ubuntu, CentOS, RHEL, Debian)", "VMware ESXi and vSphere environments", "Microsoft Hyper-V virtual machines"]}',
    'specification',
    'ServerIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Supported Systems'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Backup Frequency',
    'Flexible scheduling options',
    '{"features": ["Continuous Data Protection (CDP) for real-time backup", "Scheduled backups with custom frequency settings", "On-demand manual backup creation", "Event-triggered backup automation"]}',
    'specification',
    'ClockIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Backup Frequency'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Performance',
    'High-speed backup operations',
    '{"features": ["Fast incremental backups saving time and bandwidth", "Minimal system resource impact during operation", "Parallel backup processing for multiple machines", "Optimized deduplication and compression algorithms"]}',
    'specification',
    'CpuChipIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Performance'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Management',
    'Centralized control and monitoring',
    '{"features": ["Centralized web-based management console", "Multi-tenant support for MSPs and enterprises", "Automated reporting and alerting system", "Role-based access control for security"]}',
    'specification',
    'UsersIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Management'
);

-- =========================================================
-- VPS / CLOUD SERVERS - Technical Specifications
-- =========================================================
-- Note: This will work for any product with 'vps', 'server', or 'cloud' in route
-- You may need to adjust the WHERE clause for your specific product routes

INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Technical Specifications',
    'Detailed server specifications and features',
    'specifications',
    3,
    1
FROM products 
WHERE (route LIKE '%vps%' OR route LIKE '%server%' OR route LIKE '%cloud%')
AND NOT EXISTS (
    SELECT 1 FROM product_sections 
    WHERE product_id = products.id 
    AND section_type = 'specifications'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'CPU Resources',
    'Powerful processing capabilities',
    '{"features": ["Up to 32 vCPU cores per server", "Latest generation Intel Xeon processors", "Dedicated CPU allocation for consistent performance", "CPU credits for burstable performance tiers"]}',
    'specification',
    'CpuChipIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE (p.route LIKE '%vps%' OR p.route LIKE '%server%' OR p.route LIKE '%cloud%')
AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'CPU Resources'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'RAM & Storage',
    'High-performance memory and storage',
    '{"features": ["RAM options from 2GB up to 128GB", "SSD storage ranging from 50GB to 2TB", "NVMe storage options for maximum IOPS", "Scalable storage with automated backups"]}',
    'specification',
    'CircleStackIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE (p.route LIKE '%vps%' OR p.route LIKE '%server%' OR p.route LIKE '%cloud%')
AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'RAM & Storage'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Network',
    'High-speed connectivity',
    '{"features": ["1Gbps network port speed standard", "Unlimited bandwidth on all plans", "DDoS protection included at no extra cost", "IPv4 and IPv6 addresses available"]}',
    'specification',
    'GlobeAltIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE (p.route LIKE '%vps%' OR p.route LIKE '%server%' OR p.route LIKE '%cloud%')
AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Network'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Operating System',
    'Multiple OS options available',
    '{"features": ["Windows Server 2019 and 2022 editions", "Linux distributions: Ubuntu, CentOS, Debian, Rocky Linux", "Custom ISO installation support", "Pre-configured OS templates for quick deployment"]}',
    'specification',
    'ServerIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE (p.route LIKE '%vps%' OR p.route LIKE '%server%' OR p.route LIKE '%cloud%')
AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Operating System'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Security',
    'Enterprise-grade protection',
    '{"features": ["Configurable firewall with custom rules", "Free SSL certificates with auto-renewal", "Regular security updates and patching", "Advanced intrusion detection and prevention"]}',
    'specification',
    'ShieldCheckIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE (p.route LIKE '%vps%' OR p.route LIKE '%server%' OR p.route LIKE '%cloud%')
AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Security'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Uptime & Support',
    'Reliability and expert assistance',
    '{"features": ["99.95% uptime SLA guarantee", "24/7/365 technical support via phone, email, and chat", "Managed services available for hands-off operation", "Proactive monitoring and automatic failover"]}',
    'specification',
    'ClockIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE (p.route LIKE '%vps%' OR p.route LIKE '%server%' OR p.route LIKE '%cloud%')
AND ps.section_type = 'specifications'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Uptime & Support'
);

-- =========================================================
-- GENERIC SPECIFICATIONS FOR OTHER PRODUCTS
-- =========================================================
-- This will add specifications to products that don't have them yet

INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Technical Specifications',
    'Detailed product specifications and requirements',
    'specifications',
    3,
    1
FROM products 
WHERE route NOT IN ('microsoft-365-licenses', 'acronis-server-backup')
AND route NOT LIKE '%vps%' 
AND route NOT LIKE '%server%' 
AND route NOT LIKE '%cloud%'
AND NOT EXISTS (
    SELECT 1 FROM product_sections 
    WHERE product_id = products.id 
    AND section_type = 'specifications'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Performance',
    'High-performance infrastructure',
    '{"features": ["Enterprise-grade infrastructure for optimal performance", "Optimized for speed and reliability", "Low latency operations worldwide", "Auto-scaling capabilities for traffic spikes"]}',
    'specification',
    'CpuChipIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE ps.section_type = 'specifications'
AND p.route NOT IN ('microsoft-365-licenses', 'acronis-server-backup')
AND p.route NOT LIKE '%vps%' 
AND p.route NOT LIKE '%server%' 
AND p.route NOT LIKE '%cloud%'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Performance'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Security',
    'Enterprise-grade security',
    '{"features": ["End-to-end data encryption", "Regular security audits and compliance checks", "Multi-factor authentication support", "Advanced threat detection and prevention"]}',
    'specification',
    'ShieldCheckIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE ps.section_type = 'specifications'
AND p.route NOT IN ('microsoft-365-licenses', 'acronis-server-backup')
AND p.route NOT LIKE '%vps%' 
AND p.route NOT LIKE '%server%' 
AND p.route NOT LIKE '%cloud%'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Security'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Storage',
    'Scalable storage solutions',
    '{"features": ["Scalable storage options to meet growing needs", "Automatic daily backups included", "Data redundancy across multiple locations", "Fast storage with SSD technology"]}',
    'specification',
    'CircleStackIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE ps.section_type = 'specifications'
AND p.route NOT IN ('microsoft-365-licenses', 'acronis-server-backup')
AND p.route NOT LIKE '%vps%' 
AND p.route NOT LIKE '%server%' 
AND p.route NOT LIKE '%cloud%'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Storage'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Availability',
    'High availability guarantee',
    '{"features": ["99.9% uptime guarantee with SLA", "Global CDN for faster content delivery", "Automatic load balancing across servers", "Redundant infrastructure for business continuity"]}',
    'specification',
    'GlobeAltIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE ps.section_type = 'specifications'
AND p.route NOT IN ('microsoft-365-licenses', 'acronis-server-backup')
AND p.route NOT LIKE '%vps%' 
AND p.route NOT LIKE '%server%' 
AND p.route NOT LIKE '%cloud%'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Availability'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Support',
    '24/7 expert support',
    '{"features": ["24/7 customer support via multiple channels", "Dedicated account manager for enterprise plans", "Comprehensive knowledge base and documentation", "Training resources and webinars available"]}',
    'specification',
    'UsersIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE ps.section_type = 'specifications'
AND p.route NOT IN ('microsoft-365-licenses', 'acronis-server-backup')
AND p.route NOT LIKE '%vps%' 
AND p.route NOT LIKE '%server%' 
AND p.route NOT LIKE '%cloud%'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Support'
);

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Deployment',
    'Quick and easy setup',
    '{"features": ["Quick setup process with guided wizard", "One-click deployment for instant provisioning", "Easy migration tools from existing systems", "Pre-configured templates for common scenarios"]}',
    'specification',
    'ClockIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE ps.section_type = 'specifications'
AND p.route NOT IN ('microsoft-365-licenses', 'acronis-server-backup')
AND p.route NOT LIKE '%vps%' 
AND p.route NOT LIKE '%server%' 
AND p.route NOT LIKE '%cloud%'
AND NOT EXISTS (
    SELECT 1 FROM product_items 
    WHERE section_id = ps.id AND title = 'Deployment'
);

-- =========================================================
-- VERIFICATION QUERY
-- =========================================================
-- Run this to check how many specifications were added

SELECT 
    p.name as product_name,
    p.route as product_route,
    COUNT(pi.id) as specification_count
FROM products p
LEFT JOIN product_sections ps ON p.id = ps.product_id AND ps.section_type = 'specifications'
LEFT JOIN product_items pi ON ps.id = pi.section_id
GROUP BY p.id, p.name, p.route
ORDER BY p.name;

