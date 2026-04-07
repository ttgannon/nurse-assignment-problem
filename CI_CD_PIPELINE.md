# Zero-Latency CI/CD Pipeline

This document describes the automated deployment pipeline for the Nursify app.

## Pipeline Overview

```
Push to main
    ↓
┌─────────────────────────────────────┐
│ CI STAGE (Parallel)                │
├─────────────────────────────────────┤
│ 1. Lint & Format Check (fail-fast) │
│ 2. Build Frontend (Vite)           │
│ 3. Build Backend (TypeScript)      │
│ 4. Aggregate Status Check          │
└─────────────────────────────────────┘
    ↓ (if all pass)
┌─────────────────────────────────────┐
│ DEPLOY STAGE (Parallel)             │
├─────────────────────────────────────┤
│ 5. Deploy Backend (Render)         │
│    └─ Health-check gated           │
│       blue-green swap              │
│ 6. Deploy Frontend (Vercel)        │
│    └─ Atomic CDN swap              │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ SMOKE TESTS (Post-Deploy)           │
├─────────────────────────────────────┤
│ 7. Backend health check            │
│ 8. API endpoint verification       │
│ 9. Frontend availability check     │
│ 10. Deployment summary             │
└─────────────────────────────────────┘
```

## Stages Explained

### 1. **Lint & Format Check** (Fail-Fast)

- **Purpose**: Catch code style issues immediately
- **Command**: `npm run lint`
- **Timeout**: 5 minutes
- **Failure**: Stops deployment

### 2. **Build Frontend** (Vite)

- **Purpose**: Compile React + TypeScript → optimized bundle
- **Command**: `npm run build`
- **Output**: `dist/` directory (uploaded as artifact)
- **Timeout**: 10 minutes
- **Includes**:
  - TypeScript compilation & type checking
  - Vite bundling & optimization
  - Tailwind CSS processing
  - Asset minification

### 3. **Build Backend** (TypeScript)

- **Purpose**: Compile Express + TypeScript → JavaScript
- **Command**: `npm run build` (in `server/`)
- **Output**: `server/dist/` directory (uploaded as artifact)
- **Timeout**: 10 minutes
- **Includes**:
  - Prisma client generation
  - TypeScript compilation
  - Dependency bundling

### 4. **Aggregate CI Status**

- **Purpose**: Gate deployments on CI success
- **Ensures**: All builds pass before any deployment
- **Failure**: Prevents downstream deploy jobs

### 5. **Deploy Backend** (Render)

- **Mechanism**: HTTP webhook triggers Render rebuild
- **Render's Process**:
  1. Pulls latest `main` from GitHub
  2. Runs buildCommand: `cd server && npm ci --include=dev && npx prisma generate && npm run build`
  3. Starts new instance on random port
  4. **Polls** `/health` endpoint (required, must return 200)
  5. Once healthy, **blue-green swap**: redirects traffic to new instance
  6. Terminates old instance (zero downtime)
- **Result**: Zero-downtime deployment

### 6. **Deploy Frontend** (Vercel)

- **Mechanism**: `vercel --prod` CLI command
- **Vercel's Process**:
  1. Builds the artifact (already done in CI, but Vercel rebuilds)
  2. Runs edge functions if configured
  3. Deploys to CDN globally
  4. Performs **atomic swap**: updates DNS alias only after all edge nodes are ready
  5. Old deployment stays accessible but unreachable
- **Result**: Atomic zero-downtime deployment

### 7-10. **Post-Deploy Smoke Tests**

- **Purpose**: Verify deployments are healthy
- **Tests**:
  - ✅ Backend `/health` endpoint (6 retries with 5s delays)
  - ✅ Backend `/units` API endpoint returns data
  - ✅ Frontend `https://nursify.vercel.app` returns HTTP 200
- **Timeout**: 10 minutes total
- **Failure**: Alerts you but doesn't rollback (Render health gates would have prevented bad deployment)

---

## Zero-Latency Optimizations

### 1. **Concurrency Control**

