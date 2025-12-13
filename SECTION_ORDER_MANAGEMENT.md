# Section Order Management - Complete Guide

## 🎯 How Section Ordering Works

### **Order Dropdown (0-9):**
When editing a section, you'll see a dropdown with all 10 positions:
```
Position 0 - 🎯 Hero/Overview
Position 1 - 🎬 Gallery/Video
Position 2 - ⚡ Features
Position 3 - 💰 Pricing
Position 4 - 📋 Specifications
Position 5 - 🔒 Security
Position 6 - 💬 Support
Position 7 - 🔄 Migration
Position 8 - 🎯 Use Cases
Position 9 - 🚀 Get Started/CTA
```

---

## 🔄 Auto-Swap Feature

### **When You Change Order:**

**Example 1: Move Section from Position 7 to Position 2**
```
Before:
  0: Hero
  1: Gallery
  2: Features  ← Something is here
  3: Pricing
  ...
  7: Migration ← You want to move this

After:
  0: Hero
  1: Gallery
  2: Migration  ← Moved here
  3: Pricing
  ...
  7: Features   ← Auto-swapped here!
```

**System automatically swaps the sections!**

### **Algorithm:**
1. User changes Migration from order 7 to 2
2. System finds section currently at position 2 (Features)
3. System swaps:
   - Migration → order 2
   - Features → order 7
4. Both sections updated
5. Page reloads with new order

---

## 👁️ Hidden Sections & Order

### **How Hidden Sections Work:**

**Scenario: You hide the Gallery section (Order 1)**

**In Admin Panel:**
```
✓ 0: Hero (Visible)
🚫 1: Gallery (Hidden)  ← Still has order 1
✓ 2: Features (Visible)
✓ 3: Pricing (Visible)
...
```

**On Frontend (what users see):**
```
Hero (Order 0)
Features (Order 2)     ← Gallery skipped!
Pricing (Order 3)
...
```

**Key Points:**
- ✅ Hidden sections keep their order number
- ✅ Hidden sections don't show on frontend
- ✅ Frontend renders only visible sections in order
- ✅ You can unhide anytime and it appears in correct position

---

## 🎨 Use Cases

### **Use Case 1: Reorder Sections**
```
Want: Show Pricing before Features

Steps:
1. Edit Pricing section
2. Change order from 3 to 2
3. Save
4. Result: Features and Pricing swap positions automatically
```

### **Use Case 2: Hide Section Temporarily**
```
Want: Hide Migration section during launch, show later

Steps:
1. Click eye icon on Migration section
2. Section becomes hidden (🚫)
3. Frontend: Migration doesn't show
4. Later: Click eye icon again to unhide
5. Migration reappears at its original position (7)
```

### **Use Case 3: Multiple Hidden Sections**
```
Sections:
  0: Hero (Visible)
  1: Gallery (Hidden)
  2: Features (Visible)
  3: Pricing (Hidden)
  4: Specifications (Visible)
  5: Security (Visible)
  
Frontend shows only:
  Hero → Features → Specifications → Security
  (Gallery and Pricing skipped)
```

---

## 🔧 Technical Implementation

### **Order Swap Logic:**
```javascript
// When changing order from 7 to 2:
1. Find section at position 2 (conflicting section)
2. Update conflicting section: order_index = 7
3. Update current section: order_index = 2
4. Both saved to database
5. Reload sections list
6. Display in new order
```

### **Frontend Rendering:**
```javascript
// Product page only shows visible sections
sections
  .filter(s => s.is_visible === 1)
  .sort((a, b) => a.order_index - b.order_index)
  .map(section => <Section ... />)
```

### **Database Structure:**
```sql
product_sections
├── id
├── order_index (0-9)
├── is_visible (1=show, 0=hide)
└── ...

Hidden sections have is_visible=0 but keep order_index
```

---

## 📋 Best Practices

### **Recommended Approach:**
1. ✅ Use Quick Setup to create all sections
2. ✅ Hide sections you don't need (don't delete!)
3. ✅ Reorder if needed (swap functionality makes it safe)
4. ✅ Unhide sections when ready to use them

### **Order Guidelines:**
- **Hero (0):** Always first - never change
- **Gallery (1):** After hero - optional
- **Content sections (2-8):** Reorder as needed
- **CTA (9):** Usually last - can move if needed

### **Hidden Section Strategy:**
- ✅ Hide during development → Unhide when ready
- ✅ Hide seasonal content → Unhide for campaigns
- ✅ Hide incomplete sections → Unhide when content added
- ✅ A/B testing → Hide/show different sections

---

## 💡 Examples

### **Example 1: E-commerce Product**
```
Visible:
  0: Hero
  2: Features  
  3: Pricing ← Most important
  4: Specifications
  9: CTA

Hidden:
  1: Gallery (no video yet)
  5: Security (not relevant)
  6: Support (standard support)
  7: Migration (not needed)
  8: Use Cases (TBD)
```

### **Example 2: Enterprise Product**
```
Visible:
  0: Hero
  1: Gallery
  2: Features
  5: Security ← Highlighted
  6: Support ← Important
  7: Migration ← Critical
  8: Use Cases
  9: CTA

Hidden:
  3: Pricing (contact sales)
  4: Specifications (too technical)
```

---

## ✅ Summary

**Order Dropdown:**
- 10 positions (0-9)
- Shows recommended section for each position
- Select new position to reorder

**Auto-Swap:**
- Changing order automatically swaps sections
- No conflicts, no overwrites
- Safe and predictable

**Hidden Sections:**
- Keep their order number
- Don't show on frontend
- Can be unhidden anytime
- Appear in correct position when unhidden

**Result:** Flexible, safe, and user-friendly order management! 🎉

