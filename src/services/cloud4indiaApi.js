/**
 * Cloud4India API Service
 * Fetches pricing data from CMS cache (primary) or direct API (fallback)
 */

// CMS URL for cached data (primary source - fast, local)
const CMS_BASE = import.meta.env.VITE_CMS_URL || 'http://38.242.248.213:4002';

// Direct API URL (fallback if CMS cache is unavailable)
const API_BASE = import.meta.env.VITE_CLOUD4INDIA_API_URL || 'https://portal.cloud4india.com/backend/api';
const API_KEY = import.meta.env.VITE_CLOUD4INDIA_API_KEY;
const DEFAULT_RATE_CARD = 'default';

// Cache for API data
let apiCache = {
  services: null,
  rateCards: null,
  billingCycles: null,
  products: null,
  licences: null,
  operatingSystems: null,
  templates: null,
  storageCategories: null,
  planCategories: null,
  plansByService: {},
  lastFetched: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (shorter since CMS cache is fast)

/**
 * Helper to fetch from CMS cached data
 */
async function fetchFromCmsCache() {
  try {
    const response = await fetch(`${CMS_BASE}/api/cloud-pricing/data`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`CMS cache error: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching from CMS cache:', error);
    return null;
  }
}

/**
 * Helper to fetch from direct API (fallback)
 */
async function fetchAPI(endpoint) {
  if (!API_KEY) {
    console.warn('Cloud4India API key not configured');
    return null;
  }

  try {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText} for ${endpoint}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    return null;
  }
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
    return 'compute';
  }

  if (lowerName.includes('storage') || lowerSlug.includes('storage') ||
      lowerName.includes('nvme') || lowerSlug.includes('nvme') ||
      lowerName.includes('snapshot') || lowerSlug.includes('snapshot') ||
      lowerName.includes('template') || lowerSlug.includes('template') ||
      lowerName.includes('iso') || lowerSlug.includes('iso')) {
    return 'storage';
  }

  if (lowerName.includes('router') || lowerSlug.includes('router') ||
      lowerName.includes('vpc') || lowerSlug.includes('vpc') ||
      lowerName.includes('ip address') || lowerSlug.includes('ip-address') ||
      lowerName.includes('load balancer') || lowerSlug.includes('load-balancer') ||
      lowerName.includes('bandwidth') || lowerSlug.includes('bandwidth') ||
      lowerName.includes('network') || lowerSlug.includes('network') ||
      lowerName.includes('vnf') || lowerSlug.includes('vnf')) {
    return 'network';
  }

  if (lowerName.includes('backup') || lowerSlug.includes('backup')) {
    return 'backup';
  }

  if (lowerName.includes('licence') || lowerSlug.includes('licence') ||
      lowerName.includes('license') || lowerSlug.includes('license')) {
    return 'security';
  }

  if (lowerName.includes('monitoring') || lowerSlug.includes('monitoring')) {
    return 'monitoring';
  }

  if (lowerName.includes('addon') || lowerSlug.includes('addon') ||
      lowerName.includes('marketplace') || lowerSlug.includes('marketplace') ||
      lowerName.includes('pool card') || lowerSlug.includes('pool-card') ||
      lowerName.includes('dns') || lowerSlug.includes('dns')) {
    return 'marketplace';
  }

  return 'other';
}

/**
 * Get icon for service category
 */
function getCategoryIcon(category) {
  const icons = {
    'compute': '',
    'storage': '',
    'network': '',
    'backup': '',
    'security': '',
    'monitoring': '',
    'marketplace': '',
    'other': '',
  };
  return icons[category] || '';
}

/**
 * Get category display name
 */
function getCategoryName(category) {
  const names = {
    'compute': 'Compute',
    'storage': 'Storage',
    'network': 'Networking',
    'backup': 'Backup & Recovery',
    'security': 'Security & Licensing',
    'monitoring': 'Monitoring',
    'marketplace': 'Marketplace & Add-ons',
    'other': 'Other Services',
  };
  return names[category] || 'Other Services';
}

/**
 * Transform cached service data to expected format
 */
function transformCachedService(svc) {
  const category = svc.category || categorizeService(svc.name, svc.slug);
  return {
    id: svc.id,
    name: svc.name,
    slug: svc.slug || svc.name.toLowerCase().replace(/\s+/g, '-'),
    status: svc.status,
    config: svc.config || {},
    billing_rule: svc.billing_rule,
    category: category,
    categoryIcon: getCategoryIcon(category),
    categoryName: svc.category_name || getCategoryName(category),
    planCount: svc.plan_count || 0,
  };
}

/**
 * Transform cached plan data to expected format
 */
function transformCachedPlan(plan) {
  return {
    id: plan.id,
    name: plan.name,
    slug: plan.slug,
    service: plan.service_name,
    status: plan.status,
    cpu: plan.cpu || 0,
    memory: plan.memory || 0,
    storage: plan.storage || 0,
    size: plan.size || 0,
    bandwidth: plan.bandwidth || 0,
    bucket_limit: plan.bucket_limit || 0,
    network_rate: plan.network_rate || 0,
    data_transfer_out: plan.data_transfer_out || 0,
    hourly_price: plan.hourly_price || 0,
    monthly_price: plan.monthly_price || 0,
    yearly_price: plan.yearly_price || 0,
    plan_category_id: plan.plan_category_id,
    plan_category_name: plan.plan_category_name,
    storage_category_id: plan.storage_category_id,
    storage_category_name: plan.storage_category_name,
    attribute: plan.attribute || {},
    prices: plan.prices || [],
  };
}

/**
 * Fetch all cloud services
 */
export async function fetchServices() {
  const response = await fetchAPI('/admin/cloud-provider-services?limit=200');

  if (!response?.data) return [];

  const serviceMap = new Map();
  for (const svc of response.data) {
    if (svc.name && typeof svc.name === 'string' && !serviceMap.has(svc.name)) {
      const category = categorizeService(svc.name, svc.slug || '');
      serviceMap.set(svc.name, {
        id: svc.id,
        name: svc.name,
        slug: svc.slug || svc.name.toLowerCase().replace(/\s+/g, '-'),
        status: svc.status,
        config: svc.config || {},
        billing_rule: svc.billing_rule,
        category: category,
        categoryIcon: getCategoryIcon(category),
        categoryName: getCategoryName(category),
        planCount: 0,
      });
    }
  }

  return Array.from(serviceMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Fetch plans for a specific service
 */
export async function fetchServicePlans(serviceName, rateCard = DEFAULT_RATE_CARD, storageCategoriesMap = {}, planCategoriesMap = {}) {
  const response = await fetchAPI(
    `/admin/plans/service/${encodeURIComponent(serviceName)}?planable_type=RateCard&planable=${rateCard}&include=prices&limit=500`
  );

  if (!response?.data) return [];

  return response.data.filter(plan => plan.status).map(plan => {
    const attr = plan.attribute || {};
    const storageCategoryName = storageCategoriesMap[plan.storage_category_id] || 'NVMe';
    const planCategoryName = planCategoriesMap[plan.plan_category_id] || null;

    const yearlyFromApi = plan.prices?.find(p => p.billing_cycle?.slug === 'yearly')?.amount;
    const yearlyPrice = yearlyFromApi ? parseFloat(yearlyFromApi) : (parseFloat(plan.monthly_price) * 12 * 0.9);

    return {
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      service: serviceName,
      status: plan.status,
      cpu: attr.cpu || attr.formatted_cpu || 0,
      memory: attr.memory || 0,
      storage: attr.storage || attr.size || parseInt(plan.name) || 0,
      size: attr.size || attr.storage || parseInt(plan.name) || 0,
      bandwidth: attr.bandwidth || attr.data_transfer_out || 0,
      bucket_limit: attr.bucket_limit || 0,
      network_rate: attr.network_rate || 0,
      data_transfer_out: attr.data_transfer_out || 0,
      hourly_price: parseFloat(plan.hourly_price) || 0,
      monthly_price: parseFloat(plan.monthly_price) || 0,
      yearly_price: yearlyPrice,
      plan_category: plan.plan_category,
      plan_category_id: plan.plan_category_id,
      plan_category_name: planCategoryName,
      storage_category: plan.storage_category,
      storage_category_id: plan.storage_category_id,
      storage_category_name: storageCategoryName,
      attribute: attr,
      prices: plan.prices || [],
    };
  });
}

/**
 * Fetch all rate cards
 */
export async function fetchRateCards() {
  const response = await fetchAPI('/admin/rate-cards?limit=100');

  if (!response?.data) return [];

  return response.data.filter(rc => rc.status).map(rc => ({
    id: rc.id,
    name: rc.name,
    slug: rc.slug,
    description: rc.description,
    status: rc.status,
    default: rc.default,
    card_type: rc.card_type,
  }));
}

/**
 * Fetch all billing cycles
 */
export async function fetchBillingCycles() {
  const response = await fetchAPI('/admin/billing-cycles?limit=100');

  if (!response?.data) return [];

  return response.data.map(cycle => ({
    id: cycle.id,
    name: cycle.name,
    slug: cycle.slug,
    description: cycle.description,
    duration: cycle.duration,
    unit: cycle.unit,
    is_enabled: cycle.is_enabled,
    sort_order: cycle.sort_order,
  })).sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Fetch all products (Acronis, M365, etc.)
 */
export async function fetchProducts(rateCard = DEFAULT_RATE_CARD) {
  const response = await fetchAPI(
    `/admin/products?planable_type=RateCard&planable=${rateCard}&limit=200`
  );

  if (!response?.data) return [];

  return response.data.filter(p => p.status !== false).map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    status: product.status,
    prices: product.prices || [],
    monthly_price: product.prices?.find(p => p.billing_cycle?.slug === 'monthly')?.amount ||
                   product.prices?.[1]?.amount ||
                   product.prices?.[0]?.amount || 0,
  }));
}

/**
 * Fetch all licences (Windows, RedHat)
 */
export async function fetchLicences(rateCard = DEFAULT_RATE_CARD) {
  const response = await fetchAPI(
    `/admin/licences?planable_type=RateCard&planable=${rateCard}&limit=200`
  );

  if (!response?.data) return [];

  return response.data.filter(l => l.status !== false).map(licence => ({
    id: licence.id,
    name: licence.name,
    slug: licence.slug,
    pricing_unit: licence.pricing_unit,
    status: licence.status,
    prices: licence.prices || [],
    monthly_price: parseFloat(licence.prices?.[0]?.price) || 0,
  }));
}

/**
 * Fetch all operating systems
 */
export async function fetchOperatingSystems() {
  const response = await fetchAPI('/admin/operating-systems?limit=100');

  if (!response?.data) return [];

  return response.data.filter(os => os.status !== false).map(os => ({
    id: os.id,
    name: os.name,
    slug: os.slug,
    status: os.status,
  }));
}

/**
 * Fetch all templates
 */
export async function fetchTemplates() {
  const response = await fetchAPI('/admin/templates?limit=200');

  if (!response?.data) return [];

  return response.data.map(template => ({
    id: template.id,
    name: template.name,
    slug: template.slug,
    os_type: template.os_type,
    image_type: template.image_type,
    file_type: template.file_type,
    operating_system_id: template.operating_system_id,
    operating_system: template.operating_system,
    operating_system_version: template.operating_system_version,
    market_place_app_version_id: template.market_place_app_version_id,
    icon_url: template.icon_url,
    status: template.status,
  }));
}

/**
 * Fetch storage categories
 */
export async function fetchStorageCategories() {
  const response = await fetchAPI('/admin/storage-categories?limit=100');

  if (!response?.data) return [];

  return response.data.filter(cat => cat.status !== false).map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    status: cat.status,
  }));
}

/**
 * Fetch plan categories
 */
export async function fetchPlanCategories() {
  const response = await fetchAPI('/admin/plan-categories?limit=100');

  if (!response?.data) return [];

  return response.data.filter(cat => cat.status !== false).map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    short_name: cat.short_name,
    status: cat.status,
    sort_order: cat.sort_order,
  })).sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Fetch ALL data - tries CMS cache first, falls back to direct API
 */
export async function fetchAllApiData(rateCard = DEFAULT_RATE_CARD) {
  const now = Date.now();

  // Return cache if still valid
  if (apiCache.lastFetched && (now - apiCache.lastFetched) < CACHE_DURATION) {
    return apiCache;
  }

  console.log('Fetching pricing data...');

  // Try CMS cache first (fast, local)
  try {
    const cmsData = await fetchFromCmsCache();

    if (cmsData && cmsData.services && cmsData.services.length > 0) {
      console.log('Using CMS cached data');

      // Transform CMS data to expected format
      const services = cmsData.services.map(transformCachedService);
      const plansByService = {};

      // Transform plans
      for (const [serviceName, plans] of Object.entries(cmsData.plansByService || {})) {
        plansByService[serviceName] = plans.map(transformCachedPlan);
      }

      // Update plan counts
      for (const service of services) {
        const plans = plansByService[service.name];
        if (plans) {
          service.planCount = plans.length;
        }
      }

      apiCache = {
        services,
        rateCards: cmsData.rateCards || [],
        billingCycles: cmsData.billingCycles || [],
        products: cmsData.products || [],
        licences: cmsData.licences || [],
        operatingSystems: cmsData.operatingSystems || [],
        templates: cmsData.templates || [],
        storageCategories: cmsData.storageCategories || [],
        planCategories: cmsData.planCategories || [],
        plansByService,
        lastFetched: now,
      };

      console.log('CMS cache loaded:', {
        services: services.length,
        plans: Object.values(plansByService).flat().length,
      });

      return apiCache;
    }
  } catch (error) {
    console.warn('CMS cache unavailable, falling back to direct API:', error.message);
  }

  // Fallback to direct API calls
  console.log('Fetching from Cloud4India API directly...');

  try {
    const [
      services,
      rateCards,
      billingCycles,
      products,
      licences,
      operatingSystems,
      templates,
      storageCategories,
      planCategories,
    ] = await Promise.all([
      fetchServices(),
      fetchRateCards(),
      fetchBillingCycles(),
      fetchProducts(rateCard),
      fetchLicences(rateCard),
      fetchOperatingSystems(),
      fetchTemplates(),
      fetchStorageCategories(),
      fetchPlanCategories(),
    ]);

    console.log(`Found ${services.length} services`);

    const storageCategoriesMap = {};
    storageCategories.forEach(cat => {
      storageCategoriesMap[cat.id] = cat.name;
    });

    const planCategoriesMap = {};
    planCategories.forEach(cat => {
      planCategoriesMap[cat.id] = cat.name;
    });

    const plansByService = {};
    for (const service of services) {
      const plans = await fetchServicePlans(service.name, rateCard, storageCategoriesMap, planCategoriesMap);
      plansByService[service.name] = plans;
      service.planCount = plans.length;
    }

    apiCache = {
      services,
      rateCards,
      billingCycles,
      products,
      licences,
      operatingSystems,
      templates,
      storageCategories,
      planCategories,
      plansByService,
      lastFetched: now,
    };

    console.log('API data fetch complete:', {
      services: services.length,
      rateCards: rateCards.length,
      billingCycles: billingCycles.length,
      products: products.length,
      licences: licences.length,
      operatingSystems: operatingSystems.length,
      templates: templates.length,
    });

    return apiCache;
  } catch (error) {
    console.error('Error fetching all API data:', error);
    return apiCache;
  }
}

/**
 * Get services grouped by category
 */
export async function getServicesGroupedByCategory(rateCard = DEFAULT_RATE_CARD) {
  const data = await fetchAllApiData(rateCard);

  const groups = {};
  for (const service of data.services) {
    const category = service.category || 'other';
    if (!groups[category]) {
      groups[category] = {
        name: getCategoryName(category),
        icon: getCategoryIcon(category),
        services: [],
      };
    }
    groups[category].services.push(service);
  }

  const categoryOrder = ['compute', 'storage', 'network', 'backup', 'security', 'monitoring', 'marketplace', 'other'];
  const sortedGroups = {};
  for (const cat of categoryOrder) {
    if (groups[cat]) {
      sortedGroups[cat] = groups[cat];
    }
  }

  return sortedGroups;
}

/**
 * Clear cache (for manual refresh)
 */
export function clearCache() {
  apiCache = {
    services: null,
    rateCards: null,
    billingCycles: null,
    products: null,
    licences: null,
    operatingSystems: null,
    templates: null,
    storageCategories: null,
    planCategories: null,
    plansByService: {},
    lastFetched: null,
  };
}

/**
 * Get sync status from CMS
 */
export async function getSyncStatus() {
  try {
    const response = await fetch(`${CMS_BASE}/api/cloud-pricing/sync-status`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching sync status:', error);
    return null;
  }
}

/**
 * Trigger manual sync
 */
export async function triggerSync() {
  try {
    const response = await fetch(`${CMS_BASE}/api/cloud-pricing/sync`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }
    // Clear local cache to force refetch
    clearCache();
    return await response.json();
  } catch (error) {
    console.error('Error triggering sync:', error);
    throw error;
  }
}

export default {
  fetchServices,
  fetchServicePlans,
  fetchRateCards,
  fetchBillingCycles,
  fetchProducts,
  fetchLicences,
  fetchOperatingSystems,
  fetchTemplates,
  fetchStorageCategories,
  fetchPlanCategories,
  fetchAllApiData,
  getServicesGroupedByCategory,
  clearCache,
  getSyncStatus,
  triggerSync,
};
