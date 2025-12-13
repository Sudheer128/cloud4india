# Product Page Management Guide

## Overview
This guide explains how to create and manage product pages in the Cloud4India admin panel. Everything on the product page is now controlled through the CMS - no hardcoded content!

## Product Page Structure

Each product page follows this standard template structure:

### 1. 🎯 Hero/Overview Section (Order: 0) - **REQUIRED**
**Purpose:** Main landing section with product title, description, and key highlights

**What you need to add:**
- Section title and description (shown as main heading and subtext)
- **Items to add:**
  - `feature` items (3 recommended): Bullet points with checkmarks (e.g., "Instant deployment", "24/7 support")
  - `stat` items (3 recommended): Stats cards (e.g., "99.9% Uptime", "24/7 Support", "Free Trial")
    - `value` field: The number/stat (e.g., "99.9%", "24/7", "Free")
    - `label` field: The label below (e.g., "Uptime", "Support", "Trial")
  - `cta_primary` item (1): Primary call-to-action button
    - `title`: Button text (e.g., "Launch Console")
    - `description`: Card heading (e.g., "Try It Now")
    - `value`: Card subtext (e.g., "Start in 60 seconds")
  - `cta_secondary` item (optional): Secondary CTA button

### 2. 🎬 Gallery/Video Section (Order: 1) - Optional
**Purpose:** Display product videos or image galleries

**What you need to add:**
- Section title and description
- Media settings:
  - Upload a video/image, OR
  - Embed a YouTube URL
- No items needed for this section

### 3. ⚡ Features Section (Order: 2) - Recommended
**Purpose:** Showcase key product features with icons

**What you need to add:**
- Section title (e.g., "Key Features")
- Section description
- **Items to add:**
  - `feature` items (6-9 recommended): Each feature card
    - `title`: Feature name
    - `description`: Feature details
    - `icon`: Icon name (e.g., "CpuChipIcon", "ShieldCheckIcon")

### 4. 💰 Pricing Section (Order: 3) - Recommended
**Purpose:** Display pricing plans in a table format

**What you need to add:**
- Section title (e.g., "Pricing Plans")
- Section description
- **Items to add:**
  - `pricing_plan` items: Each pricing plan/row
    - `title`: Plan name (e.g., "SSD Standard", "NVMe SSD")
    - `content`: JSON with pricing details:
```json
{
  "specifications": ["4 vCPUs", "8GB RAM", "100GB SSD"],
  "features": ["24/7 Support", "99.9% Uptime", "Free Backups"],
  "price": "₹775",
  "buttonText": "Order Now",
  "buttonColor": "orange"
}
```

### 5. 📋 Specifications Section (Order: 4) - Recommended
**Purpose:** Technical specifications and requirements

**What you need to add:**
- Section title (e.g., "Technical Specifications")
- Section description
- **Items to add:**
  - `specification` items: Specification cards
    - `title`: Spec category (e.g., "Compute", "Storage")
    - `icon`: Icon name
    - `content`: JSON with features list:
```json
{
  "features": [
    "Intel Xeon processors",
    "Up to 96 vCPUs",
    "Dedicated resources"
  ]
}
```

### 6. 🔒 Security Section (Order: 5) - Recommended
**Purpose:** Security features and compliance information

**What you need to add:**
- Section title (e.g., "Security & Compliance")
- Section description
- **Options:**
  1. Add `security_feature` items (left side list with icons)
  2. OR add `content` field to section with JSON:
```json
{
  "title": "Security Features",
  "features": [
    "DDoS Protection",
    "Intrusion Detection",
    "Regular Security Updates",
    "Access Control"
  ]
}
```

### 7. 💬 Support Section (Order: 6) - Recommended
**Purpose:** Support channels and SLA information

**What you need to add:**
- Section title (e.g., "Support & SLA")
- Section description
- **Items to add:**
  - `support_channel` items (4 recommended): Support options
    - `title`: Channel name (e.g., "24/7 Phone Support")
    - `description`: Details
    - `icon`: Icon name

### 8. 🔄 Migration Section (Order: 7) - Optional
**Purpose:** Migration guide and onboarding steps

**What you need to add:**
- Section title (e.g., "Easy Migration")
- Section description
- **Items to add:**
  - `step` items (3 recommended): Migration steps
    - `title`: Step title
    - `description`: Step details

