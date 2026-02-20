/**
 * Cloud4India API Sync Service
 * Fetches data from Cloud4India API and caches it locally in SQLite
 */

// Default values from environment (used as fallback)
const ENV_API_BASE = process.env.CLOUD4INDIA_API_URL || 'https://portal.cloud4india.com/backend/api';
const ENV_API_KEY = process.env.CLOUD4INDIA_API_KEY;
const ENV_DEFAULT_RATE_CARD = process.env.CLOUD4INDIA_DEFAULT_RATE_CARD || 'default';
const ENV_SYNC_INTERVAL = parseInt(process.env.CLOUD4INDIA_SYNC_INTERVAL) || 15;

// Current config cache (loaded from DB)
let currentConfig = null;

/**
 * Safely parse an integer from various formats
 * Handles: 2, "2", "2 vCPU", "2GB", null, undefined
 */
function safeInt(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return Math.floor(val);
  if (typeof val === 'string') {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * Safely parse a float
 */
function safeFloat(val) {
  if (val === null || val === undefined) return 0;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
}

// Keep track of sync status in memory
let syncStatus = {
  isRunning: false,
  lastSyncAt: null,
  nextSyncAt: null,
  lastError: null,
  progress: null,
};

/**
 * Get API configuration from database with env fallback
 */
function getApiConfig(db) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM api_configurations WHERE id = 1', [], (err, row) => {
      if (err) {
        console.warn('Error reading API config from DB, using env vars:', err.message);
        resolve({
          api_base_url: ENV_API_BASE,
          api_key: ENV_API_KEY,
          default_rate_card: ENV_DEFAULT_RATE_CARD,
          sync_interval_minutes: ENV_SYNC_INTERVAL,
          is_enabled: 1,
        });
        return;
      }

      if (!row) {
        // No config in DB, use env vars
        resolve({
          api_base_url: ENV_API_BASE,
          api_key: ENV_API_KEY,
          default_rate_card: ENV_DEFAULT_RATE_CARD,
          sync_interval_minutes: ENV_SYNC_INTERVAL,
          is_enabled: 1,
        });
        return;
      }

      // Merge DB config with env fallbacks
      resolve({
        api_base_url: row.api_base_url || ENV_API_BASE,
        api_key: row.api_key || ENV_API_KEY,
        default_rate_card: row.default_rate_card || ENV_DEFAULT_RATE_CARD,
        sync_interval_minutes: row.sync_interval_minutes || ENV_SYNC_INTERVAL,
        is_enabled: row.is_enabled,
        last_tested_at: row.last_tested_at,
        test_status: row.test_status,
        name: row.name,
      });
    });
  });
}

/**
 * Test API connection with given credentials
 */
async function testApiConnection(apiBase, apiKey) {
  if (!apiKey) {
    return { success: false, error: 'API key is required' };
  }

  try {
    const url = `${apiBase}/admin/cloud-provider-services?limit=1`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `API returned ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Connection successful',
      serviceCount: data?.data?.length || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: `Connection failed: ${error.message}`
    };
  }
}

/**
 * Update API config test status in database
 */
function updateApiConfigTestStatus(db, status, testedAt) {
  return new Promise((resolve) => {
    db.run(
      'UPDATE api_configurations SET test_status = ?, last_tested_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [status, testedAt],
      (err) => {
        if (err) console.error('Error updating test status:', err.message);
        resolve();
      }
    );
  });
}

/**
 * Categorize services by name/slug
 */
function categorizeService(name, slug) {
  const lowerName = name.toLowerCase();
  const lowerSlug = (slug || '').toLowerCase();

  if (lowerName.includes('virtual machine') || lowerSlug.includes('virtual-machine') ||
      lowerName.includes('kubernetes') || lowerSlug.includes('kubernetes') ||
      lowerName.includes('autoscale') || lowerSlug.includes('autoscale')) {
    return { category: 'compute', categoryName: 'Compute' };
  }

  if (lowerName.includes('storage') || lowerSlug.includes('storage') ||
      lowerName.includes('nvme') || lowerSlug.includes('nvme') ||
      lowerName.includes('snapshot') || lowerSlug.includes('snapshot') ||
      lowerName.includes('template') || lowerSlug.includes('template') ||
      lowerName.includes('iso') || lowerSlug.includes('iso')) {
    return { category: 'storage', categoryName: 'Storage' };
  }

  if (lowerName.includes('router') || lowerSlug.includes('router') ||
      lowerName.includes('vpc') || lowerSlug.includes('vpc') ||
      lowerName.includes('ip address') || lowerSlug.includes('ip-address') ||
      lowerName.includes('load balancer') || lowerSlug.includes('load-balancer') ||
      lowerName.includes('bandwidth') || lowerSlug.includes('bandwidth') ||
      lowerName.includes('network') || lowerSlug.includes('network') ||
      lowerName.includes('vnf') || lowerSlug.includes('vnf')) {
    return { category: 'network', categoryName: 'Networking' };
  }

  if (lowerName.includes('backup') || lowerSlug.includes('backup')) {
    return { category: 'backup', categoryName: 'Backup & Recovery' };
  }

  if (lowerName.includes('licence') || lowerSlug.includes('licence') ||
      lowerName.includes('license') || lowerSlug.includes('license')) {
    return { category: 'security', categoryName: 'Security & Licensing' };
  }

  if (lowerName.includes('monitoring') || lowerSlug.includes('monitoring')) {
    return { category: 'monitoring', categoryName: 'Monitoring' };
  }

  if (lowerName.includes('addon') || lowerSlug.includes('addon') ||
      lowerName.includes('marketplace') || lowerSlug.includes('marketplace') ||
      lowerName.includes('pool card') || lowerSlug.includes('pool-card') ||
      lowerName.includes('dns') || lowerSlug.includes('dns')) {
    return { category: 'marketplace', categoryName: 'Marketplace & Add-ons' };
  }

  return { category: 'other', categoryName: 'Other Services' };
}

/**
 * Helper to fetch from Cloud4India API
 * Uses currentConfig if available, otherwise falls back to env vars
 */
async function fetchAPI(endpoint, config = null) {
  const apiBase = config?.api_base_url || currentConfig?.api_base_url || ENV_API_BASE;
  const apiKey = config?.api_key || currentConfig?.api_key || ENV_API_KEY;

  if (!apiKey) {
    console.warn('Cloud4India API key not configured - skipping API fetch');
    return null;
  }

  try {
    const url = `${apiBase}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText} for ${endpoint}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error.message);
    return null;
  }
}

