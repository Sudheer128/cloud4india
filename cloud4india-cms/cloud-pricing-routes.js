/**
 * Cloud Pricing API Routes
 * Endpoints for serving cached Cloud4India pricing data
 */

const {
  syncAllData,
  getAllCachedData,
  getDetailedSyncStatus,
  shouldSync,
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
  // ========================================
  app.get('/api/cloud-pricing/data', async (req, res) => {
    try {
      const data = await getAllCachedData(db);

      // Check if we have any data
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
    db.all('SELECT * FROM cached_services ORDER BY name', [], (err, rows) => {
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
