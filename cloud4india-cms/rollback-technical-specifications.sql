-- =========================================================
-- ROLLBACK TECHNICAL SPECIFICATIONS
-- =========================================================
-- This script removes all specifications added by the populate script
-- =========================================================

-- Delete all specification items with the specific titles we added
DELETE FROM product_items 
WHERE section_id IN (
    SELECT ps.id 
    FROM product_sections ps 
    WHERE ps.section_type = 'specifications'
)
AND title IN (
    -- Microsoft 365 specs
    'Mailbox Size',
    'OneDrive Storage',
    'User Limit',
    'Support',
    'System Requirements',
    'Service Uptime',
    
    -- Acronis Backup specs
    'Storage Capacity',
    'Data Protection',
    'Supported Systems',
    'Backup Frequency',
    'Performance',
    'Management',
    
    -- VPS/Cloud Server specs
    'CPU Resources',
    'RAM & Storage',
    'Network',
    'Operating System',
    'Security',
    'Uptime & Support',
    
    -- Generic specs
    'Availability',
    'Deployment'
);

-- Optional: If you want to remove the entire specifications sections
-- Uncomment the lines below to also delete the sections

-- DELETE FROM product_sections 
-- WHERE section_type = 'specifications';

-- Verify what's left
SELECT 
    p.name as product_name,
    p.route as product_route,
    COUNT(pi.id) as remaining_specs
FROM products p
LEFT JOIN product_sections ps ON p.id = ps.product_id AND ps.section_type = 'specifications'
LEFT JOIN product_items pi ON ps.id = pi.section_id
GROUP BY p.id, p.name, p.route
ORDER BY p.name;

