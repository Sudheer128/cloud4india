-- =========================================================
-- TECHNICAL SPECIFICATIONS - Microsoft 365 & Acronis Backup
-- =========================================================
-- This script populates Technical Specifications sections
-- for Microsoft 365 Licenses and Acronis Server Backup
-- =========================================================

-- =========================================================
-- MICROSOFT 365 LICENSES - Technical Specifications
-- =========================================================

-- Step 1: Create or get the specifications section for Microsoft 365
INSERT OR IGNORE INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Technical Specifications',
    'Comprehensive technical specifications and system requirements for Microsoft 365 business solutions',
    'specifications',
    3,
    1
FROM products 
WHERE route = 'microsoft-365-licenses';

-- Update existing section if it exists
UPDATE product_sections 
SET 
    title = 'Technical Specifications',
    description = 'Comprehensive technical specifications and system requirements for Microsoft 365 business solutions',
    order_index = 3,
    is_visible = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'microsoft-365-licenses' 
    AND ps.section_type = 'specifications'
);

-- Step 2: Delete existing specification items to avoid duplicates
DELETE FROM product_items 
WHERE section_id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'microsoft-365-licenses' 
    AND ps.section_type = 'specifications'
)
AND item_type = 'specification';

-- Step 3: Insert 6 detailed specification items for Microsoft 365
INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Mailbox & Email Storage',
    'Enterprise-grade email storage and management capabilities',
    '{"features": ["50GB mailbox storage per user included with all plans", "Expandable to 100GB with In-Place Archiving feature", "Support for email attachments up to 150MB in size"]}',
    'specification',
    'ServerIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'OneDrive Cloud Storage',
    'Secure cloud storage for files, documents, and collaboration',
    '{"features": ["1TB OneDrive cloud storage per user included", "Real-time file synchronization across all devices", "Offline access to files when internet is unavailable"]}',
    'specification',
    'CircleStackIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'User Management & Licensing',
    'Flexible user management and scalable licensing options',
    '{"features": ["Support for up to 300 users per business subscription", "Flexible license assignment and reassignment options", "Easy user addition and removal through admin portal"]}',
    'specification',
    'UsersIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Microsoft Teams & Collaboration',
    'Integrated collaboration tools and video conferencing',
    '{"features": ["Unlimited video calls and meetings with up to 300 participants", "Screen sharing, file sharing, and live document collaboration", "Integration with Outlook calendar and email"]}',
    'specification',
    'GlobeAltIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'System Requirements & Compatibility',
    'Supported devices, operating systems, and browser compatibility',
    '{"features": ["Windows 10 or later, macOS 10.14 or later for desktop apps", "Mobile apps available for iOS 13+ and Android 8+", "Web browser access from any device with modern browser"]}',
    'specification',
    'CpuChipIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Service Level & Support',
    'Guaranteed uptime and comprehensive support options',
    '{"features": ["99.9% uptime SLA guarantee with financial credits for downtime", "24/7 service availability worldwide with global data centers", "Phone, chat, and web-based support channels included"]}',
    'specification',
    'ClockIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'specifications';

-- =========================================================
-- ACRONIS SERVER BACKUP - Technical Specifications
-- =========================================================

-- Step 1: Create or get the specifications section for Acronis
INSERT OR IGNORE INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Technical Specifications',
    'Comprehensive backup solution specifications and system requirements',
    'specifications',
    3,
    1
FROM products 
WHERE route = 'acronis-server-backup';

-- Update existing section if it exists
UPDATE product_sections 
SET 
    title = 'Technical Specifications',
    description = 'Comprehensive backup solution specifications and system requirements',
    order_index = 3,
    is_visible = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'acronis-server-backup' 
    AND ps.section_type = 'specifications'
);

-- Step 2: Delete existing specification items to avoid duplicates
DELETE FROM product_items 
WHERE section_id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'acronis-server-backup' 
    AND ps.section_type = 'specifications'
)
AND item_type = 'specification';

-- Step 3: Insert 6 detailed specification items for Acronis
INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Storage & Backup Capacity',
    'Flexible and scalable backup storage solutions',
    '{"features": ["Unlimited backup storage capacity with no size restrictions", "Advanced compression reduces storage usage by up to 50%", "Cloud storage, local storage, and hybrid backup options"]}',
    'specification',
    'CircleStackIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Data Protection & Security',
    'Enterprise-grade encryption and security features',
    '{"features": ["256-bit AES encryption for data at rest and in transit", "Advanced ransomware protection with AI-powered detection", "Compliance with GDPR, HIPAA, and SOC 2 standards"]}',
    'specification',
    'ShieldCheckIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Supported Operating Systems',
    'Comprehensive platform and system compatibility',
    '{"features": ["Windows Server 2008 R2 through Windows Server 2022", "All major Linux distributions (Ubuntu, CentOS, RHEL, Debian, SUSE)", "VMware ESXi and Microsoft Hyper-V virtual machines"]}',
    'specification',
    'ServerIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Backup Scheduling & Frequency',
    'Flexible backup scheduling and automation options',
    '{"features": ["Continuous Data Protection (CDP) for real-time backup", "Customizable scheduled backups with hourly, daily, weekly options", "On-demand manual backup creation at any time"]}',
    'specification',
    'ClockIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Performance & Optimization',
    'High-speed backup operations with minimal system impact',
    '{"features": ["Fast incremental backups saving time and bandwidth", "Parallel backup processing for multiple machines simultaneously", "Minimal CPU and memory usage during backup operations"]}',
    'specification',
    'CpuChipIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Management & Monitoring',
    'Centralized control and comprehensive monitoring tools',
    '{"features": ["Centralized web-based management console for all backups", "Automated reporting and email alerting system", "Real-time backup monitoring and status dashboard"]}',
    'specification',
    'UsersIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'specifications';

-- =========================================================
-- VERIFICATION QUERY
-- =========================================================
-- Run this to verify the data was inserted correctly:
-- SELECT 
--     p.name as product_name,
--     p.route as product_route,
--     ps.title as section_title,
--     COUNT(pi.id) as specification_count
-- FROM products p
-- LEFT JOIN product_sections ps ON p.id = ps.product_id AND ps.section_type = 'specifications'
-- LEFT JOIN product_items pi ON ps.id = pi.section_id AND pi.item_type = 'specification'
-- WHERE p.route IN ('microsoft-365-licenses', 'acronis-server-backup')
-- GROUP BY p.id, p.name, p.route, ps.title
-- ORDER BY p.name;

