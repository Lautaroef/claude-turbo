# Deployment Guide

This project uses a three-tier deployment architecture:
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (Django + Gunicorn)
- **Database**: Supabase (PostgreSQL)

## Architecture Overview

```
[Vercel Frontend] --> [Railway Backend] --> [Supabase PostgreSQL]
     Next.js            Django/Gunicorn         PostgreSQL
```

---

## 1. Database (Supabase)

### Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **Database** → **Connection string**
3. Copy the **Pooler** connection string (port 6543):
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

### Notes
- Use the **Pooler** URL (port 6543) for Django, not the direct connection (port 5432)
- SSL is required - Django settings handle this with `ssl_require=True`

---

## 2. Backend (Railway)

### Prerequisites
- Railway account at [railway.app](https://railway.app)
- Railway CLI: `npm install -g @railway/cli`

### Project Structure
```
backend/
├── Dockerfile
├── railway.toml
├── entrypoint.sh
├── requirements.txt
└── config/
    ├── settings.py
    └── wsgi.py
```

### Key Configuration Files

**railway.toml**
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
preDeployCommand = "python manage.py migrate --noinput"
startCommand = "./entrypoint.sh"
healthcheckPath = "/api/health/"
healthcheckTimeout = 30
```

**entrypoint.sh**
```bash
#!/bin/bash
set -e

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn on port $PORT..."
exec gunicorn config.wsgi:application \
    --bind "0.0.0.0:$PORT" \
    --forwarded-allow-ips "*" \
    --workers 1 \
    --threads 2 \
    --timeout 120 \
    --log-level info \
    --access-logfile - \
    --error-logfile -
```

### Environment Variables (Railway Dashboard)

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Supabase pooler URL |
| `SECRET_KEY` | A secure random string |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `your-app.up.railway.app,localhost` |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` |
| `PYTHONUNBUFFERED` | `1` |

### Django Settings Requirements

```python
# ALLOWED_HOSTS - include Railway health check
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',') + ['healthcheck.railway.app']

# CORS - must be high in middleware order
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Before WhiteNoise!
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # ...
]

# HTTPS proxy settings
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
CSRF_TRUSTED_ORIGINS = ['https://your-frontend.vercel.app']
```

### Deploy
```bash
git push origin main  # Railway auto-deploys from GitHub
```

---

## 3. Frontend (Vercel)

### Setup
1. Import your GitHub repo at [vercel.com](https://vercel.com)
2. Set the **Root Directory** to `frontend` (if monorepo)
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
   ```

### Deploy
Vercel auto-deploys on push to main branch.

---

## Troubleshooting

### 502 Bad Gateway

**Symptom**: Health check passes but external requests fail with 502.

**Causes & Fixes**:

| Cause | Fix |
|-------|-----|
| Stale domain routing | Delete domain in Railway dashboard, recreate it |
| Overlapping deployments | Cancel pending builds, keep only the latest |
| Container crashing (OOM) | Reduce gunicorn workers to 1 |
| Shell expansion of `*` in TOML | Use `entrypoint.sh` script instead of inline command |

### Container Flapping (Start → Stop → Start)

**Symptom**: Logs show repeated "Starting Container" / "Stopping Container".

**Causes**:
- Multiple git pushes triggering overlapping deployments
- Memory limit exceeded (OOM kill)

**Fixes**:
- Wait for one deployment to complete before pushing again
- Reduce workers: `--workers 1`
- Check Railway metrics for memory usage

### CORS Errors

**Symptom**: Browser console shows CORS policy errors.

**Fixes**:
1. Ensure `CorsMiddleware` is **before** `WhiteNoiseMiddleware` in Django settings
2. Verify `CORS_ALLOWED_ORIGINS` env var has no trailing slashes or spaces
3. Add explicit CORS headers in settings:
   ```python
   CORS_ALLOW_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']
   CORS_ALLOW_HEADERS = ['accept', 'authorization', 'content-type', ...]
   ```

### Logs Not Appearing

**Symptom**: Container runs but no logs visible.

**Fix**: Add `PYTHONUNBUFFERED=1` environment variable in Railway.

### Health Check Fails

**Symptom**: "Healthcheck failed" in Railway build logs.

**Fixes**:
1. Ensure `/api/health/` endpoint exists and returns 200
2. Add `healthcheck.railway.app` to `ALLOWED_HOSTS`
3. Increase `healthcheckTimeout` in railway.toml (default: 30s)
4. Move migrations to `preDeployCommand` so they don't eat into health check time

---

## Useful Commands

```bash
# Railway CLI
railway login
railway link
railway logs --lines 100
railway status
railway redeploy

# Test endpoints
curl https://your-backend.up.railway.app/api/health/

# Test CORS preflight
curl -X OPTIONS https://your-backend.up.railway.app/api/auth/register/ \
  -H "Origin: https://your-frontend.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```
