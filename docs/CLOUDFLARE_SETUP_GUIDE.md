# Cloudflare Pages Setup Guide - Development Environment

## Overview

This guide walks you through setting up Cloudflare Pages for the **development environment** with proper secret management. All secrets will be stored in **GitHub Secrets** (your "key vault"), never in source code or local files.

## Prerequisites

- [x] GitHub repository created
- [x] Cloudflare account (free tier works)
- [x] Convex account and project initialized
- [ ] Microsoft Entra ID app registration (for Phase 2, can skip for now)

---

## Part 1: Convex Backend Setup

### 1.1 Create Convex Development Deployment

```bash
# Navigate to your project
cd /Users/egagne/Library/CloudStorage/OneDrive-HumaniaAssuranceInc/coding/TodoApp

# Login to Convex (if not already logged in)
npx convex login

# Initialize/verify Convex project
npx convex dev
```

This will:
- Create a **development deployment** on Convex
- Generate a deployment URL (e.g., `https://your-project-dev.convex.cloud`)
- Create a `.env.local` file with `CONVEX_URL` (this is gitignored)

### 1.2 Get Convex Deploy Key

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project
3. Click **Settings** → **Deploy Keys**
4. Click **Generate Deploy Key** for the **dev** deployment
5. Copy the deploy key (you'll add this to GitHub Secrets)

**Important**: The deploy key is for **CI/CD only**, not for local development.

---

## Part 2: Cloudflare Pages Setup

### 2.1 Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** in the left sidebar
3. Click **Create a project**
4. Choose **Connect to Git** (do NOT select Direct Upload)
5. Select **GitHub** and authorize Cloudflare
6. Select your `TodoApp` repository
7. Configure build settings:
   - **Project name**: `todoapp-dev`
   - **Production branch**: `main` (this is your dev environment)
   - **Build command**: Leave empty (handled by GitHub Actions)
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave as project root)
8. Click **Save and Deploy**

**Note**: The first deployment will fail because you haven't set environment variables yet. That's expected!

### 2.2 Get Cloudflare API Credentials

#### Get API Token:

1. In Cloudflare dashboard, click your profile icon → **My Profile**
2. Go to **API Tokens**
3. Click **Create Token**
4. Use the **Edit Cloudflare Workers** template, then customize:
   - **Token name**: `GitHub Actions - TodoApp`
   - **Permissions**:
     - Account → Cloudflare Pages → Edit
   - **Account Resources**: Include → Your account
