import { jsPDF } from 'jspdf'
import { formatPrice, getPriceForCycle, getBillingCycle } from './pricingHelpers'

export function generateEstimatePdf({ cart, billing, currency, gstRate = 18 }) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // Header bar
  doc.setFillColor(0, 128, 128)
  doc.rect(0, 0, pageWidth, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Cloud4India', margin, 18)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Cloud Infrastructure Estimate', margin, 28)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, pageWidth - margin, 18, { align: 'right' })
  doc.text(`Billing: ${getBillingCycle(billing).label}`, pageWidth - margin, 28, { align: 'right' })

  y = 50

  // Estimate ID
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(9)
  doc.text(`Estimate #EST-${Date.now().toString(36).toUpperCase()}`, margin, y)
  doc.text('Valid for 30 days from generation date', pageWidth - margin, y, { align: 'right' })
  y += 12

  // Table header
  doc.setFillColor(240, 240, 240)
  doc.rect(margin, y, contentWidth, 10, 'F')
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('#', margin + 3, y + 7)
  doc.text('Service / Configuration', margin + 12, y + 7)
  doc.text('Qty', margin + contentWidth - 55, y + 7, { align: 'right' })
  doc.text('Unit Price', margin + contentWidth - 30, y + 7, { align: 'right' })
  doc.text('Total', margin + contentWidth, y + 7, { align: 'right' })
  y += 14

  let subtotal = 0

  cart.forEach((item, index) => {
    const qty = item.quantity || 1
    const unitPrice = getPriceForCycle(item.price.monthly, billing)
    const lineTotal = unitPrice * qty
    subtotal += lineTotal

    // Check if we need a new page
    if (y > 260) {
      doc.addPage()
      y = margin
    }

    // Alternating row bg
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250)
      doc.rect(margin, y - 4, contentWidth, 18, 'F')
    }

    doc.setTextColor(30, 30, 30)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(`${index + 1}`, margin + 3, y + 2)
    doc.text(item.service?.name || 'Cloud Service', margin + 12, y + 2)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)

    // Specs line
    const specs = []
    if (item.location?.name) specs.push(item.location.name)
    if (item.os?.name) specs.push(item.os.name)
    if (item.plan?.name) specs.push(item.plan.name)
    if (item.disk?.name) specs.push(item.disk.name)
    if (item.network) specs.push(item.network === 'private' ? 'Private VPC' : 'Public Network')
    const specsText = specs.join(' | ')
    if (specsText) {
      doc.text(specsText.substring(0, 80), margin + 12, y + 9)
    }

    // Qty, Unit Price, Total
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(9)
    doc.text(`${qty}`, margin + contentWidth - 55, y + 2, { align: 'right' })
    doc.text(formatPrice(unitPrice, currency), margin + contentWidth - 30, y + 2, { align: 'right' })
    doc.setFont('helvetica', 'bold')
    doc.text(formatPrice(lineTotal, currency), margin + contentWidth, y + 2, { align: 'right' })

    y += 18
  })

  // Divider
  y += 4
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, y, margin + contentWidth, y)
  y += 10

  // Totals section
  const totalsX = margin + contentWidth - 80
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(60, 60, 60)
  doc.text('Subtotal:', totalsX, y)
  doc.text(formatPrice(subtotal, currency), margin + contentWidth, y, { align: 'right' })
  y += 8

  const gst = subtotal * (gstRate / 100)
  doc.text(`GST (${gstRate}%):`, totalsX, y)
  doc.text(formatPrice(gst, currency), margin + contentWidth, y, { align: 'right' })
  y += 2
  doc.setDrawColor(0, 128, 128)
  doc.setLineWidth(0.5)
  doc.line(totalsX, y + 4, margin + contentWidth, y + 4)
  y += 10

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(0, 128, 128)
  doc.text('Grand Total:', totalsX, y)
  doc.text(formatPrice(subtotal + gst, currency), margin + contentWidth, y, { align: 'right' })

  // Footer terms
  y += 20
  if (y > 250) { doc.addPage(); y = margin }
  doc.setDrawColor(220, 220, 220)
  doc.line(margin, y, margin + contentWidth, y)
  y += 8
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(130, 130, 130)
  doc.text('Terms & Conditions:', margin, y)
  y += 5
  doc.text('1. This estimate is valid for 30 days from the date of generation.', margin, y); y += 4
  doc.text(`2. All prices are exclusive of GST (${gstRate}%) unless stated otherwise.`, margin, y); y += 4
  doc.text('3. Actual billing may vary based on usage and configuration changes.', margin, y); y += 4
  doc.text('4. For queries, contact: sales@cloud4india.com | +91-120-4567890', margin, y); y += 8
  doc.text('Cloud4India - Sovereign Cloud Infrastructure for India', pageWidth / 2, y, { align: 'center' })

  doc.save(`Cloud4India_Estimate_${new Date().toISOString().slice(0, 10)}.pdf`)
}
