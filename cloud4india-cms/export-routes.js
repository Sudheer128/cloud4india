/**
 * Export Routes for Quotations - PDF and Excel
 * Professional format matching Cloud4India quotation template with exact styling
 */

const PdfPrinter = require('pdfmake');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Font definitions for pdfmake
const fonts = {
    Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};

// Load logo as base64
const getLogoBase64 = () => {
    try {
        const logoPath = path.join(__dirname, 'logo.png');
        if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            return 'data:image/png;base64,' + logoBuffer.toString('base64');
        }
    } catch (error) {
        console.error('Error loading logo:', error);
    }
    return null;
};

// Color scheme matching the template
const COLORS = {
    yellow: '#FFD966',      // Gold/Yellow for headers
    yellowLight: '#FFF2CC', // Light yellow for alternating rows
    blue: '#1E90FF',        // Blue for logo/accents
    black: '#000000',
    white: '#FFFFFF',
    gray: '#808080',
    border: '#000000'
};

// Terms and Conditions
const TERMS_AND_CONDITIONS = [
    'All prices are in INR (₹) and are exclusive of applicable taxes. (GST Extra)',
    'Billing will be done in advance as per agreed payment terms.',
    'Any additional storage, users, or services will be charged extra as per the prevailing rate card.',
    'Scope of migration will be strictly as defined in the signed Scope of Work (SOW).',
    'Payment to C4I Solutions LLP'
];

/**
 * Initialize export routes
 */
