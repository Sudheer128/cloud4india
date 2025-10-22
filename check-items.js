const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('cms.db');

db.all('SELECT id, title, description, icon, order_index FROM section_items WHERE section_id = 23 ORDER BY order_index', (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Financial Segments Items:');
    rows.forEach(row => {
      console.log(`Order ${row.order_index}: ${row.title} - ${row.icon}`);
    });
  }
  db.close();
});

