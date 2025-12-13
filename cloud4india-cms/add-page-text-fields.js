const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('cms.db');

console.log('📝 Adding text configuration fields to page content tables...\n');

// Fields to add to main_products_content and main_solutions_content
const fieldsToAdd = [
  'button1_text TEXT DEFAULT "Get Started"',
  'button1_link TEXT DEFAULT "/pricing"',
  'button2_text TEXT DEFAULT "Explore More"',
  'button2_link TEXT DEFAULT "#content"',
  'search_placeholder TEXT DEFAULT "Search products & services"',
  'filter_text TEXT DEFAULT "Filter"',
  'all_categories_text TEXT DEFAULT "All Categories"',
  'no_items_text TEXT DEFAULT "No items found"',
  'view_all_text TEXT DEFAULT "View All"',
  'loading_text TEXT DEFAULT "Loading..."',
  'error_text TEXT DEFAULT "Error loading content"',
  'page_title TEXT DEFAULT "Search All"'
];

let productsComplete = 0;
let solutionsComplete = 0;

console.log('Adding fields to main_products_content...');
fieldsToAdd.forEach((field, index) => {
  const columnName = field.split(' ')[0];
  db.run(`ALTER TABLE main_products_content ADD COLUMN ${field}`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error(`  ❌ Error adding ${columnName}:`, err.message);
    } else if (!err) {
      console.log(`  ✅ Added ${columnName}`);
    }
    
    productsComplete++;
    if (productsComplete === fieldsToAdd.length && solutionsComplete === fieldsToAdd.length) {
      updateDefaults();
    }
  });
});

console.log('\nAdding fields to main_solutions_content...');
fieldsToAdd.forEach((field, index) => {
  const columnName = field.split(' ')[0];
  db.run(`ALTER TABLE main_solutions_content ADD COLUMN ${field}`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error(`  ❌ Error adding ${columnName}:`, err.message);
    } else if (!err) {
      console.log(`  ✅ Added ${columnName}`);
    }
    
    solutionsComplete++;
    if (productsComplete === fieldsToAdd.length && solutionsComplete === fieldsToAdd.length) {
      updateDefaults();
    }
  });
});

function updateDefaults() {
  console.log('\n🔧 Setting default values...\n');
  
  // Update products defaults
  db.run(`
    UPDATE main_products_content SET
      button1_text = COALESCE(button1_text, 'Get Started'),
      button1_link = COALESCE(button1_link, '/pricing'),
      button2_text = COALESCE(button2_text, 'Explore Products'),
      button2_link = COALESCE(button2_link, '#products'),
      search_placeholder = COALESCE(search_placeholder, 'Search products & services'),
      filter_text = COALESCE(filter_text, 'Filter'),
      all_categories_text = COALESCE(all_categories_text, 'All Categories'),
      no_items_text = COALESCE(no_items_text, 'No products found'),
      view_all_text = COALESCE(view_all_text, 'View All Products'),
      loading_text = COALESCE(loading_text, 'Loading our innovative products...'),
      error_text = COALESCE(error_text, 'Error Loading Products'),
      page_title = COALESCE(page_title, 'Search All Products')
    WHERE id = 1
  `, (err) => {
    if (!err) {
      console.log('✅ Updated main_products_content defaults');
    }
    
    // Update solutions defaults
    db.run(`
      UPDATE main_solutions_content SET
        button1_text = COALESCE(button1_text, 'Get Started'),
        button1_link = COALESCE(button1_link, '/pricing'),
        button2_text = COALESCE(button2_text, 'Explore More'),
        button2_link = COALESCE(button2_link, '#marketplace'),
        search_placeholder = COALESCE(search_placeholder, 'Search solutions & services'),
        filter_text = COALESCE(filter_text, 'Filter'),
        all_categories_text = COALESCE(all_categories_text, 'All Categories'),
        no_items_text = COALESCE(no_items_text, 'No solutions found'),
        view_all_text = COALESCE(view_all_text, 'View All Solutions'),
        loading_text = COALESCE(loading_text, 'Loading our innovative solutions...'),
        error_text = COALESCE(error_text, 'Error Loading Solutions'),
        page_title = COALESCE(page_title, 'Search All Solutions')
      WHERE id = 1
    `, (err2) => {
      if (!err2) {
        console.log('✅ Updated main_solutions_content defaults');
      }
      
      console.log('\n✅ All text fields added and configured!');
      db.close();
    });
  });
}

