import { jsPDF } from 'jspdf'
import { formatPrice, getPriceForCycle, getBillingCycle, CURRENCIES, formatMemory } from './pricingHelpers'
import { CMS_URL } from './config'

// ============================================================================
// Cloud4India Estimate PDF — exact replica of "Proposal MSH Pathlabs" Excel
// ============================================================================

// Convert hex color string (#RRGGBB) to [r, g, b] array
function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null
  hex = hex.replace(/^#/, '')
  if (hex.length !== 6) return null
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null
  return [r, g, b]
}

// Load an image URL as a base64 data URL for jsPDF embedding
function loadImageAsDataUrl(src) {
  return new Promise((resolve) => {
    if (!src) { resolve(null); return }
    const url = src.startsWith('http') ? src : `${CMS_URL}${src}`
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        canvas.getContext('2d').drawImage(img, 0, 0)
        resolve({ dataUrl: canvas.toDataURL('image/png'), width: img.naturalWidth, height: img.naturalHeight })
      } catch (e) {
        console.warn('Image load failed (CORS):', src, e)
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

export async function generateEstimatePdf({ cart, billing, currency, gstRate = 18, pdfConfig = {} }) {
  if (!cart || cart.length === 0) return

  // Pre-load images in parallel
  const [logoImg, qrImg] = await Promise.all([
    loadImageAsDataUrl(pdfConfig.company_logo),
    loadImageAsDataUrl(pdfConfig.payment_qr_image),
  ])

  const doc = new jsPDF()
  const pw = doc.internal.pageSize.getWidth()   // 210
  const ph = doc.internal.pageSize.getHeight()  // 297
  const m = 15                                  // left margin
  const cw = pw - m * 2                         // 180 content width
  let y = m

  const cycle = getBillingCycle(billing)
  const sym = CURRENCIES[currency] || '₹'
  // jsPDF helvetica doesn't support ₹/€/£ Unicode glyphs — use ASCII-safe labels for PDF text
  const PDF_SYMBOLS = { INR: 'Rs.', USD: '$', EUR: 'EUR', GBP: 'GBP' }
  const pdfSym = PDF_SYMBOLS[currency] || sym

  // Billing period label (matches Excel "Per Month" style)
  const billingLabel = {
    hourly: 'Per Hour', monthly: 'Per Month', quarterly: 'Per Quarter',
    'semi-annually': 'Per 6 Months', yearly: 'Per Year',
    'bi-annually': 'Per 2 Years', 'tri-annually': 'Per 3 Years'
  }[billing] || cycle.label

  // Colors — use config or fallback to original values
  const GOLD   = hexToRgb(pdfConfig.header_bg_color) || [255, 242, 204]   // #FFF2CC
  const YELLOW = hexToRgb(pdfConfig.table_header_color) || [255, 255, 0]  // #FFFF00
  const BLACK  = [0, 0, 0]

  // Config values with fallbacks
  const headerTitle    = pdfConfig.header_title || 'Commercial Proposal for Cloud 4 India'
  const headerSubtitle = pdfConfig.header_subtitle || 'Cloud Services BOM'
  const estPrefix      = pdfConfig.estimate_id_prefix || 'EST'
  const companyName    = pdfConfig.company_name || 'C4I Solutions LLP'
  const filenamePrefix = pdfConfig.pdf_filename_prefix || 'Cloud4India_Estimate'
  const taxName        = pdfConfig.tax_name || 'GST'
  // Use tax_rate from pdfConfig if set, otherwise fallback to the gstRate prop
  if (pdfConfig.tax_rate !== undefined && pdfConfig.tax_rate !== null) {
    gstRate = parseFloat(pdfConfig.tax_rate) || gstRate
  }

  // ── Format number (Indian commas, .00 decimals, no currency symbol) ────────
  function fmtNum(amount) {
    if (amount === undefined || amount === null || amount === '' || isNaN(amount)) return ''
    const full = formatPrice(amount, currency)
    return full.replace(/^[₹$€£]\s*/, '')
  }

  // ── Draw bordered cell ────────────────────────────────────────────────────
  function cell(cx, cy, w, h, text, opts = {}) {
    const { fill, bold, align = 'left', fontSize = 9, border = true } = opts
    if (fill) {
      doc.setFillColor(...fill)
      doc.rect(cx, cy, w, h, border ? 'FD' : 'F')
    } else if (border) {
      doc.rect(cx, cy, w, h, 'S')
    }
    if (text === undefined || text === null || text === '') return
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(fontSize)
    doc.setTextColor(...BLACK)
    const textY = cy + h / 2 + fontSize / 2.8
    const str = String(text)
    if (align === 'center') doc.text(str, cx + w / 2, textY, { align: 'center' })
    else if (align === 'right') doc.text(str, cx + w - 2, textY, { align: 'right' })
    else doc.text(str, cx + 2, textY)
  }

  // ── Page break check ─────────────────────────────────────────────────────
  function pageBreak(needed) {
    if (y + needed > ph - 15) { doc.addPage(); y = m }
  }

  doc.setDrawColor(...BLACK)
  doc.setLineWidth(0.2)

  // ========================================================================
  // 1. HEADER BLOCK — B2:G7 merged, gold bg (#FFF2CC)
  // ========================================================================
  const hdrH = 50
  doc.setFillColor(...GOLD)
  doc.rect(m, y, cw, hdrH, 'F')
  doc.setLineWidth(0.3)
  doc.rect(m, y, cw, hdrH, 'S')

  // Company logo (top-left of header, like Excel B2:C7)
  let titleCenterX = pw / 2
  if (logoImg && logoImg.width > 0 && logoImg.height > 0) {
    const logoMaxH = hdrH - 10  // 40mm max height, leave padding
    const logoMaxW = 50          // 50mm max width
    const aspect = logoImg.width / logoImg.height
    let lw = logoMaxW
    let lh = lw / aspect
    if (lh > logoMaxH) { lh = logoMaxH; lw = lh * aspect }
    const logoX = m + 4
    const logoY = y + (hdrH - lh) / 2
    doc.addImage(logoImg.dataUrl, 'PNG', logoX, logoY, lw, lh)
    // Shift title text center to the right to avoid overlapping logo
    titleCenterX = m + lw + 8 + (cw - lw - 8) / 2
  }

  doc.setTextColor(...BLACK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(headerTitle, titleCenterX, y + 20, { align: 'center' })
  doc.setFontSize(14)
  doc.text(headerSubtitle, titleCenterX, y + 36, { align: 'center' })

  y += hdrH + 4

  // Date & Estimate ID
  const showDate = pdfConfig.show_date_line !== 0
  const showEstId = pdfConfig.show_estimate_id !== 0

  if (showDate || showEstId) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    const estId = `${estPrefix}-${Date.now().toString(36).toUpperCase()}`
    if (showDate) doc.text(`Date: ${dateStr}`, m, y + 4)
    if (showEstId) doc.text(`Estimate: ${estId}`, m + cw, y + 4, { align: 'right' })
    y += 10
  }

  // Prepared For label
  if (pdfConfig.prepared_for_label) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...BLACK)
    doc.text(pdfConfig.prepared_for_label, m, y + 4)
    y += 10
  }

  // Company Address
  if (pdfConfig.company_address) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(80, 80, 80)
    const addrLines = doc.splitTextToSize(pdfConfig.company_address, cw)
    addrLines.forEach((line, i) => {
      doc.text(line, m, y + 4 + i * 4)
    })
    y += addrLines.length * 4 + 4
  }

  doc.setLineWidth(0.2)

  // ========================================================================
  // 2. SERVICES TABLE — Row 10: headers, Rows 11+: data, last: total
  //    Columns: Sr. No. | Service Description | Qty | Unit Cost (₹) | Billing | Amount (₹)
  // ========================================================================

  // Column widths (sum = 180)
  const C = [12, 70, 12, 30, 24, 32]

  // ── Yellow header row ──
  const hdrs = ['Sr. No.', 'Service Description', 'Qty', `Unit Cost (${pdfSym})`, 'Billing', `Amount (${pdfSym})`]
  let x = m
  for (let i = 0; i < C.length; i++) {
    cell(x, y, C[i], 10, hdrs[i], { fill: YELLOW, bold: true, align: 'center' })
    x += C[i]
  }
  y += 10

  // ── Data rows ──
  let subtotal = 0
  let monthlyTotal = 0

  cart.forEach((item, idx) => {
    pageBreak(12)

    const qty = item.quantity || 1
    const monthlyPrice = parseFloat(item.price?.monthly) || 0
    const unitPrice = getPriceForCycle(monthlyPrice, billing)
    const lineTotal = unitPrice * qty
    subtotal += lineTotal
    monthlyTotal += monthlyPrice * qty

    // Build description like Excel: "Cloud VM – 4 vCPU / 16 GB RAM /150GB NVMe Disk"
    const svcName = item.service?.name || 'Cloud Service'
    const specs = []
    if (item.plan?.cpu) specs.push(`${item.plan.cpu} vCPU`)
    if (item.plan?.memory) specs.push(`${formatMemory(item.plan.memory)} RAM`)
    if (item.plan?.storage) specs.push(`${item.plan.storage}GB Storage`)
    if (item.disk?.name) specs.push(item.disk.name)
    if (item.os?.name) specs.push(item.os.name)
    if (item.network) specs.push(`${item.network} Network`)
    if (item.publicIP) specs.push('Public IP')
    if (item.licence) specs.push(item.licence.name)
    if (item.addons?.length) specs.push(item.addons.map(a => a.name).join(', '))
    let desc = svcName
    if (specs.length > 0) desc += ' \u2013 ' + specs.join(' / ')

    // Multi-line description using splitTextToSize
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const descLines = doc.splitTextToSize(desc, C[1] - 4)
    const rowH = Math.max(10, descLines.length * 5 + 4)

    pageBreak(rowH)

    x = m
    cell(x, y, C[0], rowH, idx + 1, { align: 'center' });                   x += C[0]
    // Draw description cell border/background, then render lines manually
    doc.rect(x, y, C[1], rowH, 'S')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...BLACK)
    descLines.forEach((line, li) => {
      doc.text(line, x + 2, y + 5 + li * 5)
    })
    x += C[1]
    cell(x, y, C[2], rowH, qty, { align: 'center' });                        x += C[2]
    cell(x, y, C[3], rowH, fmtNum(unitPrice), { align: 'right' });           x += C[3]
    cell(x, y, C[4], rowH, billingLabel, { align: 'center', fontSize: 7 });  x += C[4]
    cell(x, y, C[5], rowH, fmtNum(lineTotal), { align: 'right' })
    y += rowH
  })

  // ── Total row (yellow on label cells + amount cell, like Excel row 13) ──
  pageBreak(12)
  x = m
  cell(x, y, C[0], 10, '', { fill: YELLOW });                                x += C[0]
  cell(x, y, C[1], 10, `Total ${cycle.label} Recurring Charges (A)`, {
    fill: YELLOW, bold: true, fontSize: 10
  });                                                                         x += C[1]
  cell(x, y, C[2], 10, '', { fill: YELLOW });                                x += C[2]
  cell(x, y, C[3], 10, '', { fill: YELLOW });                                x += C[3]
  cell(x, y, C[4], 10, '', { fill: YELLOW });                                x += C[4]
  cell(x, y, C[5], 10, fmtNum(subtotal), {
    fill: YELLOW, bold: true, align: 'right', fontSize: 10
  })
  y += 10  // total row height
  pageBreak(12 + 35) // gap + summary section
  y += 12  // gap between table and summary

  // ========================================================================
  // 3. SUMMARY — Rows 17-19: Description | Charges | Amount
  //    Aligned with main table columns C, D, E
  // ========================================================================

  // Summary starts at column C position (after Sr.No column)
  const sX = m + C[0]  // = 27
  const S = [C[1] + C[2], C[3] + C[4], C[5]]  // spans full table width minus Sr.No

  // ── Yellow header ──
  x = sX
  cell(x, y, S[0], 10, 'Description', { fill: YELLOW, bold: true });         x += S[0]
  cell(x, y, S[1], 10, 'Charges', { fill: YELLOW, bold: true, align: 'center' }); x += S[1]
  cell(x, y, S[2], 10, `Amount (${pdfSym})`, { fill: YELLOW, bold: true, align: 'right' })
  y += 10

  // ── Row 1: Charges Per {billing} ──
  x = sX
  cell(x, y, S[0], 10, `Charges ${billingLabel} `);                          x += S[0]
  cell(x, y, S[1], 10, 'A', { align: 'center' });                            x += S[1]
  cell(x, y, S[2], 10, fmtNum(subtotal), { align: 'right' })
  y += 10

  // ── Row 2: GST ──
  if (pdfConfig.show_gst_row !== 0) {
    const gst = subtotal * (gstRate / 100)
    x = sX
    cell(x, y, S[0], 10, `${taxName} (${gstRate}%)`);                           x += S[0]
    cell(x, y, S[1], 10, '', { align: 'center' });                             x += S[1]
    cell(x, y, S[2], 10, fmtNum(gst), { align: 'right' })
    y += 10
  }

  // ── Row 3: Total incl. GST (yellow) ──
  if (pdfConfig.show_total_incl_gst !== 0) {
    const gst = subtotal * (gstRate / 100)
    const grandTotal = subtotal + gst
    x = sX
    cell(x, y, S[0], 10, `Total incl. ${taxName} (${billingLabel})`, { fill: YELLOW, bold: true }); x += S[0]
    cell(x, y, S[1], 10, '', { fill: YELLOW });                                x += S[1]
    cell(x, y, S[2], 10, fmtNum(grandTotal), { fill: YELLOW, bold: true, align: 'right' })
    y += 10
  }

  // ── Row 4: 12 months charges (yellow) ──
  if (pdfConfig.show_12_months_row !== 0) {
    const annualCharges = monthlyTotal * 12
    x = sX
    cell(x, y, S[0], 10, '12 months charges', { fill: YELLOW, bold: true });   x += S[0]
    cell(x, y, S[1], 10, '', { fill: YELLOW });                                x += S[1]
    cell(x, y, S[2], 10, fmtNum(annualCharges), { fill: YELLOW, bold: true, align: 'right' })
    y += 10
  }

  y += 14

  // ========================================================================
  // 4. TERMS & CONDITIONS — Rows 21-28 (no cell borders, just text)
  //    B = Sr. No, C:G merged = term text
  // ========================================================================
  if (pdfConfig.show_tc_section !== 0) {
    pageBreak(80)

    // ── T&C header ──
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...BLACK)
    doc.text('Sr. No', m + 4, y + 4)
    doc.text('Terms & Conditions', sX + 2, y + 4)
    y += 8

    // ── T&C items — from config or fallback ──
    const defaultTerms = [
      `All prices are in ${currency} (${pdfSym}) and are exclusive of applicable taxes. (${taxName} Extra)`,
      'Billing will be done in advance as per agreed payment terms.',
      'Any additional storage, users, or services will be charged extra as per the prevailing rate card.',
      'Scope of migration will be strictly as defined in the signed Scope of Work (SOW).',
      `Payment to ${companyName}`,
    ]

    let terms = defaultTerms
    if (Array.isArray(pdfConfig.terms_conditions) && pdfConfig.terms_conditions.length > 0) {
      // Interpolate placeholders
      terms = pdfConfig.terms_conditions.map(t =>
        t.replace(/\{currency\}/g, currency)
         .replace(/\{symbol\}/g, pdfSym)
         .replace(/\{company_name\}/g, companyName)
      )
    }

    doc.setFontSize(9)
    const maxTcW = cw - C[0] - 4
    terms.forEach((t, i) => {
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...BLACK)
      const tcLines = doc.splitTextToSize(t, maxTcW)
      pageBreak(tcLines.length * 5 + 4)
      doc.text(`${i + 1}`, m + 7, y + 4, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      tcLines.forEach((line, li) => {
        doc.text(line, sX + 2, y + 4 + li * 5)
      })
      y += Math.max(7, tcLines.length * 5 + 2)
    })

    y += 6
  }

  // ========================================================================
  // 5. BANK DETAILS (optional, between T&C and Payment)
  // ========================================================================
  if (pdfConfig.show_bank_details === 1 && pdfConfig.bank_details_text) {
    pageBreak(30)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...BLACK)
    doc.text('Bank Details', sX + 2, y + 4)
    y += 8

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const bankLines = pdfConfig.bank_details_text.split(/\r?\n/)
    bankLines.forEach(line => {
      pageBreak(6)
      doc.text(line, sX + 2, y + 4)
      y += 5
    })
    y += 6
  }

  // ========================================================================
  // 6. PAYMENT TERMS & QR CODE
  // ========================================================================

  // ── Payment terms ──
  if (pdfConfig.show_payment_terms !== 0) {
    pageBreak(10)
    const paymentText = pdfConfig.payment_terms_text || 'Payment Terms \u2013 100% Advance, Taxes Extra.'
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...BLACK)
    doc.text(paymentText, sX + 2, y)
    y += 7
  }

  if (pdfConfig.show_payment_qr_text !== 0) {
    pageBreak(10)
    const qrText = pdfConfig.payment_qr_text || 'Payment QR Code for UPI Payment'
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...BLACK)
    doc.text(qrText, sX + 2, y)
    y += 5
  }

  // ── QR Code Image ──
  if (qrImg && qrImg.width > 0 && qrImg.height > 0 && pdfConfig.show_payment_qr_text !== 0) {
    const qrMaxW = 50   // 50mm wide max
    const qrMaxH = 60   // 60mm tall max
    const aspect = qrImg.width / qrImg.height
    let qw = qrMaxW
    let qh = qw / aspect
    if (qh > qrMaxH) { qh = qrMaxH; qw = qh * aspect }
    pageBreak(qh + 4)
    doc.addImage(qrImg.dataUrl, 'PNG', sX + 2, y, qw, qh)
    y += qh + 4
  }

  // ========================================================================
  // 7. FOOTER TEXT
  // ========================================================================
  if (pdfConfig.footer_text) {
    pageBreak(12)
    y += 4
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(pdfConfig.footer_text, pw / 2, y, { align: 'center' })
    y += 6
  }

  // ========================================================================
  // Save
  // ========================================================================
  doc.save(`${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.pdf`)
}
