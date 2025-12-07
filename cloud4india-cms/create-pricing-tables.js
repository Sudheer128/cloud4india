const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const dbPath = process.env.DB_PATH || './cms.db';
const db = new sqlite3.Database(dbPath);

console.log('🏗️  Creating Pricing CMS Tables...');

db.serialize(() => {
  // Pricing Categories table (Compute, Storage, Networking, etc.)
  db.run(`CREATE TABLE IF NOT EXISTS pricing_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Pricing Subcategories table (Shared CPU, Dedicated CPU, etc.)
  db.run(`CREATE TABLE IF NOT EXISTS pricing_subcategories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    header_color TEXT DEFAULT 'green-100',
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES pricing_categories (id)
  )`);

  // Pricing Plans table
  db.run(`CREATE TABLE IF NOT EXISTS pricing_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subcategory_id INTEGER NOT NULL,
    name TEXT,
    ram TEXT NOT NULL,
    vcpu TEXT NOT NULL,
    storage TEXT NOT NULL,
    bandwidth TEXT,
    discount TEXT,
    hourly_price TEXT NOT NULL,
    monthly_price TEXT NOT NULL,
    yearly_price TEXT,
    instance_type TEXT,
    nodes TEXT,
    is_popular BOOLEAN DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subcategory_id) REFERENCES pricing_subcategories (id)
  )`);

  // Storage Options table (for Storage category)
  db.run(`CREATE TABLE IF NOT EXISTS storage_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price_per_gb TEXT NOT NULL,
    features TEXT, -- JSON array of features
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Pricing FAQ table
  db.run(`CREATE TABLE IF NOT EXISTS pricing_faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Pricing Hero Section table
  db.run(`CREATE TABLE IF NOT EXISTS pricing_hero (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log('✅ Pricing CMS tables created successfully!');
});

