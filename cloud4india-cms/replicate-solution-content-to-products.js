const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('cms.db');

console.log('🔄 Replicating AI/ML Cloud solution structure to products...\n');

// Product data
const products = [
  {
    route: 'cloud-compute-instances',
    name: 'Cloud Compute Instances',
    category: 'Compute'
  },
  {
    route: 'block-storage',
    name: 'Block Storage',
    category: 'Storage'
  }
];

// Get AI/ML Cloud solution sections and items as template
db.all(`
  SELECT 
    ps.id as section_id,
    ps.section_type,
    ps.title as section_title,
    ps.description as section_desc,
    ps.order_index,
    ps.content as section_content,
    si.id as item_id,
    si.item_type,
    si.title as item_title,
    si.description as item_desc,
    si.value,
    si.label,
    si.icon,
    si.content as item_content,
    si.order_index as item_order
  FROM solutions s
  JOIN solution_sections ps ON s.id = ps.solution_id
  LEFT JOIN solution_items si ON ps.id = si.section_id
  WHERE s.id = 3 AND s.name LIKE '%AI%ML%'
  ORDER BY ps.order_index, si.order_index
`, [], (err, templateRows) => {
  if (err) {
    console.error('❌ Error fetching template:', err.message);
    db.close();
    return;
  }

  // Group template data by section
  const templateSections = {};
  templateRows.forEach(row => {
    if (!templateSections[row.section_type]) {
      templateSections[row.section_type] = {
        title: row.section_title,
        description: row.section_desc,
        content: row.section_content,
        order: row.order_index,
        items: []
      };
    }
    if (row.item_id) {
      templateSections[row.section_type].items.push({
        type: row.item_type,
        title: row.item_title,
        description: row.item_desc,
        value: row.value,
        label: row.label,
        icon: row.icon,
        content: row.item_content,
        order: row.item_order
      });
    }
  });

  console.log(`✅ Loaded template with ${Object.keys(templateSections).length} sections\n`);

  let productsProcessed = 0;

  products.forEach(productData => {
    // Get product ID
    db.get("SELECT id FROM products WHERE route = ?", [productData.route], (err, product) => {
      if (err || !product) {
        console.error(`❌ Product not found: ${productData.route}`);
        productsProcessed++;
        if (productsProcessed === products.length) db.close();
        return;
      }

      const productId = product.id;
      console.log(`\n📦 Processing: ${productData.name} (ID: ${productId})`);

      // Delete existing sections for this product
      db.run('DELETE FROM product_items WHERE section_id IN (SELECT id FROM product_sections WHERE product_id = ?)', [productId], () => {
        db.run('DELETE FROM product_sections WHERE product_id = ?', [productId], () => {
          // Create sections and items
          createSectionsForProduct(productId, productData, templateSections, () => {
            productsProcessed++;
            if (productsProcessed === products.length) {
              console.log('\n✅ All products processed!');
              db.close();
            }
          });
        });
      });
    });
  });
});

function createSectionsForProduct(productId, productData, templateSections, callback) {
  const sectionIds = {};
  const sectionsToCreate = Object.keys(templateSections).sort((a, b) => 
    templateSections[a].order - templateSections[b].order
  );
  
  let sectionsCreated = 0;
  let itemsCreated = 0;
  let totalItems = 0;

  // Count total items
  sectionsToCreate.forEach(sectionType => {
    totalItems += templateSections[sectionType].items.length;
  });

  // Create sections
  sectionsToCreate.forEach((sectionType, index) => {
    const template = templateSections[sectionType];
    
    // Customize titles/descriptions for products
    let title = template.title;
    let description = template.description;
    
    if (sectionType === 'hero') {
      title = `${productData.name} - ${productData.category} Infrastructure`;
      description = template.description.replace('AI/ML', productData.category).replace('GPU', '');
    }
    
    db.run(`
      INSERT INTO product_sections (product_id, title, description, section_type, order_index, content, is_visible, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [productId, title, description, sectionType, template.order, template.content || null], function(err) {
      if (err) {
        console.error(`   ❌ Error creating section ${sectionType}:`, err.message);
      } else {
        const sectionId = this.lastID;
        sectionIds[sectionType] = sectionId;
        console.log(`   ✅ Created section: ${title} (${sectionType})`);
      }
      
      sectionsCreated++;
      if (sectionsCreated === sectionsToCreate.length) {
        // All sections created, now add items
        addItemsForProduct(sectionIds, templateSections, () => {
          callback();
        });
      }
    });
  });

  function addItemsForProduct(sectionIds, templateSections, callback) {
    sectionsToCreate.forEach(sectionType => {
      const sectionId = sectionIds[sectionType];
      const items = templateSections[sectionType].items;
      
      items.forEach((item, itemIndex) => {
        // Prepare content based on item type
        let query, params;
        
        if (item.type === 'feature' || item.type === 'feature_card') {
          query = `INSERT INTO product_items (section_id, item_type, title, order_index, is_visible, created_at, updated_at) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
          params = [sectionId, item.type === 'feature_card' ? 'feature_card' : 'feature', item.title, item.order || itemIndex];
        } else if (item.type === 'stat') {
          query = `INSERT INTO product_items (section_id, item_type, title, value, label, order_index, is_visible, created_at, updated_at) VALUES (?, 'stat', ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
          params = [sectionId, item.value || item.title, item.value, item.label, item.order || itemIndex];
        } else if (item.type === 'cta_primary' || item.type === 'cta_secondary') {
          query = `INSERT INTO product_items (section_id, item_type, title, description, value, order_index, is_visible, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
          params = [sectionId, item.type, item.title, item.description || '', item.value || '', item.order || itemIndex];
        } else if (item.type === 'specification') {
          query = `INSERT INTO product_items (section_id, item_type, title, description, content, icon, order_index, is_visible, created_at, updated_at) VALUES (?, 'specification', ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
          params = [sectionId, item.title, item.description, item.content || JSON.stringify({ features: [] }), item.icon, item.order || itemIndex];
        } else if (item.type === 'pricing_plan') {
          query = `INSERT INTO product_items (section_id, item_type, title, description, content, order_index, is_visible, created_at, updated_at) VALUES (?, 'pricing_plan', ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
          params = [sectionId, item.title, item.description || '', item.content || '{}', item.order || itemIndex];
        } else if (item.type === 'security_feature' || item.type === 'support_feature' || item.type === 'migration_step' || item.type === 'use_case') {
          query = `INSERT INTO product_items (section_id, item_type, title, description, icon, content, order_index, is_visible, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
          params = [sectionId, item.type, item.title, item.description || '', item.icon || null, item.content || null, item.order || itemIndex];
        } else {
          // Generic fallback
          query = `INSERT INTO product_items (section_id, item_type, title, description, order_index, is_visible, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
          params = [sectionId, item.type, item.title || '', item.description || '', item.order || itemIndex];
        }
        
        db.run(query, params, function(err) {
          if (err) {
            console.error(`   ❌ Error adding item to ${sectionType}:`, err.message);
          }
          itemsCreated++;
          if (itemsCreated === totalItems) {
            console.log(`   ✅ Added ${totalItems} items across ${sectionsToCreate.length} sections`);
            callback();
          }
        });
      });
    });
  }
}

