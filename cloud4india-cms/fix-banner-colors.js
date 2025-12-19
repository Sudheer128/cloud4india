const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

const fixBannerColors = () => {
    console.log('🎨 Updating Feature Banner 1 colors to "Deep Blue/Navy" theme...');

    // New colors: Deep Blue/Navy -> Blue -> Dark Turquoise
    // This gives a premium, "Cloud Summit" professional look
    const gradient_start = 'aws-navy';
    const gradient_mid = 'aws-blue';
    const gradient_end = 'phulkari-turquoise-dark';

    const accent_gradient_start = 'aws-blue';
    const accent_gradient_end = 'phulkari-turquoise';

    const sql = `
    UPDATE feature_banners 
    SET 
      gradient_start = ?,
      gradient_mid = ?,
      gradient_end = ?,
      accent_gradient_start = ?,
      accent_gradient_end = ?
    WHERE id = 1
  `;

    db.run(sql, [
        gradient_start,
        gradient_mid,
        gradient_end,
        accent_gradient_start,
        accent_gradient_end
    ], function (err) {
        if (err) {
            console.error('❌ Error updating banner colors:', err.message);
        } else {
            console.log(`✅ Banner 1 updated successfully! (Rows modified: ${this.changes})`);

            // Verify the change
            db.get('SELECT * FROM feature_banners WHERE id = 1', (err, row) => {
                if (row) {
                    console.log('\nUpdated Banner 1 Config:');
                    console.log(`  Category: ${row.category}`);
                    console.log(`  Gradient: ${row.gradient_start} -> ${row.gradient_mid} -> ${row.gradient_end}`);
                }
            });
        }
        db.close();
    });
};

fixBannerColors();