5. Click **Continue to summary** → **Create Token**
6. **Copy the token** (you can't see it again!)

#### Get Account ID:

1. Go to Cloudflare dashboard
2. Click on **Pages** or any service
3. Your **Account ID** is in the right sidebar (under Account details)
4. Copy it

---

## Part 3: GitHub Secrets Setup (Your "Key Vault")

### 3.1 Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each of these:

#### Cloudflare Secrets:

```
Secret Name: CLOUDFLARE_API_TOKEN
Value: <paste the API token from Part 2.2>
```

```
Secret Name: CLOUDFLARE_ACCOUNT_ID
Value: <paste your account ID from Part 2.2>
```

#### Convex Secrets:

```
Secret Name: CONVEX_DEPLOY_KEY_DEV
Value: <paste the deploy key from Part 1.2>
```

```
Secret Name: VITE_CONVEX_URL_DEV
Value: <paste your Convex deployment URL from Part 1.1>
Example: https://your-project-dev.convex.cloud
```

#### Microsoft Entra ID Secrets (Phase 2 - Optional for now):

```
Secret Name: VITE_MSAL_CLIENT_ID_DEV
Value: <your Azure app client ID - add when you create it>
```

```
Secret Name: VITE_MSAL_AUTHORITY
Value: https://login.microsoftonline.com/your-tenant-id
```

```
Secret Name: VITE_MSAL_REDIRECT_URI_DEV
Value: https://todoapp-dev.pages.dev
```

**Note**: For now, you can add placeholder values for the MSAL secrets (like "placeholder") and update them in Phase 2 when you implement authentication.

---

## Part 4: Verify GitHub Actions Workflow

Your workflow file `.github/workflows/deploy-dev.yml` is already configured to use these secrets. Let's verify:

```yaml
# Key sections in deploy-dev.yml:

# Convex deployment uses:
env:
  CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY_DEV }}

# Frontend build uses:
env:
  VITE_CONVEX_URL: ${{ secrets.VITE_CONVEX_URL_DEV }}
  VITE_MSAL_CLIENT_ID: ${{ secrets.VITE_MSAL_CLIENT_ID_DEV }}
  VITE_MSAL_AUTHORITY: ${{ secrets.VITE_MSAL_AUTHORITY }}
  VITE_MSAL_REDIRECT_URI: ${{ secrets.VITE_MSAL_REDIRECT_URI_DEV }}

# Cloudflare deployment uses:
with:
  apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
  accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
  projectName: todoapp-dev
```

✅ Everything is pulling from GitHub Secrets - perfect!

---

## Part 5: Local Development Setup (Without Secrets in Files)

For local development, you'll use a gitignored `.env.local` file:

### 5.1 Create Local Environment File

```bash
# Create .env.local (this is gitignored)
cp .env.example .env.local
```

### 5.2 Edit .env.local

```bash
# Open in your editor
code .env.local  # or nano, vim, etc.
```

Add your **local development** values:

```bash
# Convex (from 'npx convex dev' output)
VITE_CONVEX_URL=https://your-project-dev.convex.cloud

# Microsoft Entra ID (add in Phase 2)
VITE_MSAL_CLIENT_ID=placeholder-for-now
VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/common
VITE_MSAL_REDIRECT_URI=http://localhost:5173

# App Environment
VITE_APP_ENV=development
```

### 5.3 Verify .gitignore

Check that `.env.local` is in `.gitignore`:

```bash
# Check .gitignore contains:
*.local
.env.local
.env*.local
```

✅ This ensures your local secrets are NEVER committed!

---

## Part 6: Test the Complete Setup

### 6.1 Test Local Development

```bash
# Start Convex dev server (in one terminal)
npx convex dev

# Start Vite dev server (in another terminal)
npm run dev
```

Visit `http://localhost:5173` - the app should load without errors.

### 6.2 Test CI/CD Pipeline

```bash
# Make a small change
echo "# Test deployment" >> README.md

# Commit and push to main
git add README.md
git commit -m "test: verify deployment pipeline"
git push origin main
```

Watch the deployment:
1. Go to GitHub → **Actions** tab
2. You should see "Deploy to Development" workflow running
3. It should:
   - ✅ Deploy Convex backend
   - ✅ Build frontend with environment variables
   - ✅ Deploy to Cloudflare Pages

### 6.3 Verify Deployment

1. Go to Cloudflare dashboard → **Pages**
2. Click on `todoapp-dev`
3. You should see a successful deployment
4. Click the **Preview URL** to view your deployed app

---

## Part 7: Security Best Practices Checklist

### ✅ What We Did Right:

- [x] All secrets stored in GitHub Secrets (your key vault)
- [x] `.env.local` is gitignored (never committed)
- [x] No secrets in source code
- [x] Separate secrets for dev vs prod environments
- [x] API tokens have minimal required permissions
- [x] Deploy keys are scoped to specific deployments

### ❌ What to NEVER Do:

- [ ] ❌ Never commit `.env.local` or `.env.production`
- [ ] ❌ Never hardcode secrets in source files
- [ ] ❌ Never share secrets in Slack/email
- [ ] ❌ Never use production secrets in development
- [ ] ❌ Never commit API keys or tokens
- [ ] ❌ Never log sensitive data

---

## Part 8: Adding Production Environment (Future)

When ready for production:

1. **Create prod branch**:
   ```bash
   git checkout -b prod
   git push origin prod
   ```

2. **Create production Cloudflare project**:
   - Project name: `todoapp-prod`
   - Production branch: `prod`

3. **Create production Convex deployment**:
   - In Convex dashboard → Create new deployment → Production

4. **Add production secrets to GitHub**:
   - `CONVEX_DEPLOY_KEY_PROD`
   - `VITE_CONVEX_URL_PROD`
   - `VITE_MSAL_CLIENT_ID_PROD`
   - `VITE_MSAL_REDIRECT_URI_PROD`

5. Workflow `.github/workflows/deploy-prod.yml` is already configured!

---

## Troubleshooting

### Issue: Deployment fails with "Missing environment variable"

**Solution**: 
1. Go to GitHub → Settings → Secrets and variables → Actions
2. Verify all required secrets are added
3. Check secret names match exactly (case-sensitive)

### Issue: "Unauthorized" error from Convex

**Solution**:
1. Verify `CONVEX_DEPLOY_KEY_DEV` is correct
2. Regenerate deploy key in Convex dashboard if needed
3. Update GitHub secret with new key

### Issue: Cloudflare deployment fails with "Invalid token"

**Solution**:
1. Verify `CLOUDFLARE_API_TOKEN` has Pages edit permissions
2. Check token hasn't expired
3. Regenerate token if needed

### Issue: App loads but can't connect to Convex

**Solution**:
1. Check `VITE_CONVEX_URL_DEV` is correct
2. Verify Convex deployment is running (check dashboard)
3. Check browser console for specific error

---

## Quick Reference: Where Are My Secrets?

| Secret | Local Dev | CI/CD (GitHub Actions) | Never Store Here |
|--------|-----------|------------------------|------------------|
| Convex URL | `.env.local` | GitHub Secrets | Source code |
| Convex Deploy Key | Not needed | GitHub Secrets | Anywhere |
| Azure Client ID | `.env.local` | GitHub Secrets | Source code |
| Cloudflare Token | Not needed | GitHub Secrets | Anywhere |

---

## Summary

✅ **You now have:**
- Convex backend (dev deployment) running
- Cloudflare Pages project created
- All secrets in GitHub Secrets (secure!)
- Local development using `.env.local` (gitignored)
- Automatic deployments on push to `main`
- No secrets in source code or committed files

✅ **Security posture:**
- GitHub Secrets = Your key vault ✓
- No secrets in code ✓
- Gitignored local files ✓
- Minimal API token permissions ✓

---

## Next Steps

1. **Complete Phase 0**: ✅ Already done!
2. **Start Phase 1**: Begin implementing core features
3. **Add authentication in Phase 2**: Update MSAL secrets when ready
4. **Monitor deployments**: Check GitHub Actions and Cloudflare dashboards

---

**Need help?** Check:
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Convex Deployment Docs](https://docs.convex.dev/production/hosting)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
