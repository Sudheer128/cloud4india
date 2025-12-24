/**
 * Update Refund Policy page content
 * Based on screenshot
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

const newRefundPolicyContent = `
<h1>Refund Policy</h1>

<p>CLOUD 4 INDIA reserves the right to cancel, suspend, or otherwise restrict access to the account at any time with or without notice.</p>

<p>Customers may cancel at any time via a support ticket or emailing support [at] <a href="https://cloud4india.com" target="_blank">Cloud 4 India.com</a>. Cloud 4 India gives you 7 days money back guarantee on managed shared hosting, and reseller solutions for any customer who paid the first invoice with a credit card, Bank transfer or through payment gateway</p>

<p>There are no refunds on dedicated servers, mail servers, domain name registration, administrative fees, and install fees for custom software. Any domain name purchases are non-refundable. Please note that domain refunds will only be considered if they were ordered in conjunction with a hosting package. Eligibility of said refunds will be determined at the time of cancellation.</p>

<p>Only first-time accounts are eligible for a refund. For example, if you've had an account with us before, canceled and signed up again, you will not be eligible for a refund or if you have opened a second account with us.</p>

<p>For Bank Transfers, there will be minimum banking charges of Rs 250/- when refunds is requested as there is no facility for us to directly refund in to your account. Company Cheque will be deposited to your account when refund is requested within 7 days once refund is approved.</p>

<p>Violations of the Terms of Service will waive the refund policy.</p>
`;

const eyebrow = 'Integrity';
const description = 'Understand Cloud4India\'s refund policy, including our 7-day money-back guarantee on managed shared hosting and reseller solutions. Learn about eligibility, non-refundable items, and the refund process.';

console.log('🔄 Updating Refund Policy content...');

db.run(
    'UPDATE integrity_pages SET content = ?, eyebrow = ?, description = ?, updated_at = datetime("now") WHERE slug = ?',
    [newRefundPolicyContent, eyebrow, description, 'refund-policy'],
    function (err) {
        if (err) {
            console.error('❌ Error updating Refund Policy:', err.message);
        } else {
            console.log('✅ Refund Policy content updated successfully!');
            console.log(`   Rows affected: ${this.changes}`);

            // Verify the update
            db.get(
                'SELECT id, slug, title, eyebrow, LENGTH(content) as content_length FROM integrity_pages WHERE slug = ?',
                ['refund-policy'],
                (err, row) => {
                    if (err) {
                        console.error('❌ Error verifying update:', err.message);
                    } else {
                        console.log('📋 Verification:');
                        console.log(`   ID: ${row.id}`);
                        console.log(`   Slug: ${row.slug}`);
                        console.log(`   Title: ${row.title}`);
                        console.log(`   Eyebrow: ${row.eyebrow}`);
                        console.log(`   Content length: ${row.content_length} characters`);
                    }
                    db.close();
                }
            );
        }
    }
);
