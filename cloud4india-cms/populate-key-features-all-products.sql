-- =========================================================
-- KEY FEATURES - All Products
-- =========================================================
-- This script removes existing Key Features content and adds
-- proper product-specific content for all products
-- =========================================================

-- =========================================================
-- MICROSOFT 365 LICENSES - Key Features
-- =========================================================

-- Step 1: Create or get the features section
INSERT OR IGNORE INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Key Features',
    'Discover the powerful features of Microsoft 365',
    'features',
    2,
    1
FROM products 
WHERE route = 'microsoft-365-licenses';

-- Update existing section
UPDATE product_sections 
SET 
    title = 'Key Features',
    description = 'Discover the powerful features of Microsoft 365',
    order_index = 2,
    is_visible = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'microsoft-365-licenses' 
    AND ps.section_type = 'features'
);

-- Step 2: Delete existing feature items
DELETE FROM product_items 
WHERE section_id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'microsoft-365-licenses' 
    AND ps.section_type = 'features'
);

-- Step 3: Insert 6 feature items for Microsoft 365
INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Office 365 Apps',
    'Access to full suite of Microsoft Office applications including Word, Excel, PowerPoint, Outlook, and Teams on desktop, web, and mobile.',
    'feature_card',
    'DocumentTextIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Cloud Storage',
    '1TB OneDrive cloud storage per user for secure file storage, sharing, and collaboration with advanced versioning and recovery.',
    'feature_card',
    'CloudIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Email & Calendar',
    'Professional business email with 50GB mailbox, calendar scheduling, and seamless integration with Outlook and other email clients.',
    'feature_card',
    'EnvelopeIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Microsoft Teams',
    'Integrated collaboration platform with video conferencing, chat, file sharing, and team workspaces for seamless communication.',
    'feature_card',
    'UserGroupIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Security & Compliance',
    'Enterprise-grade security with advanced threat protection, data loss prevention, and compliance tools for GDPR and industry standards.',
    'feature_card',
    'ShieldCheckIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    '24/7 Support',
    'Round-the-clock Microsoft support with guaranteed 99.9% uptime SLA, phone support, and comprehensive knowledge base access.',
    'feature_card',
    'ClockIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'microsoft-365-licenses' AND ps.section_type = 'features';

-- =========================================================
-- ACRONIS SERVER BACKUP - Key Features
-- =========================================================

-- Step 1: Create or get the features section
INSERT OR IGNORE INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Key Features',
    'Comprehensive backup and disaster recovery Apps',
    'features',
    2,
    1
FROM products 
WHERE route = 'acronis-server-backup';

-- Update existing section
UPDATE product_sections 
SET 
    title = 'Key Features',
    description = 'Comprehensive backup and disaster recovery Apps',
    order_index = 2,
    is_visible = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'acronis-server-backup' 
    AND ps.section_type = 'features'
);

-- Step 2: Delete existing feature items
DELETE FROM product_items 
WHERE section_id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'acronis-server-backup' 
    AND ps.section_type = 'features'
);

-- Step 3: Insert 6 feature items for Acronis Server Backup
INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Universal Backup',
    'Complete backup App for Windows, Linux, VMware, and Hyper-V with support for physical and virtual machines.',
    'feature_card',
    'ServerIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Ransomware Protection',
    'Advanced AI-powered ransomware detection and prevention with blockchain-based data authentication and recovery.',
    'feature_card',
    'ShieldCheckIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Instant Recovery',
    'Fast recovery with instant VM recovery, granular file restore, and bare metal recovery capabilities.',
    'feature_card',
    'ArrowPathIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Unlimited Storage',
    'Unlimited cloud and local backup storage with advanced compression and deduplication for optimal efficiency.',
    'feature_card',
    'CircleStackIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Centralized Management',
    'Web-based management console for multi-tenant environments with automated reporting and monitoring.',
    'feature_card',
    'UsersIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Enterprise Security',
    '256-bit AES encryption, secure key management, and compliance with GDPR, HIPAA, and SOC 2 standards.',
    'feature_card',
    'LockClosedIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-server-backup' AND ps.section_type = 'features';

-- =========================================================
-- ACRONIS M365 BACKUP - Key Features
-- =========================================================

-- Step 1: Create or get the features section
INSERT OR IGNORE INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Key Features',
    'Complete backup App for Microsoft 365',
    'features',
    2,
    1
FROM products 
WHERE route = 'acronis-m365-backup';

-- Update existing section
UPDATE product_sections 
SET 
    title = 'Key Features',
    description = 'Complete backup App for Microsoft 365',
    order_index = 2,
    is_visible = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'acronis-m365-backup' 
    AND ps.section_type = 'features'
);

-- Step 2: Delete existing feature items
DELETE FROM product_items 
WHERE section_id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'acronis-m365-backup' 
    AND ps.section_type = 'features'
);

