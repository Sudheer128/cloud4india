# Cloud4India - Complete API Endpoints Documentation

**Total Backend Endpoints: 232 unique endpoints**

---

## 📊 Summary by Category

| Category | GET | POST | PUT | DELETE | PATCH | Total |
|----------|-----|------|-----|--------|-------|-------|
| Upload | 0 | 2 | 0 | 1 | 0 | 3 |
| Homepage | 1 | 1 | 2 | 1 | 0 | 5 |
| Client Logos | 2 | 1 | 2 | 1 | 0 | 6 |
| Marketplaces | 8 | 4 | 5 | 3 | 0 | 20 |
| Products | 11 | 5 | 6 | 4 | 0 | 26 |
| Solutions | 11 | 5 | 4 | 3 | 0 | 23 |
| Main Pages | 9 | 6 | 6 | 3 | 2 | 26 |
| Pricing | 10 | 6 | 7 | 6 | 0 | 29 |
| About Us | 6 | 5 | 22 | 5 | 0 | 38 |
| Contact | 12 | 7 | 11 | 3 | 0 | 33 |
| Integrity | 2 | 2 | 2 | 1 | 0 | 7 |
| Feature Banners | 2 | 1 | 1 | 1 | 1 | 6 |
| Comprehensive | 1 | 0 | 3 | 0 | 0 | 4 |
| Price Estimator | 3 | 0 | 1 | 0 | 0 | 4 |
| Quotations | 4 | 2 | 3 | 1 | 0 | 10 |
| System | 2 | 3 | 0 | 0 | 0 | 5 |

---

## 🔧 System & Utilities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/migrations` | List migrations |
| POST | `/api/migrations/run` | Run migrations |
| POST | `/api/cleanup-duplicates` | Cleanup duplicate records |
| POST | `/api/cleanup-marketplace-duplicates` | Cleanup marketplace duplicates |

---

## 📤 File Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/image` | Upload image (JPEG, PNG, SVG) |
| POST | `/api/upload/video` | Upload video (MP4) |
| DELETE | `/api/upload/:type/:filename` | Delete uploaded file |

---

## 🏠 Homepage

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/homepage` | Get all homepage content |
| PUT | `/api/hero` | Update hero section |
| PUT | `/api/homepage/sections/:sectionName` | Update homepage section |
| POST | `/api/why-items` | Create why item |
| PUT | `/api/why-items/:id` | Update why item |
| DELETE | `/api/why-items/:id` | Delete why item |

---

## 🏢 Client Logos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/client-logos` | Get visible client logos |
| GET | `/api/admin/client-logos` | Get all client logos (admin) |
| POST | `/api/admin/client-logos` | Create client logo |
| PUT | `/api/admin/client-logos/:id` | Update client logo |
| DELETE | `/api/admin/client-logos/:id` | Delete client logo |
| PUT | `/api/admin/client-logos/:id/toggle-visibility` | Toggle logo visibility |

---

## 🛒 Marketplaces

### Core CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/marketplaces` | List all marketplaces |
| GET | `/api/admin/marketplaces` | List all (admin) |
| GET | `/api/marketplaces/:id` | Get marketplace by ID |
| GET | `/api/marketplaces/by-route/:route` | Get by route/slug |
| GET | `/api/marketplaces/categories` | Get categories |
| POST | `/api/marketplaces` | Create marketplace |
| PUT | `/api/marketplaces/:id` | Update marketplace |
| DELETE | `/api/marketplaces/:id` | Delete marketplace |
| PUT | `/api/marketplaces/:id/toggle-visibility` | Toggle visibility |
| POST | `/api/marketplaces/:id/duplicate` | Duplicate marketplace |

### Sections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/marketplaces/:id/sections` | Get all sections |
| GET | `/api/marketplaces/:id/sections/:sectionId` | Get section |
| GET | `/api/marketplaces/by-route/:route/sections` | Get sections by route |
| POST | `/api/marketplaces/:id/sections` | Create section |
| PUT | `/api/marketplaces/:id/sections/:sectionId` | Update section |
| DELETE | `/api/marketplaces/:id/sections/:sectionId` | Delete section |

