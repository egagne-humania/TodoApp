# Deployment Guide

## Overview

TodoApp uses continuous deployment with GitHub Actions. Code pushed to `main` deploys to development, code pushed to `prod` deploys to production.

## Architecture

```
GitHub → GitHub Actions → Cloudflare Pages (Frontend) + Convex (Backend)
```

## Branch Strategy

### Main Branch → Development
- Auto-deploys to dev environment
- 1 approval required
- Use for active development

### Prod Branch → Production
- Auto-deploys to production
- 2+ approvals required
- Only stable, tested features

## Initial Setup

### 1. Convex Setup

```bash
# Create dev deployment
npx convex dev

# Get deploy key from dashboard
# https://dashboard.convex.dev → Settings → Deploy Keys
```

### 2. Cloudflare Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Create new Pages project
3. Connect to GitHub repository
4. Configure build:
   - Production branch: `main`
   - Build command: (empty)
   - Build output: `dist`

**Get API credentials**:
- API Token: Profile → API Tokens → Create Token
  - Template: "Edit Cloudflare Workers"
  - Permission: Account → Cloudflare Pages → Edit
- Account ID: From dashboard sidebar

### 3. GitHub Secrets

Add these secrets in repository Settings → Secrets and variables → Actions:

```
# Cloudflare
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID

# Convex
CONVEX_DEPLOY_KEY_DEV
CONVEX_DEPLOY_KEY_PROD

# Environment Variables (Dev)
VITE_CONVEX_URL_DEV
VITE_MSAL_CLIENT_ID_DEV
VITE_MSAL_AUTHORITY
VITE_MSAL_REDIRECT_URI_DEV

# Environment Variables (Prod)
VITE_CONVEX_URL_PROD
VITE_MSAL_CLIENT_ID_PROD
VITE_MSAL_REDIRECT_URI_PROD
```

## Local Development

### Environment Setup

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local (gitignored)
VITE_CONVEX_URL=your-convex-url
VITE_MSAL_CLIENT_ID=your-client-id
VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/common
VITE_MSAL_REDIRECT_URI=http://localhost:5173
```

### Run Locally

```bash
# Terminal 1: Convex
npx convex dev

# Terminal 2: Vite
npm run dev
```

## Deployment Workflow

### To Development (main)

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Develop with TDD
# ... write tests, implement, refactor ...

# 3. Commit and push
git add .
git commit -m "feat: add feature"
git push origin feature/my-feature

# 4. Create PR to main
# GitHub → Pull requests → New pull request

# 5. Get 1 approval, merge
# Automatic deployment to dev! ✅
```

### To Production (prod)

```bash
# 1. Test in dev environment first
# Verify all features work

# 2. Create PR from main to prod
# GitHub → Compare: prod ← main

# 3. Add release notes:
# - What's new
# - Breaking changes
# - Migration steps (if any)

# 4. Get 2+ approvals

# 5. Merge to prod
# Automatic deployment to production! ✅

# 6. Monitor deployment
# Check logs, errors, performance
```

## GitHub Actions Workflows

### CI Workflow

`.github/workflows/ci.yml` - Runs on all PRs

```yaml
- Checkout code
- Setup Node.js
- Install dependencies
- Run linter (ESLint)
- Run type check (TypeScript)
- Run tests (Vitest)
- Run build
```

### Deploy Dev Workflow

`.github/workflows/deploy-dev.yml` - Runs on push to `main`

```yaml
- Deploy Convex backend (dev)
- Build frontend
- Deploy to Cloudflare (dev)
```

### Deploy Prod Workflow

`.github/workflows/deploy-prod.yml` - Runs on push to `prod`

```yaml
- Deploy Convex backend (prod)
- Build frontend  
- Deploy to Cloudflare (prod)
- Run smoke tests
```

## Secrets Management

### Where Secrets Go

