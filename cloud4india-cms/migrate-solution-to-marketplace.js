const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'cms.db');
console.log(`📊 Connecting to database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connected to the SQLite database.');
  }
});

// Disable foreign keys during migration
db.run('PRAGMA foreign_keys = OFF');

db.serialize(() => {
  console.log('\n🔄 Starting migration: solution -> marketplace\n');

  // Helper function to check if table exists
  const tableExists = (tableName, callback) => {
    db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
      [tableName],
      (err, row) => {
        callback(err, !!row);
      }
    );
  };

  // Step 1: Rename solution_sections to marketplace_sections and update solution_id column
  tableExists('solution_sections', (err, exists) => {
    if (err) {
      console.error('Error checking solution_sections:', err.message);
      return;
    }
    
    if (exists) {
      // Get all data from solution_sections
      db.all('SELECT * FROM solution_sections', (err, rows) => {
        if (err) {
          console.error('Error fetching solution_sections:', err.message);
          return;
        }

        // Create new table with marketplace_id
        db.run(`CREATE TABLE IF NOT EXISTS marketplace_sections (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          marketplace_id INTEGER NOT NULL,
          section_type TEXT NOT NULL,
          title TEXT,
          content TEXT,
          order_index INTEGER DEFAULT 0,
          is_visible INTEGER DEFAULT 1,
          media_type TEXT,
          media_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (err) {
            console.error('Error creating marketplace_sections:', err.message);
            return;
          }

          // Copy data with renamed column
          const stmt = db.prepare(`INSERT INTO marketplace_sections 
            (id, marketplace_id, section_type, title, content, order_index, is_visible, media_type, media_url, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
          
          rows.forEach((row) => {
            stmt.run(
              row.id,
              row.solution_id, // Map solution_id to marketplace_id
              row.section_type,
              row.title,
              row.content,
              row.order_index,
              row.is_visible || 1,
              row.media_type || null,
              row.media_url || null,
              row.created_at,
              row.updated_at
            );
          });
          
          stmt.finalize((err) => {
            if (err) {
              console.error('Error finalizing insert:', err.message);
            } else {
              console.log(`✅ Migrated ${rows.length} rows from solution_sections to marketplace_sections`);
              // Drop old table
              db.run('DROP TABLE solution_sections', (err) => {
                if (err) {
                  console.error('Error dropping solution_sections:', err.message);
                } else {
                  console.log('✅ Dropped old solution_sections table');
                }
              });
            }
          });
        });
      });
    }
  });

  // Step 2: Rename main_solutions_sections
  tableExists('main_solutions_sections', (err, exists) => {
    if (err) {
      console.error('Error checking main_solutions_sections:', err.message);
      return;
    }
    
    if (exists) {
      db.all('SELECT * FROM main_solutions_sections', (err, rows) => {
        if (err) {
          console.error('Error fetching main_solutions_sections:', err.message);
          return;
        }

        // Get table schema first
        db.all("PRAGMA table_info(main_solutions_sections)", (err, columns) => {
          if (err) {
            console.error('Error getting table info:', err.message);
            return;
          }

          // Build CREATE TABLE statement dynamically
          const columnDefs = columns.map(col => {
            let def = `${col.name} ${col.type}`;
            if (col.pk) def += ' PRIMARY KEY';
            if (col.notnull && !col.pk) def += ' NOT NULL';
            if (col.dflt_value !== null) def += ` DEFAULT ${col.dflt_value}`;
            return def;
          }).join(', ');

          // Create new table
          db.run(`CREATE TABLE IF NOT EXISTS main_marketplaces_sections (${columnDefs.replace(/solution_id/g, 'marketplace_id')})`, (err) => {
            if (err) {
              console.error('Error creating main_marketplaces_sections:', err.message);
              return;
            }

            // Copy data
            const placeholders = columns.map(() => '?').join(', ');
            const insertCols = columns.map(col => col.name === 'solution_id' ? 'marketplace_id' : col.name).join(', ');
            const selectCols = columns.map(col => col.name).join(', ');
            
            const stmt = db.prepare(`INSERT INTO main_marketplaces_sections (${insertCols}) SELECT ${selectCols.replace(/solution_id/g, 'solution_id AS marketplace_id')} FROM main_solutions_sections`);
            
            stmt.run((err) => {
              if (err) {
                console.error('Error copying data:', err.message);
              } else {
                console.log(`✅ Migrated ${rows.length} rows from main_solutions_sections to main_marketplaces_sections`);
                db.run('DROP TABLE main_solutions_sections', (err) => {
                  if (err) {
                    console.error('Error dropping main_solutions_sections:', err.message);
                  } else {
                    console.log('✅ Dropped old main_solutions_sections table');
                  }
                });
              }
            });
            stmt.finalize();
          });
        });
      });
    }
  });

  // Step 3: Rename simple tables (no column changes needed)
  const simpleTableRenames = [
    { old: 'solutions', new: 'marketplaces' },
    { old: 'solution_categories', new: 'marketplace_categories' },
    { old: 'main_solutions_content', new: 'main_marketplaces_content' }
  ];

  simpleTableRenames.forEach(({ old, new: newName }) => {
    tableExists(old, (err, exists) => {
      if (err) {
        console.error(`Error checking ${old}:`, err.message);
        return;
      }
      if (exists) {
        db.run(`ALTER TABLE ${old} RENAME TO ${newName}`, (err) => {
          if (err) {
            console.error(`❌ Error renaming table ${old} to ${newName}:`, err.message);
          } else {
            console.log(`✅ Renamed table: ${old} -> ${newName}`);
          }
        });
      }
    });
  });

  // Step 4: Update routes in marketplaces table
  setTimeout(() => {
    db.all("SELECT id, route FROM marketplaces", (err, rows) => {
      if (err) {
        console.error('❌ Error fetching marketplaces:', err.message);
        return;
      }

      console.log('\n📝 Updating routes in marketplaces table...');
      let updated = 0;
      rows.forEach((row) => {
        if (row.route && row.route.includes('/solutions/')) {
          const newRoute = row.route.replace('/solutions/', '/marketplace/');
          db.run('UPDATE marketplaces SET route = ? WHERE id = ?', [newRoute, row.id], (updateErr) => {
            if (updateErr) {
              console.error(`❌ Error updating route for marketplace ${row.id}:`, updateErr.message);
            } else {
              updated++;
              console.log(`✅ Updated route: ${row.route} -> ${newRoute}`);
            }
          });
        }
      });
      
      setTimeout(() => {
        console.log(`\n✅ Updated ${updated} routes`);
        
        // Re-enable foreign keys
        db.run('PRAGMA foreign_keys = ON', (err) => {
          if (err) {
            console.error('Error enabling foreign keys:', err.message);
          }
        });

        console.log('\n✅ Migration completed!');
        console.log('\n📋 Summary:');
        console.log('  - Renamed tables: solutions -> marketplaces');
        console.log('  - Renamed tables: solution_categories -> marketplace_categories');
        console.log('  - Renamed tables: solution_sections -> marketplace_sections');
        console.log('  - Renamed tables: main_solutions_content -> main_marketplaces_content');
        console.log('  - Renamed tables: main_solutions_sections -> main_marketplaces_sections');
        console.log('  - Renamed columns: solution_id -> marketplace_id');
        console.log('  - Updated routes: /solutions/ -> /marketplace/');
        
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('\n✅ Database connection closed.');
            process.exit(0);
          }
        });
      }, 3000);
    });
  }, 2000);
});