// Insert default data
db.serialize(() => {
  console.log('📊 Inserting default pricing data...');

  // Insert default hero section
  db.run(`INSERT OR IGNORE INTO pricing_hero (id, title, description) VALUES (
    1,
    'Cloud Server Pricing for Startups, SMEs and Enterprises',
    'Experience the perfect balance of performance and affordability with Cloud4India''s cloud server pricing. Our bundled packages are designed to provide you with high-performance cloud Apps while optimizing cloud cost savings. Whether you''re looking for scalable storage or powerful servers, our cloud server cost options ensure you get maximum value without compromising on quality or efficiency.'
  )`);

  // Insert categories
  const categories = [
    { name: 'Compute', slug: 'compute', icon: 'CpuChipIcon', description: 'Virtual machines and computing resources' },
    { name: 'Storage', slug: 'storage', icon: 'CircleStackIcon', description: 'Scalable storage Apps' },
    { name: 'Networking', slug: 'networking', icon: 'CloudIcon', description: 'Network infrastructure and connectivity' },
    { name: 'Databases', slug: 'databases', icon: 'ServerIcon', description: 'Managed database services' },
    { name: 'Security', slug: 'security', icon: 'ShieldCheckIcon', description: 'Security and compliance tools' },
    { name: 'Management', slug: 'management', icon: 'CogIcon', description: 'Management and monitoring tools' }
  ];

  categories.forEach((category, index) => {
    db.run(`INSERT OR IGNORE INTO pricing_categories (name, slug, icon, description, order_index) VALUES (?, ?, ?, ?, ?)`,
      [category.name, category.slug, category.icon, category.description, index]);
  });

  // Insert compute subcategories
  const computeSubcategories = [
    { name: 'Shared CPU', slug: 'shared-cpu', description: 'Enjoy a reliable and cost-effective hosting App with a wide range of Shared CPU Plans.', header_color: 'green-100' },
    { name: 'Dedicated CPU', slug: 'dedicated-cpu', description: 'Experience exceptional performance and unleash the full power of your applications with Dedicated CPU Plans.', header_color: 'green-200' },
    { name: 'High Memory', slug: 'high-memory', description: 'Lightning-fast performance with High Memory Plans. Optimize your workloads with dedicated resources and massive RAM.', header_color: 'green-300' },
    { name: 'Kubernetes', slug: 'kubernetes', description: 'Effortlessly manage your containerized apps, simplify your deployment process today.', header_color: 'orange-100' }
  ];

  computeSubcategories.forEach((subcategory, index) => {
    db.run(`INSERT OR IGNORE INTO pricing_subcategories (category_id, name, slug, description, header_color, order_index) VALUES (1, ?, ?, ?, ?, ?)`,
      [subcategory.name, subcategory.slug, subcategory.description, subcategory.header_color, index]);
  });

  // Insert shared CPU plans
  const sharedPlans = [
    { ram: '1 GB', vcpu: '1 vCPU', storage: '25 GB SSD', bandwidth: '1 TB', discount: '15%', hourly: '₹1.20', monthly: '₹850', yearly: '₹8,500' },
    { ram: '2 GB', vcpu: '2 vCPU', storage: '50 GB SSD', bandwidth: '2 TB', discount: '15%', hourly: '₹2.40', monthly: '₹1,700', yearly: '₹17,000' },
    { ram: '4 GB', vcpu: '2 vCPU', storage: '80 GB SSD', bandwidth: '3 TB', discount: '20%', hourly: '₹4.80', monthly: '₹3,400', yearly: '₹32,640', popular: 1 },
    { ram: '8 GB', vcpu: '4 vCPU', storage: '160 GB SSD', bandwidth: '4 TB', discount: '20%', hourly: '₹9.60', monthly: '₹6,800', yearly: '₹65,280' }
  ];

  sharedPlans.forEach((plan, index) => {
    db.run(`INSERT OR IGNORE INTO pricing_plans (subcategory_id, ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, is_popular, order_index) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [plan.ram, plan.vcpu, plan.storage, plan.bandwidth, plan.discount, plan.hourly, plan.monthly, plan.yearly, plan.popular || 0, index]);
  });

  // Insert dedicated CPU plans
  const dedicatedPlans = [
    { ram: '4 GB', vcpu: '2 vCPU', storage: '80 GB SSD', discount: '20%', hourly: '₹5.50', monthly: '₹3,900', yearly: '₹37,440' },
    { ram: '8 GB', vcpu: '4 vCPU', storage: '160 GB SSD', discount: '20%', hourly: '₹11.00', monthly: '₹7,800', yearly: '₹74,880', popular: 1 },
    { ram: '16 GB', vcpu: '8 vCPU', storage: '320 GB SSD', discount: '25%', hourly: '₹22.00', monthly: '₹15,600', yearly: '₹140,400' },
    { ram: '32 GB', vcpu: '16 vCPU', storage: '640 GB SSD', discount: '25%', hourly: '₹44.00', monthly: '₹31,200', yearly: '₹280,800' }
  ];

  dedicatedPlans.forEach((plan, index) => {
    db.run(`INSERT OR IGNORE INTO pricing_plans (subcategory_id, ram, vcpu, storage, discount, hourly_price, monthly_price, yearly_price, is_popular, order_index) VALUES (2, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [plan.ram, plan.vcpu, plan.storage, plan.discount, plan.hourly, plan.monthly, plan.yearly, plan.popular || 0, index]);
  });

  // Insert Kubernetes plans
  const kubernetesPlans = [
    { instance_type: 'Shared 80 GB', nodes: '1', ram: '4 GB', vcpu: '2 vCPU', hourly: '₹4.16', monthly: '₹2,995' },
    { instance_type: 'Shared 160 GB', nodes: '1', ram: '8 GB', vcpu: '4 vCPU', hourly: '₹8.32', monthly: '₹5,990' },
    { instance_type: 'Dedicated 320 GB', nodes: '2', ram: '16 GB', vcpu: '8 vCPU', hourly: '₹16.64', monthly: '₹11,980' }
  ];

  kubernetesPlans.forEach((plan, index) => {
    db.run(`INSERT OR IGNORE INTO pricing_plans (subcategory_id, instance_type, nodes, ram, vcpu, storage, hourly_price, monthly_price, order_index) VALUES (4, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [plan.instance_type, plan.nodes, plan.ram, plan.vcpu, '', plan.hourly, plan.monthly, index]);
  });

  // Insert storage options
  const storageOptions = [
    { name: 'Block Storage', description: 'High-performance SSD storage for your applications', price: '₹2.50', features: '["99.9% Uptime SLA", "Automatic Backups", "Instant Provisioning"]' },
    { name: 'Object Storage', description: 'Scalable storage for files, images, and backups', price: '₹1.80', features: '["Unlimited Scalability", "CDN Integration", "API Access"]' },
    { name: 'Archive Storage', description: 'Cost-effective long-term data archival', price: '₹0.50', features: '["Low-cost Storage", "Data Durability", "Compliance Ready"]' }
  ];

  storageOptions.forEach((storage, index) => {
    db.run(`INSERT OR IGNORE INTO storage_options (name, description, price_per_gb, features, order_index) VALUES (?, ?, ?, ?, ?)`,
      [storage.name, storage.description, storage.price, storage.features, index]);
  });

  // Insert FAQs
  const faqs = [
    { question: 'When will my card be charged?', answer: 'Cloud4India billing cycles are monthly, typically starting on the first day of the month for the previous month\'s usage. Your card will only be charged at the end of the billing cycle or if you exceed a usage threshold.' },
    { question: 'Am I charged when I enter my credit card?', answer: 'No, your card is not charged when you add it to your Cloud4India account. Charges are only applied at the end of the billing cycle or when your usage surpasses a certain threshold.' },
    { question: 'Why am I billed for powered-off servers?', answer: 'Even when your server is powered off, you\'re still billed because resources like disk space, CPU, RAM, and IP addresses are reserved for your use. These resources are part of your overall cloud server pricing plan.' }
  ];

  faqs.forEach((faq, index) => {
    db.run(`INSERT OR IGNORE INTO pricing_faqs (question, answer, order_index) VALUES (?, ?, ?)`,
      [faq.question, faq.answer, index]);
  });

  console.log('✅ Default pricing data inserted successfully!');
});

db.close((err) => {
  if (err) {
    console.error('❌ Error closing database:', err.message);
  } else {
    console.log('🎉 Pricing CMS setup completed successfully!');
  }
});