### Section Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/marketplaces/:id/sections/:sectionId/items` | Get items |
| POST | `/api/marketplaces/:id/sections/:sectionId/items` | Create item |
| PUT | `/api/marketplaces/:id/sections/:sectionId/items/:itemId` | Update item |
| DELETE | `/api/marketplaces/:id/sections/:sectionId/items/:itemId` | Delete item |
| PUT | `/api/marketplaces/:id/sections/:sectionId/items/:itemId/toggle-visibility` | Toggle item visibility |

---

## 📦 Products

### Core CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/admin/products` | List all (admin) |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/by-route/:route` | Get by route/slug |
| GET | `/api/products/with-cards` | Get products with card data |
| GET | `/api/products/categories` | Get categories |
| POST | `/api/products` | Create product |
| POST | `/api/products/categories` | Create category |
| PUT | `/api/products/:id` | Update product |
| PUT | `/api/products/categories/:id` | Update category |
| DELETE | `/api/products/:id` | Delete product |
| DELETE | `/api/products/categories/:id` | Delete category |
| PUT | `/api/products/:id/toggle-visibility` | Toggle visibility |
| POST | `/api/products/:id/duplicate` | Duplicate product |

### Sections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/:id/sections` | Get all sections |
| GET | `/api/products/:id/sections/:sectionId` | Get section |
| GET | `/api/products/by-route/:route/sections` | Get sections by route |
| POST | `/api/products/:id/sections` | Create section |
| PUT | `/api/products/:id/sections/:sectionId` | Update section |
| DELETE | `/api/products/:id/sections/:sectionId` | Delete section |

### Section Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/:id/sections/:sectionId/items` | Get items |
| POST | `/api/products/:id/sections/:sectionId/items` | Create item |
| PUT | `/api/products/:id/sections/:sectionId/items/:itemId` | Update item |
| DELETE | `/api/products/:id/sections/:sectionId/items/:itemId` | Delete item |
| PUT | `/api/products/:id/sections/:sectionId/items/:itemId/toggle-visibility` | Toggle item visibility |

---

## 💡 Solutions

### Core CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/solutions` | List all solutions |
| GET | `/api/admin/solutions` | List all (admin) |
| GET | `/api/solutions/:id` | Get solution by ID |
| GET | `/api/solutions/by-route/:route` | Get by route/slug |
| GET | `/api/solutions/categories` | Get categories |
| POST | `/api/solutions` | Create solution |
| PUT | `/api/solutions/:id` | Update solution |
| DELETE | `/api/solutions/:id` | Delete solution |
| PUT | `/api/solutions/:id/toggle-visibility` | Toggle visibility |
| POST | `/api/solutions/:id/duplicate` | Duplicate solution |

### Sections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/solutions/:id/sections` | Get all sections |
| GET | `/api/solutions/:id/sections/:sectionId` | Get section |
| GET | `/api/solutions/by-route/:route/sections` | Get sections by route |
| POST | `/api/solutions/:id/sections` | Create section |
| PUT | `/api/solutions/:id/sections/:sectionId` | Update section |
| DELETE | `/api/solutions/:id/sections/:sectionId` | Delete section |

### Section Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/solutions/:id/sections/:sectionId/items` | Get items |
| POST | `/api/solutions/:id/sections/:sectionId/items` | Create item |
| PUT | `/api/solutions/:id/sections/:sectionId/items/:itemId` | Update item |
| DELETE | `/api/solutions/:id/sections/:sectionId/items/:itemId` | Delete item |

---

## 📄 Main Listing Pages

