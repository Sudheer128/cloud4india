/**
 * Extend Contact Us CMS with additional dynamic fields
 * Adds columns for section titles, map info, form messages
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'cms.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Extending contact_hero_section table with new fields...\n');

// New columns to add
const newColumns = [
    { name: 'contact_section_title', type: 'TEXT', default: 'Contact Information' },
    { name: 'contact_section_description', type: 'TEXT', default: 'Reach out to us through any of these channels. We are here to help you with your cloud infrastructure needs.' },
    { name: 'form_section_title', type: 'TEXT', default: 'Send us a Message' },
    { name: 'follow_us_title', type: 'TEXT', default: 'Follow Us' },
    { name: 'map_section_title', type: 'TEXT', default: 'Find Us' },
    { name: 'map_office_name', type: 'TEXT', default: 'Bengaluru Office' },
    { name: 'map_address_line1', type: 'TEXT', default: '3052 "Prestige Finsbury Park Hyde"' },
    { name: 'map_address_line2', type: 'TEXT', default: 'Aerospace Park, Bagalur KIADB' },
    { name: 'map_address_line3', type: 'TEXT', default: 'Bengaluru, 562149, India' },
    { name: 'map_url', type: 'TEXT', default: 'https://www.google.com/maps/search/?api=1&query=Bagalur+KIADB+Bengaluru' },
    { name: 'success_message', type: 'TEXT', default: 'Thank you for your message! We will get back to you soon.' },
    { name: 'phone_verification_text', type: 'TEXT', default: 'Please verify your phone number before submitting' }
];

db.serialize(() => {
    // Check and add each column
    newColumns.forEach(col => {
        db.run(`ALTER TABLE contact_hero_section ADD COLUMN ${col.name} ${col.type} DEFAULT '${col.default}'`, (err) => {
            if (err) {
                if (err.message.includes('duplicate column name')) {
                    console.log(`⏭️  Column ${col.name} already exists`);
                } else {
                    console.error(`❌ Error adding ${col.name}:`, err.message);
                }
            } else {
                console.log(`✅ Added column: ${col.name}`);
            }
        });
    });

    // Update existing row with default values for new columns
    setTimeout(() => {
        db.run(`UPDATE contact_hero_section SET 
            contact_section_title = COALESCE(contact_section_title, 'Contact Information'),
            contact_section_description = COALESCE(contact_section_description, 'Reach out to us through any of these channels. We are here to help you with your cloud infrastructure needs.'),
            form_section_title = COALESCE(form_section_title, 'Send us a Message'),
            follow_us_title = COALESCE(follow_us_title, 'Follow Us'),
            map_section_title = COALESCE(map_section_title, 'Find Us'),
            map_office_name = COALESCE(map_office_name, 'Bengaluru Office'),
            map_address_line1 = COALESCE(map_address_line1, '3052 "Prestige Finsbury Park Hyde"'),
            map_address_line2 = COALESCE(map_address_line2, 'Aerospace Park, Bagalur KIADB'),
            map_address_line3 = COALESCE(map_address_line3, 'Bengaluru, 562149, India'),
            map_url = COALESCE(map_url, 'https://www.google.com/maps/search/?api=1&query=Bagalur+KIADB+Bengaluru'),
            success_message = COALESCE(success_message, 'Thank you for your message! We will get back to you soon.'),
            phone_verification_text = COALESCE(phone_verification_text, 'Please verify your phone number before submitting')
            WHERE id = 1`, (err) => {
            if (err) {
                console.error('❌ Error updating defaults:', err.message);
            } else {
                console.log('\n✅ Updated existing row with default values');
            }

            console.log('\n✅ Contact Us CMS extension complete!');
            db.close();
        });
    }, 1000);
});