### 9. 🎯 Use Cases Section (Order: 8) - Optional
**Purpose:** Real-world use cases and applications

**What you need to add:**
- Section title (e.g., "Perfect For")
- Section description
- **Items to add:**
  - `use_case` items: Each use case
    - `title`: Use case name
    - `description`: Brief description
    - `icon`: Icon name
    - `content`: JSON with benefits:
```json
{
  "benefits": [
    "High performance processing",
    "Scalable infrastructure",
    "Cost-effective solution"
  ]
}
```

### 10. 🚀 Get Started/CTA Section (Order: 9) - Recommended
**Purpose:** Final call-to-action

**What you need to add:**
- Section title (e.g., "Ready to Get Started?")
- Section description
- **Items to add:**
  - `cta_primary` item: Main CTA button
  - `cta_secondary` item (optional): Secondary CTA button

---

## Quick Start: Creating a New Product

### Method 1: Quick Setup (Recommended for Beginners)
1. Go to **Products Management** in admin panel
2. Create a new product or edit an existing one
3. Go to **Page Sections** tab
4. Click **Quick Setup (All Sections)** button
5. All standard sections will be created automatically
6. Customize each section and add items as needed

### Method 2: Manual Setup
1. Go to **Products Management** in admin panel
2. Create a new product or edit an existing one
3. Go to **Page Sections** tab
4. Add sections one by one following the recommended order
5. For each section, click **Items** to add content

---

## Section Order Guidelines

**Important:** The `order_index` determines the display order on the frontend.

- **Hero section MUST be order 0** (always first)
- **If you add Gallery (media_banner) at order 1**, other sections shift by +1:
  - Features: Order 2
  - Pricing: Order 3
  - Specifications: Order 4
  - etc.
- **If you DON'T add Gallery**, sections follow this order:
  - Hero: 0
  - Features: 1
  - Pricing: 2
  - Specifications: 3
  - etc.

**Tip:** Use the Quick Setup feature and it will set correct orders automatically!

---

## Common Item Types Reference

| Item Type | Used In | Fields |
|-----------|---------|--------|
| `feature` | Hero, Features | title, description, icon |
| `stat` | Hero | title (or value), label (or description) |
| `cta_primary` | Hero, CTA | title, description, value |
| `cta_secondary` | Hero, CTA | title |
| `pricing_plan` | Pricing | title, content (JSON) |
| `specification` | Specifications | title, icon, content (JSON) |
| `security_feature` | Security | title, description, icon |
| `support_channel` | Support | title, description, icon |
| `step` | Migration | title, description |
| `use_case` | Use Cases | title, description, icon, content (JSON) |

---

## Available Icons

You can use these icon names in the `icon` field:
- `CpuChipIcon` - Processor/compute
- `ShieldCheckIcon` - Security
- `ClockIcon` - Time/24-7
- `CurrencyDollarIcon` - Pricing/cost
- `ChartBarIcon` - Analytics/performance
- `GlobeAltIcon` - Network/global
- `UsersIcon` - Team/community
- `ServerIcon` - Server/infrastructure
- `CircleStackIcon` - Database/storage
- `CheckIcon` - Checkmark/verified
- `StarIcon` - Featured/premium

---

## Tips for Success

1. **Always start with the Hero section** - it's required and sets the tone
2. **Use the Quick Setup** if you're new - you can always edit later
3. **Hide sections** instead of deleting - you might want them later
4. **Follow the recommended order** - it creates a logical flow
5. **Add at least 3 feature bullets** to the Hero section
6. **Add 3 stats** to the Hero section for impact
7. **Preview your changes** before publishing

---

## Troubleshooting

**Q: My section isn't showing on the frontend**
- Check if `is_visible` is enabled (use Show/Hide button)
- Verify the section has content items (some sections need items to display)

**Q: The order is wrong**
- Check the `order_index` numbers
- Remember: Hero must be 0, and if Gallery exists at 1, others shift by +1

**Q: Items aren't showing**
- Check if items have `is_visible` enabled
- Verify the `item_type` matches what the section expects

**Q: I want to remove all sections and start over**
- Delete sections individually, then use Quick Setup again

---

## Need Help?

Contact the development team or refer to:
- Frontend code: `/src/components/DynamicProductSection.jsx`
- Admin panel code: `/src/pages/ProductsAdmin.jsx`

