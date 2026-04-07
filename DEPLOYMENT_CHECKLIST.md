# Zero-Latency Deployment Checklist

This checklist ensures your CI/CD pipeline achieves zero-downtime deployments.

## Pre-Deployment Verification

### GitHub Setup
- [ ] Repository has `.github/workflows/ci-cd.yml` configured
- [ ] All required secrets are set in GitHub Settings → Secrets:
  - [ ] `RENDER_DEPLOY_HOOK_URL` (from Render dashboard)
  - [ ] `VERCEL_TOKEN` (from Vercel account)
  - [ ] `VERCEL_ORG_ID` (from Vercel team)
  - [ ] `VERCEL_PROJECT_ID` (from Vercel project)
- [ ] Branch protection rules allow merging only after CI passes

### Backend (Render)
- [ ] `/health` endpoint exists and returns `{ ok: true }` with HTTP 200
  - Test: `curl https://nursify-api.onrender.com/health`
- [ ] `render.yaml` exists with:
  - [ ] `health_check` configured
  - [ ] `buildCommand` includes `npm ci --include=dev`
  - [ ] `startCommand` includes `npm run start:prod`
- [ ] All environment variables set in Render dashboard:
  - [ ] `DATABASE_URL` (Neon PostgreSQL URL)
  - [ ] `SESSION_SECRET` (unique random string)
  - [ ] `ALLOWED_ORIGINS` (includes `https://nursify.vercel.app`)
  - [ ] `NODE_ENV=production`
- [ ] Database migrations up-to-date (`npx prisma migrate deploy`)

### Frontend (Vercel)
- [ ] `vercel.json` exists with SPA rewrite rules
- [ ] Build settings configured:
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
  - [ ] Install Command: `npm ci`
- [ ] Environment variables set in Vercel dashboard:
  - [ ] `VITE_API_BASE_URL=https://nursify-api.onrender.com`
  - [ ] `VITE_FHIR_REDIRECT_URI=https://nursify.vercel.app/auth/callback`
- [ ] Domain configured and SSL/TLS active

### Code Quality
- [ ] No console errors: `npm run lint` passes
- [ ] TypeScript builds cleanly: `npm run build` succeeds
- [ ] Backend TypeScript compiles: `cd server && npm run build` succeeds
- [ ] Local build artifacts not in git:
  - [ ] `dist/` in `.gitignore`
  - [ ] `server/dist/` in `.gitignore`
  - [ ] `node_modules/` in `.gitignore`

### Database
- [ ] Neon PostgreSQL database created and populated
- [ ] Tables verified: `SELECT * FROM information_schema.tables WHERE table_schema='public';`
- [ ] Sample data present: `SELECT COUNT(*) FROM nurses, patients, units;`
- [ ] Search path configured: `ALTER DATABASE neondb SET search_path TO public;`
- [ ] Connection string works locally:
  ```bash
  export DATABASE_URL="postgresql://..."
  cd server && npm run db:push:prod
  ```

---

## First Deployment Flow

1. **Prepare the commit**
   ```bash
   git add .
   git commit -m "chore: initial deployment setup"
   ```

2. **Push to main**
   ```bash
   git push origin main
   ```

3. **Monitor GitHub Actions**
   - Go to: `https://github.com/[user]/[repo]/actions`
   - Watch the `CI / CD (Zero-Latency)` workflow
   - Timeline:
     - ~30s: Lint completes
     - ~60s: Frontend build completes
     - ~40s: Backend build completes
     - ~2m: Backend deployment (Render health check)
     - ~1m: Frontend deployment (Vercel atomic swap)
     - ~20s: Smoke tests run
     - Total: ~5-6 minutes

4. **Verify deployments**
   ```bash
   # Backend
   curl https://nursify-api.onrender.com/health
   curl https://nursify-api.onrender.com/units
   
   # Frontend
   curl https://nursify.vercel.app
   ```

5. **Check logs**
   - **Render**: https://dashboard.render.com/ → Service → Logs
   - **Vercel**: https://vercel.com/ → Project → Deployments → Latest
   - **GitHub**: Actions tab → Workflow run

---

## Deployment Verification Checklist

### After Each Deployment

- [ ] **GitHub Actions**: All jobs show green ✅
- [ ] **Backend Health**: `/health` endpoint returns 200
  ```bash
  curl -I https://nursify-api.onrender.com/health
  # HTTP/1.1 200 OK
  ```
- [ ] **API Connectivity**: Data endpoint works
  ```bash
  curl https://nursify-api.onrender.com/units | jq
  # Should return JSON array of units
  ```
- [ ] **Frontend Accessible**: Home page loads
  ```bash
  curl -I https://nursify.vercel.app
  # HTTP/1.1 200 OK
  ```
- [ ] **Console Clean**: No JavaScript errors
  - Open DevTools on `https://nursify.vercel.app`
  - Check Console tab (no red errors)
- [ ] **Functionality Works**: Can perform basic operations
  - Can select unit
  - Can view patients
  - Can see nurses

### Smoke Test Output Should Show
```
========================================
✅ DEPLOYMENT COMPLETE
=========================================
Frontend:  https://nursify.vercel.app
Backend:   https://nursify-api.onrender.com
=========================================
```

---

## Rollback Procedures

### If Backend Deployment Fails

**Option 1: Automatic Rollback (if health check fails)**
- Old instance keeps serving traffic
- New instance is terminated
- No manual action needed

**Option 2: Manual Rollback**
```bash
# Re-deploy previous commit
git revert HEAD
git push origin main

# GitHub Actions will automatically trigger deployment of previous commit
```

**Option 3: Render Manual Rollback**
1. Go to: https://dashboard.render.com/
2. Select service → Deployments
3. Click "Deploy" on a previous successful deployment
4. Wait for health check to pass