-- Step 3: Insert 6 feature items for Acronis M365 Backup
INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Complete M365 Backup',
    'Full backup coverage for Exchange Online, OneDrive, SharePoint, and Teams with automated daily backups.',
    'feature_card',
    'ServerIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-m365-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Granular Recovery',
    'Point-in-time recovery for emails, files, and folders with granular item-level restore without full recovery.',
    'feature_card',
    'ArrowPathIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-m365-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Data Protection',
    'End-to-end encryption with 256-bit AES, secure cloud storage, and compliance with GDPR and HIPAA standards.',
    'feature_card',
    'ShieldCheckIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-m365-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Flexible Export',
    'Export backed-up data to PST, MSG, or original format for easy migration and compliance requirements.',
    'feature_card',
    'ArrowDownTrayIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-m365-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Unlimited Storage',
    'Unlimited cloud storage for backup data with configurable retention policies and automatic cleanup.',
    'feature_card',
    'CircleStackIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-m365-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Easy Management',
    'Centralized web console for managing all backups with real-time monitoring and automated reporting.',
    'feature_card',
    'UsersIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-m365-backup' AND ps.section_type = 'features';

-- =========================================================
-- ACRONIS GOOGLE WORKSPACE BACKUP - Key Features
-- =========================================================

-- Step 1: Create or get the features section
INSERT OR IGNORE INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Key Features',
    'Complete backup App for Google Workspace',
    'features',
    2,
    1
FROM products 
WHERE route = 'acronis-google-workspace-backup';

-- Update existing section
UPDATE product_sections 
SET 
    title = 'Key Features',
    description = 'Complete backup App for Google Workspace',
    order_index = 2,
    is_visible = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'acronis-google-workspace-backup' 
    AND ps.section_type = 'features'
);

-- Step 2: Delete existing feature items
DELETE FROM product_items 
WHERE section_id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'acronis-google-workspace-backup' 
    AND ps.section_type = 'features'
);

-- Step 3: Insert 6 feature items for Acronis Google Workspace Backup
INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Complete Workspace Backup',
    'Full backup coverage for Gmail, Google Drive, Google Calendar, and Contacts with automated daily backups.',
    'feature_card',
    'ServerIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-google-workspace-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Granular Recovery',
    'Point-in-time recovery for emails, files, and calendar events with granular item-level restore capabilities.',
    'feature_card',
    'ArrowPathIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-google-workspace-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Data Protection',
    'End-to-end encryption with 256-bit AES, secure cloud storage, and compliance with GDPR and HIPAA standards.',
    'feature_card',
    'ShieldCheckIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-google-workspace-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Flexible Export',
    'Export backed-up data to MBOX, PST, or original format for easy migration and compliance requirements.',
    'feature_card',
    'ArrowDownTrayIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-google-workspace-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Unlimited Storage',
    'Unlimited cloud storage for backup data with configurable retention policies and automatic cleanup.',
    'feature_card',
    'CircleStackIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-google-workspace-backup' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Easy Management',
    'Centralized web console for managing all backups with real-time monitoring and automated reporting.',
    'feature_card',
    'UsersIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'acronis-google-workspace-backup' AND ps.section_type = 'features';

-- =========================================================
-- ANTI-VIRUS - Key Features
-- =========================================================

-- Step 1: Create or get the features section
INSERT OR IGNORE INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
SELECT 
    id,
    'Key Features',
    'Comprehensive antivirus and security protection',
    'features',
    2,
    1
FROM products 
WHERE route = 'anti-virus';

-- Update existing section
UPDATE product_sections 
SET 
    title = 'Key Features',
    description = 'Comprehensive antivirus and security protection',
    order_index = 2,
    is_visible = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'anti-virus' 
    AND ps.section_type = 'features'
);

-- Step 2: Delete existing feature items
DELETE FROM product_items 
WHERE section_id IN (
    SELECT ps.id 
    FROM product_sections ps
    JOIN products p ON ps.product_id = p.id
    WHERE p.route = 'anti-virus' 
    AND ps.section_type = 'features'
);

-- Step 3: Insert 6 feature items for Anti-Virus
INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Real-Time Protection',
    'Continuous scanning and protection against viruses, malware, ransomware, and zero-day threats with AI-powered detection.',
    'feature_card',
    'ShieldCheckIcon',
    1,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'anti-virus' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Multi-Platform Support',
    'Protection for Windows, macOS, and Linux with consistent security across all platforms and devices.',
    'feature_card',
    'ServerIcon',
    2,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'anti-virus' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Firewall & Network Security',
    'Built-in firewall with intrusion detection, network monitoring, and VPN kill switch for comprehensive network protection.',
    'feature_card',
    'LockClosedIcon',
    3,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'anti-virus' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Lightweight Performance',
    'Minimal system resource usage with optimized scanning that runs in background without impacting system performance.',
    'feature_card',
    'CpuChipIcon',
    4,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'anti-virus' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Centralized Management',
    'Unified management console for all devices with remote deployment, automatic updates, and comprehensive reporting.',
    'feature_card',
    'UsersIcon',
    5,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'anti-virus' AND ps.section_type = 'features';

INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
SELECT 
    ps.id,
    'Enterprise Support',
    '24/7 technical support, compliance with industry standards, and detailed audit trails for enterprise requirements.',
    'feature_card',
    'ClockIcon',
    6,
    1
FROM product_sections ps
JOIN products p ON ps.product_id = p.id
WHERE p.route = 'anti-virus' AND ps.section_type = 'features';