### Main Marketplaces Page
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/main-marketplaces` | Get main page content |
| GET | `/api/main-marketplaces/sections/all` | Get all sections |
| PUT | `/api/main-marketplaces/hero` | Update hero |
| PUT | `/api/main-marketplaces/sections/:sectionId` | Update section |
| POST | `/api/main-marketplaces/sections` | Create section |
| POST | `/api/main-marketplaces/sections/:sectionId/duplicate` | Duplicate section |
| DELETE | `/api/main-marketplaces/sections/:sectionId` | Delete section |
| PATCH | `/api/main-marketplaces/sections/:sectionId/toggle-visibility` | Toggle visibility |

### Main Products Page
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/main-products` | Get main page content |
| GET | `/api/main-products/sections/all` | Get all sections |
| GET | `/api/main-products/sections/:sectionId/products` | Get section products |
| PUT | `/api/main-products/hero` | Update hero |
| PUT | `/api/main-products/sections/:sectionId` | Update section |
| PUT | `/api/main-products/sections/:sectionId/toggle-visibility` | Toggle visibility |
| POST | `/api/main-products/sections` | Create section |
| POST | `/api/main-products/sections/:sectionId/duplicate` | Duplicate section |
| DELETE | `/api/main-products/sections/:sectionId` | Delete section |

### Main Solutions Page
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/main-solutions` | Get main page content |
| GET | `/api/main-solutions/sections/all` | Get all sections |
| PUT | `/api/main-solutions/hero` | Update hero |
| PUT | `/api/main-solutions/sections/:sectionId` | Update section |
| POST | `/api/main-solutions/sections` | Create section |
| POST | `/api/main-solutions/sections/:sectionId/duplicate` | Duplicate section |
| POST | `/api/main-solutions/sync` | Sync solutions |
| DELETE | `/api/main-solutions/sections/:sectionId` | Delete section |
| PATCH | `/api/main-solutions/sections/:sectionId/toggle-visibility` | Toggle visibility |

---

## 💰 Pricing

### Hero & Config
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pricing/hero` | Get pricing hero |
| PUT | `/api/pricing/hero/:id` | Update pricing hero |
| GET | `/api/pricing/page-config` | Get page config |
| PUT | `/api/pricing/page-config` | Update page config |

### Categories & Subcategories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pricing/categories` | Get categories |
| POST | `/api/pricing/categories` | Create category |
| PUT | `/api/pricing/categories/:id` | Update category |
| DELETE | `/api/pricing/categories/:id` | Delete category |
| GET | `/api/pricing/categories/:categoryId/subcategories` | Get subcategories |
| POST | `/api/pricing/categories/:categoryId/subcategories` | Create subcategory |
| PUT | `/api/pricing/subcategories/:id` | Update subcategory |
| DELETE | `/api/pricing/subcategories/:id` | Delete subcategory |

### Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pricing/subcategories/:subcategoryId/plans` | Get plans |
| POST | `/api/pricing/subcategories/:subcategoryId/plans` | Create plan |
| PUT | `/api/pricing/plans/:id` | Update plan |
| DELETE | `/api/pricing/plans/:id` | Delete plan |

### Compute Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pricing/compute-plans` | Get compute plans |
| POST | `/api/pricing/compute-plans` | Create compute plan |
| PUT | `/api/pricing/compute-plans/:id` | Update compute plan |
| DELETE | `/api/pricing/compute-plans/:id` | Delete compute plan |

### Disk Offerings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pricing/disk-offerings` | Get disk offerings |
| POST | `/api/pricing/disk-offerings` | Create disk offering |
| PUT | `/api/pricing/disk-offerings/:id` | Update disk offering |
| DELETE | `/api/pricing/disk-offerings/:id` | Delete disk offering |

### Storage & FAQs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pricing/storage` | Get storage options |
| POST | `/api/pricing/storage` | Create storage option |
| PUT | `/api/pricing/storage/:id` | Update storage option |
| GET | `/api/pricing/faqs` | Get FAQs |
| POST | `/api/pricing/faqs` | Create FAQ |
| PUT | `/api/pricing/faqs/:id` | Update FAQ |
| DELETE | `/api/pricing/faqs/:id` | Delete FAQ |