function initExportRoutes(app, db) {
    console.log('📤 Initializing Export routes...');

    const getQuoteWithItems = (quoteId) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM quotations WHERE id = ?', [quoteId], (err, quote) => {
                if (err) return reject(err);
                if (!quote) return reject(new Error('Quote not found'));

                db.all('SELECT * FROM quote_items WHERE quote_id = ? ORDER BY order_index', [quoteId], (err, items) => {
                    if (err) return reject(err);
                    resolve({ ...quote, items: items || [] });
                });
            });
        });
    };

    const formatNumber = (amount) => {
        if (amount === null || amount === undefined || amount === '') return '';
        return new Intl.NumberFormat('en-IN').format(amount);
    };

    const getBillingPeriod = (duration) => {
        const durationMap = {
            'hourly': 'Per Hour',
            'monthly': 'Per Month',
            'quarterly': 'Per Quarter',
            'yearly': 'Per Year'
        };
        return durationMap[duration?.toLowerCase()] || 'Per Month';
    };

    // PDF Export - Exact Template Match
    app.get('/api/quotations/:id/export/pdf', async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

        try {
            const quote = await getQuoteWithItems(req.params.id);
            const monthlyTotal = quote.subtotal || 0;
            const yearlyTotal = monthlyTotal * 12;

            // Build items table rows
            const itemRows = quote.items.map((item, index) => [
                { text: index + 1, alignment: 'center', border: [true, true, true, true] },
                { text: `${item.item_name}${item.plan_name ? ' / ' + item.plan_name : ''}`, border: [true, true, true, true] },
                { text: item.quantity || 1, alignment: 'center', border: [true, true, true, true] },
                { text: item.unit_price ? formatNumber(item.unit_price) : '', alignment: 'right', border: [true, true, true, true] },
                { text: getBillingPeriod(item.duration), alignment: 'center', border: [true, true, true, true] },
                { text: item.total_price ? formatNumber(item.total_price) : '', alignment: 'right', border: [true, true, true, true] }
            ]);

            // Build terms rows
            const termsRows = TERMS_AND_CONDITIONS.map((term, index) => [
                { text: index + 1, alignment: 'center', fontSize: 9 },
                { text: term, fontSize: 9 }
            ]);

            // Get logo
            const logoBase64 = getLogoBase64();

            const docDefinition = {
                pageSize: 'A4',
                pageMargins: [30, 30, 30, 30],
                content: [
                    // Header with Logo and Title
                    {
                        columns: [
                            logoBase64 ? {
                                image: logoBase64,
                                width: 80,
                                alignment: 'center'
                            } : {
                                width: 80,
                                stack: [
                                    { text: 'CLOUD', fontSize: 12, bold: true, color: COLORS.blue, alignment: 'center' },
                                    { text: '4', fontSize: 20, bold: true, color: COLORS.blue, alignment: 'center' },
                                    { text: 'INDIA', fontSize: 12, bold: true, color: COLORS.blue, alignment: 'center' }
                                ]
                            },
                            {
                                width: '*',
                                stack: [
                                    { text: 'Commercial Proposal for Cloud 4 India', fontSize: 18, bold: true, alignment: 'center', margin: [0, 10, 0, 10] },
                                    { text: 'Cloud Services BOM', fontSize: 14, bold: true, alignment: 'center' }
                                ]
                            }
                        ],
                        margin: [0, 0, 0, 20]
                    },

                    // Items Table
                    {
                        table: {
                            headerRows: 1,
                            widths: [35, '*', 35, 70, 60, 70],
                            body: [
                                // Header row - Yellow background
                                [
                                    { text: 'Sr. No.', bold: true, alignment: 'center', fillColor: COLORS.yellow },
                                    { text: 'Service Description', bold: true, fillColor: COLORS.yellow },
                                    { text: 'Qty', bold: true, alignment: 'center', fillColor: COLORS.yellow },
                                    { text: 'Unit Cost (₹)', bold: true, alignment: 'center', fillColor: COLORS.yellow },
                                    { text: 'Billing', bold: true, alignment: 'center', fillColor: COLORS.yellow },
                                    { text: 'Amount (₹)', bold: true, alignment: 'center', fillColor: COLORS.yellow }
                                ],
                                // Item rows
                                ...itemRows,
                                // Total row - Yellow background
                                [
                                    { text: '', fillColor: COLORS.yellow },
                                    { text: 'Total Monthly Recurring Charges (A)', bold: true, fillColor: COLORS.yellow },
                                    { text: '', fillColor: COLORS.yellow },
                                    { text: '', fillColor: COLORS.yellow },
                                    { text: '', fillColor: COLORS.yellow },
                                    { text: formatNumber(monthlyTotal), bold: true, alignment: 'right', fillColor: COLORS.yellow }
                                ]
                            ]
                        },
                        layout: {
                            hLineWidth: () => 1,
                            vLineWidth: () => 1,
                            hLineColor: () => COLORS.border,
                            vLineColor: () => COLORS.border
                        },
                        margin: [0, 0, 0, 20]
                    },

                    // Summary Section
                    {
                        columns: [
                            { width: '*', text: '' },
                            {
                                width: 'auto',
                                table: {
                                    widths: [150, 60, 80],
                                    body: [
                                        [
                                            { text: 'Description', bold: true, fillColor: COLORS.yellow },
                                            { text: 'Charges', bold: true, alignment: 'center', fillColor: COLORS.yellow },
                                            { text: 'Amount (₹)', bold: true, alignment: 'center', fillColor: COLORS.yellow }
                                        ],
                                        [
                                            { text: 'Charges Per month' },
                                            { text: 'A', alignment: 'center' },
                                            { text: formatNumber(monthlyTotal), alignment: 'right' }
                                        ],
                                        [
                                            { text: '12 months charges' },
                                            { text: '', alignment: 'center' },
                                            { text: formatNumber(yearlyTotal), alignment: 'right' }
                                        ]
                                    ]
                                },
                                layout: {
                                    hLineWidth: () => 1,
                                    vLineWidth: () => 1,
                                    hLineColor: () => COLORS.border,
                                    vLineColor: () => COLORS.border
                                }
                            }
                        ],
                        margin: [0, 0, 0, 20]
                    },

                    // Terms & Conditions Section with yellow border
                    {
                        table: {
                            widths: ['*'],
                            body: [
                                [{
                                    stack: [
                                        {
                                            table: {
                                                widths: [40, '*'],
                                                body: [
                                                    [
                                                        { text: 'Sr. No', bold: true, alignment: 'center', fillColor: COLORS.yellow, fontSize: 9 },
                                                        { text: 'Terms & Conditions', bold: true, fillColor: COLORS.yellow, fontSize: 9 }
                                                    ],
                                                    ...termsRows
                                                ]
                                            },
                                            layout: 'noBorders'
                                        },
                                        { text: '\nPayment Terms – 100% Advance, Taxes Extra.', fontSize: 9, margin: [0, 5, 0, 5] },
                                        { text: 'Payment QR Code for UPI Payment', fontSize: 9, margin: [0, 0, 0, 5] },
                                        { text: '[QR Code Placeholder]', fontSize: 8, color: COLORS.gray, italics: true }
                                    ],
                                    border: [true, true, true, true]
                                }]
                            ]
                        },
                        layout: {
                            hLineWidth: () => 2,
                            vLineWidth: () => 2,
                            hLineColor: () => COLORS.yellow,
                            vLineColor: () => COLORS.yellow
                        },
                        margin: [0, 0, 0, 20]
                    },

                    // GST Summary (additional)
                    {
                        columns: [
                            { width: '*', text: '' },
                            {
                                width: 'auto',
                                table: {
                                    widths: [150, 80],
                                    body: [
                                        [{ text: 'Subtotal', bold: true }, { text: formatNumber(quote.subtotal), alignment: 'right' }],
                                        [{ text: `GST (${quote.tax_rate}%)`, bold: true }, { text: formatNumber(quote.tax_amount), alignment: 'right' }],
                                        [{ text: 'Grand Total', bold: true, fillColor: COLORS.yellow }, { text: formatNumber(quote.grand_total), bold: true, alignment: 'right', fillColor: COLORS.yellow }]
                                    ]
                                },
                                layout: {
                                    hLineWidth: () => 1,
                                    vLineWidth: () => 1,
                                    hLineColor: () => COLORS.border,
                                    vLineColor: () => COLORS.border
                                }
                            }
                        ]
                    }
                ],
                defaultStyle: { fontSize: 10 }
            };

            const printer = new PdfPrinter(fonts);
            const pdfDoc = printer.createPdfKitDocument(docDefinition);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${quote.quote_number}.pdf"`);

            pdfDoc.pipe(res);
            pdfDoc.end();
        } catch (error) {
            console.error('PDF export error:', error);
            res.status(500).json({ error: error.message });
        }
    });

    // Excel Export - Exact Template Match with Colors
    app.get('/api/quotations/:id/export/excel', async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

        try {
            const quote = await getQuoteWithItems(req.params.id);
            const monthlyTotal = quote.subtotal || 0;
            const yearlyTotal = monthlyTotal * 12;

            // Build Excel data
            const data = [];
            let rowIndex = 0;

            // Header rows
            data.push(['', 'Commercial Proposal for Cloud 4 India', '', '', '', '']);
            rowIndex++;
            data.push(['', '', '', '', '', '']);
            rowIndex++;
            data.push(['', 'Cloud Services BOM', '', '', '', '']);
            rowIndex++;
            data.push(['', '', '', '', '', '']);
            rowIndex++;

            // Items table header row
            const headerRowIndex = rowIndex;
            data.push(['Sr. No.', 'Service Description', 'Qty', 'Unit Cost (₹)', 'Billing', 'Amount (₹)']);
            rowIndex++;

            // Item rows
            quote.items.forEach((item, index) => {
                data.push([
                    index + 1,
                    `${item.item_name}${item.plan_name ? ' / ' + item.plan_name : ''}`,
                    item.quantity || 1,
                    item.unit_price || '',
                    getBillingPeriod(item.duration),
                    item.total_price || ''
                ]);
                rowIndex++;
            });

            // Total row
            const totalRowIndex = rowIndex;
            data.push(['', 'Total Monthly Recurring Charges (A)', '', '', '', monthlyTotal]);
            rowIndex++;

            // Empty row
            data.push(['', '', '', '', '', '']);
            rowIndex++;

            // Summary section header
            const summaryHeaderIndex = rowIndex;
            data.push(['', 'Description', 'Charges', 'Amount (₹)', '', '']);
            rowIndex++;
            data.push(['', 'Charges Per month', 'A', monthlyTotal, '', '']);
            rowIndex++;
            data.push(['', '12 months charges', '', yearlyTotal, '', '']);
            rowIndex++;

            // Empty row
            data.push(['', '', '', '', '', '']);
            rowIndex++;

            // Terms header
            const termsHeaderIndex = rowIndex;
            data.push(['Sr. No', 'Terms & Conditions', '', '', '', '']);
            rowIndex++;

            // Terms
            TERMS_AND_CONDITIONS.forEach((term, index) => {
                data.push([index + 1, term, '', '', '', '']);
                rowIndex++;
            });

            // Payment info
            data.push(['', 'Payment Terms – 100% Advance, Taxes Extra.', '', '', '', '']);
            rowIndex++;
            data.push(['', 'Payment QR Code for UPI Payment', '', '', '', '']);
            rowIndex++;

            // Create worksheet
            const ws = XLSX.utils.aoa_to_sheet(data);

            // Set column widths
            ws['!cols'] = [
                { wch: 8 },   // Sr. No
                { wch: 55 },  // Description
                { wch: 8 },   // Qty
                { wch: 15 },  // Unit Cost
                { wch: 12 },  // Billing
                { wch: 15 }   // Amount
            ];

            // Merge cells for header
            ws['!merges'] = [
                { s: { r: 0, c: 1 }, e: { r: 0, c: 5 } },  // Title merge
                { s: { r: 2, c: 1 }, e: { r: 2, c: 5 } }   // Subtitle merge
            ];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Commercials');

            const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${quote.quote_number}.xlsx"`);
            res.send(buffer);
        } catch (error) {
            console.error('Excel export error:', error);
            res.status(500).json({ error: error.message });
        }
    });

    console.log('✅ Export routes initialized');
}

module.exports = { initExportRoutes };
