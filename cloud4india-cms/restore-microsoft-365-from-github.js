const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const backupDbPath = '/tmp/cms.db.backup';
const currentDbPath = path.join(__dirname, 'cms.db');

console.log('🔄 Restoring Microsoft 365 Licenses from GitHub backup...\n');

// First, check if backup database exists
if (!fs.existsSync(backupDbPath)) {
  console.error('❌ Backup database not found at:', backupDbPath);
  process.exit(1);
}

const backupDb = new sqlite3.Database(backupDbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Error opening backup database:', err.message);
    process.exit(1);
  }
  
  // Get product from backup
  backupDb.get('SELECT * FROM products WHERE route = ?', ['microsoft-365-licenses'], (err, product) => {
    if (err) {
      console.error('❌ Error fetching product from backup:', err.message);
      backupDb.close();
      process.exit(1);
    }
    
    if (!product) {
      console.error('❌ Product not found in backup database');
      backupDb.close();
      process.exit(1);
    }
    
    console.log(`✅ Found product in backup: ID ${product.id}, Name: ${product.name}`);
    
    // Get all sections for this product
    backupDb.all('SELECT * FROM product_sections WHERE product_id = ? ORDER BY order_index', [product.id], (err, sections) => {
      if (err) {
        console.error('❌ Error fetching sections from backup:', err.message);
        backupDb.close();
        process.exit(1);
      }
      
      console.log(`✅ Found ${sections.length} sections in backup`);
      
      // Get all items for these sections
      const sectionIds = sections.map(s => s.id);
      const placeholders = sectionIds.map(() => '?').join(',');
      
      backupDb.all(`SELECT * FROM product_items WHERE section_id IN (${placeholders}) ORDER BY order_index`, sectionIds, (err, items) => {
        if (err) {
          console.error('❌ Error fetching items from backup:', err.message);
          backupDb.close();
          process.exit(1);
        }
        
        console.log(`✅ Found ${items.length} items in backup`);
        
        // Get main_products_sections entry
        backupDb.get('SELECT * FROM main_products_sections WHERE product_id = ?', [product.id], (err, mainProductSection) => {
          if (err) {
            console.error('❌ Error fetching main_products_sections from backup:', err.message);
            backupDb.close();
            process.exit(1);
          }
          
          backupDb.close();
          
          // Now restore to current database
          const currentDb = new sqlite3.Database(currentDbPath, (err) => {
            if (err) {
              console.error('❌ Error opening current database:', err.message);
              process.exit(1);
            }
            
            console.log('\n📝 Starting restoration to current database...\n');
            
            // Step 1: Delete the incorrectly added product (ID: 22)
            currentDb.get('SELECT id FROM products WHERE id = 22 AND route = ?', ['microsoft-365-licenses'], (err, existingProduct) => {
              if (err) {
                console.error('❌ Error checking for existing product:', err.message);
                currentDb.close();
                process.exit(1);
              }
              
              if (existingProduct) {
                console.log('🗑️  Removing incorrectly added product (ID: 22)...');
                
                // Delete items first
                currentDb.run('DELETE FROM product_items WHERE section_id IN (SELECT id FROM product_sections WHERE product_id = 22)', function(err) {
                  if (err) {
                    console.error('❌ Error deleting items:', err.message);
                  } else {
                    console.log(`   Deleted ${this.changes} items`);
                  }
                  
                  // Delete sections
                  currentDb.run('DELETE FROM product_sections WHERE product_id = 22', function(err) {
                    if (err) {
                      console.error('❌ Error deleting sections:', err.message);
                    } else {
                      console.log(`   Deleted ${this.changes} sections`);
                    }
                    
                    // Delete product
                    currentDb.run('DELETE FROM products WHERE id = 22', function(err) {
                      if (err) {
                        console.error('❌ Error deleting product:', err.message);
                      } else {
                        console.log(`   Deleted product\n`);
                      }
                      
                      // Step 2: Check if product already exists in current DB
                      currentDb.get('SELECT id FROM products WHERE route = ?', [product.route], (err, existing) => {
                        if (err) {
                          console.error('❌ Error checking existing product:', err.message);
                          currentDb.close();
                          process.exit(1);
                        }
                        
                        if (existing) {
                          console.log(`⚠️  Product already exists with ID ${existing.id}. Updating it...\n`);
                          
                          // Update existing product
                          currentDb.run(`
                            UPDATE products 
                            SET name = ?, description = ?, category = ?, color = ?, border_color = ?, 
                                route = ?, gradient_start = ?, gradient_end = ?, is_visible = ?, 
                                order_index = ?, updated_at = CURRENT_TIMESTAMP
                            WHERE id = ?
                          `, [
                            product.name, product.description, product.category, product.color, 
                            product.border_color, product.route, product.gradient_start, 
                            product.gradient_end, product.is_visible, product.order_index, existing.id
                          ], function(err) {
                            if (err) {
                              console.error('❌ Error updating product:', err.message);
                              currentDb.close();
                              process.exit(1);
                            }
                            
                            console.log(`✅ Updated product (ID: ${existing.id})`);
                            restoreSectionsAndItems(currentDb, existing.id, sections, items, mainProductSection);
                          });
                        } else {
                          // Insert new product
                          currentDb.run(`
                            INSERT INTO products (name, description, category, color, border_color, route, gradient_start, gradient_end, is_visible, order_index, created_at, updated_at)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                          `, [
                            product.name, product.description, product.category, product.color, 
                            product.border_color, product.route, product.gradient_start, 
                            product.gradient_end, product.is_visible, product.order_index, 
                            product.created_at || 'CURRENT_TIMESTAMP', product.updated_at || 'CURRENT_TIMESTAMP'
                          ], function(err) {
                            if (err) {
                              console.error('❌ Error inserting product:', err.message);
                              currentDb.close();
                              process.exit(1);
                            }
                            
                            const newProductId = this.lastID;
                            console.log(`✅ Inserted product (ID: ${newProductId})\n`);
                            restoreSectionsAndItems(currentDb, newProductId, sections, items, mainProductSection);
                          });
                        }
                      });
                    });
                  });
                });
              } else {
                console.log('ℹ️  No incorrectly added product found. Proceeding with restoration...\n');
                
                // Check if product already exists
                currentDb.get('SELECT id FROM products WHERE route = ?', [product.route], (err, existing) => {
                  if (err) {
                    console.error('❌ Error checking existing product:', err.message);
                    currentDb.close();
                    process.exit(1);
                  }
                  
                  if (existing) {
                    console.log(`⚠️  Product already exists with ID ${existing.id}. Updating it...\n`);
                    
                    // Update existing product
                    currentDb.run(`
                      UPDATE products 
                      SET name = ?, description = ?, category = ?, color = ?, border_color = ?, 
                          route = ?, gradient_start = ?, gradient_end = ?, is_visible = ?, 
                          order_index = ?, updated_at = CURRENT_TIMESTAMP
                      WHERE id = ?
                    `, [
                      product.name, product.description, product.category, product.color, 
                      product.border_color, product.route, product.gradient_start, 
                      product.gradient_end, product.is_visible, product.order_index, existing.id
                    ], function(err) {
                      if (err) {
                        console.error('❌ Error updating product:', err.message);
                        currentDb.close();
                        process.exit(1);
                      }
                      
                      console.log(`✅ Updated product (ID: ${existing.id})`);
                      restoreSectionsAndItems(currentDb, existing.id, sections, items, mainProductSection);
                    });
                  } else {
                    // Insert new product
                    currentDb.run(`
                      INSERT INTO products (name, description, category, color, border_color, route, gradient_start, gradient_end, is_visible, order_index, created_at, updated_at)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                      product.name, product.description, product.category, product.color, 
                      product.border_color, product.route, product.gradient_start, 
                      product.gradient_end, product.is_visible, product.order_index, 
                      product.created_at || 'CURRENT_TIMESTAMP', product.updated_at || 'CURRENT_TIMESTAMP'
                    ], function(err) {
                      if (err) {
                        console.error('❌ Error inserting product:', err.message);
                        currentDb.close();
                        process.exit(1);
                      }
                      
                      const newProductId = this.lastID;
                      console.log(`✅ Inserted product (ID: ${newProductId})\n`);
                      restoreSectionsAndItems(currentDb, newProductId, sections, items, mainProductSection);
                    });
                  }
                });
              }
            });
          });
        });
      });
    });
  });
});

function restoreSectionsAndItems(currentDb, productId, sections, items, mainProductSection) {
  // Delete existing sections and items for this product
  console.log('🗑️  Removing existing sections and items...');
  currentDb.run('DELETE FROM product_items WHERE section_id IN (SELECT id FROM product_sections WHERE product_id = ?)', [productId], function(err) {
    if (err) {
      console.error('❌ Error deleting existing items:', err.message);
    } else {
      console.log(`   Deleted ${this.changes} existing items`);
    }
    
    currentDb.run('DELETE FROM product_sections WHERE product_id = ?', [productId], function(err) {
      if (err) {
        console.error('❌ Error deleting existing sections:', err.message);
      } else {
        console.log(`   Deleted ${this.changes} existing sections\n`);
      }
      
      // Insert sections
      console.log('📝 Restoring sections...');
      let sectionsCompleted = 0;
      const sectionIdMap = {}; // Map old section IDs to new section IDs
      
      sections.forEach(section => {
        const oldSectionId = section.id;
        delete section.id; // Remove ID so it gets auto-generated
        
        currentDb.run(`
          INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          productId, section.title, section.description, section.section_type, 
          section.order_index, section.is_visible, 
          section.created_at || 'CURRENT_TIMESTAMP', section.updated_at || 'CURRENT_TIMESTAMP'
        ], function(err) {
          if (err) {
            console.error(`❌ Error inserting section "${section.title}":`, err.message);
          } else {
            const newSectionId = this.lastID;
            sectionIdMap[oldSectionId] = newSectionId;
            console.log(`   ✅ Section: "${section.title}" (ID: ${newSectionId})`);
          }
          
          sectionsCompleted++;
          if (sectionsCompleted === sections.length) {
            console.log(`\n✅ Restored ${sections.length} sections\n`);
            
            // Insert items
            console.log('📝 Restoring items...');
            let itemsCompleted = 0;
            
            items.forEach(item => {
              const newSectionId = sectionIdMap[item.section_id];
              if (!newSectionId) {
                console.error(`❌ No mapping found for section_id ${item.section_id}`);
                itemsCompleted++;
                if (itemsCompleted === items.length) {
                  finishRestoration(currentDb, productId, mainProductSection);
                }
                return;
              }
              
              delete item.id; // Remove ID so it gets auto-generated
              delete item.section_id; // Will use new section ID
              
              currentDb.run(`
                INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                newSectionId, item.title, item.description, item.content, item.item_type, 
                item.icon, item.order_index, item.is_visible,
                item.created_at || 'CURRENT_TIMESTAMP', item.updated_at || 'CURRENT_TIMESTAMP'
              ], function(err) {
                if (err) {
                  console.error(`❌ Error inserting item "${item.title}":`, err.message);
                } else {
                  console.log(`   ✅ Item: "${item.title}"`);
                }
                
                itemsCompleted++;
                if (itemsCompleted === items.length) {
                  console.log(`\n✅ Restored ${items.length} items\n`);
                  finishRestoration(currentDb, productId, mainProductSection);
                }
              });
            });
          }
        });
      });
    });
  });
}

function finishRestoration(currentDb, productId, mainProductSection) {
  // Update or insert main_products_sections
  if (mainProductSection) {
    console.log('📝 Updating main_products_sections...');
    currentDb.run(`
      INSERT OR REPLACE INTO main_products_sections (product_id, title, description, is_visible, order_index, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      productId, mainProductSection.title, mainProductSection.description, 
      mainProductSection.is_visible, mainProductSection.order_index,
      mainProductSection.created_at || 'CURRENT_TIMESTAMP', 
      mainProductSection.updated_at || 'CURRENT_TIMESTAMP'
    ], function(err) {
      if (err) {
        console.error('❌ Error updating main_products_sections:', err.message);
      } else {
        console.log('✅ Updated main_products_sections\n');
      }
      
      console.log('✅ Microsoft 365 Licenses product restored successfully from GitHub backup!');
      console.log(`   Product ID: ${productId}`);
      console.log(`   Route: microsoft-365-licenses\n`);
      
      currentDb.close();
    });
  } else {
    console.log('⚠️  No main_products_sections entry found in backup\n');
    console.log('✅ Microsoft 365 Licenses product restored successfully from GitHub backup!');
    console.log(`   Product ID: ${productId}`);
    console.log(`   Route: microsoft-365-licenses\n`);
    
    currentDb.close();
  }
}