```yaml
concurrency:
  group: ci-cd-${{ github.ref }}
  cancel-in-progress: true
```

- **Benefit**: Cancels old runs if a new push happens → saves CI minutes
- **Result**: Only the latest commit is deployed

### 2. **Parallel Job Execution**

- Lint, build frontend, and build backend run **simultaneously**
- Saves ~5-10 seconds per deployment

### 3. **Artifact Caching**

```yaml
cache: npm
```

- **Mechanism**: GitHub caches `node_modules/` between runs
- **Benefit**: Dependency install ~10x faster on cache hit
- **Result**: Saves ~30-60 seconds per deployment

### 4. **Node.js Memory Optimization**

```yaml
NODE_OPTIONS: "--max_old_space_size=4096"
```

- **Benefit**: Prevents OOM errors during large builds
- **Result**: Stable deployments, no timeouts

### 5. **Health-Check Gating (Render)**

- Render waits for `/health` endpoint before swapping
- **Benefit**: If backend crashes on startup, old instance keeps serving
- **Result**: Zero downtime even if deployment has bugs

### 6. **Atomic CDN Swap (Vercel)**

- Old deployment keeps serving until new one passes all checks
- **Benefit**: Users never see partially deployed code
- **Result**: Instant, atomic frontend updates

### 7. **Fail-Fast Linting**

- Lint runs first, fails quickly if code has issues
- **Benefit**: Don't waste 10+ minutes building broken code
- **Result**: Fast feedback loop

### 8. **Smoke Tests Post-Deploy**

- Verify real endpoints, not just local builds
- **Benefit**: Catch integration issues, database failures, env misconfigs
- **Result**: Early warning if deployment is broken

---

## Configuration Files

### `.github/workflows/ci-cd.yml`

**Location**: `.github/workflows/ci-cd.yml`

Contains:

- Job definitions (lint, build, deploy)
- Environment variables (NODE_VERSION, NODE_OPTIONS)
- Concurrency rules
- Secrets references

### `render.yaml`

**Location**: `render.yaml`

Contains:

- Build command (installs deps, generates Prisma, compiles)
- Start command (runs DB migrations, starts Express server)
- Health check path (`/health`)
- Environment variables

**Critical for zero-downtime**: Health check must be configured and endpoint must work.

### `vercel.json`

**Location**: `vercel.json`

Contains:

- SPA rewrite rule (all routes → `/index.html`)
- Build settings (inherited from Vercel dashboard)

---

## Secrets Required in GitHub

### Backend Deployment

- **`RENDER_DEPLOY_HOOK_URL`**: Webhook URL provided by Render
  - Format: `https://api.render.com/deploy/srv-...?key=...`
  - Found in Render dashboard → Service → Deploy Hook

### Frontend Deployment

- **`VERCEL_TOKEN`**: Personal auth token from Vercel
  - Found in Vercel → Settings → Tokens
- **`VERCEL_ORG_ID`**: Organization/Team ID
  - Found in Vercel dashboard URL or team settings
- **`VERCEL_PROJECT_ID`**: Project ID for the Nursify app
  - Found in Vercel project → Settings → Project ID

### CI Environment Variables (optional)

- **`VITE_API_BASE_URL`**: Backend API URL (defaults to production)
- **`VITE_FHIR_REDIRECT_URI`**: FHIR OAuth redirect URI

---

## Environment Configuration

### Production Secrets (in Render, Vercel dashboards)

**Render** (Backend):

- `DATABASE_URL`: Neon PostgreSQL connection string
- `SESSION_SECRET`: Session signing key
- `ALLOWED_ORIGINS`: CORS allowed origins (includes Vercel domain)
- `NODE_ENV`: `production`
- `FHIR_CLIENT_ID`, `FHIR_CLIENT_SECRET`, `FHIR_REDIRECT_URI`

**Vercel** (Frontend):

- `VITE_API_BASE_URL`: Points to `https://nursify-api.onrender.com`
- `VITE_FHIR_REDIRECT_URI`: Points to OAuth callback

