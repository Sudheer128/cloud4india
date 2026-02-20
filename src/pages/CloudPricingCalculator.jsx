import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAllApiData } from '../services/cloud4indiaApi'
import { useCart } from '../context/CartContext'
import { BILLING_CYCLES, CURRENCIES, formatPrice, getPriceForCycle, getBillingCycle, formatMemory, applyPricingSettings, getGstPercent } from '../utils/pricingHelpers'
import EstimateDetailsModal from '../components/PriceEstimator/EstimateDetailsModal'

// ============================================================================
// CLOUD4INDIA PRICE ESTIMATOR - Service Selection First, Then Step-by-Step
// ============================================================================

// Service Category Icons
const CATEGORY_ICONS = {
  compute: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  storage: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  network: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  backup: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  security: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  marketplace: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  monitoring: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  other: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
}

// Data Center Locations
const LOCATIONS = [
  { id: 'noida', name: 'NOIDA', country: 'India', region: 'Asia', flag: '🇮🇳' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', region: 'Asia', flag: '🇮🇳' },
  { id: 'us', name: 'US', country: 'United States', region: 'North America', flag: '🇺🇸' },
  { id: 'uae', name: 'UAE', country: 'United Arab Emirates', region: 'Asia', flag: '🇦🇪' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', region: 'Asia', flag: '🇸🇬' },
  { id: 'europe', name: 'Europe', country: 'Germany', region: 'Europe', flag: '🇩🇪' },
]

// OS Logos as SVG components
const OSLogos = {
  ubuntu: (
    <svg viewBox="0 0 32 32" className="w-10 h-10">
      <circle cx="16" cy="16" r="14" fill="#E95420"/>
      <circle cx="16" cy="8" r="3" fill="white"/>
      <circle cx="9" cy="20" r="3" fill="white"/>
      <circle cx="23" cy="20" r="3" fill="white"/>
    </svg>
  ),
  centos: (
    <svg viewBox="0 0 32 32" className="w-10 h-10">
      <rect width="32" height="32" rx="4" fill="#262577"/>
      <rect x="2" y="2" width="13" height="13" fill="#9CCD2A"/>
      <rect x="17" y="2" width="13" height="13" fill="#F8E14B"/>
      <rect x="2" y="17" width="13" height="13" fill="#932279"/>
      <rect x="17" y="17" width="13" height="13" fill="#262577"/>
    </svg>
  ),
  debian: (
    <svg viewBox="0 0 32 32" className="w-10 h-10">
      <circle cx="16" cy="16" r="14" fill="#A80030"/>
      <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">D</text>
    </svg>
  ),
  redhat: (
    <svg viewBox="0 0 32 32" className="w-10 h-10">
      <circle cx="16" cy="16" r="14" fill="#EE0000"/>
      <ellipse cx="16" cy="14" rx="10" ry="7" fill="#CC0000"/>
      <ellipse cx="16" cy="13" rx="7" ry="4" fill="#EE0000"/>
    </svg>
  ),
  almalinux: (
    <svg viewBox="0 0 32 32" className="w-10 h-10">
      <circle cx="16" cy="16" r="14" fill="#0F4266"/>
      <text x="16" y="21" textAnchor="middle" fill="#FF6600" fontSize="14" fontWeight="bold">A</text>
    </svg>
  ),
  rocky: (
    <svg viewBox="0 0 32 32" className="w-10 h-10">
      <circle cx="16" cy="16" r="14" fill="#10B981"/>
      <polygon points="16,6 24,24 8,24" fill="white"/>
    </svg>
  ),
  windows: (
    <svg viewBox="0 0 32 32" className="w-10 h-10">
      <rect x="2" y="2" width="13" height="13" fill="#0078D4"/>
      <rect x="17" y="2" width="13" height="13" fill="#0078D4"/>
      <rect x="2" y="17" width="13" height="13" fill="#0078D4"/>
      <rect x="17" y="17" width="13" height="13" fill="#0078D4"/>
    </svg>
  ),
  cloudlinux: (
    <svg viewBox="0 0 32 32" className="w-10 h-10">
      <circle cx="16" cy="16" r="14" fill="#1E3A5F"/>
      <path d="M8 16 Q16 8 24 16 Q16 24 8 16" fill="#00A4E4"/>
    </svg>
  ),
  default: (
    <svg viewBox="0 0 32 32" className="w-10 h-10">
      <circle cx="16" cy="16" r="14" fill="#6B7280"/>
      <text x="16" y="20" textAnchor="middle" fill="white" fontSize="10">OS</text>
    </svg>
  ),
}

const getOSLogo = (osName) => {
  const name = (osName || '').toLowerCase()
  if (name.includes('ubuntu')) return OSLogos.ubuntu
  if (name.includes('centos')) return OSLogos.centos
  if (name.includes('debian')) return OSLogos.debian
  if (name.includes('redhat') || name.includes('rhel')) return OSLogos.redhat
  if (name.includes('alma')) return OSLogos.almalinux
  if (name.includes('rocky')) return OSLogos.rocky
  if (name.includes('windows')) return OSLogos.windows
  if (name.includes('cloud')) return OSLogos.cloudlinux
  return OSLogos.default
}

// Marketplace app icons (since API returns same Ubuntu icon for all)
const getAppIcon = (appName) => {
  const name = (appName || '').toLowerCase()
  // Return emoji-based icons for marketplace apps
  if (name.includes('docker')) return '🐳'
  if (name.includes('jenkins')) return '🔧'
  if (name.includes('gitlab')) return '🦊'
  if (name.includes('wordpress')) return '📝'
  if (name.includes('mysql')) return '🐬'
  if (name.includes('mongodb')) return '🍃'
  if (name.includes('postgres')) return '🐘'
  if (name.includes('redis')) return '🔴'
  if (name.includes('nginx')) return '🟢'
  if (name.includes('apache') || name.includes('kafka')) return '🪶'
  if (name.includes('node')) return '💚'
  if (name.includes('python')) return '🐍'
  if (name.includes('laravel')) return '🔺'
  if (name.includes('lamp') || name.includes('lemp')) return '💡'
  if (name.includes('magento')) return '🛒'
  if (name.includes('nextcloud')) return '☁️'
  if (name.includes('rabbit')) return '🐰'
  if (name.includes('influx')) return '📊'
  if (name.includes('elastic') || name.includes('search')) return '🔍'
  if (name.includes('guacamole')) return '🥑'
  if (name.includes('media')) return '📺'
  if (name.includes('wiki')) return '📚'
  if (name.includes('maria')) return '🐬'
  if (name.includes('rethink')) return '💭'
  if (name.includes('active')) return '📨'
  if (name.includes('openlite')) return '⚡'
  return '📦' // default app icon
}

// Categorize products for better display
const getCategoryForProduct = (productName) => {
  const name = (productName || '').toLowerCase()
  // Security - Antivirus, EDR
  if (name.includes('antivirus') || name.includes('edr')) return 'security'
  // Backup - Server Backup, Acronis Backup (but not EDR)
  if (name.includes('backup') || name.includes('server backup')) return 'backup'
  // Managed Services
  if (name.includes('managed')) return 'managed'
  // Microsoft 365 products
  if (name.includes('microsoft') || name.includes('m365') || name.includes('365')) return 'microsoft'
  // Acronis products (not backup/edr)
  if (name.includes('acronis')) return 'backup'
  return 'other'
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CloudPricingCalculator = () => {
  // Navigation hook for routing
  const navigate = useNavigate()
  const { addItem: addToGlobalCart, removeItemByItemId: removeFromGlobalCart, clearCart: clearGlobalCart } = useCart()

  // API Data State
  const [loading, setLoading] = useState(true)
  const [apiData, setApiData] = useState(null)

  // View State: 'services' | 'configure'
  const [view, setView] = useState('services')
  const [selectedService, setSelectedService] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Wizard State (for configuration)
  const [currentStep, setCurrentStep] = useState(1)

  // Location State
  const [selectedLocation, setSelectedLocation] = useState('noida')
  const [locationFilter, setLocationFilter] = useState('all')

  // OS State
  const [selectedOS, setSelectedOS] = useState(null)
  const [selectedVersion, setSelectedVersion] = useState('')
  const [osTab, setOsTab] = useState('linux')

  // Compute State
  const [computeTab, setComputeTab] = useState('all')
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [customCpu, setCustomCpu] = useState('')
  const [customMemory, setCustomMemory] = useState('')
  const [useCustomPlan, setUseCustomPlan] = useState(false)

  // Disk/Storage State
  const [selectedDisk, setSelectedDisk] = useState(null)
  const [customDiskSize, setCustomDiskSize] = useState('')
  const [useCustomDisk, setUseCustomDisk] = useState(false)
  const [storageCategory, setStorageCategory] = useState('nvme')

  // Network State
  const [networkType, setNetworkType] = useState('elastic')
  const [publicIP, setPublicIP] = useState(true)

  // Addons State (uses Products from API)
  const [selectedAddons, setSelectedAddons] = useState([])

  // Licence State (Windows/RedHat pricing)
  const [selectedLicence, setSelectedLicence] = useState(null)

  // Estimate State
  const [currency, setCurrency] = useState('INR')
  const [billing, setBilling] = useState('monthly')
  const [cart, setCart] = useState([])
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Load API Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllApiData('default')
        setApiData(data)
        // Apply dynamic pricing settings (GST, currency rates, billing discounts)
        if (data?.pricingSettings) {
          applyPricingSettings(data.pricingSettings)
        }
        // Set default OS from templates (prefer AlmaLinux or Ubuntu)
        if (data?.templates?.length > 0) {
          const linuxTemplates = data.templates.filter(t =>
            t.image_type === 'Operating System' &&
            t.operating_system?.family === 'Linux'
          )
          const defaultOS = linuxTemplates.find(t =>
            t.name.toLowerCase().includes('alma')
          ) || linuxTemplates.find(t =>
            t.name.toLowerCase().includes('ubuntu')
          ) || linuxTemplates[0]
          if (defaultOS) {
            setSelectedOS({
              id: defaultOS.id,
              name: defaultOS.name,
              slug: defaultOS.slug,
              icon_url: defaultOS.icon_url,
              operating_system: defaultOS.operating_system,
              operating_system_version: defaultOS.operating_system_version,
              type: 'os'
            })
          }
        }
      } catch (error) {
        console.error('Failed to load API data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Restore cart from shared estimate link
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const estimateParam = params.get('estimate')
      if (estimateParam && cart.length === 0) {
        const decoded = JSON.parse(atob(estimateParam))
        if (Array.isArray(decoded) && decoded.length > 0) {
          // Store minimal cart data for reference - full restoration requires API data
          // This is a simplified restore that shows the shared estimate was received
          window.history.replaceState({}, '', window.location.pathname)
        }
      }
    } catch (e) {
      // Silently ignore malformed estimate params
    }
  }, [])

  // Get services grouped by category - ONLY services with plans
  const servicesByCategory = useMemo(() => {
    if (!apiData?.services) return {}
    const groups = {}
    apiData.services
      .filter(service => service.planCount > 0) // Only show services that have plans
      .forEach(service => {
        const cat = service.category || 'other'
        if (!groups[cat]) groups[cat] = []
        groups[cat].push(service)
      })
    return groups
  }, [apiData])

  // Count of services with plans
  const servicesWithPlans = useMemo(() => {
    if (!apiData?.services) return 0
    return apiData.services.filter(s => s.planCount > 0).length
  }, [apiData])

  // Count of all services (including those without plans)
  const totalServicesCount = useMemo(() => {
    if (!apiData?.services) return 0
    return apiData.services.length
  }, [apiData])

  // Unit pricing rates from API (Cloud4India/nimbo provider is the primary compute provider)
  const unitRates = useMemo(() => {
    const ps = apiData?.pricingSettings?.default_unit_rates
    const defaults = {
      cpu: ps?.cpu || 200,
      memory: ps?.memory || 100,
      storage: ps?.storage || 8,
      ip: ps?.ip || 150,
    }
    if (!apiData?.unitPricings?.length) return defaults
    // Find the primary compute provider (nimbo/Cloud4India/CloudStack)
    const computeProvider = apiData.unitPricings.find(up =>
      up.cloud_provider_name?.toLowerCase() === 'nimbo' ||
      up.cloud_provider_setup_name?.toLowerCase().includes('cloudstack')
    )
    if (!computeProvider) return defaults
    return {
      cpu: computeProvider.cpu_price || defaults.cpu,
      memory: computeProvider.memory_price || defaults.memory,
      storage: computeProvider.storage_price || defaults.storage,
      ip: computeProvider.ip_address_price || defaults.ip,
    }
  }, [apiData])

  // Get all categories
  const categories = useMemo(() => {
    return Object.keys(servicesByCategory).sort((a, b) => {
      const order = ['compute', 'storage', 'network', 'backup', 'security', 'monitoring', 'marketplace', 'other']
      return order.indexOf(a) - order.indexOf(b)
    })
  }, [servicesByCategory])

  // Filter services - only show services with plans
  const filteredServices = useMemo(() => {
    if (!apiData?.services) return []
    // Show ALL services from API (including those with 0 plans)
    // Sort: services with plans first, then alphabetically
    const allServices = [...apiData.services].sort((a, b) => {
      // Services with plans come first
      if (a.planCount > 0 && b.planCount === 0) return -1
      if (a.planCount === 0 && b.planCount > 0) return 1
      // Then sort alphabetically
      return a.name.localeCompare(b.name)
    })
    // Filter by category if needed
    if (categoryFilter === 'all') return allServices
    return allServices.filter(s => s.category === categoryFilter)
  }, [apiData, categoryFilter])

  // Get steps based on selected service type
  const getStepsForService = (service) => {
    if (!service) return []
    const slug = (service.slug || service.name || '').toLowerCase()

    // ============================================================
    // SERVICES THAT DON'T NEED LOCATION (Software/Global services)
    // ============================================================

    // Licence services - no location needed (software licenses are global)
    if (slug.includes('licence') || slug.includes('license')) {
      return [
        { id: 1, name: 'Config', desc: 'Select plan' },
        { id: 2, name: 'Review', desc: 'Confirm' },
      ]
    }

    // DNS Domain - no location needed (DNS is global)
    if (slug.includes('dns') || slug === 'domain') {
      return [
        { id: 1, name: 'Config', desc: 'Select plan' },
        { id: 2, name: 'Review', desc: 'Confirm' },
      ]
    }

    // Addon services - no location needed (software add-ons)
    if (slug === 'addon' || slug === 'addons') {
      return [
        { id: 1, name: 'Config', desc: 'Select plan' },
        { id: 2, name: 'Review', desc: 'Confirm' },
      ]
    }

    // ============================================================
    // SERVICES THAT NEED LOCATION (Infrastructure services)
    // ============================================================

    // Virtual Machine - full wizard (exclude backup, snapshot, autoscale)
    if (slug === 'virtual-machine' || (slug.includes('virtual-machine') && !slug.includes('backup') && !slug.includes('autoscale'))) {
      return [
        { id: 1, name: 'Location', desc: 'Choose data center' },
        { id: 2, name: 'Image', desc: 'Select OS' },
        { id: 3, name: 'Compute', desc: 'CPU & Memory' },
        { id: 4, name: 'Storage', desc: 'Disk size' },
        { id: 5, name: 'Network', desc: 'Network config' },
        { id: 6, name: 'Addons', desc: 'Extra services' },
        { id: 7, name: 'Review', desc: 'Confirm' },
      ]
    }

    // Block Storage / NVMe - storage selection flow
    if (slug === 'block-storage' || slug === 'nvme' || slug === 'object-storage') {
      return [
        { id: 1, name: 'Location', desc: 'Choose data center' },
        { id: 2, name: 'Storage', desc: 'Size & Type' },
        { id: 3, name: 'Review', desc: 'Confirm' },
      ]
    }

    // Kubernetes
    if (slug.includes('kubernetes')) {
      return [
        { id: 1, name: 'Location', desc: 'Choose data center' },
        { id: 2, name: 'Cluster', desc: 'Node configuration' },
        { id: 3, name: 'Review', desc: 'Confirm' },
      ]
    }

    // Network services (VPC, Router, Load Balancer, IP, Bandwidth, Network)
    if (slug.includes('vpc') || slug.includes('router') || slug.includes('load-balancer') ||
        slug.includes('ip-address') || slug.includes('bandwidth') || slug === 'network') {
      return [
        { id: 1, name: 'Location', desc: 'Choose data center' },
        { id: 2, name: 'Config', desc: 'Select plan' },
        { id: 3, name: 'Review', desc: 'Confirm' },
      ]
    }

    // Backup services (Backups, Virtual Machine Backup, Veeam Backup)
    if (slug.includes('backup') || slug.includes('veeam')) {
      return [
        { id: 1, name: 'Location', desc: 'Choose data center' },
        { id: 2, name: 'Config', desc: 'Select plan' },
        { id: 3, name: 'Review', desc: 'Confirm' },
      ]
    }

    // Snapshot services (VM Snapshot, Block Storage Snapshot)
    if (slug.includes('snapshot')) {
      return [
        { id: 1, name: 'Location', desc: 'Choose data center' },
        { id: 2, name: 'Config', desc: 'Select plan' },
        { id: 3, name: 'Review', desc: 'Confirm' },
      ]
    }

    // Template/ISO services
    if (slug.includes('template') || slug.includes('iso')) {
      return [
        { id: 1, name: 'Location', desc: 'Choose data center' },
        { id: 2, name: 'Config', desc: 'Select plan' },
        { id: 3, name: 'Review', desc: 'Confirm' },
      ]
    }

    // Autoscale services
    if (slug.includes('autoscale')) {
      return [
        { id: 1, name: 'Location', desc: 'Choose data center' },
        { id: 2, name: 'Config', desc: 'Select plan' },
        { id: 3, name: 'Review', desc: 'Confirm' },
      ]
    }

    // Monitoring services
    if (slug.includes('monitoring')) {
      return [
        { id: 1, name: 'Location', desc: 'Choose data center' },
        { id: 2, name: 'Config', desc: 'Select plan' },
        { id: 3, name: 'Review', desc: 'Confirm' },
      ]
    }

    // VNF Appliance (Virtual Network Functions)
    if (slug.includes('vnf') || slug.includes('appliance')) {
      return [
        { id: 1, name: 'Location', desc: 'Choose data center' },
        { id: 2, name: 'Config', desc: 'Select plan' },
        { id: 3, name: 'Review', desc: 'Confirm' },
      ]
    }

    // Pool Card Subscription
    if (slug.includes('pool-card')) {
      return [
        { id: 1, name: 'Config', desc: 'Select plan' },
        { id: 2, name: 'Review', desc: 'Confirm' },
      ]
    }

    // Default - with location (most infrastructure services need it)
    return [
      { id: 1, name: 'Location', desc: 'Choose data center' },
      { id: 2, name: 'Config', desc: 'Select plan' },
      { id: 3, name: 'Review', desc: 'Confirm' },
    ]
  }

  const currentSteps = getStepsForService(selectedService)

  // Get VM Plans
  const vmPlans = useMemo(() => {
    if (!apiData?.plansByService) return []
    const vmService = Object.keys(apiData.plansByService).find(name =>
      name.toLowerCase().includes('virtual machine') && !name.toLowerCase().includes('backup')
    )
    return vmService ? apiData.plansByService[vmService] : []
  }, [apiData])

  // Get plans for selected service (sorted by price)
  const servicePlans = useMemo(() => {
    if (!selectedService || !apiData?.plansByService) return []
    const plans = apiData.plansByService[selectedService.name] || []
    // Sort by monthly_price ascending
    return [...plans].sort((a, b) => (a.monthly_price || 0) - (b.monthly_price || 0))
  }, [selectedService, apiData])

  // Helper function to categorize a VM plan
  const getVmPlanCategory = (plan) => {
    const categoryName = (plan.plan_category_name || '').toLowerCase()
    const planName = (plan.name || '').toUpperCase()

    // Check by plan_category_name first
    if (categoryName.includes('basic')) return 'basic'
    if (categoryName.includes('cpu')) return 'cpu'
    if (categoryName.includes('memory')) return 'memory'

    // Fallback to name prefix
    if (planName.startsWith('BP_') || planName.startsWith('BP-')) return 'basic'
    if (planName.startsWith('C1_') || planName.startsWith('C1-') ||
        planName.startsWith('CI_') || planName.startsWith('CI-')) return 'cpu'
    if (planName.startsWith('M1_') || planName.startsWith('M1-') ||
        planName.startsWith('MI_') || planName.startsWith('MI-') ||
        planName.startsWith('M2') || planName.startsWith('M3')) return 'memory'

    return 'other'
  }

  // Count plans by category for tabs
  const vmPlanCounts = useMemo(() => {
    const counts = { basic: 0, cpu: 0, memory: 0, all: vmPlans.length }
    vmPlans.forEach(plan => {
      const cat = getVmPlanCategory(plan)
      if (counts[cat] !== undefined) counts[cat]++
    })
    return counts
  }, [vmPlans])

  // Filter VM Plans by category based on name prefix and sort by memory/price
  // Filter by plan_category_name (from API), fallback to name prefix
  const filteredVmPlans = useMemo(() => {
    // If 'all' tab is selected, show all plans
    if (computeTab === 'all') {
      return [...vmPlans].sort((a, b) => {
        const memA = a.memory || 0
        const memB = b.memory || 0
        if (memA !== memB) return memA - memB
        return (a.monthly_price || 0) - (b.monthly_price || 0)
      })
    }

    const filtered = vmPlans.filter(plan => {
      const cat = getVmPlanCategory(plan)
      return cat === computeTab
    })

    // Sort by memory (ascending), then by monthly_price
    return filtered.sort((a, b) => {
      const memA = a.memory || 0
      const memB = b.memory || 0
      if (memA !== memB) return memA - memB
      return (a.monthly_price || 0) - (b.monthly_price || 0)
    })
  }, [vmPlans, computeTab])

  // Filter locations by region
  const filteredLocations = useMemo(() => {
    if (locationFilter === 'all') return LOCATIONS
    return LOCATIONS.filter(loc => loc.region.toLowerCase().includes(locationFilter.toLowerCase()))
  }, [locationFilter])

  // Group OS by type (using templates which have image_type) - deduplicated by name
  const osByType = useMemo(() => {
    if (!apiData?.templates) return { linux: [], windows: [], marketplace: [], iso: [] }

    const grouped = { linux: [], windows: [], marketplace: [], iso: [] }
    const seenNames = { linux: new Set(), windows: new Set(), marketplace: new Set(), iso: new Set() }

    apiData.templates.forEach(template => {
      const imageType = template.image_type || ''
      const family = template.operating_system?.family || ''
      const name = template.name

      if (imageType === 'Market Place App') {
        // Skip if already seen this name in marketplace
        if (seenNames.marketplace.has(name)) return
        seenNames.marketplace.add(name)
        grouped.marketplace.push({
          id: template.id,
          name: name,
          slug: template.slug,
          icon_url: template.icon_url,
          operating_system: template.operating_system,
          type: 'marketplace'
        })
      } else if (imageType === 'ISO Image') {
        if (seenNames.iso.has(name)) return
        seenNames.iso.add(name)
        grouped.iso.push({
          id: template.id,
          name: name,
          slug: template.slug,
          icon_url: template.icon_url,
          operating_system: template.operating_system,
          type: 'iso'
        })
      } else if (imageType === 'Operating System') {
        if (family === 'Windows') {
          if (seenNames.windows.has(name)) return
          seenNames.windows.add(name)
          grouped.windows.push({
            id: template.id,
            name: name,
            slug: template.slug,
            icon_url: template.icon_url,
            operating_system: template.operating_system,
            operating_system_version: template.operating_system_version,
            type: 'os'
          })
        } else {
          if (seenNames.linux.has(name)) return
          seenNames.linux.add(name)
          grouped.linux.push({
            id: template.id,
            name: name,
            slug: template.slug,
            icon_url: template.icon_url,
            operating_system: template.operating_system,
            operating_system_version: template.operating_system_version,
            type: 'os'
          })
        }
      }
    })

    return grouped
  }, [apiData])

  // Get templates for selected OS
  const osVersions = useMemo(() => {
    if (!selectedOS || !apiData?.templates) return []
    return apiData.templates.filter(t =>
      t.operating_system_id === selectedOS.id ||
      t.name?.toLowerCase().includes(selectedOS.name?.toLowerCase())
    )
  }, [selectedOS, apiData])

  // Get disk options from Block Storage service plans (sorted by size)
  const diskOptions = useMemo(() => {
    if (!apiData?.plansByService) return []
    const blockStoragePlans = apiData.plansByService['Block Storage'] || []
    return [...blockStoragePlans]
      .map(plan => ({
        id: plan.id,
        name: plan.name,
        size: plan.size || plan.storage || parseInt(plan.name) || 0,
        monthly: plan.monthly_price || 0,
        hourly: plan.hourly_price || 0,
        storage_category: plan.storage_category_name || 'NVMe',
      }))
      .sort((a, b) => a.size - b.size)
  }, [apiData])

  // Get Products from API (Acronis, Server Backup, M365, Managed Services)
  const availableProducts = useMemo(() => {
    if (!apiData?.products) return []
    return apiData.products
      .filter(p => p.status !== false)
      .map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        monthly_price: p.monthly_price || 0,
        description: p.description || '',
        category: getCategoryForProduct(p.name),
      }))
      .sort((a, b) => (a.monthly_price || 0) - (b.monthly_price || 0))
  }, [apiData])

  // Get Licences from API (Windows, RedHat)
  const availableLicences = useMemo(() => {
    if (!apiData?.licences) return []
    return apiData.licences.map(l => ({
      id: l.id,
      name: l.name,
      slug: l.slug,
      pricing_unit: l.pricing_unit || 'per instance',
      monthly_price: l.monthly_price || 0,
    }))
  }, [apiData])

  // Auto-select licence based on OS (using template's operating_system)
  const applicableLicence = useMemo(() => {
    if (!selectedOS || !availableLicences.length) return null

    // Get OS name from template's operating_system or template name
    const osName = (selectedOS.operating_system?.name || selectedOS.name || '').toLowerCase()
    const osFamily = (selectedOS.operating_system?.family || '').toLowerCase()

    // Windows licence (per core)
    if (osFamily === 'windows' || osName.includes('windows')) {
      return availableLicences.find(l =>
        l.name.toLowerCase().includes('windows') && l.name.toLowerCase().includes('standard')
      )
    }

    // RedHat licence (per instance)
    if (osName.includes('redhat') || osName.includes('rhel')) {
      return availableLicences.find(l => l.name.toLowerCase().includes('redhat'))
    }

    return null // Linux (free)
  }, [selectedOS, availableLicences])

  // Calculate Prices
  const calculatePrice = () => {
    let monthly = 0, hourly = 0
    const slug = (selectedService?.slug || selectedService?.name || '').toLowerCase()
    const num = (v) => parseFloat(v) || 0

    // VM pricing
    if (slug.includes('virtual-machine') && !slug.includes('backup')) {
      // Compute
      if (useCustomPlan && customCpu && customMemory) {
        monthly += parseFloat(customCpu) * unitRates.cpu + parseFloat(customMemory) * unitRates.memory
        hourly += monthly / 730
      } else if (selectedPlan) {
        monthly += num(selectedPlan.monthly_price)
        hourly += num(selectedPlan.hourly_price)
      }

      // Disk
      if (useCustomDisk && customDiskSize) {
        monthly += parseFloat(customDiskSize) * unitRates.storage
        hourly += (parseFloat(customDiskSize) * unitRates.storage) / 730
      } else if (selectedDisk) {
        monthly += num(selectedDisk.monthly || selectedDisk.monthly_price)
        hourly += num(selectedDisk.hourly || selectedDisk.hourly_price)
      }

      // Public IP
      if (publicIP) {
        monthly += unitRates.ip
        hourly += unitRates.ip / 730
      }

      // OS Licence (Windows per core, RedHat per instance)
      if (applicableLicence) {
        const licencePrice = num(applicableLicence.monthly_price)
        // Windows is per core - multiply by CPU count
        if (applicableLicence.pricing_unit === 'per core') {
          const cpuCount = useCustomPlan ? parseInt(customCpu) || 1 : (selectedPlan?.cpu || 1)
          monthly += licencePrice * cpuCount
          hourly += (licencePrice * cpuCount) / 730
        } else {
          // RedHat is per instance
          monthly += licencePrice
          hourly += licencePrice / 730
        }
      }

      // Addons (Products from API)
      selectedAddons.forEach(addon => {
        const addonPrice = num(addon.monthly_price)
        monthly += addonPrice
        hourly += addonPrice / 730
      })
    }
    // Object Storage pricing (uses selectedPlan)
    else if (slug === 'object-storage') {
      if (selectedPlan) {
        monthly += num(selectedPlan.monthly_price)
        hourly += num(selectedPlan.hourly_price)
      }
    }
    // Block Storage / NVMe pricing (uses selectedDisk)
    else if (slug === 'block-storage' || slug === 'nvme') {
      if (useCustomDisk && customDiskSize) {
        monthly += parseFloat(customDiskSize) * unitRates.storage
        hourly += (parseFloat(customDiskSize) * unitRates.storage) / 730
      } else if (selectedDisk) {
        monthly += num(selectedDisk.monthly)
        hourly += num(selectedDisk.hourly)
      }
    }
    // Other services - use plan pricing
    else if (selectedPlan) {
      monthly += num(selectedPlan.monthly_price)
      hourly += num(selectedPlan.hourly_price)
    }

    return { monthly, hourly }
  }

  const currentPrice = calculatePrice()

  // Navigation
  const goNext = () => currentStep < currentSteps.length && setCurrentStep(currentStep + 1)
  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      // Go back to service selection
      setView('services')
      setSelectedService(null)
      resetConfig()
    }
  }
  const goToStep = (step) => step <= currentStep && setCurrentStep(step)

  const canGoNext = () => {
    const slug = (selectedService?.slug || selectedService?.name || '').toLowerCase()

    if (slug.includes('virtual-machine') && !slug.includes('backup')) {
      if (currentStep === 1) return !!selectedLocation
      if (currentStep === 2) return !!selectedOS
      if (currentStep === 3) return !!selectedPlan || (useCustomPlan && customCpu && customMemory)
      if (currentStep === 4) return !!selectedDisk || (useCustomDisk && customDiskSize)
      return true
    }

    // Object Storage (uses plans, not disk options)
    if (slug === 'object-storage') {
      if (currentStep === 1) return !!selectedLocation
      if (currentStep === 2) return !!selectedPlan
      return true
    }

    // Block Storage / NVMe (uses disk options)
    if (slug === 'block-storage' || slug === 'nvme') {
      if (currentStep === 1) return !!selectedLocation
      if (currentStep === 2) return !!selectedDisk || (useCustomDisk && customDiskSize)
      return true
    }

    // Other services
    if (currentStep === 1) return !!selectedLocation || servicePlans.length === 0
    return true
  }

  // Reset configuration
  const resetConfig = () => {
    setCurrentStep(1)
    setSelectedPlan(null)
    setSelectedDisk(null)
    setSelectedAddons([])
    setUseCustomPlan(false)
    setUseCustomDisk(false)
    setCustomCpu('')
    setCustomMemory('')
    setCustomDiskSize('')
    setSelectedLocation('noida')
    setPublicIP(true)
    setNetworkType('elastic')
  }

  // Select a service and start configuration
  const selectService = (service) => {
    setSelectedService(service)
    resetConfig()
    setView('configure')
  }

  // Add to cart (or update existing item if editing)
  const addToCart = () => {
    const slug = (selectedService?.slug || selectedService?.name || '').toLowerCase()
    let item = {
      id: editingItem ? editingItem.id : Date.now(),
      service: selectedService,
      location: LOCATIONS.find(l => l.id === selectedLocation),
      price: currentPrice,
      quantity: editingItem ? (editingItem.quantity || 1) : 1,
      notes: editingItem ? (editingItem.notes || '') : '',
    }

    if (slug.includes('virtual-machine') && !slug.includes('backup')) {
      const osFamily = selectedOS?.operating_system?.family?.toLowerCase() || selectedOS?.name?.toLowerCase() || ''
      const applicableLicence = apiData?.licences?.find(l => {
        const lname = l.name.toLowerCase()
        if (osFamily.includes('windows') && lname.includes('windows')) return true
        if ((osFamily.includes('redhat') || osFamily.includes('red hat')) && lname.includes('redhat')) return true
        return false
      })

      item = {
        ...item,
        os: selectedOS,
        plan: useCustomPlan ? { name: `Custom (${customCpu} vCPU, ${customMemory} GB)`, cpu: customCpu, memory: customMemory, custom: true } : selectedPlan,
        disk: useCustomDisk ? { name: `${customDiskSize} GB NVMe`, size: customDiskSize, custom: true } : selectedDisk,
        network: networkType,
        publicIP,
        addons: [...selectedAddons],
        licence: applicableLicence || null,
        billingCycle: billing,
      }
    } else if (slug === 'object-storage') {
      item = {
        ...item,
        plan: selectedPlan,
        storageType: 'Object Storage',
        billingCycle: billing,
      }
    } else if (slug === 'block-storage' || slug === 'nvme') {
      item = {
        ...item,
        disk: useCustomDisk ? { name: `${customDiskSize} GB`, size: customDiskSize, custom: true } : selectedDisk,
        storageType: storageCategory,
        billingCycle: billing,
      }
    } else if (selectedPlan) {
      item = {
        ...item,
        plan: selectedPlan,
        billingCycle: billing,
      }
    }

    if (editingItem) {
      // Replace existing item in cart
      setCart(cart.map(c => c.id === editingItem.id ? item : c))
      // Remove old global cart entry and add updated one
      if (editingItem.globalCartId) {
        removeFromGlobalCart(editingItem.globalCartId)
      }
    } else {
      setCart([...cart, item])
    }

    // Push to global CartContext for quotation flow
    const planName = item.plan?.name || item.disk?.name || selectedService?.name || ''
    const specs = []
    if (item.os) specs.push(`OS: ${item.os.name}`)
    if (item.plan && !item.plan.custom) specs.push(`Plan: ${item.plan.name}`)
    if (item.plan?.custom) specs.push(`CPU: ${item.plan.cpu} vCPU`, `RAM: ${item.plan.memory} GB`)
    if (item.disk) specs.push(`Disk: ${item.disk.name}`)
    if (item.location) specs.push(`Location: ${item.location.name}`)

    const billingCyclePrice = getPriceForCycle(item.price.monthly, billing)
    const globalCartId = editingItem?.globalCartId || `cloud-${selectedService?.slug || 'service'}-${item.id}`
    addToGlobalCart({
      item_id: globalCartId,
      item_type: 'cloud_service',
      item_name: selectedService?.name || 'Cloud Service',
      plan_name: planName,
      duration: billing,
      unit_price: billingCyclePrice,
      monthly_base_price: item.price.monthly,
      quantity: item.quantity,
      specifications: specs,
      features: []
    })

    item.globalCartId = globalCartId

    setEditingItem(null)
    setView('services')
    setSelectedService(null)
    resetConfig()
  }

  const removeFromCart = (id) => {
    const item = cart.find(i => i.id === id)
    if (item?.globalCartId) {
      removeFromGlobalCart(item.globalCartId)
    }
    setCart(cart.filter(i => i.id !== id))
  }

  const updateCartQuantity = (id, qty) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, Math.min(99, qty)) } : item))
  }

  const updateCartNotes = (id, notes) => {
    setCart(cart.map(item => item.id === id ? { ...item, notes } : item))
  }

  const clearAllCart = () => {
    cart.forEach(item => {
      if (item.globalCartId) removeFromGlobalCart(item.globalCartId)
    })
    setCart([])
  }

  const editCartItem = (item) => {
    setEditingItem(item)
    setShowDetailsModal(false)
    // Pre-fill wizard state from saved item
    const service = item.service
    setSelectedService(service)
    if (item.location) setSelectedLocation(item.location.id)
    if (item.os) { setSelectedOS(item.os) }
    if (item.plan) {
      if (item.plan.custom) {
        setUseCustomPlan(true)
        setCustomCpu(item.plan.cpu)
        setCustomMemory(item.plan.memory)
      } else {
        setUseCustomPlan(false)
        setSelectedPlan(item.plan)
      }
    }
    if (item.disk) {
      if (item.disk.custom) {
        setUseCustomDisk(true)
        setCustomDiskSize(item.disk.size)
      } else {
        setUseCustomDisk(false)
        setSelectedDisk(item.disk)
      }
    }
    if (item.network) setNetworkType(item.network)
    if (item.publicIP !== undefined) setPublicIP(item.publicIP)
    if (item.addons) setSelectedAddons([...item.addons])
    if (item.storageType) setStorageCategory(item.storageType)
    if (item.billingCycle) setBilling(item.billingCycle)
    setCurrentStep(1)
    setView('configure')
  }

  const cancelEdit = () => {
    setEditingItem(null)
    resetConfig()
    setView('services')
    setSelectedService(null)
  }

  const cartTotal = cart.reduce((sum, item) => {
    const qty = item.quantity || 1
    return {
      monthly: sum.monthly + (parseFloat(item.price.monthly) || 0) * qty,
      hourly: sum.hourly + (parseFloat(item.price.hourly) || 0) * qty,
    }
  }, { monthly: 0, hourly: 0 })

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saree-teal-light/30 via-white to-phulkari-turquoise-light/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading services from Cloud4India...</p>
        </div>
      </div>
    )
  }

  // ============================================================================
  // SERVICE SELECTION VIEW
  // ============================================================================
  if (view === 'services') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saree-teal-light/30 via-white to-phulkari-turquoise-light/30">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cloud Price Estimator</h1>
                <p className="text-sm text-gray-500">Select a service to configure and get instant pricing</p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={billing}
                  onChange={(e) => setBilling(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {BILLING_CYCLES.map(cycle => (
                    <option key={cycle.id} value={cycle.id}>{cycle.label}</option>
                  ))}
                </select>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {Object.keys(CURRENCIES).map(c => (
                    <option key={c} value={c}>{CURRENCIES[c]} {c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Category Filter */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      categoryFilter === 'all'
                        ? 'bg-saree-teal text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Services ({totalServicesCount})
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition flex items-center gap-2 ${
                        categoryFilter === cat
                          ? 'bg-saree-teal text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {CATEGORY_ICONS[cat] || CATEGORY_ICONS.other}
                      {cat} ({servicesByCategory[cat]?.length || 0})
                    </button>
                  ))}
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map(service => (
                  <button
                    key={service.id}
                    onClick={() => selectService(service)}
                    className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-saree-teal hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition ${
                        service.planCount > 0
                          ? 'bg-saree-teal-light/20 text-saree-teal-dark group-hover:bg-saree-teal group-hover:text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {CATEGORY_ICONS[service.category] || CATEGORY_ICONS.other}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-saree-teal-dark transition">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">{service.categoryName}</p>
                        {service.planCount > 0 ? (
                          <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {service.planCount} plans available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            Contact Sales
                          </span>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-saree-teal transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar - Cart */}
            <div className="w-80 hidden lg:block">
              <div className="bg-white rounded-xl border border-gray-200 sticky top-36">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-bold text-gray-900">Your Estimate</h2>
                  <p className="text-sm text-gray-500">{cart.length} item(s) added</p>
                </div>

                {/* Cart Items */}
                {cart.length > 0 ? (
                  <div className="p-4 border-b border-gray-200 max-h-64 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{item.service?.name}</div>
                          <div className="text-xs text-gray-500">
                            {item.location?.name}
                            {item.plan && ` • ${item.plan.name}`}
                            {item.disk && ` • ${item.disk.name}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-saree-teal-dark font-medium text-sm whitespace-nowrap">
                            {formatPrice(getPriceForCycle(item.price.monthly, billing), currency)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 text-lg leading-none"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-sm">No items added yet</p>
                    <p className="text-xs mt-1">Select a service to start</p>
                  </div>
                )}

                {/* Grand Total */}
                <div className="p-4 bg-gray-50 rounded-b-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-saree-teal-dark">
                        {formatPrice(getPriceForCycle(cartTotal.monthly, billing), currency)}
                      </div>
                      <div className="text-sm text-gray-500">{getBillingCycle(billing).suffix}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 text-right mb-4">+ {getGstPercent()}% GST applicable</div>
                  {cart.length > 0 && (
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowDetailsModal(true)}
                        className="w-full py-3 bg-saree-teal text-white rounded-lg font-medium hover:bg-saree-teal-dark transition shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <EstimateDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          cart={cart}
          billing={billing}
          currency={currency}
          cartTotal={cartTotal}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateCartQuantity}
          onUpdateNotes={updateCartNotes}
          onEditItem={editCartItem}
          onClearAll={clearAllCart}
          gstRate={getGstPercent()}
        />
      </div>
    )
  }

  // ============================================================================
  // CONFIGURATION VIEW (Step-by-Step Wizard)
  // ============================================================================
  const slug = (selectedService?.slug || selectedService?.name || '').toLowerCase()
  // Determine service type for step rendering
  const isVM = slug === 'virtual-machine' || (slug.includes('virtual-machine') && !slug.includes('backup') && !slug.includes('autoscale'))
  const isStorage = slug === 'block-storage' || slug === 'nvme' || slug === 'object-storage' // Only actual storage services, not snapshots

  return (
    <div className="min-h-screen bg-gradient-to-br from-saree-teal-light/30 via-white to-phulkari-turquoise-light/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setView('services'); setSelectedService(null); resetConfig(); }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit' : 'Configure'} {selectedService?.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {editingItem ? 'Editing existing estimate item' : selectedService?.categoryName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={billing}
                onChange={(e) => setBilling(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                {BILLING_CYCLES.map(cycle => (
                  <option key={cycle.id} value={cycle.id}>{cycle.label}</option>
                ))}
              </select>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                {Object.keys(CURRENCIES).map(c => (
                  <option key={c} value={c}>{CURRENCIES[c]} {c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Progress Steps */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <div className="flex items-center">
                {currentSteps.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => goToStep(step.id)}
                      disabled={step.id > currentStep}
                      className={`flex items-center gap-2 ${step.id > currentStep ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${
                        currentStep === step.id ? 'bg-saree-teal text-white' :
                        currentStep > step.id ? 'bg-green-500 text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {currentStep > step.id ? '✓' : step.id}
                      </div>
                      <span className={`text-sm hidden lg:inline ${
                        currentStep === step.id ? 'text-gray-900 font-medium' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </span>
                    </button>
                    {idx < currentSteps.length - 1 && (
                      <div className={`flex-1 h-1 mx-2 rounded ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">

              {/* ========== LOCATION STEP (Common) ========== */}
              {currentSteps[currentStep - 1]?.name === 'Location' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Choose Location</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Select the data center where your {selectedService?.name} will be hosted.
                  </p>

                  {/* Region Tabs */}
                  <div className="flex gap-4 mb-6 border-b border-gray-200">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'asia', label: 'Asia' },
                      { id: 'north america', label: 'North America' },
                      { id: 'europe', label: 'Europe' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setLocationFilter(tab.id)}
                        className={`pb-3 text-sm font-medium border-b-2 transition ${
                          locationFilter === tab.id
                            ? 'text-saree-teal-dark border-saree-teal'
                            : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Location Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredLocations.map(loc => (
                      <button
                        key={loc.id}
                        onClick={() => setSelectedLocation(loc.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all relative ${
                          selectedLocation === loc.id
                            ? 'border-saree-teal bg-saree-teal-light/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {selectedLocation === loc.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-saree-teal rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{loc.flag}</span>
                          <div>
                            <div className="font-semibold text-saree-teal-dark">{loc.name}</div>
                            <div className="text-sm text-gray-500">{loc.country}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ========== IMAGE STEP (VM Only) ========== */}
              {isVM && currentSteps[currentStep - 1]?.name === 'Image' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Choose Image</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Pick an operating system or application template to install on your server.
                  </p>

                  {/* OS Type Tabs with counts */}
                  <div className="flex gap-4 mb-6 border-b border-gray-200">
                    {[
                      { id: 'linux', label: 'Linux', count: osByType.linux?.length || 0 },
                      { id: 'windows', label: 'Windows', count: osByType.windows?.length || 0 },
                      { id: 'marketplace', label: 'Marketplace Apps', count: osByType.marketplace?.length || 0 },
                      { id: 'iso', label: 'ISOs', count: osByType.iso?.length || 0 },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setOsTab(tab.id)}
                        className={`pb-3 text-sm font-medium border-b-2 transition flex items-center gap-2 ${
                          osTab === tab.id
                            ? 'text-saree-teal-dark border-saree-teal'
                            : 'text-gray-500 border-transparent hover:text-gray-700'
                        }`}
                      >
                        {tab.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          osTab === tab.id ? 'bg-saree-teal-light text-saree-teal-dark' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Image Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {(osByType[osTab] || []).map(item => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedOS(item)}
                        className={`p-4 rounded-lg border-2 transition-all relative ${
                          selectedOS?.id === item.id
                            ? 'border-saree-teal bg-saree-teal-light/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {selectedOS?.id === item.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-saree-teal rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <div className="flex flex-col items-center text-center">
                          {/* Use appropriate icon based on type */}
                          <div className="mb-2 w-10 h-10 flex items-center justify-center">
                            {item.type === 'marketplace' ? (
                              // Marketplace apps - use emoji icons (API has same Ubuntu icon for all)
                              <span className="text-3xl">{getAppIcon(item.name)}</span>
                            ) : item.type === 'iso' ? (
                              // ISO - use disc icon
                              <span className="text-3xl">💿</span>
                            ) : (
                              // OS - use API icon or fallback to SVG
                              <>
                                {item.icon_url ? (
                                  <img
                                    src={item.icon_url}
                                    alt={item.name}
                                    className="w-10 h-10 object-contain rounded"
                                    onError={(e) => {
                                      e.target.style.display = 'none'
                                      e.target.nextSibling.style.display = 'block'
                                    }}
                                  />
                                ) : null}
                                <div style={{ display: item.icon_url ? 'none' : 'block' }}>
                                  {getOSLogo(item.operating_system?.name || item.name)}
                                </div>
                              </>
                            )}
                          </div>
                          <div className="font-medium text-saree-teal-dark text-sm">{item.name}</div>
                          {item.operating_system_version && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.operating_system_version.version}
                            </div>
                          )}
                          {item.type === 'marketplace' && (
                            <span className="mt-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                              App
                            </span>
                          )}
                          {item.type === 'iso' && (
                            <span className="mt-2 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                              ISO
                            </span>
                          )}
                        </div>
                      </button>
                    ))}

                    {(osByType[osTab] || []).length === 0 && (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        No {osTab} images available. Contact sales for custom requirements.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========== COMPUTE STEP (VM Only) ========== */}
              {isVM && currentSteps[currentStep - 1]?.name === 'Compute' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Compute Offering</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Choose a plan based on CPU and memory requirements. {vmPlans.length} plans available.
                  </p>

                  {/* Category Tabs with dynamic counts */}
                  <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
                    {[
                      { id: 'all', label: 'All Plans', count: vmPlanCounts.all },
                      { id: 'basic', label: 'Basic', count: vmPlanCounts.basic },
                      { id: 'cpu', label: 'CPU Intensive', count: vmPlanCounts.cpu },
                      { id: 'memory', label: 'Memory Intensive', count: vmPlanCounts.memory },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setComputeTab(tab.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                          computeTab === tab.id
                            ? 'bg-saree-teal text-white'
                            : tab.count > 0
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-gray-50 text-gray-400'
                        }`}
                      >
                        {tab.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          computeTab === tab.id
                            ? 'bg-white/20 text-white'
                            : tab.count > 0
                              ? 'bg-gray-200 text-gray-600'
                              : 'bg-gray-100 text-gray-400'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Plans Table */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-600">
                      <div>Name</div>
                      <div>vCPU</div>
                      <div>Memory<br/><span className="text-xs font-normal text-gray-400">RAM</span></div>
                      <div className="text-red-500">Price<br/><span className="text-xs font-normal">Monthly</span></div>
                      <div>Price<br/><span className="text-xs font-normal text-gray-400">Hourly</span></div>
                    </div>

                    {/* Custom Plan Row */}
                    <div
                      onClick={() => { setUseCustomPlan(true); setSelectedPlan(null); }}
                      className={`grid grid-cols-5 items-center px-4 py-3 border-b border-gray-100 cursor-pointer transition ${
                        useCustomPlan ? 'bg-saree-teal-light/20' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-saree-teal-dark font-medium">Custom Plan</div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="CPU"
                          value={customCpu}
                          onChange={(e) => setCustomCpu(e.target.value)}
                          onClick={(e) => { e.stopPropagation(); setUseCustomPlan(true); setSelectedPlan(null); }}
                          className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm"
                          min="1"
                        />
                        <span className="text-gray-500 text-sm">vCPU</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Memory"
                          value={customMemory}
                          onChange={(e) => setCustomMemory(e.target.value)}
                          onClick={(e) => { e.stopPropagation(); setUseCustomPlan(true); setSelectedPlan(null); }}
                          className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm"
                          min="1"
                        />
                        <span className="text-gray-500 text-sm">GB</span>
                      </div>
                      <div className="text-red-500 font-medium">
                        {useCustomPlan && customCpu && customMemory
                          ? formatPrice((parseFloat(customCpu) * unitRates.cpu + parseFloat(customMemory) * unitRates.memory), currency)
                          : `${CURRENCIES[currency]}0.00`}
                        <span className="text-gray-400 text-xs"> /Month</span>
                      </div>
                      <div className="text-gray-600">
                        {useCustomPlan && customCpu && customMemory
                          ? formatPrice((parseFloat(customCpu) * unitRates.cpu + parseFloat(customMemory) * unitRates.memory) / 730, currency)
                          : `${CURRENCIES[currency]}0.00`}
                        <span className="text-gray-400 text-xs"> /Hour</span>
                      </div>
                    </div>

                    {/* Predefined Plans */}
                    <div className="max-h-80 overflow-y-auto">
                      {filteredVmPlans.length > 0 ? (
                        filteredVmPlans.map(plan => (
                          <div
                            key={plan.id}
                            onClick={() => { setSelectedPlan(plan); setUseCustomPlan(false); }}
                            className={`grid grid-cols-5 items-center px-4 py-3 border-b border-gray-100 cursor-pointer transition ${
                              selectedPlan?.id === plan.id && !useCustomPlan
                                ? 'bg-saree-teal-light/20 border-l-4 border-l-saree-teal'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div>
                              <div className="font-medium text-gray-900">{plan.name}</div>
                              {plan.plan_category_name && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                                  {plan.plan_category_name}
                                </span>
                              )}
                            </div>
                            <div><span className="font-semibold">{plan.cpu}</span> vCPU</div>
                            <div><span className="font-semibold text-saree-teal-dark">{formatMemory(plan.memory)}</span></div>
                            <div className="text-red-500 font-medium">
                              {formatPrice(plan.monthly_price, currency)}
                              <span className="text-gray-400 text-xs"> /mo</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">
                                {formatPrice(plan.hourly_price, currency)}
                                <span className="text-gray-400 text-xs"> /hr</span>
                              </span>
                              {selectedPlan?.id === plan.id && !useCustomPlan && (
                                <div className="w-5 h-5 bg-saree-teal rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-gray-500">
                          <p className="mb-2">No plans in this category.</p>
                          <button
                            onClick={() => setComputeTab('all')}
                            className="text-saree-teal-dark hover:underline text-sm"
                          >
                            View all {vmPlans.length} plans →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ========== STORAGE STEP ========== */}
              {currentSteps[currentStep - 1]?.name === 'Storage' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    {slug === 'object-storage' ? 'Configure Object Storage' : isStorage ? 'Configure Storage' : 'Disk Offering'} <span className="text-red-500">*</span>
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    {slug === 'object-storage'
                      ? 'Select an object storage plan with your required capacity and bucket limits.'
                      : 'Select storage size. NVMe storage provides faster read/write speeds.'}
                  </p>

                  {/* Object Storage Plans (special handling) */}
                  {slug === 'object-storage' ? (
                    servicePlans.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {servicePlans.map(plan => {
                          const storageGB = parseInt(plan.attribute?.storage) || 0;
                          const storageTB = storageGB >= 1024 ? (storageGB / 1024).toFixed(1) : null;
                          const bucketLimit = plan.attribute?.bucket_limit || plan.bucket_limit || 0;
                          const isSelected = selectedPlan?.id === plan.id;

                          return (
                            <div
                              key={plan.id}
                              onClick={() => setSelectedPlan(plan)}
                              className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-saree-teal bg-saree-teal-light/10 shadow-lg'
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-saree-teal rounded-full flex items-center justify-center shadow">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                              <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                  {storageTB ? `${storageTB} TB` : `${storageGB} GB`}
                                </div>
                                <div className="text-sm text-gray-500 mb-3">{plan.name}</div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Bucket Limit</span>
                                    <span className="font-medium text-gray-900">{bucketLimit}</span>
                                  </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <div className="text-xl font-bold text-saree-teal-dark">
                                    {formatPrice(plan.monthly_price, currency)}
                                    <span className="text-sm font-normal text-gray-500">/month</span>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatPrice(plan.hourly_price, currency)}/hour
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Contact sales for Object Storage pricing.</p>
                      </div>
                    )
                  ) : (
                    <>
                      {/* Storage Type Tabs (for block storage services) */}
                      {isStorage && slug !== 'object-storage' && (
                        <div className="flex gap-4 mb-6 border-b border-gray-200">
                          {[
                            { id: 'nvme', label: 'NVMe SSD' },
                            { id: 'ssd', label: 'Enterprise SSD' },
                            { id: 'hdd', label: 'HDD' },
                          ].map(tab => (
                            <button
                              key={tab.id}
                              onClick={() => setStorageCategory(tab.id)}
                              className={`pb-3 text-sm font-medium border-b-2 transition ${
                                storageCategory === tab.id
                                  ? 'text-saree-teal-dark border-saree-teal'
                                  : 'text-gray-500 border-transparent hover:text-gray-700'
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Disk Table */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Header */}
                        <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-600">
                          <div>Name</div>
                          <div>Storage Type</div>
                          <div>Size</div>
                          <div className="text-red-500">Price<br/><span className="text-xs font-normal">Monthly</span></div>
                          <div>Price<br/><span className="text-xs font-normal text-gray-400">Hourly</span></div>
                        </div>

                        {/* Custom Disk Row */}
                        <div
                          onClick={() => { setUseCustomDisk(true); setSelectedDisk(null); }}
                          className={`grid grid-cols-5 items-center px-4 py-3 border-b border-gray-100 cursor-pointer transition ${
                            useCustomDisk ? 'bg-saree-teal-light/20' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-saree-teal-dark font-medium">Custom</div>
                          <div className="text-gray-600 capitalize">{storageCategory || 'NVMe'}</div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="0"
                              value={customDiskSize}
                              onChange={(e) => setCustomDiskSize(e.target.value)}
                              onClick={(e) => { e.stopPropagation(); setUseCustomDisk(true); setSelectedDisk(null); }}
                              className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm"
                              min="1"
                            />
                            <span className="text-gray-500 text-sm">GB</span>
                          </div>
                          <div className="text-red-500 font-medium">
                            {useCustomDisk && customDiskSize
                              ? formatPrice(parseFloat(customDiskSize) * 8, currency)
                              : `${CURRENCIES[currency]}0.00`}
                            <span className="text-gray-400 text-xs"> /Month</span>
                          </div>
                          <div className="text-gray-600">
                            {useCustomDisk && customDiskSize
                              ? formatPrice((parseFloat(customDiskSize) * 8) / 730, currency)
                              : `${CURRENCIES[currency]}0.00`}
                            <span className="text-gray-400 text-xs"> /Hour</span>
                          </div>
                        </div>

                        {/* Predefined Disk Sizes */}
                        <div className="max-h-80 overflow-y-auto">
                          {diskOptions.length > 0 ? (
                            diskOptions.map(disk => (
                              <div
                                key={disk.id}
                                onClick={() => { setSelectedDisk(disk); setUseCustomDisk(false); }}
                                className={`grid grid-cols-5 items-center px-4 py-3 border-b border-gray-100 cursor-pointer transition ${
                                  selectedDisk?.id === disk.id && !useCustomDisk
                                    ? 'bg-saree-teal-light/20 border-l-4 border-l-saree-teal'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <div className="font-medium text-gray-900">{disk.name}</div>
                                <div className="text-gray-600">{disk.storage_category || 'NVMe'}</div>
                                <div><span className="font-semibold text-saree-teal-dark">{disk.size >= 1024 ? `${(disk.size/1024).toFixed(1)} TB` : `${disk.size} GB`}</span></div>
                                <div className="text-red-500 font-medium">
                                  {formatPrice(disk.monthly, currency)}
                                  <span className="text-gray-400 text-xs"> /mo</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">
                                    {formatPrice(disk.hourly, currency)}
                                    <span className="text-gray-400 text-xs"> /hr</span>
                                  </span>
                                  {selectedDisk?.id === disk.id && !useCustomDisk && (
                                    <div className="w-5 h-5 bg-saree-teal rounded-full flex items-center justify-center">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-8 text-center text-gray-500">
                              <p>No predefined storage plans available. Use custom size above.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ========== NETWORK STEP (VM Only) ========== */}
              {isVM && currentSteps[currentStep - 1]?.name === 'Network' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Choose Network</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Set up or choose a network for your server.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <button
                      onClick={() => setNetworkType('elastic')}
                      className={`p-5 rounded-lg border-2 text-left transition ${
                        networkType === 'elastic' ? 'border-saree-teal bg-saree-teal-light/20' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          networkType === 'elastic' ? 'border-saree-teal' : 'border-gray-300'
                        }`}>
                          {networkType === 'elastic' && <div className="w-3 h-3 rounded-full bg-saree-teal" />}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Elastic Network</div>
                          <div className="text-sm text-gray-500">Create a default EN under selected region.</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setNetworkType('vpc')}
                      className={`p-5 rounded-lg border-2 text-left transition ${
                        networkType === 'vpc' ? 'border-saree-teal bg-saree-teal-light/20' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          networkType === 'vpc' ? 'border-saree-teal' : 'border-gray-300'
                        }`}>
                          {networkType === 'vpc' && <div className="w-3 h-3 rounded-full bg-saree-teal" />}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">VPC Network</div>
                          <div className="text-sm text-gray-500">Create a default VPC under selected region.</div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Public IP */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-bold text-gray-900 mb-2">Public IP</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Choose whether you want your server to have a public IPv4 address.
                    </p>

                    <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                      publicIP ? 'border-saree-teal bg-saree-teal-light/20' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={publicIP}
                        onChange={(e) => setPublicIP(e.target.checked)}
                        className="w-5 h-5 text-saree-teal-dark rounded border-gray-300 focus:ring-saree-teal"
                      />
                      <span className="font-medium text-gray-900">Create VM with Public IP</span>
                      {publicIP && (
                        <span className="ml-auto text-sm text-saree-teal-dark font-medium">
                          +{formatPrice(unitRates.ip, currency)}/month
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* ========== ADDONS STEP (VM Only) ========== */}
              {isVM && currentSteps[currentStep - 1]?.name === 'Addons' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Select Addons</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Choose additional add-ons to enhance your server's capabilities.
                  </p>

                  {/* OS Licence Info (if applicable) */}
                  {applicableLicence && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="font-medium text-amber-800">OS Licence Required</div>
                          <p className="text-sm text-amber-700 mt-1">
                            {selectedOS?.name} requires a licence: <strong>{applicableLicence.name}</strong>
                            <span className="ml-2">
                              {formatPrice(applicableLicence.monthly_price, currency)}/{applicableLicence.pricing_unit}
                            </span>
                          </p>
                          {applicableLicence.pricing_unit === 'per core' && selectedPlan && (
                            <p className="text-sm text-amber-600 mt-1">
                              Based on {selectedPlan.cpu} cores = {formatPrice(applicableLicence.monthly_price * selectedPlan.cpu, currency)}/month
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Products (Antivirus, EDR) */}
                  {availableProducts.filter(p => p.category === 'security').length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                      <div className="p-4 bg-gray-50 font-medium text-gray-700 border-b border-gray-200">Security & Antivirus</div>
                      <div className="p-4 space-y-3">
                        {availableProducts.filter(p => p.category === 'security').map(product => (
                          <label
                            key={product.id}
                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${
                              selectedAddons.find(a => a.id === product.id)
                                ? 'border-saree-teal bg-saree-teal-light/20'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={!!selectedAddons.find(a => a.id === product.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedAddons([...selectedAddons, product])
                                  } else {
                                    setSelectedAddons(selectedAddons.filter(a => a.id !== product.id))
                                  }
                                }}
                                className="w-4 h-4 text-saree-teal-dark rounded border-gray-300"
                              />
                              <span className="font-medium text-gray-900">{product.name}</span>
                            </div>
                            <span className="text-saree-teal-dark font-medium">
                              {formatPrice(product.monthly_price, currency)}/month
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Backup Products */}
                  {availableProducts.filter(p => p.category === 'backup').length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                      <div className="p-4 bg-gray-50 font-medium text-gray-700 border-b border-gray-200">Backup Services</div>
                      <div className="p-4 space-y-3">
                        {availableProducts.filter(p => p.category === 'backup').map(product => (
                          <label
                            key={product.id}
                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${
                              selectedAddons.find(a => a.id === product.id)
                                ? 'border-saree-teal bg-saree-teal-light/20'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={!!selectedAddons.find(a => a.id === product.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedAddons([...selectedAddons, product])
                                  } else {
                                    setSelectedAddons(selectedAddons.filter(a => a.id !== product.id))
                                  }
                                }}
                                className="w-4 h-4 text-saree-teal-dark rounded border-gray-300"
                              />
                              <span className="font-medium text-gray-900">{product.name}</span>
                            </div>
                            <span className="text-saree-teal-dark font-medium">
                              {formatPrice(product.monthly_price, currency)}/month
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Managed Services */}
                  {availableProducts.filter(p => p.category === 'managed').length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                      <div className="p-4 bg-gray-50 font-medium text-gray-700 border-b border-gray-200">Managed Services</div>
                      <div className="p-4 space-y-3">
                        {availableProducts.filter(p => p.category === 'managed').map(product => (
                          <label
                            key={product.id}
                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${
                              selectedAddons.find(a => a.id === product.id)
                                ? 'border-saree-teal bg-saree-teal-light/20'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={!!selectedAddons.find(a => a.id === product.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedAddons([...selectedAddons, product])
                                  } else {
                                    setSelectedAddons(selectedAddons.filter(a => a.id !== product.id))
                                  }
                                }}
                                className="w-4 h-4 text-saree-teal-dark rounded border-gray-300"
                              />
                              <span className="font-medium text-gray-900">{product.name}</span>
                            </div>
                            <span className="text-saree-teal-dark font-medium">
                              {formatPrice(product.monthly_price, currency)}/month
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Microsoft 365 Products */}
                  {availableProducts.filter(p => p.category === 'microsoft').length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                      <div className="p-4 bg-gray-50 font-medium text-gray-700 border-b border-gray-200">Microsoft 365 Licenses</div>
                      <div className="p-4 space-y-3">
                        {availableProducts.filter(p => p.category === 'microsoft').map(product => (
                          <label
                            key={product.id}
                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${
                              selectedAddons.find(a => a.id === product.id)
                                ? 'border-saree-teal bg-saree-teal-light/20'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={!!selectedAddons.find(a => a.id === product.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedAddons([...selectedAddons, product])
                                  } else {
                                    setSelectedAddons(selectedAddons.filter(a => a.id !== product.id))
                                  }
                                }}
                                className="w-4 h-4 text-saree-teal-dark rounded border-gray-300"
                              />
                              <span className="font-medium text-gray-900">{product.name}</span>
                            </div>
                            <span className="text-saree-teal-dark font-medium">
                              {formatPrice(product.monthly_price, currency)}/month
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Products */}
                  {availableProducts.filter(p => p.category === 'other').length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 font-medium text-gray-700 border-b border-gray-200">Other Add-ons</div>
                      <div className="p-4 space-y-3">
                        {availableProducts.filter(p => p.category === 'other').map(product => (
                          <label
                            key={product.id}
                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${
                              selectedAddons.find(a => a.id === product.id)
                                ? 'border-saree-teal bg-saree-teal-light/20'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={!!selectedAddons.find(a => a.id === product.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedAddons([...selectedAddons, product])
                                  } else {
                                    setSelectedAddons(selectedAddons.filter(a => a.id !== product.id))
                                  }
                                }}
                                className="w-4 h-4 text-saree-teal-dark rounded border-gray-300"
                              />
                              <span className="font-medium text-gray-900">{product.name}</span>
                            </div>
                            <span className="text-saree-teal-dark font-medium">
                              {formatPrice(product.monthly_price, currency)}/month
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableProducts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No add-on products available.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ========== VEEAM BACKUP STEP (Specialized card-based UI) ========== */}
              {(currentSteps[currentStep - 1]?.name === 'Config') && slug === 'veeam-backup' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Select Plan <span className="text-red-500">*</span></h2>
                  <p className="text-sm text-saree-teal-dark mb-6">Select Plan</p>

                  {servicePlans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {servicePlans.map((plan, index) => {
                        const attr = plan.attribute || {};
                        const isSelected = selectedPlan?.id === plan.id;

                        // Determine badge
                        let badge = null;
                        if (index === 0) badge = { text: 'Recommended', color: 'bg-red-100 text-red-600', icon: '❤️' };
                        if (plan.name.toLowerCase().includes('basic') || plan.monthly_price < 1500) {
                          badge = { text: 'Pocket Friendly', color: 'bg-green-100 text-green-600', icon: '💚' };
                        }

                        return (
                          <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`relative border-2 rounded-xl cursor-pointer transition-all ${
                              isSelected
                                ? 'border-saree-teal bg-saree-teal-light/10 shadow-lg'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                          >
                            {/* Selection indicator */}
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-saree-teal rounded-full flex items-center justify-center shadow">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}

                            {/* Header with price and name */}
                            <div className="p-4 border-b border-gray-100">
                              <div className="text-xl font-bold text-gray-900">
                                {formatPrice(plan.monthly_price, currency)}<span className="text-sm font-normal text-gray-500">/month</span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">{plan.name}</div>
                            </div>

                            {/* Cloud Connect Services */}
                            <div className="p-4">
                              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
                                Cloud Connect Services
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Repository Quota</span>
                                  <span className="font-medium text-gray-900">{attr.formatted_storage || `${attr.storage || 0} GB`}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">VMs Quota</span>
                                  <span className="font-medium text-gray-900">{attr.number_of_vm || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Workstation Quota</span>
                                  <span className="font-medium text-gray-900">{attr.workstation_quota || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Server Quota</span>
                                  <span className="font-medium text-gray-900">{attr.server_quota || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Concurrent Tasks</span>
                                  <span className="font-medium text-gray-900">{attr.max_concurrent_tasks || 1}</span>
                                </div>
                              </div>

                              {/* Remote Services */}
                              <div className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-3 mt-4">
                                Remote Services
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Workstation Agents</span>
                                  <span className="font-medium text-gray-900">{attr.workstation_agents || attr.licenses?.vspc_licenses_workstation || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Server Agents</span>
                                  <span className="font-medium text-gray-900">{attr.server_agents || attr.licenses?.vspc_licenses_server || 0}</span>
                                </div>
                              </div>
                            </div>

                            {/* Badge */}
                            {badge && (
                              <div className="px-4 pb-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${badge.color}`}>
                                  <span>{badge.icon}</span>
                                  {badge.text}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 font-medium mb-2">No Veeam Backup plans available</p>
                      <p className="text-sm text-gray-400">Please contact sales for a custom quote.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ========== CONFIG STEP (Generic for all non-VM, non-Storage services) ========== */}
              {(currentSteps[currentStep - 1]?.name === 'Config' || currentSteps[currentStep - 1]?.name === 'Configure') && !isVM && !isStorage && slug !== 'veeam-backup' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Configure {selectedService?.name}</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Select a plan for your {selectedService?.name}.
                  </p>

                  {servicePlans.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Dynamic header based on plan attributes */}
                      <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-600">
                        <div>Plan Name</div>
                        <div>Details</div>
                        <div className="text-red-500">Monthly Price</div>
                        <div>Hourly Price</div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {servicePlans.map(plan => {
                          // Dynamically build details string based on available attributes
                          const details = [];
                          if (plan.cpu && plan.cpu > 0) details.push(`${plan.cpu} vCPU`);
                          if (plan.memory && plan.memory > 0) details.push(formatMemory(plan.memory));
                          // Show storage/size (avoid duplicates - prefer size for block storage, storage for object storage)
                          const storageVal = parseInt(plan.attribute?.storage) || 0;
                          const sizeVal = parseInt(plan.attribute?.size) || 0;
                          if (storageVal > 0 && storageVal !== sizeVal) {
                            // Object Storage style - storage is the main value
                            details.push(storageVal >= 1024 ? `${(storageVal/1024).toFixed(1)} TB` : `${storageVal} GB`);
                          } else if (sizeVal > 0) {
                            // Block Storage style - size is the main value
                            details.push(sizeVal >= 1024 ? `${(sizeVal/1024).toFixed(1)} TB` : `${sizeVal} GB`);
                          }
                          if (plan.bandwidth && plan.bandwidth > 0) details.push(`${plan.bandwidth} Mbps`);
                          if (plan.network_rate && plan.network_rate > 0) details.push(`${plan.network_rate} Mbps Network`);
                          if (plan.bucket_limit && plan.bucket_limit > 0) details.push(`${plan.bucket_limit} Buckets`);
                          if (plan.data_transfer_out && plan.data_transfer_out > 0) {
                            const transferVal = parseInt(plan.data_transfer_out);
                            details.push(transferVal >= 1024 ? `${(transferVal/1024).toFixed(1)} TB Transfer` : `${transferVal} GB Transfer`);
                          }
                          if (plan.storage_category_name) details.push(plan.storage_category_name);

                          return (
                            <div
                              key={plan.id}
                              onClick={() => setSelectedPlan(plan)}
                              className={`grid grid-cols-4 items-center px-4 py-4 border-b border-gray-100 cursor-pointer transition ${
                                selectedPlan?.id === plan.id
                                  ? 'bg-saree-teal-light/20 border-l-4 border-l-saree-teal'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div>
                                <div className="font-medium text-gray-900">{plan.name}</div>
                                {plan.plan_category_name && (
                                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                    {plan.plan_category_name}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {details.length > 0 ? details.join(' • ') : (
                                  <span className="text-gray-400">Standard plan</span>
                                )}
                              </div>
                              <div className="text-red-500 font-semibold">
                                {formatPrice(plan.monthly_price, currency)}
                                <span className="text-gray-400 text-xs font-normal"> /mo</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                  {formatPrice(plan.hourly_price, currency)}
                                  <span className="text-gray-400 text-xs"> /hr</span>
                                </span>
                                {selectedPlan?.id === plan.id && (
                                  <div className="w-5 h-5 bg-saree-teal rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-gray-600 font-medium mb-2">No pricing plans available</p>
                      <p className="text-sm text-gray-400 mb-4">This service requires a custom quote.</p>
                      <button 
                        onClick={() => navigate('/contact-us')}
                        className="px-4 py-2 bg-saree-teal text-white rounded-lg text-sm font-medium hover:bg-saree-teal-dark transition"
                      >
                        Contact Sales
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ========== CLUSTER STEP (Kubernetes) ========== */}
              {currentSteps[currentStep - 1]?.name === 'Cluster' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Configure Kubernetes Cluster</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Select the node configuration for your Kubernetes cluster.
                  </p>

                  {servicePlans.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-600">
                        <div>Node Type</div>
                        <div>Specs</div>
                        <div className="text-red-500">Monthly</div>
                        <div>Hourly</div>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {servicePlans.map(plan => (
                          <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`grid grid-cols-4 items-center px-4 py-3 border-b border-gray-100 cursor-pointer transition ${
                              selectedPlan?.id === plan.id
                                ? 'bg-saree-teal-light/20 border-l-4 border-l-saree-teal'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-medium text-gray-900">{plan.name}</div>
                            <div className="text-sm text-gray-500">
                              {plan.cpu && `${plan.cpu} vCPU`}
                              {plan.memory && ` • ${formatMemory(plan.memory)}`}
                            </div>
                            <div className="text-red-500 font-medium">
                              {formatPrice(plan.monthly_price, currency)}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">
                                {formatPrice(plan.hourly_price, currency)}
                              </span>
                              {selectedPlan?.id === plan.id && (
                                <div className="w-5 h-5 bg-saree-teal rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Contact sales for Kubernetes pricing.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ========== REVIEW STEP ========== */}
              {currentSteps[currentStep - 1]?.name === 'Review' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Review Configuration</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Review your configuration before adding to estimate.
                  </p>

                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Service</div>
                        <div className="font-medium">{selectedService?.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium">{LOCATIONS.find(l => l.id === selectedLocation)?.name}, {LOCATIONS.find(l => l.id === selectedLocation)?.country}</div>
                      </div>
                      {isVM && (
                        <>
                          <div>
                            <div className="text-sm text-gray-500">Operating System</div>
                            <div className="font-medium">
                              {selectedOS?.name}
                              {selectedOS?.operating_system_version?.version && (
                                <span className="text-gray-500 text-sm ml-1">
                                  ({selectedOS.operating_system_version.version})
                                </span>
                              )}
                              {selectedOS?.type === 'marketplace' && (
                                <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                                  Marketplace App
                                </span>
                              )}
                              {selectedOS?.type === 'iso' && (
                                <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                  ISO
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Compute</div>
                            <div className="font-medium">
                              {useCustomPlan ? `Custom (${customCpu} vCPU, ${customMemory} GB RAM)` : `${selectedPlan?.name} (${selectedPlan?.cpu} vCPU, ${formatMemory(selectedPlan?.memory)})`}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Storage</div>
                            <div className="font-medium">
                              {useCustomDisk ? `${customDiskSize} GB NVMe` : `${selectedDisk?.name} ${selectedDisk?.storage_category || 'NVMe'}`}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Network</div>
                            <div className="font-medium capitalize">{networkType} Network</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Public IP</div>
                            <div className="font-medium">{publicIP ? 'Yes' : 'No'}</div>
                          </div>
                        </>
                      )}
                      {slug === 'object-storage' && selectedPlan && (
                        <>
                          <div>
                            <div className="text-sm text-gray-500">Plan</div>
                            <div className="font-medium">{selectedPlan.name}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Storage Capacity</div>
                            <div className="font-medium">
                              {(() => {
                                const storageGB = parseInt(selectedPlan.attribute?.storage) || 0;
                                return storageGB >= 1024 ? `${(storageGB / 1024).toFixed(1)} TB` : `${storageGB} GB`;
                              })()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Bucket Limit</div>
                            <div className="font-medium">{selectedPlan.attribute?.bucket_limit || selectedPlan.bucket_limit || 0}</div>
                          </div>
                        </>
                      )}
                      {(slug === 'block-storage' || slug === 'nvme') && (
                        <div>
                          <div className="text-sm text-gray-500">Storage</div>
                          <div className="font-medium">
                            {useCustomDisk ? `${customDiskSize} GB NVMe` : `${selectedDisk?.name} ${selectedDisk?.storage_category || 'NVMe'}`}
                          </div>
                        </div>
                      )}
                      {!isVM && !isStorage && selectedPlan && (
                        <div>
                          <div className="text-sm text-gray-500">Plan</div>
                          <div className="font-medium">{selectedPlan.name}</div>
                        </div>
                      )}
                    </div>

                    {isVM && applicableLicence && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500 mb-2">OS Licence (Required)</div>
                        <div className="flex justify-between items-center bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                          <span className="font-medium text-amber-800">{applicableLicence.name}</span>
                          <span className="text-amber-700">
                            {applicableLicence.pricing_unit === 'per core' && selectedPlan
                              ? `${selectedPlan.cpu} cores × ${formatPrice(applicableLicence.monthly_price, currency)} = ${formatPrice(applicableLicence.monthly_price * selectedPlan.cpu, currency)}/month`
                              : `${formatPrice(applicableLicence.monthly_price, currency)}/${applicableLicence.pricing_unit}`
                            }
                          </span>
                        </div>
                      </div>
                    )}

                    {isVM && selectedAddons.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500 mb-2">Add-ons</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedAddons.map(addon => (
                            <span key={addon.id} className="px-3 py-1 bg-saree-teal-light text-saree-teal-dark rounded-full text-sm">
                              {addon.name} ({formatPrice(addon.monthly_price, currency)})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Estimate</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-saree-teal-dark">
                          {formatPrice(getPriceForCycle(currentPrice.monthly, billing), currency)}
                        </div>
                        <div className="text-sm text-gray-500">{getBillingCycle(billing).suffix}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <div className="flex gap-2">
                <button
                  onClick={goBack}
                  className="px-6 py-3 rounded-lg font-medium transition bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  ← {currentStep === 1 ? 'Back to Services' : 'Back'}
                </button>
                {editingItem && (
                  <button
                    onClick={cancelEdit}
                    className="px-5 py-3 rounded-lg font-medium transition border border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {currentStep === currentSteps.length ? (
                <button
                  onClick={addToCart}
                  className="px-8 py-3 bg-saree-teal text-white rounded-lg font-medium hover:bg-saree-teal-dark transition shadow-lg shadow-gray-200"
                >
                  {editingItem ? 'Update Item' : 'Add to Estimate'}
                </button>
              ) : (
                <button
                  onClick={goNext}
                  disabled={!canGoNext()}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    canGoNext() ? 'bg-saree-teal text-white hover:bg-saree-teal-dark' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next →
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 hidden lg:block">
            <div className="bg-white rounded-xl border border-gray-200 sticky top-36">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">Your Estimate</h2>
              </div>

              {/* Current Config */}
              <div className="p-4 border-b border-gray-200">
                <div className="text-sm text-gray-500 mb-3">Current Configuration</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{LOCATIONS.find(l => l.id === selectedLocation)?.name}</span>
                  </div>
                  {isVM && selectedOS && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">OS</span>
                      <span className="font-medium">{selectedOS.name}</span>
                    </div>
                  )}
                  {(selectedPlan || useCustomPlan) && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isVM ? 'Compute' : 'Plan'}</span>
                      <span className="font-medium">{useCustomPlan ? `${customCpu}vCPU/${customMemory}GB` : selectedPlan?.name}</span>
                    </div>
                  )}
                  {(selectedDisk || useCustomDisk) && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Storage</span>
                      <span className="font-medium">{useCustomDisk ? `${customDiskSize}GB` : selectedDisk?.name}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Config Total</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-saree-teal-dark">
                        {formatPrice(getPriceForCycle(currentPrice.monthly, billing), currency)}
                      </div>
                      <div className="text-xs text-gray-500">{getBillingCycle(billing).suffix}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              {cart.length > 0 && (
                <div className="p-4 border-b border-gray-200 max-h-48 overflow-y-auto">
                  <div className="text-sm text-gray-500 mb-2">Added Items ({cart.length})</div>
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{item.service?.name}</div>
                        <div className="text-xs text-gray-500">{item.location?.name} • {item.plan?.name || item.disk?.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-saree-teal-dark font-medium text-sm">
                          {formatPrice(getPriceForCycle(item.price.monthly, billing), currency)}
                        </span>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Grand Total */}
              <div className="p-4 bg-gray-50 rounded-b-xl">
                {cart.length > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900">Cart Total</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-saree-teal-dark">
                        {formatPrice(getPriceForCycle(cartTotal.monthly, billing), currency)}
                      </div>
                      <div className="text-xs text-gray-500">{getBillingCycle(billing).suffix}</div>
                    </div>
                  </div>
                )}
                {currentPrice.monthly > 0 && (
                  <div className="flex justify-between items-center mb-1 text-sm text-gray-500">
                    <span>If you add this config</span>
                    <span>+{formatPrice(getPriceForCycle(currentPrice.monthly, billing), currency)}</span>
                  </div>
                )}
                <div className="text-xs text-gray-400 text-right mb-4">+ {getGstPercent()}% GST applicable</div>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowDetailsModal(true)}
                    className="w-full py-3 bg-saree-teal text-white rounded-lg font-medium hover:bg-saree-teal-dark transition shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EstimateDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        cart={cart}
        billing={billing}
        currency={currency}
        cartTotal={cartTotal}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
        onUpdateNotes={updateCartNotes}
        onEditItem={editCartItem}
        onClearAll={clearAllCart}
      />
    </div>
  )
}

export default CloudPricingCalculator
