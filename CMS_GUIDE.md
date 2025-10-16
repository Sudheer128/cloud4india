# 🎯 Cloud4India CMS - Content Management Guide

## 🚀 **How to Edit Your Homepage Content**

### **Method 1: Admin Panel (Recommended)**

1. **Start both servers:**
   ```bash
   # Terminal 1: Start CMS Server
   cd cloud4india-cms
   node server.js
   
   # Terminal 2: Start React App
   cd cloud4india
   npm run dev
   ```

2. **Access Admin Panel:**
   - Open browser: `http://localhost:3000/admin`
   - You'll see a clean admin interface with tabs

3. **Edit Content:**
   - **Hero Section**: Edit title, description, buttons
   - **Why Items**: Edit expandable FAQ items
   - **Products**: Edit product cards with categories
   - **Features**: Edit feature cards with statistics

### **Method 2: Direct API (Advanced)**

You can also edit content directly via API calls:

```bash
# Update Hero Section
curl -X PUT http://localhost:1337/api/hero \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Your New Title",
    "description": "Your new description",
    "primary_button_text": "Get Started",
    "primary_button_link": "/signup",
    "secondary_button_text": "Learn More",
    "secondary_button_link": "/learn"
  }'

# Update Why Item
curl -X PUT http://localhost:1337/api/why-items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Why Item Title",
    "content": "New content here...",
    "link": "Learn more link text"
  }'
```

## 📊 **What You Can Edit**

### **Hero Section**
- ✅ Main headline
- ✅ Description text
- ✅ Primary button text & link
- ✅ Secondary button text & link

### **Why Items (5 items)**
- ✅ Item titles
- ✅ Detailed content
- ✅ Link text for each item

### **Products (4 items)**
- ✅ Product names
- ✅ Descriptions
- ✅ Categories
- ✅ Colors and styling

### **Features (4 items)**
- ✅ Feature titles
- ✅ Descriptions
- ✅ Statistics
- ✅ Colors

## 🔄 **Real-time Updates**

- ✅ Changes save immediately
- ✅ Website updates automatically
- ✅ No need to restart servers
- ✅ Refresh browser to see changes

## 🛠 **Troubleshooting**

### **If Admin Panel Won't Load:**
1. Check CMS server is running: `http://localhost:1337/api/health`
2. Check React app is running: `http://localhost:3000`
3. Make sure both servers are on correct ports

### **If Changes Don't Save:**
1. Check browser console for errors
2. Verify CMS server is running
3. Try refreshing the admin panel

### **If Website Shows Loading:**
1. Check CMS server health
2. Verify API endpoints are working
3. Check network tab in browser dev tools

## 🎯 **Quick Start Commands**

```bash
# Start CMS Server
cd cloud4india-cms && node server.js

# Start React App (in new terminal)
cd cloud4india && npm run dev

# Access Admin Panel
# Open: http://localhost:3000/admin

# View Website
# Open: http://localhost:3000
```

## 📝 **Content Tips**

- **Keep titles short** and impactful
- **Use clear descriptions** that explain benefits
- **Test buttons** to make sure links work
- **Save frequently** to avoid losing changes
- **Preview changes** by refreshing the main website

---

**🎉 Your Cloud4India website now has professional content management!**