---

## Health Check Endpoint

**Requirement for zero-downtime**: Backend must expose `/health` endpoint.

### Implementation (Express)

```typescript
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
```

**Why required**:

- Render polls this before swapping traffic
- If endpoint returns non-200, old instance keeps serving
- Prevents serving broken deploys

**Check it**:

```bash
curl https://nursify-api.onrender.com/health
# { "status": "ok", "timestamp": "2026-04-07T..." }
```

---

## Smoke Test Details

### Backend Health Check

```bash
curl https://nursify-api.onrender.com/health
```

- Retries 6 times with 5-second delays (30 seconds total)
- Must return HTTP 200

### API Endpoint Test

```bash
curl https://nursify-api.onrender.com/units
```

- Verifies data is being returned
- Checks JSON structure

### Frontend Test

```bash
curl https://nursify.vercel.app
```

- Verifies page loads
- Checks HTTP 200 response

---

## Troubleshooting

### Deployment Fails: "health check failed"

**Cause**: Backend `/health` endpoint returning non-200 or timing out
**Fix**:

1. Check Render logs: `https://dashboard.render.com/services/[service-id]/logs`
2. Verify `/health` endpoint exists and returns 200
3. Check database connectivity (DATABASE_URL)
4. Restart service manually

### Deployment Stuck: "Waiting for health check"

**Cause**: Backend taking >30s to start or `/health` endpoint crashing
**Fix**:

1. Increase retry count in smoke test (edit `.github/workflows/ci-cd.yml`)
2. Optimize Express startup (reduce initialization work)
3. Enable Render's auto-restart

### Frontend Not Updated

**Cause**: Vercel cache or CDN lag
**Fix**:

1. Force rebuild in Vercel dashboard: Deployments → [latest] → Redeploy
2. Clear browser cache (`Cmd+Shift+R` on Mac)
3. Check that Vercel got the latest commit

### Dependencies Not Installed

**Cause**: Cache corruption or lockfile mismatch
**Fix**:

1. Clear GitHub Actions cache: Settings → Actions → General → Clear all caches
2. Verify `package-lock.json` is committed
3. Run `npm ci` locally to reproduce

---

## Performance Metrics

**Typical End-to-End Deployment Time**:

- Lint: ~30 seconds
- Build Frontend: ~60 seconds
- Build Backend: ~40 seconds
- Deploy Backend: ~2 minutes (includes Render rebuild + health check)
- Deploy Frontend: ~1 minute
- Smoke Tests: ~20 seconds
- **Total**: ~5-6 minutes from push to live

**Downtime**: **0 seconds** (zero-latency achieved via:

- Render: Health-check gated blue-green swap
- Vercel: Atomic CDN swap
- Users never served stale code or errors)

---

## Manual Deployment (if needed)

### Render Backend

```bash
curl -X POST https://api.render.com/deploy/srv-[service-id]?key=[deploy-key]
```

### Vercel Frontend

```bash
npx vercel --prod --token [vercel-token]
```

### Full Local Test

```bash
npm run lint
npm run build
npm run test

cd server
npm run build
cd ..

# Verify locally before pushing
git push origin main  # triggers CI/CD
```

---

## Monitoring & Alerts

### Health Endpoints

- **Backend**: `https://nursify-api.onrender.com/health`
- **Frontend**: `https://nursify.vercel.app`

### Logs

- **Backend**: Render dashboard → Service logs
- **Frontend**: Vercel dashboard → Deployments → Logs
- **CI/CD**: GitHub Actions → Workflows → Latest run

### Status Page

- **Render**: https://status.render.com/
- **Vercel**: https://www.vercel-status.com/
- **GitHub**: https://www.githubstatus.com/

---

## Next Steps

1. ✅ Verify all GitHub secrets are set
2. ✅ Test deploy workflow by pushing to `main`
3. ✅ Monitor smoke test results
4. ✅ Set up Slack/email notifications (optional)
5. ✅ Document any customizations
