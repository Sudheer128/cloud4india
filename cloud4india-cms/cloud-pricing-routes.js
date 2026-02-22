/**
 * Cloud Pricing API Routes
 * Endpoints for serving cached Cloud4India pricing data
 */

const {
  syncAllData,
  getAllCachedData,
  getDetailedSyncStatus,
  shouldSync,
  getApiConfig,
  testApiConnection,
  updateApiConfigTestStatus,
} = require('./services/cloud4india-sync');

// Sync interval from environment (default 15 minutes)
const SYNC_INTERVAL_MINUTES = parseInt(process.env.CLOUD4INDIA_SYNC_INTERVAL) || 15;

let cronJob = null;

/**
 * Initialize Cloud Pricing routes
 */
function initCloudPricingRoutes(app, db) {
  console.log('Initializing Cloud Pricing routes...');

  // ========================================
  // GET /api/cloud-pricing/data
  // Returns all cached pricing data for frontend
  // Strategy: Always serve cached data if available (even if stale)
  // Only fail if absolutely no data exists in cache
  // ========================================
  app.get('/api/cloud-pricing/data', async (req, res) => {
    try {
      const data = await getAllCachedData(db);

      // Check if we have any cached data at all
      if (!data.services || data.services.length === 0) {
        // No data cached yet, try to sync first
        console.log('No cached data found, triggering initial sync...');
        const syncResult = await syncAllData(db);

        if (syncResult.success) {
          // Retry getting data after sync
          const freshData = await getAllCachedData(db);
          return res.json(freshData);
        } else {
          return res.status(503).json({
            error: 'No cached data available and sync failed',
            message: syncResult.error || 'Unable to fetch data from Cloud4India API',
          });
        }
      }

      // We have cached data! Always return it, even if it might be stale
      // This ensures the frontend always shows pricing, even if the API is down
      // The background sync job will update the cache when API becomes available
      res.json(data);
    } catch (error) {
      console.error('Error fetching cloud pricing data:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ========================================
  // GET /api/cloud-pricing/sync-status
  // Returns detailed sync status with table counts
  // ========================================
  app.get('/api/cloud-pricing/sync-status', async (req, res) => {
    try {
      const status = await getDetailedSyncStatus(db);
      res.json(status);
    } catch (error) {
      console.error('Error fetching sync status:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ========================================
  // POST /api/cloud-pricing/sync
  // Trigger manual sync (admin only)
  // ========================================
  app.post('/api/cloud-pricing/sync', async (req, res) => {
    try {
      console.log('Manual sync triggered via API');
      const result = await syncAllData(db);
      res.json(result);
    } catch (error) {
      console.error('Error during manual sync:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ========================================
  // GET /api/cloud-pricing/services
  // Returns cached services list
  // ========================================
  app.get('/api/cloud-pricing/services', (req, res) => {
    db.all('SELECT * FROM cached_services ORDER BY display_order ASC, name ASC', [], (err, rows) => {
      if (err) {
        console.error('Error fetching services:', err);
        return res.status(500).json({ error: err.message });
      }

      // Parse JSON fields
      const services = rows.map(svc => {
        if (svc.config && typeof svc.config === 'string') {
          try { svc.config = JSON.parse(svc.config); } catch (e) {}
        }
        return svc;
      });

      res.json(services);
    });
  });

  // ========================================
  // GET /api/cloud-pricing/plans/:serviceName
  // Returns cached plans for a specific service
  // ========================================
  app.get('/api/cloud-pricing/plans/:serviceName', (req, res) => {
    const serviceName = req.params.serviceName;

    db.all(
      'SELECT * FROM cached_plans WHERE service_name = ? ORDER BY name',
      [serviceName],
      (err, rows) => {
        if (err) {
          console.error('Error fetching plans:', err);
          return res.status(500).json({ error: err.message });
        }

        // Parse JSON fields
        const plans = rows.map(plan => {
          if (plan.attribute && typeof plan.attribute === 'string') {
            try { plan.attribute = JSON.parse(plan.attribute); } catch (e) {}
          }
          if (plan.prices && typeof plan.prices === 'string') {
            try { plan.prices = JSON.parse(plan.prices); } catch (e) {}
          }
          return plan;
        });

        res.json(plans);
      }
    );
  });

  // ========================================
  // GET /api/cloud-pricing/service-order
  // Returns services with display_order for admin reordering
  // ========================================
  app.get('/api/cloud-pricing/service-order', (req, res) => {
    db.all(
      'SELECT id, name, slug, category, category_name, plan_count, display_order FROM cached_services ORDER BY display_order ASC, name ASC',
      [],
      (err, rows) => {
        if (err) {
          console.error('Error fetching service order:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
      }
    );
  });

  // ========================================
  // PUT /api/cloud-pricing/service-order
  // Update display order for services
  // Accepts { order: [{ id, display_order }, ...] }
  // ========================================
  app.put('/api/cloud-pricing/service-order', (req, res) => {
    const { order } = req.body;

    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'order must be an array' });
    }

    // If empty array, reset all to 0
    if (order.length === 0) {
      db.run('UPDATE cached_services SET display_order = 0', [], function(err) {
        if (err) {
          console.error('Error resetting service order:', err);
          return res.status(500).json({ error: err.message });
        }
        return res.json({ success: true, message: 'Service order reset to default' });
      });
      return;
    }

    db.serialize(() => {
      const stmt = db.prepare('UPDATE cached_services SET display_order = ? WHERE id = ?');
      let errors = 0;

      for (const item of order) {
        if (item.id !== undefined && item.display_order !== undefined) {
          stmt.run([item.display_order, item.id], (err) => {
            if (err) {
              console.error('Error updating display_order:', err);
              errors++;
            }
          });
        }
      }

      stmt.finalize((err) => {
        if (err || errors > 0) {
          return res.status(500).json({ error: 'Some updates failed' });
        }
        res.json({ success: true, message: `Service order updated for ${order.length} services` });
      });
    });
  });

  // ========================================
  // GET /api/cloud-pricing/templates
  // Returns cached templates
  // ========================================
  app.get('/api/cloud-pricing/templates', (req, res) => {
    db.all('SELECT * FROM cached_templates ORDER BY name', [], (err, rows) => {
      if (err) {
        console.error('Error fetching templates:', err);
        return res.status(500).json({ error: err.message });
      }

      // Parse JSON fields
      const templates = rows.map(tmpl => {
        if (tmpl.operating_system && typeof tmpl.operating_system === 'string') {
          try { tmpl.operating_system = JSON.parse(tmpl.operating_system); } catch (e) {}
        }
        return tmpl;
      });

      res.json(templates);
    });
  });

  // ========================================
  // GET /api/cloud-pricing/products
  // Returns cached products
  // ========================================
  app.get('/api/cloud-pricing/products', (req, res) => {
    db.all('SELECT * FROM cached_products ORDER BY name', [], (err, rows) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ error: err.message });
      }

      // Parse JSON fields
      const products = rows.map(p => {
        if (p.prices && typeof p.prices === 'string') {
          try { p.prices = JSON.parse(p.prices); } catch (e) {}
        }
        return p;
      });

      res.json(products);
    });
  });

  // ========================================
  // GET /api/cloud-pricing/licences
  // Returns cached licences
  // ========================================
  app.get('/api/cloud-pricing/licences', (req, res) => {
    db.all('SELECT * FROM cached_licences ORDER BY name', [], (err, rows) => {
      if (err) {
        console.error('Error fetching licences:', err);
        return res.status(500).json({ error: err.message });
      }

      // Parse JSON fields
      const licences = rows.map(l => {
        if (l.prices && typeof l.prices === 'string') {
          try { l.prices = JSON.parse(l.prices); } catch (e) {}
        }
        return l;
      });

      res.json(licences);
    });
  });

  // ========================================
  // GET /api/cloud-pricing/unit-pricings
  // Returns cached unit pricings (per-unit rates)
  // ========================================
  app.get('/api/cloud-pricing/unit-pricings', (req, res) => {
    db.all('SELECT * FROM cached_unit_pricings ORDER BY cloud_provider_name', [], (err, rows) => {
      if (err) {
        console.error('Error fetching unit pricings:', err);
        return res.status(500).json({ error: err.message });
      }

      // Parse JSON fields
      const unitPricings = rows.map(up => {
        if (up.raw_data && typeof up.raw_data === 'string') {
          try { up.raw_data = JSON.parse(up.raw_data); } catch (e) {}
        }
        return up;
      });

      res.json(unitPricings);
    });
  });

  // ========================================
  // GET /api/cloud-pricing/pricing-settings
  // Returns pricing settings (GST, currency rates, discounts, default unit rates)
  // ========================================
  app.get('/api/cloud-pricing/pricing-settings', (req, res) => {
    db.get('SELECT * FROM pricing_settings WHERE id = 1', [], (err, row) => {
      if (err) {
        console.error('Error fetching pricing settings:', err);
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.json({
          gst_rate: 18,
          currency_rates: { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 },
          billing_discounts: { yearly: 0.9, 'bi-annually': 0.85, 'tri-annually': 0.8 },
          default_unit_rates: { cpu: 200, memory: 100, storage: 8, ip: 150 },
        });
      }

      // Parse JSON fields
      const settings = {
        gst_rate: row.gst_rate,
        currency_rates: typeof row.currency_rates === 'string' ? JSON.parse(row.currency_rates) : row.currency_rates,
        billing_discounts: typeof row.billing_discounts === 'string' ? JSON.parse(row.billing_discounts) : row.billing_discounts,
        default_unit_rates: typeof row.default_unit_rates === 'string' ? JSON.parse(row.default_unit_rates) : row.default_unit_rates,
      };

      res.json(settings);
    });
  });

  // ========================================
  // PUT /api/admin/pricing-settings
  // Update pricing settings
  // ========================================
  app.put('/api/admin/pricing-settings', (req, res) => {
    const { gst_rate, currency_rates, billing_discounts, default_unit_rates } = req.body;

    const updates = [];
    const values = [];

    if (gst_rate !== undefined) {
      updates.push('gst_rate = ?');
      values.push(gst_rate);
    }
    if (currency_rates !== undefined) {
      updates.push('currency_rates = ?');
      values.push(typeof currency_rates === 'string' ? currency_rates : JSON.stringify(currency_rates));
    }
    if (billing_discounts !== undefined) {
      updates.push('billing_discounts = ?');
      values.push(typeof billing_discounts === 'string' ? billing_discounts : JSON.stringify(billing_discounts));
    }
    if (default_unit_rates !== undefined) {
      updates.push('default_unit_rates = ?');
      values.push(typeof default_unit_rates === 'string' ? default_unit_rates : JSON.stringify(default_unit_rates));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    const sql = `UPDATE pricing_settings SET ${updates.join(', ')} WHERE id = 1`;

    db.run(sql, values, function(err) {
      if (err) {
        console.error('Error updating pricing settings:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, message: 'Pricing settings updated' });
    });
  });

  // ========================================
  // GET /api/admin/api-config
  // Returns current API configuration (with masked API key)
  // ========================================
  app.get('/api/admin/api-config', async (req, res) => {
    try {
      const config = await getApiConfig(db);

      // Mask API key - only show last 4 characters
      let maskedApiKey = '';
      if (config.api_key) {
        const key = config.api_key;
        if (key.length > 4) {
          maskedApiKey = '*'.repeat(key.length - 4) + key.slice(-4);
        } else {
          maskedApiKey = '****';
        }
      }

      res.json({
        name: config.name || 'Cloud4India API',
        api_base_url: config.api_base_url,
        api_key_masked: maskedApiKey,
        has_api_key: !!config.api_key,
        default_rate_card: config.default_rate_card,
        sync_interval_minutes: config.sync_interval_minutes,
        is_enabled: config.is_enabled,
        last_tested_at: config.last_tested_at,
        test_status: config.test_status,
      });
    } catch (error) {
      console.error('Error fetching API config:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ========================================
  // PUT /api/admin/api-config
  // Update API configuration
  // ========================================
  app.put('/api/admin/api-config', (req, res) => {
    const {
      name,
      api_base_url,
      api_key,
      default_rate_card,
      sync_interval_minutes,
      is_enabled,
    } = req.body;

    // Build update query dynamically (only update provided fields)
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (api_base_url !== undefined) {
      updates.push('api_base_url = ?');
      values.push(api_base_url);
    }
    if (api_key !== undefined) {
      updates.push('api_key = ?');
      values.push(api_key);
    }
    if (default_rate_card !== undefined) {
      updates.push('default_rate_card = ?');
      values.push(default_rate_card);
    }
    if (sync_interval_minutes !== undefined) {
      updates.push('sync_interval_minutes = ?');
      values.push(sync_interval_minutes);
    }
    if (is_enabled !== undefined) {
      updates.push('is_enabled = ?');
      values.push(is_enabled ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    const sql = `UPDATE api_configurations SET ${updates.join(', ')} WHERE id = 1`;

    db.run(sql, values, function(err) {
      if (err) {
        console.error('Error updating API config:', err);
        return res.status(500).json({ error: err.message });
      }

      // If no row was updated, insert default row first
      if (this.changes === 0) {
        db.run(
          `INSERT OR REPLACE INTO api_configurations (id, name, api_base_url, api_key, default_rate_card, sync_interval_minutes, is_enabled) VALUES (1, ?, ?, ?, ?, ?, ?)`,
          [
            name || 'Cloud4India API',
            api_base_url || 'https://portal.cloud4india.com/backend/api',
            api_key || null,
            default_rate_card || 'default',
            sync_interval_minutes || 15,
            is_enabled !== undefined ? (is_enabled ? 1 : 0) : 1,
          ],
          (insertErr) => {
            if (insertErr) {
              console.error('Error inserting API config:', insertErr);
              return res.status(500).json({ error: insertErr.message });
            }
            res.json({ success: true, message: 'API configuration saved' });
          }
        );
      } else {
        res.json({ success: true, message: 'API configuration updated' });
      }
    });
  });

  // ========================================
  // POST /api/admin/api-config/test
  // Test API connection
  // ========================================
  app.post('/api/admin/api-config/test', async (req, res) => {
    try {
      const { api_base_url, api_key } = req.body;

      // Use provided values or fetch from DB
      let testUrl = api_base_url;
      let testKey = api_key;

      if (!testUrl || !testKey) {
        const config = await getApiConfig(db);
        testUrl = testUrl || config.api_base_url;
        testKey = testKey || config.api_key;
      }

      if (!testKey) {
        return res.json({
          success: false,
          error: 'No API key configured',
        });
      }

      const result = await testApiConnection(testUrl, testKey);
      const testedAt = new Date().toISOString();

      // Update test status in database
      await updateApiConfigTestStatus(
        db,
        result.success ? 'success' : 'failed',
        testedAt
      );

      res.json({
        ...result,
        tested_at: testedAt,
      });
    } catch (error) {
      console.error('Error testing API connection:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  console.log('   ✅ Cloud Pricing routes initialized');
}

/**
 * Start background sync scheduler using node-cron
 */
function startBackgroundSync(db) {
  try {
    const cron = require('node-cron');

    // Schedule sync every N minutes (default 15)
    const cronExpression = `*/${SYNC_INTERVAL_MINUTES} * * * *`;
    console.log(`📅 Scheduling Cloud4India API sync every ${SYNC_INTERVAL_MINUTES} minutes`);

    cronJob = cron.schedule(cronExpression, async () => {
      console.log('⏰ Running scheduled Cloud4India API sync...');
      try {
        const result = await syncAllData(db);
        if (result.success) {
          console.log(`   ✅ Scheduled sync completed: ${result.counts?.services || 0} services, ${result.counts?.plans || 0} plans`);
        } else {
          console.error(`   ❌ Scheduled sync failed: ${result.error}`);
        }
      } catch (err) {
        console.error('   ❌ Scheduled sync error:', err.message);
      }
    });

    console.log('   ✅ Background sync scheduler started');
  } catch (err) {
    console.error('   ⚠️  node-cron not available, background sync disabled:', err.message);
    console.log('   Install node-cron: npm install node-cron');
  }
}

/**
 * Run initial sync on startup
 */
async function runInitialSync(db) {
  console.log('🚀 Running initial Cloud4India API sync...');
  try {
    // Check if we need to sync (no data or data is stale)
    const needsSync = await shouldSync(db, 'services', SYNC_INTERVAL_MINUTES);

    if (needsSync) {
      const result = await syncAllData(db);
      if (result.success) {
        console.log(`   ✅ Initial sync completed: ${result.counts?.services || 0} services, ${result.counts?.plans || 0} plans`);
      } else {
        console.error(`   ⚠️  Initial sync failed: ${result.error}`);
      }
    } else {
      console.log('   ✅ Cache is fresh, skipping initial sync');
    }
  } catch (err) {
    console.error('   ⚠️  Initial sync error:', err.message);
  }
}

/**
 * Stop background sync (for cleanup)
 */
function stopBackgroundSync() {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log('Background sync stopped');
  }
}

module.exports = {
  initCloudPricingRoutes,
  startBackgroundSync,
  runInitialSync,
  stopBackgroundSync,
};