---

## 📋 About Us

### Main Sections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/about` | Get all about content |
| PUT | `/api/about/hero` | Update hero |
| PUT | `/api/about/hero/toggle-visibility` | Toggle hero visibility |
| PUT | `/api/about/story` | Update story |
| PUT | `/api/about/story/toggle-visibility` | Toggle story visibility |
| PUT | `/api/about/legacy` | Update legacy |
| PUT | `/api/about/legacy/toggle-visibility` | Toggle legacy visibility |
| PUT | `/api/about/mission-vision` | Update mission/vision |
| PUT | `/api/about/mission-vision/toggle-visibility` | Toggle mission visibility |

### Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/about/stats` | Get stats |
| POST | `/api/about/stats` | Create stat |
| PUT | `/api/about/stats/:id` | Update stat |
| DELETE | `/api/about/stats/:id` | Delete stat |
| PUT | `/api/about/stats/:id/toggle-visibility` | Toggle stat visibility |

### Testimonials
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/about/testimonials` | Get testimonials |
| POST | `/api/about/testimonials` | Create testimonial |
| PUT | `/api/about/testimonials/:id` | Update testimonial |
| DELETE | `/api/about/testimonials/:id` | Delete testimonial |
| PUT | `/api/about/testimonials/:id/toggle-visibility` | Toggle visibility |
| PUT | `/api/about/testimonials-section` | Update section |
| PUT | `/api/about/testimonials-section/toggle-visibility` | Toggle section visibility |

### Ratings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/about/ratings` | Get ratings |
| POST | `/api/about/ratings` | Create rating |
| PUT | `/api/about/ratings/:id` | Update rating |
| DELETE | `/api/about/ratings/:id` | Delete rating |
| PUT | `/api/about/ratings/:id/toggle-visibility` | Toggle visibility |

### Approach
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/about/approach-items` | Get approach items |
| POST | `/api/about/approach-items` | Create approach item |
| PUT | `/api/about/approach-items/:id` | Update approach item |
| DELETE | `/api/about/approach-items/:id` | Delete approach item |
| PUT | `/api/about/approach-items/:id/toggle-visibility` | Toggle visibility |
| PUT | `/api/about/approach-section` | Update section |
| PUT | `/api/about/approach-section/toggle-visibility` | Toggle section visibility |

### Core Values
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/about/core-values` | Get core values |
| POST | `/api/about/core-values` | Create core value |
| PUT | `/api/about/core-values/:id` | Update core value |
| DELETE | `/api/about/core-values/:id` | Delete core value |
| PUT | `/api/about/core-values/:id/toggle-visibility` | Toggle visibility |
| PUT | `/api/about/core-values-section` | Update section |
| PUT | `/api/about/core-values-section/toggle-visibility` | Toggle section visibility |

---

## 📞 Contact Us

### Page Content
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contact` | Get contact page content |
| PUT | `/api/contact/hero` | Update hero |

### Contact Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contact/items` | Get contact items |
| POST | `/api/contact/items` | Create contact item |
| PUT | `/api/contact/items/:id` | Update contact item |
| DELETE | `/api/contact/items/:id` | Delete contact item |
| PUT | `/api/contact/items/:id/toggle-visibility` | Toggle visibility |

