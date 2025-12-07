# Marketplace API Deployment Checklist

## ⚠️ IMPORTANT: Server Needs Update

The server at **149.13.60.6:4002** is returning 404 errors for all marketplace endpoints.

## Required Actions:

### 1. Update Server Code
- ✅ Code is updated locally in `/root/cloud4india/cloud4india-cms/server.js`
- ⚠️ **Server needs to be updated with new code**
- ⚠️ **Server needs to be restarted**

### 2. Verify Routes in server.js
The following routes should exist:
- `GET /api/marketplaces`
- `GET /api/admin/marketplaces`
- `GET /api/marketplaces/:id`
- `GET /api/marketplaces/:id/sections`
- `GET /api/main-marketplaces`
- `POST /api/marketplaces`
- `PUT /api/marketplaces/:id`
- `DELETE /api/marketplaces/:id`

### 3. Database Migration
- Run migration script if not already done:
  ```bash
  cd cloud4india-cms
  node migrate-solution-to-marketplace.js
  ```

### 4. Restart Services
After updating code:
```bash
# Restart backend
cd cloud4india-cms
pm2 restart cms-server
# OR
npm start
```

### 5. Test After Deployment
```bash
# Test endpoints
curl http://149.13.60.6:4002/api/marketplaces
curl http://149.13.60.6:4002/api/admin/marketplaces
curl http://149.13.60.6:4002/api/main-marketplaces
```

## Current Status:
- ✅ Code structure: VERIFIED
- ✅ Routes defined: VERIFIED
- ❌ Server running: NEEDS UPDATE
- ❌ APIs responding: FAILING (404 errors)

## Next Steps:
1. Deploy updated server.js to 149.13.60.6
2. Restart the backend service
3. Run database migration if needed
4. Re-run API tests
