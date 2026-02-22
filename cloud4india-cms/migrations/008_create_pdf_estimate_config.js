/**
 * Migration: Create pdf_estimate_config table
 * Singleton table (id=1) storing all configurable values for the estimate PDF generator.
 */

const up = `
CREATE TABLE IF NOT EXISTS pdf_estimate_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  header_title TEXT DEFAULT 'Commercial Proposal for Cloud 4 India',
  header_subtitle TEXT DEFAULT 'Cloud Services BOM',
  header_bg_color TEXT DEFAULT '#FFF2CC',
  table_header_color TEXT DEFAULT '#FFFF00',
  estimate_id_prefix TEXT DEFAULT 'EST',
  company_name TEXT DEFAULT 'C4I Solutions LLP',
  terms_conditions TEXT DEFAULT '[
    "All prices are in {currency} ({symbol}) and are exclusive of applicable taxes. (GST Extra)",
    "Billing will be done in advance as per agreed payment terms.",
    "Any additional storage, users, or services will be charged extra as per the prevailing rate card.",
    "Scope of migration will be strictly as defined in the signed Scope of Work (SOW).",
    "Payment to {company_name}"
  ]',
  payment_terms_text TEXT DEFAULT 'Payment Terms – 100% Advance, Taxes Extra.',
  payment_qr_text TEXT DEFAULT 'Payment QR Code for UPI Payment',
  show_gst_row INTEGER DEFAULT 1,
  show_total_incl_gst INTEGER DEFAULT 1,
  show_12_months_row INTEGER DEFAULT 1,
  show_tc_section INTEGER DEFAULT 1,
  show_date_line INTEGER DEFAULT 1,
  show_estimate_id INTEGER DEFAULT 1,
  show_payment_terms INTEGER DEFAULT 1,
  show_payment_qr_text INTEGER DEFAULT 1,
  pdf_filename_prefix TEXT DEFAULT 'Cloud4India_Estimate',
  company_address TEXT DEFAULT '',
  bank_details_text TEXT DEFAULT '',
  show_bank_details INTEGER DEFAULT 0,
  footer_text TEXT DEFAULT '',
  prepared_for_label TEXT DEFAULT '',
  payment_qr_image TEXT DEFAULT '',
  company_logo TEXT DEFAULT '',
  tax_name TEXT DEFAULT 'GST',
  tax_rate REAL DEFAULT 18,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO pdf_estimate_config (id) VALUES (1);
`;

const down = `
DROP TABLE IF EXISTS pdf_estimate_config;
`;

module.exports = { up, down };
