const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || '/app/data/cms.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database');
});

// Add pricing section to all marketplaces that don't have one
db.serialize(() => {
  // Get all marketplaces with their names
  db.all('SELECT id, name FROM marketplaces', [], (err, marketplaces) => {
    if (err) {
      console.error('Error fetching marketplaces:', err.message);
      db.close();
      return;
    }

    if (marketplaces.length === 0) {
      console.log('No marketplaces found.');
      db.close();
      return;
    }

    console.log(`Found ${marketplaces.length} marketplace(s). Checking for pricing sections...`);

    let processed = 0;
    let created = 0;
    let skipped = 0;

    marketplaces.forEach((marketplace) => {
      // Check if pricing section already exists
      db.get(
        'SELECT id FROM marketplace_sections WHERE marketplace_id = ? AND section_type = ?',
        [marketplace.id, 'pricing'],
        (err, existing) => {
          if (err) {
            console.error(`Error checking marketplace ${marketplace.id}:`, err.message);
            processed++;
            if (processed === marketplaces.length) {
              db.close();
            }
            return;
          }

          if (existing) {
            console.log(`⏭️  Marketplace ${marketplace.id} already has a pricing section. Skipping.`);
            skipped++;
          } else {
            // Get max order_index for this marketplace
            db.get(
              'SELECT MAX(order_index) as max_order FROM marketplace_sections WHERE marketplace_id = ?',
              [marketplace.id],
              (err, result) => {
                if (err) {
                  console.error(`Error getting max order for marketplace ${marketplace.id}:`, err.message);
                  processed++;
                  if (processed === marketplaces.length) {
                    console.log(`\n✅ Complete! Created ${created} pricing section(s), skipped ${skipped}.`);
                    db.close();
                  }
                  return;
                }

                const nextOrder = (result.max_order !== null ? result.max_order : -1) + 1;

                // Insert pricing section
                db.run(
                  `INSERT INTO marketplace_sections 
                  (marketplace_id, section_type, title, content, order_index, is_visible,
                   pricing_table_header_app_name, pricing_table_header_specs, pricing_table_header_features,
                   pricing_table_header_hourly, pricing_table_header_monthly, pricing_table_header_quarterly,
                   pricing_table_header_yearly, pricing_table_header_action,
                   show_hourly_column, show_monthly_column, show_quarterly_column, show_yearly_column)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    marketplace.id,
                    'pricing',
                    'Pricing Plans',
                    'Choose the perfect plan for your needs',
                    nextOrder,
                    1, // is_visible
                    'App Name',
                    'Specifications',
                    'Features',
                    'Price Hourly',
                    'Price Monthly',
                    'Price Quarterly',
                    'Price Yearly',
                    'Action',
                    1, // show_hourly_column
                    1, // show_monthly_column
                    1, // show_quarterly_column
                    1  // show_yearly_column
                  ],
                  function(insertErr) {
                    if (insertErr) {
                      console.error(`❌ Error creating pricing section for marketplace ${marketplace.id}:`, insertErr.message);
                      processed++;
                      if (processed === marketplaces.length) {
                        console.log(`\n✅ Complete! Created ${created} pricing section(s), skipped ${skipped}.`);
                        db.close();
                      }
                    } else {
                      console.log(`✅ Created pricing section for marketplace ${marketplace.id} (order: ${nextOrder})`);
                      created++;
                      
                      // Now create a default pricing item for this section
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
                          this.lastID, // The newly created section ID
                          'pricing_plan',
                          marketplace.name || 'App Name', // Use marketplace name as app name
                          defaultContent,
                          0,
                          1 // is_visible
                        ],
                        function(itemErr) {
                          if (itemErr) {
                            console.error(`⚠️  Error creating default pricing item for marketplace ${marketplace.id}:`, itemErr.message);
                          } else {
                            console.log(`   ✅ Added default pricing item: "${marketplace.name || 'App Name'}"`);
                          }
                        }
                      );
                    }

                    processed++;
                    if (processed === marketplaces.length) {
                      // Wait a bit for async item creation to complete
                      setTimeout(() => {
                        console.log(`\n✅ Complete! Created ${created} pricing section(s), skipped ${skipped}.`);
                        db.close();
                      }, 500);
                    }
                  }
                );
              }
            );
          }

          processed++;
          if (processed === marketplaces.length) {
            console.log(`\n✅ Complete! Created ${created} pricing section(s), skipped ${skipped}.`);
            db.close();
          }
        }
      );
    });
  });
});

