const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('cms.db');

db.all('SELECT id, title, order_index FROM solution_sections WHERE solution_id = 1 ORDER BY order_index', (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Sections:');
    rows.forEach(row => {
      console.log(`Order ${row.order_index}: ${row.title} (ID: ${row.id})`);
    });
  }
  db.close();
});