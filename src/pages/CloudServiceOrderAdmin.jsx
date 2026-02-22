import React, { useState, useEffect, useRef, useCallback } from 'react'

const CMS_BASE = import.meta.env.VITE_CMS_URL || 'http://38.242.248.213:4002'

const CATEGORY_ICONS = {
  compute: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  storage: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  network: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  backup: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  security: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  marketplace: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  monitoring: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  other: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
}

const CATEGORY_COLORS = {
  compute: 'bg-blue-50 text-blue-700',
  storage: 'bg-purple-50 text-purple-700',
  network: 'bg-cyan-50 text-cyan-700',
  backup: 'bg-amber-50 text-amber-700',
  security: 'bg-green-50 text-green-700',
  marketplace: 'bg-pink-50 text-pink-700',
  monitoring: 'bg-orange-50 text-orange-700',
  other: 'bg-gray-50 text-gray-700',
}

export default function CloudServiceOrderAdmin() {
  const [services, setServices] = useState([])
  const [originalServices, setOriginalServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [hasChanges, setHasChanges] = useState(false)

  // Drag state
  const dragItem = useRef(null)
  const dragOverItem = useRef(null)
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${CMS_BASE}/api/cloud-pricing/service-order`)
      if (!res.ok) throw new Error('Failed to fetch services')
      const data = await res.json()
      // Apply same sort as CloudPricingCalculator: if custom order exists, use it;
      // otherwise plans-first then alphabetical
      const hasCustomOrder = data.some(s => s.display_order > 0)
      const sorted = [...data].sort((a, b) => {
        if (hasCustomOrder) {
          if (a.display_order > 0 && b.display_order === 0) return -1
          if (a.display_order === 0 && b.display_order > 0) return 1
          if (a.display_order > 0 && b.display_order > 0) return a.display_order - b.display_order
          return a.name.localeCompare(b.name)
        }
        // Default: services with plans first, then alphabetical
        if (a.plan_count > 0 && b.plan_count === 0) return -1
        if (a.plan_count === 0 && b.plan_count > 0) return 1
        return a.name.localeCompare(b.name)
      })
      setServices(sorted)
      setOriginalServices(JSON.parse(JSON.stringify(sorted)))
      setHasChanges(false)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  // Build categories dynamically from API data — no hardcoding
  const categories = ['all', ...Array.from(new Set(services.map(s => s.category || 'other')))]

  const filteredServices = categoryFilter === 'all'
    ? services
    : services.filter(s => (s.category || 'other') === categoryFilter)

  // Drag handlers
  const handleDragStart = (index) => {
    dragItem.current = index
    setDragIndex(index)
  }

  const handleDragEnter = (index) => {
    dragOverItem.current = index
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }

    // When filtering by category, we need to map filtered indices back to the full list
    if (categoryFilter !== 'all') {
      const filteredIds = filteredServices.map(s => s.id)
      const fromId = filteredIds[dragItem.current]
      const toId = filteredIds[dragOverItem.current]
      const fromFullIndex = services.findIndex(s => s.id === fromId)
      const toFullIndex = services.findIndex(s => s.id === toId)

      if (fromFullIndex !== -1 && toFullIndex !== -1) {
        const updated = [...services]
        const [removed] = updated.splice(fromFullIndex, 1)
        updated.splice(toFullIndex, 0, removed)
        setServices(updated)
        setHasChanges(true)
      }
    } else {
      const updated = [...services]
      const [removed] = updated.splice(dragItem.current, 1)
      updated.splice(dragOverItem.current, 0, removed)
      setServices(updated)
      setHasChanges(true)
    }

    dragItem.current = null
    dragOverItem.current = null
    setDragIndex(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const publishOrder = async () => {
    try {
      setSaving(true)
      const order = services.map((s, i) => ({ id: s.id, display_order: i + 1 }))
      const res = await fetch(`${CMS_BASE}/api/cloud-pricing/service-order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      })
      if (!res.ok) throw new Error('Failed to save order')
      const data = await res.json()
      setMessage({ type: 'success', text: data.message || 'Order published successfully' })
      setOriginalServices(JSON.parse(JSON.stringify(services)))
      setHasChanges(false)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const resetOrder = async () => {
    if (!window.confirm('Reset all services to default alphabetical order?')) return
    try {
      setSaving(true)
      const res = await fetch(`${CMS_BASE}/api/cloud-pricing/service-order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: [] }),
      })
      if (!res.ok) throw new Error('Failed to reset order')
      setMessage({ type: 'success', text: 'Order reset to default (alphabetical)' })
      await fetchServices()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const discardChanges = () => {
    setServices(JSON.parse(JSON.stringify(originalServices)))
    setHasChanges(false)
  }

  // Auto-dismiss messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const hasCustomOrder = services.some(s => s.display_order > 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <span className="ml-3 text-gray-600">Loading services...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 mt-1">
            Drag and drop service tiles to set the display order on the Cloud Pricing page.
            {hasCustomOrder && <span className="ml-2 text-teal-600 font-medium">Custom order active</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <button
              onClick={discardChanges}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Discard
            </button>
          )}
          <button
            onClick={resetOrder}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Reset to Default
          </button>
          <button
            onClick={publishOrder}
            disabled={saving || !hasChanges}
            className="px-5 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Publishing...' : 'Publish Order'}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize transition ${
              categoryFilter === cat
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? `All (${services.length})` : `${cat} (${services.filter(s => (s.category || 'other') === cat).length})`}
          </button>
        ))}
      </div>

      {/* Info */}
      <p className="text-xs text-gray-400">
        {hasChanges ? 'You have unsaved changes. Click "Publish Order" to apply.' : 'Showing current display order. Drag tiles to reorder.'}
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredServices.map((service, index) => {
          const isDragging = dragIndex === index
          const isDragOver = dragOverIndex === index && dragOverIndex !== dragIndex

          return (
            <div
              key={service.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              className={`relative bg-white rounded-xl border p-4 cursor-grab active:cursor-grabbing transition-all select-none ${
                isDragging
                  ? 'opacity-40 border-gray-300 scale-95'
                  : isDragOver
                  ? 'border-teal-500 shadow-md ring-2 ring-teal-200'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {/* Position badge */}
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-xs font-medium flex items-center justify-center">
                {categoryFilter === 'all'
                  ? services.indexOf(service) + 1
                  : index + 1}
              </div>

              {/* Drag handle */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-0.5 pt-1 text-gray-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm0 6a2 2 0 10.001 4.001A2 2 0 007 8zm0 6a2 2 0 10.001 4.001A2 2 0 007 14zm6-8a2 2 0 10-.001-4.001A2 2 0 0013 6zm0 2a2 2 0 10.001 4.001A2 2 0 0013 8zm0 6a2 2 0 10.001 4.001A2 2 0 0013 14z" />
                  </svg>
                </div>

                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  service.plan_count > 0
                    ? 'bg-teal-50 text-teal-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {CATEGORY_ICONS[service.category] || CATEGORY_ICONS.other}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate pr-6">
                    {service.name}
                  </h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                    CATEGORY_COLORS[service.category] || CATEGORY_COLORS.other
                  }`}>
                    {service.category_name || service.category || 'Other'}
                  </span>
                  {service.plan_count > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{service.plan_count} plans</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No services found{categoryFilter !== 'all' ? ` in "${categoryFilter}" category` : ''}.
        </div>
      )}
    </div>
  )
}