| Secret | Local | GitHub | Cloudflare | Convex |
|--------|-------|--------|-----------|---------|
| Convex URL | `.env.local` | ✅ Secret | ✅ Env Var | - |
| Convex Deploy Key | - | ✅ Secret | - | - |
| Azure Client ID | `.env.local` | ✅ Secret | ✅ Env Var | - |
| Cloudflare Token | - | ✅ Secret | - | - |

### Security Rules

- ✅ Use `.env.local` for local secrets (gitignored)
- ✅ Use GitHub Secrets for CI/CD
- ✅ Never commit secrets to repository
- ❌ Never put secrets in code
- ❌ Never commit `.env.local`

## Configuration

### Environment Variables

**Required for frontend**:
```bash
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_MSAL_CLIENT_ID=your-azure-client-id
VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/tenant-id
VITE_MSAL_REDIRECT_URI=https://your-domain.com
```

**Access in code**:
```typescript
import { env } from '@/config/env';

console.log(env.convexUrl);
console.log(env.msal.clientId);
```

## Deployment Checklist

### Before Deploying to Dev (main)
- [ ] All tests passing
- [ ] No TypeScript/ESLint errors
- [ ] Feature tested locally
- [ ] PR reviewed (1+ approval)

### Before Deploying to Prod
- [ ] Tested in dev environment
- [ ] Security review completed
- [ ] Performance verified
- [ ] 2+ approvals received
- [ ] Release notes prepared
- [ ] Rollback plan ready

## Monitoring & Rollback

### Check Deployment Status

**Convex**:
```bash
# View logs
npx convex logs --prod

# Check deployment
npx convex dashboard
```

**Cloudflare**:
- Dashboard → Pages → Select project → Deployments
- View build logs
- Check deployment status

### Rollback Procedure

**If deployment fails**:

1. **Immediate**: Revert merge commit
   ```bash
   git revert -m 1 <merge-commit-hash>
   git push origin prod
   ```

2. **Fix & Redeploy**:
   - Fix issue in feature branch
   - Test in dev
   - Create new PR to prod

## Troubleshooting

### Build Fails

1. Check GitHub Actions logs
2. Verify all secrets are set
3. Check TypeScript/ESLint errors
4. Verify dependencies installed

### Deployment Succeeds but App Broken

1. Check browser console for errors
2. Check Convex logs: `npx convex logs`
3. Verify environment variables
4. Check Cloudflare deployment logs

### Secrets Not Working

1. Verify secrets in GitHub Settings
2. Check secret names match exactly
3. Redeploy after updating secrets
4. Check Cloudflare environment variables

## Production Best Practices

### Deployment Timing

- **Preferred**: Tuesday-Thursday, 10 AM - 2 PM
- **Avoid**: Mondays (week start), Fridays (weekend risk)
- **Emergency**: Anytime with proper approval and on-call ready

### Pre-Deployment

1. Announce deployment in team channel
2. Verify dev environment stable
3. Review all changes since last deployment
4. Prepare rollback plan
5. Have on-call person ready

### Post-Deployment

1. Run smoke tests
2. Monitor error logs (15 minutes)
3. Check key user flows
4. Monitor performance metrics
5. Announce completion

### Rollback Criteria

Rollback immediately if:
- Error rate increases >10%
- Critical feature broken
- Performance degrades significantly
- Security issue discovered

## Quick Reference

### Essential Commands

```bash
# Local Development
npx convex dev              # Start Convex
npm run dev                 # Start Vite

# Build
npm run build               # Production build
npm run preview             # Preview build

# Deployment
git push origin main        # Deploy to dev
git push origin prod        # Deploy to prod

# Monitoring
npx convex logs             # View Convex logs
npx convex dashboard        # Open dashboard
```

### Important URLs

- Convex Dashboard: https://dashboard.convex.dev
- Cloudflare Dashboard: https://dash.cloudflare.com
- GitHub Actions: https://github.com/[org]/[repo]/actions

## Resources

- [Convex Deployment](https://docs.convex.dev/production/deployment)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [GitHub Actions](https://docs.github.com/en/actions)
