-- =========================================================
-- TECHNICAL SPECIFICATIONS - Remaining Products
-- =========================================================
-- This script populates Technical Specifications sections
-- for Acronis M365 Backup, Acronis Google Workspace Backup, and Anti-Virus
-- =========================================================

-- =========================================================
-- ACRONIS M365 BACKUP - Technical Specifications
-- =========================================================

-- Step 1: Create or get the specifications section
INSERT OR IGNORE INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Technical Specifications',
    'Comprehensive backup solution specifications for Microsoft 365',
    'specifications',
    3,
    1
FROM products 
WHERE route = 'acronis-m365-backup';

-- Update existing section if it exists
UPDATE product_sections 
SET 
    title = 'Technical Specifications',
    description = 'Comprehensive backup solution specifications for Microsoft 365',
    order_index = 3,
    is_visible = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'acronis-m365-backup' 
    AND ps.section_type = 'specifications'
);

-- Step 2: Delete existing specification items to avoid duplicates
DELETE FROM product_items 
WHERE section_id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'acronis-m365-backup' 
    AND ps.section_type = 'specifications'
)
AND item_type = 'specification';

-- Step 3: Insert 6 specification items
INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Microsoft 365 Coverage',
    'Complete backup coverage for all Microsoft 365 services',
    '{"features": ["Full backup of Exchange Online mailboxes and calendars", "OneDrive for Business files and folders backup", "SharePoint Online sites and document libraries backup"]}',
    'specification',
    'ServerIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-m365-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Data Protection & Security',
    'Enterprise-grade encryption and security for M365 backups',
    '{"features": ["256-bit AES encryption for all backup data", "End-to-end encryption during backup and restore operations", "Compliance with GDPR, HIPAA, and SOC 2 standards"]}',
    'specification',
    'ShieldCheckIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-m365-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Backup Frequency & Scheduling',
    'Flexible backup scheduling and automation options',
    '{"features": ["Automated daily backups with customizable schedules", "Real-time backup for critical mailboxes and files", "On-demand backup creation at any time"]}',
    'specification',
    'ClockIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-m365-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Recovery Options',
    'Granular and flexible recovery capabilities',
    '{"features": ["Point-in-time recovery for emails, files, and folders", "Granular item-level recovery without full restore", "Export to PST, MSG, or original format"]}',
    'specification',
    'ArrowPathIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-m365-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Storage & Retention',
    'Flexible storage and retention management',
    '{"features": ["Unlimited cloud storage for backup data", "Configurable retention policies for compliance", "Automatic cleanup of expired backups"]}',
    'specification',
    'CircleStackIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-m365-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Management & Monitoring',
    'Centralized management and monitoring tools',
    '{"features": ["Centralized web-based management console", "Real-time backup monitoring and status alerts", "Automated reporting and email notifications"]}',
    'specification',
    'UsersIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-m365-backup' AND ps.section_type = 'specifications';

-- =========================================================
-- ACRONIS GOOGLE WORKSPACE BACKUP - Technical Specifications
-- =========================================================

-- Step 1: Create or get the specifications section
INSERT OR IGNORE INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Technical Specifications',
    'Comprehensive backup solution specifications for Google Workspace',
    'specifications',
    3,
    1
FROM products 
WHERE route = 'acronis-google-workspace-backup';

-- Update existing section if it exists
UPDATE product_sections 
SET 
    title = 'Technical Specifications',
    description = 'Comprehensive backup solution specifications for Google Workspace',
    order_index = 3,
    is_visible = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'acronis-google-workspace-backup' 
    AND ps.section_type = 'specifications'
);

-- Step 2: Delete existing specification items to avoid duplicates
DELETE FROM product_items 
WHERE section_id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'acronis-google-workspace-backup' 
    AND ps.section_type = 'specifications'
)
AND item_type = 'specification';