### Social Links
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contact/social-links` | Get social links |
| POST | `/api/contact/social-links` | Create social link |
| PUT | `/api/contact/social-links/:id` | Update social link |
| DELETE | `/api/contact/social-links/:id` | Delete social link |
| PUT | `/api/contact/social-links/:id/toggle-visibility` | Toggle visibility |

### Form Submissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact/submit` | Submit contact form |
| GET | `/api/contact/submissions` | Get all submissions |
| GET | `/api/contact/submissions/:id` | Get submission by ID |
| GET | `/api/contact/submissions/stats` | Get submission stats |
| GET | `/api/contact/submissions/export` | Export submissions |
| GET | `/api/contact/submissions/today-followups` | Get today's follow-ups |
| GET | `/api/contact/submissions/overdue-followups` | Get overdue follow-ups |
| PUT | `/api/contact/submissions/:id/status` | Update status |
| PUT | `/api/contact/submissions/:id/notes` | Update notes |
| PUT | `/api/contact/submissions/:id/priority` | Update priority |
| PUT | `/api/contact/submissions/:id/follow-up` | Set follow-up |
| PUT | `/api/contact/submissions/:id/source` | Update source |
| PUT | `/api/contact/submissions/:id/assign` | Assign submission |
| PUT | `/api/contact/submissions/bulk-update` | Bulk update |
| DELETE | `/api/contact/submissions/:id` | Delete submission |
| DELETE | `/api/contact/submissions/:id/follow-up` | Remove follow-up |
| DELETE | `/api/contact/submissions/bulk-delete` | Bulk delete |
| POST | `/api/contact/submissions/:id/increment-contact` | Increment contact count |
| GET | `/api/contact/submissions/:id/activity` | Get activity log |
| POST | `/api/contact/submissions/:id/activity` | Add activity |

### Phone Verification
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact/send-otp` | Send OTP |
| POST | `/api/contact/verify-otp` | Verify OTP |
| POST | `/api/contact/verify-phone-email` | Verify phone/email |
| GET | `/api/contact/check-verification/:phone` | Check verification status |

---

## 📜 Integrity Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/integrity-pages` | List all integrity pages |
| GET | `/api/integrity-pages/:slug` | Get page by slug |
| POST | `/api/integrity-pages` | Create integrity page |
| PUT | `/api/integrity-pages/:id` | Update integrity page |
| DELETE | `/api/integrity-pages/:id` | Delete integrity page |
| PUT | `/api/integrity-pages/:id/toggle-visibility` | Toggle visibility |
| POST | `/api/integrity-pages/:id/duplicate` | Duplicate page |

---

## 🎨 Feature Banners

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/feature-banners` | Get visible banners |
| GET | `/api/feature-banners/all` | Get all banners |
| POST | `/api/feature-banners` | Create banner |
| PUT | `/api/feature-banners/:id` | Update banner |
| DELETE | `/api/feature-banners/:id` | Delete banner |
| PATCH | `/api/feature-banners/:id/toggle-visibility` | Toggle visibility |

---

## 📊 Comprehensive Section

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comprehensive-section` | Get section content |
| PUT | `/api/comprehensive-section/header` | Update header |
| PUT | `/api/comprehensive-section/features/:id` | Update feature |
| PUT | `/api/comprehensive-section/stats/:id` | Update stat |

---

## 💵 Price Estimator

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/price-estimator/config` | Get estimator config |
| PUT | `/api/price-estimator/config` | Update estimator config |
| GET | `/api/price-estimator/all-items` | Get all pricing items |
| GET | `/api/price-estimator/item-price` | Calculate item price |

---

## 📝 Quotations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quotations` | List all quotations |
| GET | `/api/quotations/:id` | Get quotation by ID |
| GET | `/api/quotations/share/:token` | Get shared quotation |
| GET | `/api/quotations/stats/summary` | Get quotation stats |
| POST | `/api/quotations` | Create quotation |
| PUT | `/api/quotations/:id` | Update quotation |
| PUT | `/api/quotations/:id/status` | Update status |
| PUT | `/api/quotations/:id/share` | Update share settings |
| POST | `/api/quotations/:id/clone` | Clone quotation |
| DELETE | `/api/quotations/:id` | Delete quotation |
| GET | `/api/quotations/:id/export/pdf` | Export as PDF |
| GET | `/api/quotations/:id/export/excel` | Export as Excel |

---

## 📈 Statistics

- **Total Unique Endpoints**: 232
- **GET Endpoints**: 84
- **POST Endpoints**: 50
- **PUT Endpoints**: 82
- **DELETE Endpoints**: 31
- **PATCH Endpoints**: 3

---

*Generated: 2024-12-30*