### If Frontend Deployment Fails

**Option 1: Automatic Fallback**
- Failed deployment remains inaccessible
- Previous deployment continues serving
- No manual action needed

**Option 2: Manual Rollback**
```bash
# In Vercel dashboard
# Deployments → Previous deployment → Click to promote
```

**Option 3: Git Revert**
```bash
git revert HEAD
git push origin main
```

---

## Performance Optimization Tips

### Reduce Build Time
1. **Use npm cache aggressively**
   - GitHub caches dependencies automatically
   - Ensure `package-lock.json` is committed

2. **Parallelize CI jobs**
   - Already done in updated workflow
   - Lint, build frontend, build backend run simultaneously

3. **Optimize dependencies**
   - Remove unused packages: `npm prune`
   - Check bundle size: `npm run build && npm ls`

4. **Enable Render build cache**
   - Render caches `node_modules/` between builds by default
   - Speeds up dependencies install

### Reduce Database Migration Time
1. **Run migrations ahead of time**
   - Don't wait for production migration during deploy
   - Test migrations locally first: `npm run db:push:prod` on staging

2. **Batch database changes**
   - Combine multiple ALTER TABLE into one migration
   - Reduces total migration time

### Reduce Frontend Deploy Time
1. **Vercel caching**
   - Already optimized (atomic swap)
   - Previous builds cached for instant rollback

2. **CDN distribution**
   - Global CDN (built into Vercel)
   - Users get assets from nearest edge location

---

## Scaling for Zero-Latency

### Current Setup (Single Backend Instance)
- **Latency**: Single instance in Ohio
- **Redundancy**: None (if instance crashes, service down until restart)
- **Recovery Time**: ~2 minutes (Render auto-restart)

### High-Availability Setup (Optional)
To scale beyond single instance:

1. **Enable Render Auto-Restart**
   - Settings → Auto-Restart → Enabled
   - Automatically restarts crashed instances

2. **Add Health Checks & Monitoring**
   - Render monitors `/health` endpoint every 30s
   - Fails over if endpoint unresponsive

3. **Database Connection Pooling**
   - Neon already provides pooling
   - Currently sufficient for single backend instance

4. **CDN for Static Assets**
   - Vercel provides global CDN by default
   - Static assets served from nearest edge location

5. **Multi-Region Deployment** (if needed later)
   - Deploy backend to multiple regions
   - Use Render's drain timeout for graceful shutdown
   - Route traffic via load balancer

---

## Monitoring & Alerts

### GitHub Actions Notifications
- Enabled by default
- Notifies on workflow failure
- Settings: https://github.com/settings/notifications

### Render Notifications
1. Go to: https://dashboard.render.com/account
2. Alerting → Email notifications
3. Check: "Service failures", "Service suspensions"

### Vercel Notifications
1. Go to: https://vercel.com/account/notifications
2. Enable email for: Deployment completed, Deployment failed

### Custom Slack Integration (Optional)
```yaml
# Add to .github/workflows/ci-cd.yml
- name: Notify Slack on failure
  if: failure()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -d '{"text":"Deployment failed"}'
```

---

## Continuous Improvement

### Weekly Tasks
- [ ] Check deployment logs for errors
- [ ] Monitor API response times (Render logs)
- [ ] Review GitHub Actions build times
- [ ] Verify smoke test outputs

### Monthly Tasks
- [ ] Update dependencies: `npm update`
- [ ] Review database for bloat
- [ ] Check Render service logs for warnings
- [ ] Test rollback procedure (low-traffic time)

### Quarterly Tasks
- [ ] Load test backend (10-50 concurrent users)
- [ ] Review and update CI/CD pipeline
- [ ] Audit all environment variables and secrets

---

## Common Pitfalls & Solutions

| Problem | Cause | Solution |
|---------|-------|----------|
| **Deployment hangs at health check** | `/health` endpoint timing out | Check backend logs, increase retry timeout |
| **Frontend doesn't show new data** | Browser cache | Hard-refresh (`Cmd+Shift+R` Mac, `Ctrl+Shift+R` Windows) |
| **API calls fail after deploy** | CORS misconfigured | Verify ALLOWED_ORIGINS in Render env vars |
| **Database tables not found** | Search path not set | Run: `ALTER DATABASE neondb SET search_path TO public;` |
| **Build succeeds locally, fails on CI** | Dependency mismatch | Delete `node_modules/`, clear cache, `npm ci` fresh |
| **Vercel build succeeds, frontend blank** | SPA rewrite not configured | Check `vercel.json` has rewrite rule |
| **Render instance keeps restarting** | OOM or crash loop | Check logs, verify DATABASE_URL valid |
| **GitHub Actions stuck** | Workflow syntax error | Check `.github/workflows/ci-cd.yml` YAML formatting |

---

## References

- [Render Zero-Downtime Deploys](https://render.com/docs/deploy-hooks#zero-downtime-deploys)
- [Vercel Deployments & Atomic Swap](https://vercel.com/docs/deployments/overview)
- [GitHub Actions Workflows](https://docs.github.com/en/actions/using-workflows)
- [Neon PostgreSQL Connection](https://neon.tech/docs/connect/connect-from-any-application)
- [Express Health Checks](https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html)

---

## Support

If deployment fails:
1. **Check logs**: GitHub Actions → Workflows → Latest run
2. **Debug locally**: `npm run build && npm run test`
3. **Review errors**: Render/Vercel dashboards
4. **Verify secrets**: GitHub Settings → Secrets → All present and valid
5. **Test endpoints**: `curl https://nursify-api.onrender.com/health`

Good luck! 🚀