-- Step 3: Insert 6 specification items
INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Google Workspace Coverage',
    'Complete backup coverage for all Google Workspace services',
    '{"features": ["Full backup of Gmail messages, labels, and attachments", "Google Drive files and folders backup", "Google Calendar events and contacts backup"]}',
    'specification',
    'ServerIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-google-workspace-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Data Protection & Security',
    'Enterprise-grade encryption and security for Google Workspace backups',
    '{"features": ["256-bit AES encryption for all backup data", "End-to-end encryption during backup and restore operations", "Compliance with GDPR, HIPAA, and SOC 2 standards"]}',
    'specification',
    'ShieldCheckIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-google-workspace-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Backup Frequency & Scheduling',
    'Flexible backup scheduling and automation options',
    '{"features": ["Automated daily backups with customizable schedules", "Real-time backup for critical mailboxes and files", "On-demand backup creation at any time"]}',
    'specification',
    'ClockIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-google-workspace-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Recovery Options',
    'Granular and flexible recovery capabilities',
    '{"features": ["Point-in-time recovery for emails, files, and folders", "Granular item-level recovery without full restore", "Export to MBOX, PST, or original format"]}',
    'specification',
    'ArrowPathIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-google-workspace-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Storage & Retention',
    'Flexible storage and retention management',
    '{"features": ["Unlimited cloud storage for backup data", "Configurable retention policies for compliance", "Automatic cleanup of expired backups"]}',
    'specification',
    'CircleStackIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-google-workspace-backup' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Management & Monitoring',
    'Centralized management and monitoring tools',
    '{"features": ["Centralized web-based management console", "Real-time backup monitoring and status alerts", "Automated reporting and email notifications"]}',
    'specification',
    'UsersIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-google-workspace-backup' AND ps.section_type = 'specifications';

-- =========================================================
-- ANTI-VIRUS - Technical Specifications
-- =========================================================

-- Step 1: Create or get the specifications section
INSERT OR IGNORE INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Technical Specifications',
    'Comprehensive antivirus and security solution specifications',
    'specifications',
    3,
    1
FROM products 
WHERE route = 'anti-virus';

-- Update existing section if it exists
UPDATE product_sections 
SET 
    title = 'Technical Specifications',
    description = 'Comprehensive antivirus and security solution specifications',
    order_index = 3,
    is_visible = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'anti-virus' 
    AND ps.section_type = 'specifications'
);

-- Step 2: Delete existing specification items to avoid duplicates
DELETE FROM product_items 
WHERE section_id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'anti-virus' 
    AND ps.section_type = 'specifications'
)
AND item_type = 'specification';

-- Step 3: Insert 6 specification items
INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Protection Features',
    'Comprehensive malware and threat protection',
    '{"features": ["Real-time scanning and protection against viruses, malware, and ransomware", "Advanced threat detection with AI and machine learning", "Behavioral analysis to detect zero-day threats"]}',
    'specification',
    'ShieldCheckIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'anti-virus' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Supported Platforms',
    'Multi-platform protection coverage',
    '{"features": ["Windows 10, 11, and Windows Server 2016-2022", "macOS 10.14 and later versions", "Linux distributions (Ubuntu, CentOS, RHEL, Debian)"]}',
    'specification',
    'ServerIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'anti-virus' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Firewall & Network Protection',
    'Advanced network security features',
    '{"features": ["Built-in firewall with intrusion detection and prevention", "Network traffic monitoring and blocking of suspicious activities", "VPN kill switch and secure connection protection"]}',
    'specification',
    'LockClosedIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'anti-virus' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Performance & Optimization',
    'Lightweight and efficient protection',
    '{"features": ["Minimal system resource usage with optimized scanning", "Background scanning without impacting system performance", "Automatic updates with minimal bandwidth usage"]}',
    'specification',
    'CpuChipIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'anti-virus' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Management & Updates',
    'Centralized management and automatic updates',
    '{"features": ["Centralized management console for all devices", "Automatic virus definition and engine updates", "Remote management and deployment capabilities"]}',
    'specification',
    'UsersIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'anti-virus' AND ps.section_type = 'specifications';

INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Support & Compliance',
    'Enterprise support and compliance features',
    '{"features": ["24/7 technical support and assistance", "Compliance with industry standards and regulations", "Detailed reporting and audit trail capabilities"]}',
    'specification',
    'ClockIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'anti-virus' AND ps.section_type = 'specifications';



