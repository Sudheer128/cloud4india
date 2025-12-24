const sqlite3 = require('sqlite3').verbose();

const DB_PATH = process.env.DB_PATH || '/app/data/cms.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database');
});

const LOGIN_URL = 'https://portal.cloud4india.com/login';

// Update all product pricing items to have buttonUrl set to login URL
db.serialize(() => {
  // Get all pricing items from product pricing sections
  db.all(
    `SELECT pi.id, pi.section_id, pi.title, pi.content, ps.product_id, p.name as product_name
     FROM product_items pi
     JOIN product_sections ps ON pi.section_id = ps.id
     JOIN products p ON ps.product_id = p.id
     WHERE pi.item_type = 'pricing_plan' AND ps.section_type = 'pricing'`,
    [],
    (err, items) => {
      if (err) {
        console.error('Error fetching pricing items:', err.message);
        db.close();
        return;
      }

      if (items.length === 0) {
        console.log('No pricing items found.');
        db.close();
        return;
      }

      console.log(`Found ${items.length} pricing item(s). Updating buttonUrl...\n`);

      let processed = 0;
      let updated = 0;
      let skipped = 0;
      let errors = 0;

      items.forEach((item) => {
        try {
          // Parse existing content JSON
          let content = {};
          if (item.content) {
            try {
              content = JSON.parse(item.content);
            } catch (parseErr) {
              console.error(`⚠️  Error parsing content for item ${item.id} (${item.title}):`, parseErr.message);
              // If content is not valid JSON, create a new object
              content = {};
            }
          }

          // Check if buttonUrl already exists and is the same
          if (content.buttonUrl === LOGIN_URL) {
            console.log(`⏭️  Item ${item.id} (${item.title}) in "${item.product_name}" already has correct buttonUrl. Skipping.`);
            skipped++;
            processed++;
            if (processed === items.length) {
              console.log(`\n✅ Complete! Updated ${updated} item(s), skipped ${skipped}, errors: ${errors}.`);
              db.close();
            }
            return;
          }

          // Update buttonUrl
          content.buttonUrl = LOGIN_URL;

          // Ensure buttonText exists (keep existing or set default)
          if (!content.buttonText) {
            content.buttonText = 'Order Now';
          }

          // Convert back to JSON string
          const updatedContent = JSON.stringify(content);

          // Update in database
          db.run(
            `UPDATE product_items SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [updatedContent, item.id],
            function(updateErr) {
              if (updateErr) {
                console.error(`❌ Error updating item ${item.id} (${item.title}):`, updateErr.message);
                errors++;
              } else {
                console.log(`✅ Updated item ${item.id} (${item.title}) in "${item.product_name}" - buttonUrl set to login URL`);
                updated++;
              }

              processed++;
              if (processed === items.length) {
                console.log(`\n✅ Complete! Updated ${updated} item(s), skipped ${skipped}, errors: ${errors}.`);
                db.close();
              }
            }
          );
        } catch (error) {
          console.error(`❌ Error processing item ${item.id}:`, error.message);
          errors++;
          processed++;
          if (processed === items.length) {
            console.log(`\n✅ Complete! Updated ${updated} item(s), skipped ${skipped}, errors: ${errors}.`);
            db.close();
          }
        }
      });
    }
  );
});


