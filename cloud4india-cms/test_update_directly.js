const sqlite3 = require('sqlite3').verbose();
const dbPath = process.env.DB_PATH || './cms.db';

console.log(`Testing database update at: ${dbPath}\n`);

// Simulate what the server does
const db = new sqlite3.Database(dbPath);

const id = 1;
const description = `DIRECT_TEST_${Date.now()}`;
const title = "Privacy Policyyy";
const eyebrow = "Integrity & Policies";
const content = "<h2>Test Content</h2>";

console.log('1. Current state:');
db.get('SELECT id, title, description FROM integrity_pages WHERE id = ?', [id], (err, before) => {
  if (err) {
    console.error('Error:', err);
    db.close();
    return;
  }
  console.log('  ', JSON.stringify(before));
  
  // Now do the update exactly as the server does
  const updateFields = [];
  const values = [];
  
  updateFields.push('title = ?');
  values.push(title);
  updateFields.push('description = ?');
  values.push(description);
  updateFields.push('eyebrow = ?');
  values.push(eyebrow);
  updateFields.push('content = ?');
  values.push(content);
  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  
  const query = `UPDATE integrity_pages SET ${updateFields.join(', ')} WHERE id = ?`;
  
  console.log('\n2. Executing UPDATE:');
  console.log('   Query:', query);
  console.log('   Values:', values);
  
  db.run(query, values, function(err) {
    if (err) {
      console.error('   UPDATE Error:', err);
      db.close();
      return;
    }
    
    console.log('   Changes:', this.changes);
    
    // Verify immediately
    console.log('\n3. Verifying immediately:');
    db.get('SELECT description FROM integrity_pages WHERE id = ?', [id], (err, after) => {
      if (err) {
        console.error('   Error:', err);
        db.close();
        return;
      }
      console.log('   Description is now:', JSON.stringify(after.description));
      console.log('   Expected:', JSON.stringify(description));
      console.log('   Match:', after.description === description ? 'YES' : 'NO');
      
      // Wait a bit and check again
      setTimeout(() => {
        console.log('\n4. Checking again after 100ms:');
        db.get('SELECT description FROM integrity_pages WHERE id = ?', [id], (err, later) => {
          if (err) {
            console.error('   Error:', err);
            db.close();
            return;
          }
          console.log('   Description is now:', JSON.stringify(later.description));
          console.log('   Match:', later.description === description ? 'YES' : 'NO');
          
          db.close();
        });
      }, 100);
    });
  });
});

