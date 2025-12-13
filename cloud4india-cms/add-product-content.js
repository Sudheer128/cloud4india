const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('cms.db');

console.log('📝 Adding content for Cloud Compute Instances and Block Storage...\n');

// Function to create product sections and items
function addProductContent(productRoute, sectionsData, callback) {
  db.get("SELECT id, name FROM products WHERE route = ?", [productRoute], (err, product) => {
    if (err || !product) {
      console.error(`❌ Product not found: ${productRoute}`);
      callback();
      return;
    }
    
    console.log(`\n✅ Processing: ${product.name} (ID: ${product.id})`);
    
    let sectionsCreated = 0;
    const sectionIds = {};
    
    // Create sections
    sectionsData.sections.forEach((section, index) => {
      db.run(`
        INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [product.id, section.title, section.description, section.type, section.order], function(err) {
        if (err) {
          console.error(`   ❌ Error creating section ${section.title}:`, err.message);
        } else {
          const sectionId = this.lastID;
          sectionIds[section.type] = sectionId;
          console.log(`   ✅ Created section: ${section.title} (ID: ${sectionId})`);
        }
        
        sectionsCreated++;
        if (sectionsCreated === sectionsData.sections.length) {
          // All sections created, now add items
          addSectionItems(product.id, sectionIds, sectionsData.items, () => {
            callback();
          });
        }
      });
    });
  });
}

function addSectionItems(productId, sectionIds, itemsData, callback) {
  let itemsCreated = 0;
  let totalItems = 0;
  
  // Count total items
  Object.values(itemsData).forEach(itemList => {
    totalItems += itemList.length;
  });
  
  if (totalItems === 0) {
    callback();
    return;
  }
  
  // Add hero items
  if (itemsData.hero && sectionIds.hero) {
    itemsData.hero.forEach((item, index) => {
      if (item.type === 'feature') {
        // Feature bullet points
        db.run(`
          INSERT INTO product_items (section_id, item_type, title, order_index, is_visible, created_at, updated_at)
          VALUES (?, 'feature', ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, [sectionIds.hero, item.text, index], function(err) {
          if (err) {
            console.error(`   ❌ Error adding hero feature:`, err.message);
          }
          itemsCreated++;
          if (itemsCreated === totalItems) callback();
        });
      } else if (item.type === 'stat') {
        // Stats - need title field too (use value as title)
        db.run(`
          INSERT INTO product_items (section_id, item_type, title, value, label, order_index, is_visible, created_at, updated_at)
          VALUES (?, 'stat', ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, [sectionIds.hero, item.value, item.value, item.label, index], function(err) {
          if (err) {
            console.error(`   ❌ Error adding hero stat:`, err.message);
          }
          itemsCreated++;
          if (itemsCreated === totalItems) callback();
        });
      }
    });
  }
  
  // Add features
  if (itemsData.features && sectionIds.features) {
    itemsData.features.forEach((feature, index) => {
      db.run(`
        INSERT INTO product_items (section_id, item_type, title, description, icon, order_index, is_visible, created_at, updated_at)
        VALUES (?, 'feature_card', ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [sectionIds.features, feature.title, feature.description, feature.icon, index], function(err) {
        if (err) {
          console.error(`   ❌ Error adding feature:`, err.message);
        }
        itemsCreated++;
        if (itemsCreated === totalItems) callback();
      });
    });
  }
  
  // Add specifications
  if (itemsData.specifications && sectionIds.specifications) {
    itemsData.specifications.forEach((spec, index) => {
      db.run(`
        INSERT INTO product_items (section_id, item_type, title, description, content, icon, order_index, is_visible, created_at, updated_at)
        VALUES (?, 'specification', ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [sectionIds.specifications, spec.title, spec.description, JSON.stringify({ features: spec.features }), spec.icon, index], function(err) {
        if (err) {
          console.error(`   ❌ Error adding spec:`, err.message);
        }
        itemsCreated++;
        if (itemsCreated === totalItems) callback();
      });
    });
  }
}

// Cloud Compute Instances Content
const cloudComputeContent = {
  sections: [
    {
      type: 'hero',
      title: 'Cloud Compute Instances',
      description: 'Scalable virtual machines for general workloads with high performance and reliability',
      order: 0
    },
    {
      type: 'features',
      title: 'Key Features',
      description: 'Why Choose Cloud Compute Instances',
      order: 1
    },
    {
      type: 'specifications',
      title: 'Technical Specifications',
      description: 'Comprehensive technical details',
      order: 2
    }
  ],
  items: {
    hero: [
      { type: 'feature', text: 'Scalable virtual machines from 1 vCPU to 64 vCPUs' },
      { type: 'feature', text: 'High-performance SSD storage with up to 10TB capacity' },
      { type: 'feature', text: '99.9% uptime SLA with automated backups' },
      { type: 'stat', value: '1-64', label: 'vCPUs Available' },
      { type: 'stat', value: '99.9%', label: 'Uptime SLA' },
      { type: 'stat', value: '24/7', label: 'Support' }
    ],
    features: [
      {
        title: 'Flexible Configuration',
        description: 'Choose from a wide range of CPU, RAM, and storage configurations to match your workload requirements.',
        icon: 'CpuChipIcon'
      },
      {
        title: 'High Performance',
        description: 'Powered by Intel Xeon processors with NVMe SSD storage for optimal performance.',
        icon: 'ChartBarIcon'
      },
      {
        title: 'Auto Scaling',
        description: 'Automatically scale your resources up or down based on demand to optimize costs.',
        icon: 'ArrowPathIcon'
      },
      {
        title: 'Global Network',
        description: 'Low-latency network with multiple data centers across India for better connectivity.',
        icon: 'GlobeAltIcon'
      },
      {
        title: 'Enterprise Security',
        description: 'Advanced security features including firewalls, VPN, and encrypted storage.',
        icon: 'ShieldCheckIcon'
      },
      {
        title: 'Easy Management',
        description: 'Intuitive control panel and API access for seamless infrastructure management.',
        icon: 'CogIcon'
      }
    ],
    specifications: [
      {
        title: 'Compute Resources',
        description: 'Flexible compute options',
        features: ['1 to 64 vCPUs available', 'Intel Xeon processors', 'Burstable and dedicated CPU options', 'High-frequency cores'],
        icon: 'CpuChipIcon'
      },
      {
        title: 'Memory & Storage',
        description: 'High-performance storage solutions',
        features: ['1GB to 256GB RAM options', 'NVMe SSD storage up to 10TB', 'High IOPS performance', 'Snapshot and backup capabilities'],
        icon: 'CircleStackIcon'
      },
      {
        title: 'Network & Connectivity',
        description: 'High-speed network connectivity',
        features: ['1Gbps to 10Gbps network speed', 'Unlimited bandwidth', 'DDoS protection included', 'Private networking support'],
        icon: 'GlobeAltIcon'
      }
    ]
  }
};

// Block Storage Content
const blockStorageContent = {
  sections: [
    {
      type: 'hero',
      title: 'Block Storage',
      description: 'High IOPS SSD-backed block storage for your applications and databases',
      order: 0
    },
    {
      type: 'features',
      title: 'Key Features',
      description: 'Why Choose Block Storage',
      order: 1
    },
    {
      type: 'specifications',
      title: 'Technical Specifications',
      description: 'Comprehensive technical details',
      order: 2
    }
  ],
  items: {
    hero: [
      { type: 'feature', text: 'High IOPS SSD storage with up to 100,000 IOPS' },
      { type: 'feature', text: 'Scale from 10GB to 16TB per volume' },
      { type: 'feature', text: '99.99% durability with automatic replication' },
      { type: 'stat', value: '100K', label: 'Max IOPS' },
      { type: 'stat', value: '99.99%', label: 'Durability' },
      { type: 'stat', value: '16TB', label: 'Max Volume' }
    ],
    features: [
      {
        title: 'High IOPS Performance',
        description: 'Up to 100,000 IOPS with low latency for demanding database and application workloads.',
        icon: 'ChartBarIcon'
      },
      {
        title: 'Scalable Storage',
        description: 'Easily scale your storage from 10GB to 16TB without downtime or data migration.',
        icon: 'ArrowPathIcon'
      },
      {
        title: 'Data Durability',
        description: '99.99% durability with automatic replication across multiple availability zones.',
        icon: 'ShieldCheckIcon'
      },
      {
        title: 'Snapshot Support',
        description: 'Create instant snapshots for backups and point-in-time recovery of your data.',
        icon: 'CameraIcon'
      },
      {
        title: 'Easy Attachment',
        description: 'Attach and detach storage volumes to any compute instance with a few clicks.',
        icon: 'LinkIcon'
      },
      {
        title: 'Encrypted Storage',
        description: 'All data encrypted at rest using AES-256 encryption for maximum security.',
        icon: 'LockClosedIcon'
      }
    ],
    specifications: [
      {
        title: 'Storage Performance',
        description: 'High-performance SSD storage',
        features: ['Up to 100,000 IOPS per volume', 'Low latency (sub-millisecond)', 'SSD-backed storage', 'Optimized for databases'],
        icon: 'CircleStackIcon'
      },
      {
        title: 'Storage Capacity',
        description: 'Flexible storage sizes',
        features: ['10GB to 16TB per volume', 'Multiple volumes per instance', 'Scale without downtime', 'Pay only for what you use'],
        icon: 'ServerIcon'
      },
      {
        title: 'Data Protection',
        description: 'Enterprise-grade data protection',
        features: ['99.99% durability SLA', 'Automatic replication', 'Snapshot capabilities', 'AES-256 encryption'],
        icon: 'ShieldCheckIcon'
      }
    ]
  }
};

let productsProcessed = 0;

// Add content for Cloud Compute Instances
addProductContent('cloud-compute-instances', cloudComputeContent, () => {
  productsProcessed++;
  if (productsProcessed === 2) {
    console.log('\n✅ All product content added successfully!');
    db.close();
  }
});

// Add content for Block Storage
addProductContent('block-storage', blockStorageContent, () => {
  productsProcessed++;
  if (productsProcessed === 2) {
    console.log('\n✅ All product content added successfully!');
    db.close();
  }
});