/**
 * Update cache metadata
 */
function updateCacheMetadata(db, cacheKey, status, recordCount = 0, errorMessage = null) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    db.run(`
      INSERT INTO api_cache_metadata (cache_key, last_synced_at, sync_status, record_count, error_message, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(cache_key) DO UPDATE SET
        last_synced_at = excluded.last_synced_at,
        sync_status = excluded.sync_status,
        record_count = excluded.record_count,
        error_message = excluded.error_message,
        updated_at = excluded.updated_at
    `, [cacheKey, now, status, recordCount, errorMessage, now], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * Clear and insert data into a table
 */
function clearAndInsert(db, tableName, data, columns) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Clear existing data
      db.run(`DELETE FROM ${tableName}`, (err) => {
        if (err) {
          reject(err);
          return;
        }
      });

      if (data.length === 0) {
        resolve(0);
        return;
      }

      // Build insert statement
      const placeholders = columns.map(() => '?').join(', ');
      const stmt = db.prepare(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`);

      let inserted = 0;
      for (const row of data) {
        const values = columns.map(col => {
          const val = row[col];
          // Handle null/undefined
          if (val === null || val === undefined) {
            return null;
          }
          // Convert booleans to integers for SQLite
          if (typeof val === 'boolean') {
            return val ? 1 : 0;
          }
          // Convert objects/arrays to JSON strings
          if (typeof val === 'object') {
            return JSON.stringify(val);
          }
          return val;
        });

        stmt.run(values, (err) => {
          if (err) {
            console.error(`Error inserting into ${tableName}:`, err.message);
          } else {
            inserted++;
          }
        });
      }

      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve(inserted);
      });
    });
  });
}

/**
 * Sync services from API
 */
async function syncServices(db) {
  console.log('   Syncing services...');
  const response = await fetchAPI('/admin/cloud-provider-services?limit=200');

  if (!response?.data) {
    await updateCacheMetadata(db, 'services', 'error', 0, 'No data returned from API');
    return [];
  }

  // Extract unique services
  const serviceMap = new Map();
  for (const svc of response.data) {
    if (svc.name && typeof svc.name === 'string' && !serviceMap.has(svc.name)) {
      const { category, categoryName } = categorizeService(svc.name, svc.slug || '');
      serviceMap.set(svc.name, {
        id: svc.id,
        name: svc.name,
        slug: svc.slug || svc.name.toLowerCase().replace(/\s+/g, '-'),
        status: svc.status ? 1 : 0,
        category,
        category_name: categoryName,
        billing_rule: svc.billing_rule,
        config: svc.config || {},
        plan_count: 0,
      });
    }
  }

  const services = Array.from(serviceMap.values());
  const columns = ['id', 'name', 'slug', 'status', 'category', 'category_name', 'billing_rule', 'config', 'plan_count'];
  await clearAndInsert(db, 'cached_services', services, columns);
  await updateCacheMetadata(db, 'services', 'success', services.length);

  console.log(`   ✅ Synced ${services.length} services`);
  return services;
}

/**
 * Sync plans for all services
 */
async function syncPlans(db, services, storageCategoriesMap, planCategoriesMap) {
  console.log('   Syncing plans...');
  const allPlans = [];

  const rateCard = currentConfig?.default_rate_card || ENV_DEFAULT_RATE_CARD;
  for (const service of services) {
    const response = await fetchAPI(
      `/admin/plans/service/${encodeURIComponent(service.name)}?planable_type=RateCard&planable=${rateCard}&include=prices&limit=500`
    );

    if (response?.data) {
      const plans = response.data.filter(plan => plan.status).map(plan => {
        const attr = plan.attribute || {};
        const storageCategoryName = storageCategoriesMap[plan.storage_category_id] || 'NVMe';
        const planCategoryName = planCategoriesMap[plan.plan_category_id] || null;

        const yearlyFromApi = plan.prices?.find(p => p.billing_cycle?.slug === 'yearly')?.amount;
        const yearlyPrice = yearlyFromApi ? parseFloat(yearlyFromApi) : (parseFloat(plan.monthly_price) * 12 * 0.9);

        return {
          id: plan.id,
          service_name: service.name,
          name: plan.name,
          slug: plan.slug,
          status: plan.status ? 1 : 0,
          cpu: safeInt(attr.cpu) || safeInt(attr.formatted_cpu),
          memory: safeInt(attr.memory),
          storage: safeInt(attr.storage) || safeInt(attr.size) || safeInt(plan.name),
          size: safeInt(attr.size) || safeInt(attr.storage) || safeInt(plan.name),
          bandwidth: safeInt(attr.bandwidth) || safeInt(attr.data_transfer_out),
          bucket_limit: safeInt(attr.bucket_limit),
          network_rate: safeInt(attr.network_rate),
          data_transfer_out: safeInt(attr.data_transfer_out),
          hourly_price: safeFloat(plan.hourly_price),
          monthly_price: safeFloat(plan.monthly_price),
          yearly_price: safeFloat(yearlyPrice),
          plan_category_id: plan.plan_category_id || null,
          plan_category_name: planCategoryName,
          storage_category_id: plan.storage_category_id || null,
          storage_category_name: storageCategoryName,
          attribute: attr,
          prices: plan.prices || [],
        };
      });

      allPlans.push(...plans);

      // Update plan count in services
      service.plan_count = plans.length;
    }
  }

  const columns = [
    'id', 'service_name', 'name', 'slug', 'status', 'cpu', 'memory', 'storage', 'size',
    'bandwidth', 'bucket_limit', 'network_rate', 'data_transfer_out',
    'hourly_price', 'monthly_price', 'yearly_price',
    'plan_category_id', 'plan_category_name', 'storage_category_id', 'storage_category_name',
    'attribute', 'prices'
  ];
  await clearAndInsert(db, 'cached_plans', allPlans, columns);
  await updateCacheMetadata(db, 'plans', 'success', allPlans.length);

  // Update services with plan counts
  for (const service of services) {
    await new Promise((resolve) => {
      db.run('UPDATE cached_services SET plan_count = ? WHERE id = ?', [service.plan_count, service.id], resolve);
    });
  }

  console.log(`   ✅ Synced ${allPlans.length} plans`);
  return allPlans;
}

/**
 * Sync rate cards
 */
async function syncRateCards(db) {
  console.log('   Syncing rate cards...');
  const response = await fetchAPI('/admin/rate-cards?limit=100');

  if (!response?.data) {
    await updateCacheMetadata(db, 'rate_cards', 'error', 0, 'No data returned');
    return [];
  }

  const rateCards = response.data.filter(rc => rc.status).map(rc => ({
    id: rc.id,
    name: rc.name,
    slug: rc.slug,
    description: rc.description,
    status: rc.status ? 1 : 0,
    is_default: rc.default ? 1 : 0,
    card_type: rc.card_type,
  }));

  const columns = ['id', 'name', 'slug', 'description', 'status', 'is_default', 'card_type'];
  await clearAndInsert(db, 'cached_rate_cards', rateCards, columns);
  await updateCacheMetadata(db, 'rate_cards', 'success', rateCards.length);

  console.log(`   ✅ Synced ${rateCards.length} rate cards`);
  return rateCards;
}

/**
 * Sync billing cycles
 */
async function syncBillingCycles(db) {
  console.log('   Syncing billing cycles...');
  const response = await fetchAPI('/admin/billing-cycles?limit=100');

  if (!response?.data) {
    await updateCacheMetadata(db, 'billing_cycles', 'error', 0, 'No data returned');
    return [];
  }

  const cycles = response.data.map(cycle => ({
    id: cycle.id,
    name: cycle.name,
    slug: cycle.slug,
    description: cycle.description,
    duration: cycle.duration,
    unit: cycle.unit,
    is_enabled: cycle.is_enabled ? 1 : 0,
    sort_order: cycle.sort_order || 0,
  }));

  const columns = ['id', 'name', 'slug', 'description', 'duration', 'unit', 'is_enabled', 'sort_order'];
  await clearAndInsert(db, 'cached_billing_cycles', cycles, columns);
  await updateCacheMetadata(db, 'billing_cycles', 'success', cycles.length);

  console.log(`   ✅ Synced ${cycles.length} billing cycles`);
  return cycles;
}

/**
 * Sync products
 */
async function syncProducts(db) {
  console.log('   Syncing products...');
  const rateCard = currentConfig?.default_rate_card || ENV_DEFAULT_RATE_CARD;
  const response = await fetchAPI(`/admin/products?planable_type=RateCard&planable=${rateCard}&limit=200`);

  if (!response?.data) {
    await updateCacheMetadata(db, 'products', 'error', 0, 'No data returned');
    return [];
  }

  const products = response.data.filter(p => p.status !== false).map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    status: product.status ? 1 : 0,
    monthly_price: product.prices?.find(p => p.billing_cycle?.slug === 'monthly')?.amount ||
                   product.prices?.[1]?.amount ||
                   product.prices?.[0]?.amount || 0,
    prices: product.prices || [],
  }));

  const columns = ['id', 'name', 'slug', 'description', 'status', 'monthly_price', 'prices'];
  await clearAndInsert(db, 'cached_products', products, columns);
  await updateCacheMetadata(db, 'products', 'success', products.length);

  console.log(`   ✅ Synced ${products.length} products`);
  return products;
}

/**
 * Sync licences
 */
async function syncLicences(db) {
  console.log('   Syncing licences...');
  const rateCard = currentConfig?.default_rate_card || ENV_DEFAULT_RATE_CARD;
  const response = await fetchAPI(`/admin/licences?planable_type=RateCard&planable=${rateCard}&limit=200`);

  if (!response?.data) {
    await updateCacheMetadata(db, 'licences', 'error', 0, 'No data returned');
    return [];
  }

  const licences = response.data.filter(l => l.status !== false).map(licence => ({
    id: licence.id,
    name: licence.name,
    slug: licence.slug,
    pricing_unit: licence.pricing_unit,
    status: licence.status ? 1 : 0,
    monthly_price: parseFloat(licence.prices?.[0]?.price) || 0,
    prices: licence.prices || [],
  }));

  const columns = ['id', 'name', 'slug', 'pricing_unit', 'status', 'monthly_price', 'prices'];
  await clearAndInsert(db, 'cached_licences', licences, columns);
  await updateCacheMetadata(db, 'licences', 'success', licences.length);

  console.log(`   ✅ Synced ${licences.length} licences`);
  return licences;
}

/**
 * Sync operating systems
 */
async function syncOperatingSystems(db) {
  console.log('   Syncing operating systems...');
  const response = await fetchAPI('/admin/operating-systems?limit=100');

  if (!response?.data) {
    await updateCacheMetadata(db, 'operating_systems', 'error', 0, 'No data returned');
    return [];
  }

  const operatingSystems = response.data.filter(os => os.status !== false).map(os => ({
    id: os.id,
    name: os.name,
    slug: os.slug,
    status: os.status ? 1 : 0,
  }));

  const columns = ['id', 'name', 'slug', 'status'];
  await clearAndInsert(db, 'cached_operating_systems', operatingSystems, columns);
  await updateCacheMetadata(db, 'operating_systems', 'success', operatingSystems.length);

  console.log(`   ✅ Synced ${operatingSystems.length} operating systems`);
  return operatingSystems;
}

/**
 * Sync templates
 */
async function syncTemplates(db) {
  console.log('   Syncing templates...');
  const response = await fetchAPI('/admin/templates?limit=200');

  if (!response?.data) {
    await updateCacheMetadata(db, 'templates', 'error', 0, 'No data returned');
    return [];
  }

  const templates = response.data.map(template => ({
    id: template.id,
    name: template.name,
    slug: template.slug,
    os_type: template.os_type,
    image_type: template.image_type,
    file_type: template.file_type,
    operating_system_id: template.operating_system_id,
    operating_system: template.operating_system,
    operating_system_version: template.operating_system_version,
    icon_url: template.icon_url,
    status: template.status ? 1 : 0,
  }));

  const columns = ['id', 'name', 'slug', 'os_type', 'image_type', 'file_type',
                   'operating_system_id', 'operating_system', 'operating_system_version',
                   'icon_url', 'status'];
  await clearAndInsert(db, 'cached_templates', templates, columns);
  await updateCacheMetadata(db, 'templates', 'success', templates.length);

  console.log(`   ✅ Synced ${templates.length} templates`);
  return templates;
}

/**
 * Sync storage categories
 */
async function syncStorageCategories(db) {
  console.log('   Syncing storage categories...');
  const response = await fetchAPI('/admin/storage-categories?limit=100');

  if (!response?.data) {
    await updateCacheMetadata(db, 'storage_categories', 'error', 0, 'No data returned');
    return [];
  }

  const categories = response.data.filter(cat => cat.status !== false).map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    status: cat.status ? 1 : 0,
  }));

  const columns = ['id', 'name', 'slug', 'status'];
  await clearAndInsert(db, 'cached_storage_categories', categories, columns);
  await updateCacheMetadata(db, 'storage_categories', 'success', categories.length);

  console.log(`   ✅ Synced ${categories.length} storage categories`);
  return categories;
}

/**
 * Sync plan categories
 */
async function syncPlanCategories(db) {
  console.log('   Syncing plan categories...');
  const response = await fetchAPI('/admin/plan-categories?limit=100');

  if (!response?.data) {
    await updateCacheMetadata(db, 'plan_categories', 'error', 0, 'No data returned');
    return [];
  }

  const categories = response.data.filter(cat => cat.status !== false).map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    short_name: cat.short_name,
    status: cat.status ? 1 : 0,
    sort_order: cat.sort_order || 0,
  }));

  const columns = ['id', 'name', 'slug', 'short_name', 'status', 'sort_order'];
  await clearAndInsert(db, 'cached_plan_categories', categories, columns);
  await updateCacheMetadata(db, 'plan_categories', 'success', categories.length);

  console.log(`   ✅ Synced ${categories.length} plan categories`);
  return categories;
}

/**
 * Sync unit pricings (per-unit rates for CPU, memory, storage, Veeam, etc.)
 */
async function syncUnitPricings(db) {
  console.log('   Syncing unit pricings...');
  const rateCard = currentConfig?.default_rate_card || ENV_DEFAULT_RATE_CARD;
  const response = await fetchAPI(`/admin/unit-pricings?planable_type=RateCard&planable=${rateCard}&include=cloud_provider,cloud_provider_setup,region,unit_pricing_currencies,storage_category`);

  if (!response?.data) {
    await updateCacheMetadata(db, 'unit_pricings', 'error', 0, 'No data returned');
    return [];
  }

  const unitPricings = response.data.map(up => {
    // Extract currency prices (prefer INR, fallback to first available)
    const currencies = up.unit_pricing_currencies || [];
    const inrCurrency = currencies.find(c =>
      c.currency?.code === 'INR' || c.currency?.name?.toLowerCase().includes('rupee')
    ) || currencies[0] || {};

    return {
      id: up.id,
      cloud_provider_id: up.cloud_provider_id || null,
      cloud_provider_name: up.cloud_provider?.name || up.cloud_provider_setup?.name || null,
      cloud_provider_setup_id: up.cloud_provider_setup_id || null,
      cloud_provider_setup_name: up.cloud_provider_setup?.name || null,
      region_id: up.region_id || null,
      region_name: up.region?.name || null,
      storage_category_id: up.storage_category_id || null,
      storage_category_name: up.storage_category?.name || null,
      cpu_price: safeFloat(inrCurrency.cpu),
      memory_price: safeFloat(inrCurrency.memory),
      storage_price: safeFloat(inrCurrency.storage),
      ip_address_price: safeFloat(inrCurrency.ip_address),
      bandwidth_price: safeFloat(inrCurrency.bandwidth),
      data_transfer_price: safeFloat(inrCurrency.data_transfer),
      per_vm_price: safeFloat(inrCurrency.per_vm_price),
      per_workstation_price: safeFloat(inrCurrency.per_workstation_price),
      per_server_price: safeFloat(inrCurrency.per_server_price),
      per_concurrent_task_price: safeFloat(inrCurrency.per_concurrent_task_price),
      replication_price: safeFloat(inrCurrency.replication),
      vb365_price: safeFloat(inrCurrency.vb365),
      workstation_agents_price: safeFloat(inrCurrency.workstation_agents_price),
      server_agents_price: safeFloat(inrCurrency.server_agents_price),
      subscription_user_price: safeFloat(inrCurrency.subscription_user_price),
      standard_storage_used_gb_price: safeFloat(inrCurrency.standard_storage_used_gb_price),
      source_hosted_amount_of_data_gb_price: safeFloat(inrCurrency.source_hosted_amount_of_data_gb_price),
      source_remote_amount_of_data_gb_price: safeFloat(inrCurrency.source_remote_amount_of_data_gb_price),
      replicated_vm_price: safeFloat(inrCurrency.replicated_vm_price),
      currency: inrCurrency.currency?.code || 'INR',
      raw_data: up,
    };
  });

  const columns = [
    'id', 'cloud_provider_id', 'cloud_provider_name',
    'cloud_provider_setup_id', 'cloud_provider_setup_name',
    'region_id', 'region_name',
    'storage_category_id', 'storage_category_name',
    'cpu_price', 'memory_price', 'storage_price', 'ip_address_price',
    'bandwidth_price', 'data_transfer_price',
    'per_vm_price', 'per_workstation_price', 'per_server_price', 'per_concurrent_task_price',
    'replication_price', 'vb365_price', 'workstation_agents_price', 'server_agents_price',
    'subscription_user_price', 'standard_storage_used_gb_price',
    'source_hosted_amount_of_data_gb_price', 'source_remote_amount_of_data_gb_price',
    'replicated_vm_price', 'currency', 'raw_data',
  ];
  await clearAndInsert(db, 'cached_unit_pricings', unitPricings, columns);
  await updateCacheMetadata(db, 'unit_pricings', 'success', unitPricings.length);

  console.log(`   ✅ Synced ${unitPricings.length} unit pricings`);
  return unitPricings;
}

/**
 * Sync all data from Cloud4India API
 */
async function syncAllData(db) {
  if (syncStatus.isRunning) {
    console.log('Sync already in progress, skipping...');
    return { success: false, message: 'Sync already in progress' };
  }

  syncStatus.isRunning = true;
  syncStatus.progress = 'Starting sync...';
  const startTime = Date.now();

  console.log('🔄 Starting Cloud4India API sync...');

  try {
    // Load config from database first
    syncStatus.progress = 'Loading API configuration...';
    currentConfig = await getApiConfig(db);

    // Check if sync is enabled
    if (!currentConfig.is_enabled) {
      console.log('   ⚠️  API sync is disabled in configuration');
      syncStatus.isRunning = false;
      syncStatus.progress = null;
      return { success: false, message: 'API sync is disabled' };
    }

    // Check if API key is configured
    if (!currentConfig.api_key) {
      console.log('   ⚠️  No API key configured');
      syncStatus.isRunning = false;
      syncStatus.progress = null;
      return { success: false, message: 'No API key configured' };
    }

    console.log(`   Using API: ${currentConfig.api_base_url}`);
    console.log(`   Rate Card: ${currentConfig.default_rate_card}`);

    // Sync categories first (needed for lookups)
    syncStatus.progress = 'Syncing categories...';
    const storageCategories = await syncStorageCategories(db);
    const planCategories = await syncPlanCategories(db);

    // Create lookup maps
    const storageCategoriesMap = {};
    storageCategories.forEach(cat => { storageCategoriesMap[cat.id] = cat.name; });

    const planCategoriesMap = {};
    planCategories.forEach(cat => { planCategoriesMap[cat.id] = cat.name; });

    // Sync other data in parallel where possible
    syncStatus.progress = 'Syncing base data...';
    const [rateCards, billingCycles, products, licences, operatingSystems, templates, unitPricings] = await Promise.all([
      syncRateCards(db),
      syncBillingCycles(db),
      syncProducts(db),
      syncLicences(db),
      syncOperatingSystems(db),
      syncTemplates(db),
      syncUnitPricings(db),
    ]);

    // Sync services
    syncStatus.progress = 'Syncing services...';
    const services = await syncServices(db);

    // Sync plans (depends on services and categories)
    syncStatus.progress = 'Syncing plans...';
    const plans = await syncPlans(db, services, storageCategoriesMap, planCategoriesMap);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Cloud4India API sync completed in ${duration}s`);

    syncStatus.isRunning = false;
    syncStatus.lastSyncAt = new Date().toISOString();
    syncStatus.lastError = null;
    syncStatus.progress = null;

    return {
      success: true,
      duration: `${duration}s`,
      counts: {
        services: services.length,
        plans: plans.length,
        rateCards: rateCards.length,
        billingCycles: billingCycles.length,
        products: products.length,
        licences: licences.length,
        operatingSystems: operatingSystems.length,
        templates: templates.length,
        storageCategories: storageCategories.length,
        planCategories: planCategories.length,
        unitPricings: unitPricings.length,
      },
    };
  } catch (error) {
    console.error('❌ Cloud4India API sync failed:', error.message);
    syncStatus.isRunning = false;
    syncStatus.lastError = error.message;
    syncStatus.progress = null;

    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get last sync time for a cache key
 */
function getLastSyncTime(db, cacheKey) {
  return new Promise((resolve, reject) => {
    db.get('SELECT last_synced_at FROM api_cache_metadata WHERE cache_key = ?', [cacheKey], (err, row) => {
      if (err) reject(err);
      else resolve(row?.last_synced_at || null);
    });
  });
}

/**
 * Check if sync is needed based on max age
 */
async function shouldSync(db, cacheKey, maxAgeMinutes = 15) {
  const lastSync = await getLastSyncTime(db, cacheKey);
  if (!lastSync) return true;

  const lastSyncTime = new Date(lastSync).getTime();
  const now = Date.now();
  const ageMinutes = (now - lastSyncTime) / 1000 / 60;

  return ageMinutes >= maxAgeMinutes;
}

/**
 * Get current sync status
 */
function getSyncStatus() {
  return { ...syncStatus };
}

/**
 * Get all cached data for frontend
 */
function getAllCachedData(db) {
  return new Promise((resolve, reject) => {
    const result = {
      services: [],
      plansByService: {},
      rateCards: [],
      billingCycles: [],
      products: [],
      licences: [],
      operatingSystems: [],
      templates: [],
      storageCategories: [],
      planCategories: [],
      unitPricings: [],
      pricingSettings: null,
      lastFetched: null,
    };

    const queries = [
      { key: 'services', sql: 'SELECT * FROM cached_services ORDER BY name' },
      { key: 'plans', sql: 'SELECT * FROM cached_plans ORDER BY service_name, name' },
      { key: 'rateCards', sql: 'SELECT * FROM cached_rate_cards ORDER BY name' },
      { key: 'billingCycles', sql: 'SELECT * FROM cached_billing_cycles ORDER BY sort_order' },
      { key: 'products', sql: 'SELECT * FROM cached_products ORDER BY name' },
      { key: 'licences', sql: 'SELECT * FROM cached_licences ORDER BY name' },
      { key: 'operatingSystems', sql: 'SELECT * FROM cached_operating_systems ORDER BY name' },
      { key: 'templates', sql: 'SELECT * FROM cached_templates ORDER BY name' },
      { key: 'storageCategories', sql: 'SELECT * FROM cached_storage_categories ORDER BY name' },
      { key: 'planCategories', sql: 'SELECT * FROM cached_plan_categories ORDER BY sort_order' },
      { key: 'unitPricings', sql: 'SELECT * FROM cached_unit_pricings ORDER BY cloud_provider_name' },
      { key: 'pricingSettings', sql: 'SELECT * FROM pricing_settings WHERE id = 1' },
      { key: 'metadata', sql: 'SELECT * FROM api_cache_metadata ORDER BY cache_key' },
    ];

    let completed = 0;

    for (const q of queries) {
      db.all(q.sql, [], (err, rows) => {
        if (err) {
          console.error(`Error fetching ${q.key}:`, err.message);
          rows = [];
        }

        if (q.key === 'plans') {
          // Group plans by service
          for (const plan of rows) {
            // Parse JSON fields
            if (plan.attribute && typeof plan.attribute === 'string') {
              try { plan.attribute = JSON.parse(plan.attribute); } catch (e) {}
            }
            if (plan.prices && typeof plan.prices === 'string') {
              try { plan.prices = JSON.parse(plan.prices); } catch (e) {}
            }

            if (!result.plansByService[plan.service_name]) {
              result.plansByService[plan.service_name] = [];
            }
            result.plansByService[plan.service_name].push(plan);
          }
        } else if (q.key === 'metadata') {
          // Find the most recent sync time
          for (const meta of rows) {
            if (meta.last_synced_at) {
              if (!result.lastFetched || new Date(meta.last_synced_at) > new Date(result.lastFetched)) {
                result.lastFetched = meta.last_synced_at;
              }
            }
          }
        } else if (q.key === 'services') {
          // Parse JSON fields in services
          result.services = rows.map(svc => {
            if (svc.config && typeof svc.config === 'string') {
              try { svc.config = JSON.parse(svc.config); } catch (e) {}
            }
            return svc;
          });
        } else if (q.key === 'products' || q.key === 'licences') {
          // Parse JSON fields
          result[q.key] = rows.map(item => {
            if (item.prices && typeof item.prices === 'string') {
              try { item.prices = JSON.parse(item.prices); } catch (e) {}
            }
            return item;
          });
        } else if (q.key === 'templates') {
          // Parse JSON fields in templates
          result.templates = rows.map(tmpl => {
            if (tmpl.operating_system && typeof tmpl.operating_system === 'string') {
              try { tmpl.operating_system = JSON.parse(tmpl.operating_system); } catch (e) {}
            }
            return tmpl;
          });
        } else if (q.key === 'unitPricings') {
          // Parse JSON raw_data field in unit pricings
          result.unitPricings = rows.map(up => {
            if (up.raw_data && typeof up.raw_data === 'string') {
              try { up.raw_data = JSON.parse(up.raw_data); } catch (e) {}
            }
            return up;
          });
        } else if (q.key === 'pricingSettings') {
          // Parse JSON fields in pricing settings
          const row = rows && rows[0];
          if (row) {
            result.pricingSettings = {
              gst_rate: row.gst_rate,
              currency_rates: typeof row.currency_rates === 'string' ? JSON.parse(row.currency_rates) : row.currency_rates,
              billing_discounts: typeof row.billing_discounts === 'string' ? JSON.parse(row.billing_discounts) : row.billing_discounts,
              default_unit_rates: typeof row.default_unit_rates === 'string' ? JSON.parse(row.default_unit_rates) : row.default_unit_rates,
            };
          }
        } else {
          result[q.key] = rows;
        }

        completed++;
        if (completed === queries.length) {
          // Convert lastFetched to timestamp for compatibility
          if (result.lastFetched) {
            result.lastFetched = new Date(result.lastFetched).getTime();
          }
          resolve(result);
        }
      });
    }
  });
}

/**
 * Get detailed sync status with table counts
 */
function getDetailedSyncStatus(db) {
  return new Promise((resolve, reject) => {
    const status = getSyncStatus();
    const tables = {};

    const tableQueries = [
      { key: 'services', table: 'cached_services' },
      { key: 'plans', table: 'cached_plans' },
      { key: 'rateCards', table: 'cached_rate_cards' },
      { key: 'billingCycles', table: 'cached_billing_cycles' },
      { key: 'products', table: 'cached_products' },
      { key: 'licences', table: 'cached_licences' },
      { key: 'templates', table: 'cached_templates' },
      { key: 'storageCategories', table: 'cached_storage_categories' },
      { key: 'planCategories', table: 'cached_plan_categories' },
      { key: 'operatingSystems', table: 'cached_operating_systems' },
      { key: 'unitPricings', table: 'cached_unit_pricings' },
    ];

    let completed = 0;

    // Get metadata first
    db.all('SELECT * FROM api_cache_metadata', [], (err, metadata) => {
      if (err) metadata = [];

      const metaMap = {};
      for (const m of metadata) {
        metaMap[m.cache_key] = m;
      }

      for (const q of tableQueries) {
        db.get(`SELECT COUNT(*) as count FROM ${q.table}`, [], (err, row) => {
          const meta = metaMap[q.key.replace(/([A-Z])/g, '_$1').toLowerCase()] ||
                       metaMap[q.key] || {};

          tables[q.key] = {
            count: row?.count || 0,
            lastUpdated: meta.last_synced_at || null,
            status: meta.sync_status || 'pending',
            error: meta.error_message || null,
          };

          completed++;
          if (completed === tableQueries.length) {
            // Calculate next sync time based on config
            const syncInterval = currentConfig?.sync_interval_minutes || ENV_SYNC_INTERVAL;
            let nextSyncAt = null;
            if (status.lastSyncAt) {
              const lastSync = new Date(status.lastSyncAt);
              nextSyncAt = new Date(lastSync.getTime() + syncInterval * 60 * 1000).toISOString();
            }

            resolve({
              isRunning: status.isRunning,
              lastSyncAt: status.lastSyncAt,
              nextSyncAt,
              lastError: status.lastError,
              progress: status.progress,
              tables,
              syncInterval: `${syncInterval} minutes`,
              apiUrl: currentConfig?.api_base_url || ENV_API_BASE,
              isEnabled: currentConfig?.is_enabled !== 0,
            });
          }
        });
      }
    });
  });
}

module.exports = {
  syncAllData,
  syncServices,
  syncPlans,
  syncTemplates,
  syncUnitPricings,
  getLastSyncTime,
  shouldSync,
  getSyncStatus,
  getAllCachedData,
  getDetailedSyncStatus,
  getApiConfig,
  testApiConnection,
  updateApiConfigTestStatus,
};
