const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'cms.db');
console.log('Using database:', dbPath);
const db = new sqlite3.Database(dbPath);

console.log('🔧 Creating Pricing Page Configuration Table...\n');

db.serialize(() => {
  // Create pricing_page_config table
  db.run(`CREATE TABLE IF NOT EXISTS pricing_page_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    main_heading TEXT NOT NULL DEFAULT 'Affordable Cloud Server Pricing and Plans in India',
    compute_section_heading TEXT NOT NULL DEFAULT 'Compute Offering',
    compute_section_description TEXT NOT NULL DEFAULT 'Choose a plan based on the amount of CPU, memory, and storage required for your project. The cost will adjust according to the resources you select.',
    compute_tab_basic_label TEXT NOT NULL DEFAULT 'Basic Compute Plans',
    compute_tab_cpu_intensive_label TEXT NOT NULL DEFAULT 'CPU Intensive',
    compute_tab_memory_intensive_label TEXT NOT NULL DEFAULT 'Memory Intensive',
    compute_table_header_name TEXT NOT NULL DEFAULT 'Name',
    compute_table_header_vcpu TEXT NOT NULL DEFAULT 'vCPU',
    compute_table_header_memory TEXT NOT NULL DEFAULT 'Memory RAM',
    compute_table_header_hourly TEXT NOT NULL DEFAULT 'Price Hourly',
    compute_table_header_monthly TEXT NOT NULL DEFAULT 'Price Monthly',
    compute_table_header_quarterly TEXT NOT NULL DEFAULT 'Price Quarterly',
    compute_table_header_yearly TEXT NOT NULL DEFAULT 'Price Yearly',
    disk_section_heading TEXT NOT NULL DEFAULT 'Disk Offering',
    disk_section_description TEXT NOT NULL DEFAULT 'Choose the disk storage size that best fits your requirements. All storage options use high-performance NVMe technology.',
    disk_table_header_name TEXT NOT NULL DEFAULT 'Name',
    disk_table_header_type TEXT NOT NULL DEFAULT 'Storage Type',
    disk_table_header_size TEXT NOT NULL DEFAULT 'Size',
    storage_section_heading TEXT NOT NULL DEFAULT 'Storage Pricing and Plans',
    storage_section_description TEXT NOT NULL DEFAULT 'Choose from our flexible storage options designed to meet your specific needs and budget requirements.',
    storage_table_header_type TEXT NOT NULL DEFAULT 'Storage Type',
    storage_table_header_description TEXT NOT NULL DEFAULT 'Description',
    storage_table_header_price TEXT NOT NULL DEFAULT 'Price',
    storage_table_header_action TEXT NOT NULL DEFAULT 'Action',
    service_table_header_service TEXT NOT NULL DEFAULT 'Service',
    service_table_header_type TEXT NOT NULL DEFAULT 'Type',
    service_table_header_features TEXT NOT NULL DEFAULT 'Features',
    service_table_header_bandwidth TEXT NOT NULL DEFAULT 'Bandwidth',
    service_table_header_discount TEXT NOT NULL DEFAULT 'Discount',
    service_table_header_price TEXT NOT NULL DEFAULT 'Price',
    service_table_header_action TEXT NOT NULL DEFAULT 'Action',
    faq_section_heading TEXT NOT NULL DEFAULT 'Have Any Questions?',
    faq_section_subheading TEXT NOT NULL DEFAULT 'Don''t Worry, We''ve Got Answers!',
    button_get_started TEXT NOT NULL DEFAULT 'Get Started',
    button_contact_sales TEXT NOT NULL DEFAULT 'Contact Sales',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating pricing_page_config table:', err.message);
      db.close();
      return;
    }
    console.log('✅ Created pricing_page_config table');
    
    // Check if config already exists
    db.get('SELECT COUNT(*) as count FROM pricing_page_config', (err, row) => {
      if (err) {
        console.error('❌ Error checking existing config:', err.message);
        db.close();
        return;
      }
      
      if (row.count === 0) {
        // Insert default configuration
        db.run(`INSERT INTO pricing_page_config (id) VALUES (1)`, (err) => {
          if (err) {
            console.error('❌ Error inserting default config:', err.message);
          } else {
            console.log('✅ Inserted default pricing page configuration');
          }
          db.close();
        });
      } else {
        console.log('✅ Pricing page configuration already exists');
        db.close();
      }
    });
  });
});

