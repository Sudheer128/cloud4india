# Environment Variables Guide

## Where to Maintain VITE_CMS_URL

### For Production (Docker Deployment)

The `VITE_CMS_URL` is configured in **`docker-compose.yml`** as a build argument.

**Current Configuration:**
```yaml
build:
  args:
    - VITE_CMS_URL=${VITE_CMS_URL:-http://38.242.248.213:4002}
```

**How to Change It:**

1. **Option 1: Use Environment Variable (Recommended)**
   - Create a `.env` file in the project root:
     ```
     VITE_CMS_URL=http://your-server-ip:4002
     ```
   - Docker Compose will automatically read from `.env` file
   - The `:-http://38.242.248.213:4002` part is a fallback if the env var is not set

2. **Option 2: Direct Edit in docker-compose.yml**
   - Edit line 10 in `docker-compose.yml`:
     ```yaml
     - VITE_CMS_URL=http://your-new-ip:4002
     ```

**After changing, rebuild:**
```bash
docker-compose up --build -d cloud4india-web
```

### For Local Development

Create a `.env` file in the project root:

```bash
# .env file
VITE_CMS_URL=http://localhost:4002
VITE_API_URL=http://localhost:4002
```

**Important Notes:**
- `.env` files are typically gitignored (don't commit sensitive data)
- Vite automatically loads `.env` files
- Variables must start with `VITE_` to be accessible in the browser
- Changes to `.env` require restarting the dev server

### Current Setup

- **Production URL**: `http://38.242.248.213:4002` (set in docker-compose.yml)
- **Local Fallback**: `http://localhost:4002` (used in code when env var is not set)

### How It Works

1. **Build Time**: Vite embeds environment variables during `npm run build`
2. **Docker Build**: The Dockerfile accepts `VITE_CMS_URL` as a build argument
3. **Runtime**: The built app uses the embedded value (can't change after build)

### To Update Production URL

1. Edit `docker-compose.yml` or create `.env` file with new URL
2. Rebuild the frontend container:
   ```bash
   docker-compose up --build -d cloud4india-web
   ```

### Security Note

- Never commit `.env` files with sensitive data
- Use environment variables or secrets management for production
- The current setup uses a fallback value, which is safe for non-sensitive URLs


