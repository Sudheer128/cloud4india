const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

console.log('Testing eyebrow and description update...');

db.serialize(() => {
  // Check current values
  db.get("SELECT eyebrow, description FROM integrity_pages WHERE id = 1", (err, row) => {
    if (err) {
      console.error('Error:', err.message);
      db.close();
      return;
    }
    console.log('Current values:', row);
    
    // Update values
    db.run("UPDATE integrity_pages SET eyebrow = ?, description = ? WHERE id = 1", 
      ['Integrity & Policies', 'Test Description Updated'], 
      function(err) {
        if (err) {
          console.error('Update error:', err.message);
        } else {
          console.log('Update successful, rows changed:', this.changes);
          
          // Verify update
          db.get("SELECT eyebrow, description FROM integrity_pages WHERE id = 1", (err, row) => {
            if (err) {
              console.error('Error:', err.message);
            } else {
              console.log('Updated values:', row);
            }
            db.close();
          });
        }
      }
    );
  });
});

