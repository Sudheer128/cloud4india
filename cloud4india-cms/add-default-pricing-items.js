const sqlite3 = require('sqlite3').verbose();

const DB_PATH = process.env.DB_PATH || '/app/data/cms.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database');
});

// Add default pricing item to all pricing sections that don't have items
db.serialize(() => {
  // Get all pricing sections with their marketplace info
  db.all(
    `SELECT ms.id as section_id, ms.marketplace_id, m.name as marketplace_name
     FROM marketplace_sections ms
     JOIN marketplaces m ON ms.marketplace_id = m.id
     WHERE ms.section_type = 'pricing'`,
    [],
    (err, pricingSections) => {
      if (err) {
        console.error('Error fetching pricing sections:', err.message);
        db.close();
        return;
      }

      if (pricingSections.length === 0) {
        console.log('No pricing sections found.');
        db.close();
        return;
      }

      console.log(`Found ${pricingSections.length} pricing section(s). Checking for items...`);

      let processed = 0;
      let created = 0;
      let skipped = 0;

      pricingSections.forEach((section) => {
        // Check if pricing section already has items
        db.get(
          'SELECT COUNT(*) as count FROM section_items WHERE section_id = ?',
          [section.section_id],
          (err, result) => {
            if (err) {
              console.error(`Error checking items for section ${section.section_id}:`, err.message);
              processed++;
              if (processed === pricingSections.length) {
                console.log(`\n✅ Complete! Created ${created} default item(s), skipped ${skipped}.`);
                db.close();
              }
              return;
            }

            if (result.count > 0) {
              console.log(`⏭️  Section ${section.section_id} (${section.marketplace_name}) already has ${result.count} item(s). Skipping.`);
              skipped++;
              processed++;
              if (processed === pricingSections.length) {
                console.log(`\n✅ Complete! Created ${created} default item(s), skipped ${skipped}.`);
                db.close();
              }
            } else {
              // Create default pricing item
              const defaultContent = JSON.stringify({
                hourly_price: '',
                monthly_price: '',
                quarterly_price: '',
                yearly_price: '',
                specifications: [],
                features: [],
                buttonText: 'Order Now',
                buttonUrl: ''
              });

              db.run(
                `INSERT INTO section_items 
                (section_id, item_type, title, content, order_index, is_visible)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                  section.section_id,
                  'pricing_plan',
                  section.marketplace_name || 'App Name', // Use marketplace name as app name
                  defaultContent,
                  0,
                  1 // is_visible
                ],
                function(insertErr) {
                  if (insertErr) {
                    console.error(`❌ Error creating default item for section ${section.section_id}:`, insertErr.message);
                  } else {
                    console.log(`✅ Created default pricing item for "${section.marketplace_name}" (section ${section.section_id})`);
                    created++;
                  }

                  processed++;
                  if (processed === pricingSections.length) {
                    console.log(`\n✅ Complete! Created ${created} default item(s), skipped ${skipped}.`);
                    db.close();
                  }
                }
              );
            }
          }
        );
      });
    }
  );
});

