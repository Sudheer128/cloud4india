import React, { useState } from 'react'
import { formatPrice, getPriceForCycle, getBillingCycle, getBillingDiscounts } from '../../utils/pricingHelpers'
import { generateEstimatePdf } from '../../utils/estimatePdf'

const EstimateDetailsModal = ({
  isOpen,
  onClose,
  cart,
  billing,
  currency,
  cartTotal,
  onRemoveItem,
  onUpdateQuantity,
  onUpdateNotes,
  onEditItem,
  onClearAll,
  gstRate = 18,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [confirmClearAll, setConfirmClearAll] = useState(false)
  const [expandedNotes, setExpandedNotes] = useState({})
  const [shareTooltip, setShareTooltip] = useState(false)

  if (!isOpen) return null

  const cycle = getBillingCycle(billing)

  const computedTotal = cart.reduce((sum, item) => {
    const qty = item.quantity || 1
    return {
      monthly: sum.monthly + (parseFloat(item.price.monthly) || 0) * qty,
      hourly: sum.hourly + (parseFloat(item.price.hourly) || 0) * qty,
    }
  }, { monthly: 0, hourly: 0 })

  const subtotal = getPriceForCycle(computedTotal.monthly, billing)
  const gst = subtotal * (gstRate / 100)
  const grandTotal = subtotal + gst

  const handleDelete = (id) => {
    if (confirmDeleteId === id) {
      onRemoveItem(id)
      setConfirmDeleteId(null)
    } else {
      setConfirmDeleteId(id)
    }
  }

  const handleClearAll = () => {
    if (confirmClearAll) {
      onClearAll()
      setConfirmClearAll(false)
    } else {
      setConfirmClearAll(true)
    }
  }

  const handleShareLink = () => {
    try {
      const minimalCart = cart.map(item => ({
        s: item.service?.slug,
        l: item.location?.id,
        p: item.plan?.id || item.plan?.name,
        d: item.disk?.id || item.disk?.name,
        q: item.quantity || 1,
        b: item.billingCycle || billing,
        n: item.network,
        os: item.os?.name,
      }))
      const encoded = btoa(JSON.stringify(minimalCart))
      const url = `${window.location.origin}${window.location.pathname}?estimate=${encoded}`
      navigator.clipboard.writeText(url).then(() => {
        setShareTooltip(true)
        setTimeout(() => setShareTooltip(false), 2000)
      })
    } catch (e) {
      console.error('Failed to copy share link:', e)
    }
  }

  const handleDownloadPdf = () => {
    generateEstimatePdf({ cart, billing, currency, gstRate })
  }

  const toggleNotes = (id) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-saree-teal to-saree-teal-dark flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white">Estimate Details</h2>
            <p className="text-saree-teal-light text-sm mt-1">
              {cart.length} item(s) • {cycle.label} billing
            </p>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={handleClearAll}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  confirmClearAll
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {confirmClearAll ? 'Confirm Clear All?' : 'Clear All'}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg font-medium">No items added</p>
              <p className="text-sm mt-1">Select services to start building your estimate</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, index) => {
                const isVMItem = item.service?.slug?.toLowerCase().includes('virtual-machine')
                const isStorageItem = item.service?.slug?.toLowerCase().includes('storage') || item.service?.slug?.toLowerCase().includes('nvme')
                const qty = item.quantity || 1
                const itemCyclePrice = getPriceForCycle(item.price.monthly, billing) * qty

                return (
                  <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Item Header */}
                    <div className="bg-gray-50 px-5 py-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-saree-teal-light/20 text-saree-teal-dark font-bold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-gray-900">{item.service?.name}</h3>
                          <p className="text-sm text-gray-500">{item.location?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, qty - 1))}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-l-lg transition"
                            disabled={qty <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-900">
                            {qty}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.min(99, qty + 1))}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-r-lg transition"
                            disabled={qty >= 99}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-saree-teal-dark">
                            {formatPrice(itemCyclePrice, currency)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {qty > 1 && `${qty} x ${formatPrice(getPriceForCycle(item.price.monthly, billing), currency)} `}
                            {cycle.suffix}
                          </div>
                        </div>
                        {/* Edit Button */}
                        <button
                          onClick={() => onEditItem(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Edit item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className={`h-8 flex items-center justify-center rounded-lg transition text-sm font-medium ${
                            confirmDeleteId === item.id
                              ? 'bg-red-100 text-red-600 hover:bg-red-200 px-3 gap-1'
                              : 'w-8 text-gray-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={confirmDeleteId === item.id ? 'Click to confirm' : 'Remove item'}
                        >
                          {confirmDeleteId === item.id ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove?
                            </>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Item Details Grid */}
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Operating System (VM only) */}
                        {isVMItem && item.os && (
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200">
                              {item.os.icon_url ? (
                                <img src={item.os.icon_url} alt="" className="w-6 h-6" />
                              ) : (
                                <span className="text-xl">🖥️</span>
                              )}
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">Operating System</div>
                              <div className="font-medium text-gray-900">{item.os.name}</div>
                              {item.os.type && <div className="text-xs text-gray-500">{item.os.type}</div>}
                            </div>
                          </div>
                        )}

                        {/* Plan Details */}
                        {item.plan && (
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200">
                              <span className="text-xl">⚙️</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-gray-500 uppercase tracking-wide">Compute Plan</div>
                              <div className="font-medium text-gray-900">{item.plan.name}</div>
                              <div className="text-xs text-gray-500 mt-1 space-x-2">
                                {item.plan.cpu && <span>{item.plan.cpu} vCPU</span>}
                                {item.plan.memory && <span>• {item.plan.memory >= 1024 ? `${item.plan.memory/1024} GB` : `${item.plan.memory} MB`} RAM</span>}
                                {item.plan.storage && <span>• {item.plan.storage} GB Storage</span>}
                              </div>
                              {item.plan.plan_category_name && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-saree-teal-light text-saree-teal-dark rounded text-xs">
                                  {item.plan.plan_category_name}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Disk/Storage */}
                        {item.disk && (
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200">
                              <span className="text-xl">💾</span>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">
                                {isStorageItem ? 'Block Storage' : 'Additional Disk'}
                              </div>
                              <div className="font-medium text-gray-900">{item.disk.name}</div>
                              {item.storageType && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                                  {item.storageType}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Network Type (VM only) */}
                        {isVMItem && item.network && (
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200">
                              <span className="text-xl">🌐</span>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">Network</div>
                              <div className="font-medium text-gray-900">
                                {item.network === 'private' ? 'Private VPC Network' : 'Public Network'}
                              </div>
                              {item.publicIP !== undefined && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Public IP: <span className={item.publicIP ? 'text-green-600' : 'text-gray-400'}>{item.publicIP ? 'Yes' : 'No'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* OS Licence (if applicable) */}
                        {item.licence && (
                          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-amber-200">
                              <span className="text-xl">🔑</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-amber-600 uppercase tracking-wide">OS Licence</div>
                              <div className="font-medium text-gray-900">{item.licence.name}</div>
                              <div className="text-sm text-amber-700 mt-1">
                                {formatPrice(item.licence.monthly_price, currency)}/{item.licence.pricing_unit}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Addons Section */}
                      {item.addons && item.addons.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Add-ons & Products</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {item.addons.map(addon => (
                              <div key={addon.id} className="flex items-center justify-between p-3 bg-saree-teal-light/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <span className="text-saree-teal">✓</span>
                                  <span className="font-medium text-gray-900 text-sm">{addon.name}</span>
                                </div>
                                <span className="text-saree-teal-dark font-medium text-sm">
                                  {formatPrice(addon.monthly_price, currency)}/mo
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Price Breakdown */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Price Breakdown</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <div className="text-xs text-gray-500">Hourly</div>
                            <div className="font-bold text-gray-900">{formatPrice(item.price.hourly, currency)}</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <div className="text-xs text-gray-500">Monthly</div>
                            <div className="font-bold text-gray-900">{formatPrice(item.price.monthly, currency)}</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <div className="text-xs text-gray-500">Yearly</div>
                            <div className="font-bold text-gray-900">{formatPrice(getPriceForCycle(item.price.monthly, 'yearly'), currency)}</div>
                            <div className="text-xs text-green-600">{Math.round((1 - (getBillingDiscounts()['yearly'] || 0.9)) * 100)}% off</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <div className="text-xs text-gray-500">3-Year</div>
                            <div className="font-bold text-gray-900">{formatPrice(getPriceForCycle(item.price.monthly, 'tri-annually'), currency)}</div>
                            <div className="text-xs text-green-600">{Math.round((1 - (getBillingDiscounts()['tri-annually'] || 0.8)) * 100)}% off</div>
                          </div>
                        </div>
                      </div>

                      {/* Notes Section */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => toggleNotes(item.id)}
                          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
                        >
                          <svg className={`w-4 h-4 transition-transform ${expandedNotes[item.id] ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {item.notes ? 'Edit Notes' : 'Add Notes'}
                          {item.notes && <span className="w-2 h-2 bg-blue-400 rounded-full" />}
                        </button>
                        {expandedNotes[item.id] && (
                          <textarea
                            className="mt-2 w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saree-teal/30 focus:border-saree-teal resize-none"
                            rows={2}
                            placeholder="Add notes for this item..."
                            value={item.notes || ''}
                            onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Terms & Validity */}
        {cart.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex-shrink-0">
            <p>Estimate valid for 30 days. All prices exclude GST ({gstRate}%). For custom requirements, contact sales@cloud4india.com</p>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <div className="text-sm text-gray-500">Subtotal ({cycle.label})</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(subtotal, currency)}
              </div>
              <div className="text-sm text-gray-500 mt-0.5">
                + GST ({gstRate}%): {formatPrice(gst, currency)}
              </div>
              <div className="text-xl font-bold text-saree-teal-dark mt-1">
                Grand Total: {formatPrice(grandTotal, currency)}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button
                onClick={onClose}
                className="flex-1 md:flex-none px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition text-sm"
              >
                Close
              </button>
              <div className="relative">
                <button
                  onClick={handleShareLink}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Link
                </button>
                {shareTooltip && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
                    Link copied!
                  </div>
                )}
              </div>
              <button
                onClick={handleDownloadPdf}
                className="flex-1 md:flex-none px-5 py-2.5 bg-saree-teal text-white rounded-lg font-medium hover:bg-saree-teal-dark transition flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstimateDetailsModal
