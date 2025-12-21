/**
 * Price Estimator & Quotation API Routes
 * This module adds all API endpoints for the Price Estimator and Quotation system
 */

const crypto = require('crypto');

/**
 * Initialize Price Estimator routes
 * @param {Express} app - Express application instance
 * @param {sqlite3.Database} db - SQLite database instance
 */
function initPriceEstimatorRoutes(app, db) {
    console.log('📊 Initializing Price Estimator API routes...');

    // ============================================================
    // HELPER FUNCTIONS
    // ============================================================

    // Generate unique quote number
    const generateQuoteNumber = (prefix = 'C4I-Q') => {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${prefix}-${year}-${random}`;
    };

    // Generate share token
    const generateShareToken = () => {
        return crypto.randomBytes(32).toString('hex');
    };

    // Parse price string to number (handles ₹ symbol and commas)
    const parsePrice = (priceStr) => {
        if (!priceStr || priceStr === 'N/A' || priceStr === 'Contact Sales') return null;
        const cleaned = priceStr.replace(/[₹,\s]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? null : parsed;
    };

    // ============================================================
    // PRICE ESTIMATOR CONFIG ENDPOINTS
    // ============================================================

    // Get price estimator configuration
    app.get('/api/price-estimator/config', (req, res) => {
        db.get('SELECT * FROM price_estimator_config WHERE id = 1', (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(row || {});
        });
    });

    // Update price estimator configuration
    app.put('/api/price-estimator/config', (req, res) => {
        const fields = [
            'page_title', 'page_subtitle', 'page_description',
            'marketplace_section_title', 'marketplace_section_description',
            'products_section_title', 'products_section_description',
            'solutions_section_title', 'solutions_section_description',
            'enable_approval_workflow', 'approval_notification_email',
            'default_validity_days', 'quote_prefix', 'tax_rate', 'tax_name',
            'show_hourly_pricing', 'show_monthly_pricing', 'show_quarterly_pricing', 'show_yearly_pricing',
            'default_duration', 'cart_bar_background_color', 'cart_bar_text_color', 'add_button_color',
            'assumptions_text', 'terms_text'
        ];

        const updates = [];
        const values = [];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(req.body[field]);
            }
        });

        if (updates.length === 0) {
            res.status(400).json({ error: 'No fields to update' });
            return;
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(1); // For WHERE id = 1

        const sql = `UPDATE price_estimator_config SET ${updates.join(', ')} WHERE id = ?`;

        db.run(sql, values, function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Configuration updated successfully', changes: this.changes });
        });
    });

    // ============================================================
    // ALL ITEMS ENDPOINT (for Price Estimator page)
    // ============================================================

    // Get all priceable items grouped by category
    app.get('/api/price-estimator/all-items', (req, res) => {
        const result = {
            marketplaces: [],
            products: [],
            solutions: [],
            compute_plans: [],
            disk_offerings: []
        };

        // Get marketplaces with pricing sections
        db.all(`
      SELECT 
        m.id, m.name, m.description, m.category, m.route,
        si.id as item_id, si.title as plan_name, si.content as pricing_content
      FROM marketplaces m
      LEFT JOIN marketplace_sections ms ON m.id = ms.marketplace_id AND ms.section_type = 'pricing'
      LEFT JOIN section_items si ON ms.id = si.section_id AND si.item_type = 'pricing_plan'
      WHERE m.is_visible = 1
      ORDER BY m.order_index, si.order_index
    `, (err, rows) => {
            if (err) {
                console.error('Error fetching marketplaces:', err);
            } else {
                // Group by marketplace
                const marketplaceMap = new Map();
                rows.forEach(row => {
                    if (!marketplaceMap.has(row.id)) {
                        marketplaceMap.set(row.id, {
                            id: row.id,
                            name: row.name,
                            description: row.description,
                            category: row.category,
                            route: row.route,
                            plans: []
                        });
                    }
                    if (row.item_id) {
                        let pricingData = {};
                        try {
                            pricingData = row.pricing_content ? JSON.parse(row.pricing_content) : {};
                        } catch (e) { }
                        marketplaceMap.get(row.id).plans.push({
                            item_id: row.item_id,
                            plan_name: row.plan_name,
                            hourly_price: pricingData.hourly_price || null,
                            monthly_price: pricingData.monthly_price || null,
                            quarterly_price: pricingData.quarterly_price || null,
                            yearly_price: pricingData.yearly_price || null,
                            specifications: pricingData.specifications || [],
                            features: pricingData.features || []
                        });
                    }
                });
                result.marketplaces = Array.from(marketplaceMap.values());
            }

            // Get products with pricing sections
            db.all(`
        SELECT 
          p.id, p.name, p.description, p.category, p.route,
          pi.id as item_id, pi.title as plan_name, pi.content as pricing_content
        FROM products p
        LEFT JOIN product_sections ps ON p.id = ps.product_id AND ps.section_type = 'pricing'
        LEFT JOIN product_items pi ON ps.id = pi.section_id AND pi.item_type = 'pricing_plan'
        WHERE p.is_visible = 1
        ORDER BY p.order_index, pi.order_index
      `, (err, rows) => {
                if (err) {
                    console.error('Error fetching products:', err);
                } else {
                    const productMap = new Map();
                    rows.forEach(row => {
                        if (!productMap.has(row.id)) {
                            productMap.set(row.id, {
                                id: row.id,
                                name: row.name,
                                description: row.description,
                                category: row.category,
                                route: row.route,
                                plans: []
                            });
                        }
                        if (row.item_id) {
                            let pricingData = {};
                            try {
                                pricingData = row.pricing_content ? JSON.parse(row.pricing_content) : {};
                            } catch (e) { }
                            productMap.get(row.id).plans.push({
                                item_id: row.item_id,
                                plan_name: row.plan_name,
                                hourly_price: pricingData.hourly_price || null,
                                monthly_price: pricingData.monthly_price || null,
                                quarterly_price: pricingData.quarterly_price || null,
                                yearly_price: pricingData.yearly_price || null,
                                specifications: pricingData.specifications || [],
                                features: pricingData.features || []
                            });
                        }
                    });
                    result.products = Array.from(productMap.values());
                }

                // Get solutions with pricing sections
                db.all(`
          SELECT 
            s.id, s.name, s.description, s.category, s.route,
            si.id as item_id, si.title as plan_name, si.content as pricing_content
          FROM solutions s
          LEFT JOIN solution_sections ss ON s.id = ss.solution_id AND ss.section_type = 'pricing'
          LEFT JOIN solution_items si ON ss.id = si.section_id AND si.item_type = 'pricing_plan'
          WHERE s.is_visible = 1
          ORDER BY s.order_index, si.order_index
        `, (err, rows) => {
                    if (err) {
                        console.error('Error fetching solutions:', err);
                    } else {
                        const solutionMap = new Map();
                        rows.forEach(row => {
                            if (!solutionMap.has(row.id)) {
                                solutionMap.set(row.id, {
                                    id: row.id,
                                    name: row.name,
                                    description: row.description,
                                    category: row.category,
                                    route: row.route,
                                    plans: []
                                });
                            }
                            if (row.item_id) {
                                let pricingData = {};
                                try {
                                    pricingData = row.pricing_content ? JSON.parse(row.pricing_content) : {};
                                } catch (e) { }
                                solutionMap.get(row.id).plans.push({
                                    item_id: row.item_id,
                                    plan_name: row.plan_name,
                                    hourly_price: pricingData.hourly_price || null,
                                    monthly_price: pricingData.monthly_price || null,
                                    quarterly_price: pricingData.quarterly_price || null,
                                    yearly_price: pricingData.yearly_price || null,
                                    specifications: pricingData.specifications || [],
                                    features: pricingData.features || []
                                });
                            }
                        });
                        result.solutions = Array.from(solutionMap.values());
                    }

                    // Get compute plans
                    db.all(`SELECT * FROM compute_plans WHERE is_active = 1 ORDER BY plan_type, order_index`, (err, rows) => {
                        if (err) {
                            console.error('Error fetching compute plans:', err);
                        } else {
                            result.compute_plans = rows || [];
                        }

                        // Get disk offerings
                        db.all(`SELECT * FROM disk_offerings WHERE is_active = 1 ORDER BY order_index`, (err, rows) => {
                            if (err) {
                                console.error('Error fetching disk offerings:', err);
                            } else {
                                result.disk_offerings = rows || [];
                            }

                            res.json(result);
                        });
                    });
                });
            });
        });
    });

    // Get price for a specific item by duration
    app.get('/api/price-estimator/item-price', (req, res) => {
        const { item_id, item_type, duration } = req.query;

        if (!item_id || !item_type || !duration) {
            res.status(400).json({ error: 'Missing required parameters: item_id, item_type, duration' });
            return;
        }

        const durationField = `${duration}_price`;

        switch (item_type) {
            case 'marketplace':
                db.get(`SELECT content FROM section_items WHERE id = ?`, [item_id], (err, row) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    if (!row) {
                        res.status(404).json({ error: 'Item not found' });
                        return;
                    }
                    try {
                        const content = JSON.parse(row.content || '{}');
                        res.json({ price: content[durationField] || null, duration });
                    } catch (e) {
                        res.json({ price: null, duration });
                    }
                });
                break;

            case 'product':
                db.get(`SELECT content FROM product_items WHERE id = ?`, [item_id], (err, row) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    if (!row) {
                        res.status(404).json({ error: 'Item not found' });
                        return;
                    }
                    try {
                        const content = JSON.parse(row.content || '{}');
                        res.json({ price: content[durationField] || null, duration });
                    } catch (e) {
                        res.json({ price: null, duration });
                    }
                });
                break;

            case 'solution':
                db.get(`SELECT content FROM solution_items WHERE id = ?`, [item_id], (err, row) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    if (!row) {
                        res.status(404).json({ error: 'Item not found' });
                        return;
                    }
                    try {
                        const content = JSON.parse(row.content || '{}');
                        res.json({ price: content[durationField] || null, duration });
                    } catch (e) {
                        res.json({ price: null, duration });
                    }
                });
                break;

            case 'compute_plan':
                db.get(`SELECT ${durationField} as price FROM compute_plans WHERE id = ? AND is_active = 1`, [item_id], (err, row) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    res.json({ price: row?.price || null, duration });
                });
                break;

            case 'disk_offering':
                db.get(`SELECT ${durationField} as price FROM disk_offerings WHERE id = ? AND is_active = 1`, [item_id], (err, row) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    res.json({ price: row?.price || null, duration });
                });
                break;

            default:
                res.status(400).json({ error: 'Invalid item_type' });
        }
    });

    // ============================================================
    // QUOTATION CRUD ENDPOINTS
    // ============================================================

    // List all quotations (with filters)
    app.get('/api/quotations', (req, res) => {
        const { status, customer_email, limit = 50, offset = 0 } = req.query;

        let query = 'SELECT * FROM quotations WHERE 1=1';
        const params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (customer_email) {
            query += ' AND customer_email LIKE ?';
            params.push(`%${customer_email}%`);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        db.all(query, params, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            // Get total count
            let countQuery = 'SELECT COUNT(*) as total FROM quotations WHERE 1=1';
            const countParams = [];
            if (status) {
                countQuery += ' AND status = ?';
                countParams.push(status);
            }
            if (customer_email) {
                countQuery += ' AND customer_email LIKE ?';
                countParams.push(`%${customer_email}%`);
            }

            db.get(countQuery, countParams, (err, countRow) => {
                res.json({
                    quotations: rows,
                    total: countRow?.total || 0,
                    limit: parseInt(limit),
                    offset: parseInt(offset)
                });
            });
        });
    });

    // Get single quotation with items
    app.get('/api/quotations/:id', (req, res) => {
        const { id } = req.params;

        db.get('SELECT * FROM quotations WHERE id = ?', [id], (err, quote) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!quote) {
                res.status(404).json({ error: 'Quotation not found' });
                return;
            }

            // Get quote items
            db.all('SELECT * FROM quote_items WHERE quote_id = ? ORDER BY order_index', [id], (err, items) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                // Get activity log
                db.all('SELECT * FROM quote_activity_log WHERE quote_id = ? ORDER BY created_at DESC', [id], (err, activities) => {
                    res.json({
                        ...quote,
                        items: items || [],
                        activities: activities || []
                    });
                });
            });
        });
    });

    // Get quotation by share token (public)
    app.get('/api/quotations/share/:token', (req, res) => {
        const { token } = req.params;

        db.get('SELECT * FROM quotations WHERE share_token = ? AND share_enabled = 1', [token], (err, quote) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!quote) {
                res.status(404).json({ error: 'Quotation not found or sharing disabled' });
                return;
            }

            // Check if quote is expired
            if (quote.valid_until && new Date(quote.valid_until) < new Date()) {
                res.status(410).json({ error: 'This quotation has expired' });
                return;
            }

            // Get quote items
            db.all('SELECT * FROM quote_items WHERE quote_id = ? ORDER BY order_index', [quote.id], (err, items) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                // Get config for terms
                db.get('SELECT assumptions_text, terms_text FROM price_estimator_config WHERE id = 1', (err, config) => {
                    res.json({
                        ...quote,
                        items: items || [],
                        assumptions_text: config?.assumptions_text || '',
                        terms_text: config?.terms_text || ''
                    });
                });
            });
        });
    });

    // Create new quotation
    app.post('/api/quotations', (req, res) => {
        const {
            customer_name, customer_company, customer_email, customer_phone,
            customer_address, customer_gst, validity_days = 30, internal_notes,
            items = [], created_by
        } = req.body;

        // Calculate totals
        let subtotal = 0;
        items.forEach(item => {
            const price = parsePrice(item.unit_price) || 0;
            subtotal += price * (item.quantity || 1);
        });

        // Get config for tax rate
        db.get('SELECT tax_rate, quote_prefix FROM price_estimator_config WHERE id = 1', (err, config) => {
            const taxRate = config?.tax_rate || 18;
            const quotePrefix = config?.quote_prefix || 'C4I-Q';
            const taxAmount = subtotal * (taxRate / 100);
            const grandTotal = subtotal + taxAmount;
            const validUntil = new Date(Date.now() + validity_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const quoteNumber = generateQuoteNumber(quotePrefix);
            const shareToken = generateShareToken();

            db.run(`
        INSERT INTO quotations (
          quote_number, customer_name, customer_company, customer_email,
          customer_phone, customer_address, customer_gst, validity_days,
          valid_until, internal_notes, subtotal, tax_rate, tax_amount,
          grand_total, share_token, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                quoteNumber, customer_name, customer_company, customer_email,
                customer_phone, customer_address, customer_gst, validity_days,
                validUntil, internal_notes, subtotal, taxRate, taxAmount,
                grandTotal, shareToken, created_by
            ], function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                const quoteId = this.lastID;

                // Insert items
                if (items.length > 0) {
                    const itemPromises = items.map((item, index) => {
                        return new Promise((resolve, reject) => {
                            const totalPrice = (parsePrice(item.unit_price) || 0) * (item.quantity || 1);
                            db.run(`
                INSERT INTO quote_items (
                  quote_id, item_id, item_type, item_name, item_description,
                  plan_name, duration, unit_price, quantity, total_price,
                  specifications, features, order_index
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                                quoteId, item.item_id, item.item_type, item.item_name,
                                item.item_description, item.plan_name, item.duration,
                                parsePrice(item.unit_price) || 0, item.quantity || 1, totalPrice,
                                JSON.stringify(item.specifications || []),
                                JSON.stringify(item.features || []),
                                index
                            ], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        });
                    });

                    Promise.all(itemPromises)
                        .then(() => {
                            // Log activity
                            db.run(`
                INSERT INTO quote_activity_log (quote_id, action, new_status, user_name, notes)
                VALUES (?, 'created', 'draft', ?, 'Quotation created')
              `, [quoteId, created_by || 'System']);

                            res.json({
                                message: 'Quotation created successfully',
                                id: quoteId,
                                quote_number: quoteNumber,
                                share_token: shareToken
                            });
                        })
                        .catch(err => {
                            res.status(500).json({ error: err.message });
                        });
                } else {
                    res.json({
                        message: 'Quotation created successfully',
                        id: quoteId,
                        quote_number: quoteNumber,
                        share_token: shareToken
                    });
                }
            });
        });
    });

    // Update quotation
    app.put('/api/quotations/:id', (req, res) => {
        const { id } = req.params;
        const {
            customer_name, customer_company, customer_email, customer_phone,
            customer_address, customer_gst, validity_days, internal_notes, items
        } = req.body;

        // First get existing quote
        db.get('SELECT * FROM quotations WHERE id = ?', [id], (err, existingQuote) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!existingQuote) {
                res.status(404).json({ error: 'Quotation not found' });
                return;
            }

            // Calculate new totals if items provided
            let subtotal = existingQuote.subtotal;
            if (items) {
                subtotal = 0;
                items.forEach(item => {
                    const price = parsePrice(item.unit_price) || 0;
                    subtotal += price * (item.quantity || 1);
                });
            }

            const taxAmount = subtotal * (existingQuote.tax_rate / 100);
            const grandTotal = subtotal + taxAmount;
            const validUntil = validity_days
                ? new Date(Date.now() + validity_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                : existingQuote.valid_until;

            db.run(`
        UPDATE quotations SET
          customer_name = COALESCE(?, customer_name),
          customer_company = COALESCE(?, customer_company),
          customer_email = COALESCE(?, customer_email),
          customer_phone = COALESCE(?, customer_phone),
          customer_address = COALESCE(?, customer_address),
          customer_gst = COALESCE(?, customer_gst),
          validity_days = COALESCE(?, validity_days),
          valid_until = ?,
          internal_notes = COALESCE(?, internal_notes),
          subtotal = ?, tax_amount = ?, grand_total = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
                customer_name, customer_company, customer_email, customer_phone,
                customer_address, customer_gst, validity_days, validUntil,
                internal_notes, subtotal, taxAmount, grandTotal, id
            ], function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                // Update items if provided
                if (items) {
                    // Delete existing items
                    db.run('DELETE FROM quote_items WHERE quote_id = ?', [id], (err) => {
                        if (err) {
                            console.error('Error deleting quote items:', err);
                        }

                        // Insert new items
                        items.forEach((item, index) => {
                            const totalPrice = (parsePrice(item.unit_price) || 0) * (item.quantity || 1);
                            db.run(`
                INSERT INTO quote_items (
                  quote_id, item_id, item_type, item_name, item_description,
                  plan_name, duration, unit_price, quantity, total_price,
                  specifications, features, order_index
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                                id, item.item_id, item.item_type, item.item_name,
                                item.item_description, item.plan_name, item.duration,
                                parsePrice(item.unit_price) || 0, item.quantity || 1, totalPrice,
                                JSON.stringify(item.specifications || []),
                                JSON.stringify(item.features || []),
                                index
                            ]);
                        });
                    });
                }

                res.json({ message: 'Quotation updated successfully', changes: this.changes });
            });
        });
    });

    // Update quotation status
    app.put('/api/quotations/:id/status', (req, res) => {
        const { id } = req.params;
        const { status, user_name, notes, rejection_reason } = req.body;

        const validStatuses = ['draft', 'pending_approval', 'approved', 'sent', 'rejected', 'expired'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ error: 'Invalid status' });
            return;
        }

        db.get('SELECT status FROM quotations WHERE id = ?', [id], (err, quote) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!quote) {
                res.status(404).json({ error: 'Quotation not found' });
                return;
            }

            const oldStatus = quote.status;

            let updateQuery = 'UPDATE quotations SET status = ?, updated_at = CURRENT_TIMESTAMP';
            const params = [status];

            if (status === 'approved') {
                updateQuery += ', approved_by = ?, approved_at = CURRENT_TIMESTAMP';
                params.push(user_name);
            }

            if (status === 'sent') {
                updateQuery += ', sent_at = CURRENT_TIMESTAMP';
            }

            if (status === 'rejected' && rejection_reason) {
                updateQuery += ', rejection_reason = ?';
                params.push(rejection_reason);
            }

            updateQuery += ' WHERE id = ?';
            params.push(id);

            db.run(updateQuery, params, function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                // Log activity
                db.run(`
          INSERT INTO quote_activity_log (quote_id, action, old_status, new_status, user_name, notes)
          VALUES (?, 'status_change', ?, ?, ?, ?)
        `, [id, oldStatus, status, user_name || 'System', notes || `Status changed from ${oldStatus} to ${status}`]);

                res.json({ message: 'Status updated successfully', old_status: oldStatus, new_status: status });
            });
        });
    });

    // Clone quotation
    app.post('/api/quotations/:id/clone', (req, res) => {
        const { id } = req.params;
        const { created_by } = req.body;

        db.get('SELECT * FROM quotations WHERE id = ?', [id], (err, quote) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!quote) {
                res.status(404).json({ error: 'Quotation not found' });
                return;
            }

            // Get config for quote prefix
            db.get('SELECT quote_prefix FROM price_estimator_config WHERE id = 1', (err, config) => {
                const quotePrefix = config?.quote_prefix || 'C4I-Q';
                const newQuoteNumber = generateQuoteNumber(quotePrefix);
                const newShareToken = generateShareToken();
                const newVersion = quote.version + 1;
                const newValidUntil = new Date(Date.now() + quote.validity_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

                db.run(`
          INSERT INTO quotations (
            quote_number, version, parent_quote_id, status,
            customer_name, customer_company, customer_email, customer_phone,
            customer_address, customer_gst, validity_days, valid_until,
            internal_notes, subtotal, tax_rate, tax_amount, discount_amount,
            grand_total, currency, share_token, created_by
          ) VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
                    newQuoteNumber, newVersion, quote.id,
                    quote.customer_name, quote.customer_company, quote.customer_email, quote.customer_phone,
                    quote.customer_address, quote.customer_gst, quote.validity_days, newValidUntil,
                    quote.internal_notes, quote.subtotal, quote.tax_rate, quote.tax_amount, quote.discount_amount,
                    quote.grand_total, quote.currency, newShareToken, created_by
                ], function (err) {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }

                    const newQuoteId = this.lastID;

                    // Clone items
                    db.all('SELECT * FROM quote_items WHERE quote_id = ?', [id], (err, items) => {
                        if (err || !items || items.length === 0) {
                            res.json({
                                message: 'Quotation cloned successfully',
                                id: newQuoteId,
                                quote_number: newQuoteNumber,
                                version: newVersion
                            });
                            return;
                        }

                        items.forEach(item => {
                            db.run(`
                INSERT INTO quote_items (
                  quote_id, item_id, item_type, item_name, item_description,
                  plan_name, duration, unit_price, quantity, total_price,
                  specifications, features, order_index
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                                newQuoteId, item.item_id, item.item_type, item.item_name, item.item_description,
                                item.plan_name, item.duration, item.unit_price, item.quantity, item.total_price,
                                item.specifications, item.features, item.order_index
                            ]);
                        });

                        // Log activity
                        db.run(`
              INSERT INTO quote_activity_log (quote_id, action, new_status, user_name, notes)
              VALUES (?, 'cloned', 'draft', ?, ?)
            `, [newQuoteId, created_by || 'System', `Cloned from quote ${quote.quote_number}`]);

                        res.json({
                            message: 'Quotation cloned successfully',
                            id: newQuoteId,
                            quote_number: newQuoteNumber,
                            version: newVersion,
                            parent_quote_id: quote.id
                        });
                    });
                });
            });
        });
    });

    // Toggle share link
    app.put('/api/quotations/:id/share', (req, res) => {
        const { id } = req.params;
        const { enabled } = req.body;

        db.run('UPDATE quotations SET share_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [enabled ? 1 : 0, id], function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                db.get('SELECT share_token, share_enabled FROM quotations WHERE id = ?', [id], (err, row) => {
                    res.json({
                        message: enabled ? 'Share link enabled' : 'Share link disabled',
                        share_token: row?.share_token,
                        share_enabled: row?.share_enabled
                    });
                });
            });
    });

    // Delete quotation
    app.delete('/api/quotations/:id', (req, res) => {
        const { id } = req.params;

        db.run('DELETE FROM quotations WHERE id = ?', [id], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Quotation deleted successfully', changes: this.changes });
        });
    });

    // ============================================================
    // STATISTICS ENDPOINT
    // ============================================================

    app.get('/api/quotations/stats/summary', (req, res) => {
        const stats = {};

        db.all(`
      SELECT status, COUNT(*) as count, SUM(grand_total) as total_value
      FROM quotations
      GROUP BY status
    `, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            rows.forEach(row => {
                stats[row.status] = {
                    count: row.count,
                    total_value: row.total_value || 0
                };
            });

            db.get('SELECT COUNT(*) as total, SUM(grand_total) as total_value FROM quotations', (err, totals) => {
                res.json({
                    by_status: stats,
                    total_quotes: totals?.total || 0,
                    total_value: totals?.total_value || 0
                });
            });
        });
    });

    console.log('✅ Price Estimator API routes initialized');
}

module.exports = { initPriceEstimatorRoutes };
