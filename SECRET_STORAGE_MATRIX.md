# Secret Storage Matrix - Where Should Each Secret Go?

## Overview

This guide shows **exactly** where each secret/property should be stored and why.

---

## The Three Storage Locations

| Location | Purpose | Access | Tools Available |
|----------|---------|--------|-----------------|
| **GitHub Secrets** | CI/CD deployment secrets | GitHub Actions workflows | Manual (GitHub UI) |
| **Convex Environment Variables** | Backend runtime secrets | Convex functions (queries/mutations) | ✅ CLI + AI can help |
| **Cloudflare Environment Variables** | Build-time frontend secrets | Frontend build process | Manual (Cloudflare UI) |

---

## Complete Secret Matrix

### 🔑 Deployment & Infrastructure Secrets

| Secret | GitHub Secrets | Convex Env Vars | Cloudflare Env Vars | Notes |
|--------|----------------|-----------------|---------------------|-------|
| **Convex Deploy Key** | ✅ Required | ❌ No | ❌ No | For CI/CD to deploy backend |
| **Cloudflare API Token** | ✅ Required | ❌ No | ❌ No | For CI/CD to deploy frontend |
| **Cloudflare Account ID** | ✅ Required | ❌ No | ❌ No | For CI/CD to deploy frontend |

**Storage**: GitHub Secrets only
**Why**: These are used by GitHub Actions to deploy your app. Convex and Cloudflare never need them.

---

### 🌐 Frontend Public Configuration (Not Really Secrets)

| Property | GitHub Secrets | Convex Env Vars | Cloudflare Env Vars | Notes |
|----------|----------------|-----------------|---------------------|-------|
| **Convex URL (Dev)** | ✅ For CI/CD | ❌ No | ⚠️ Optional | Frontend needs to know backend URL |
| **Convex URL (Prod)** | ✅ For CI/CD | ❌ No | ⚠️ Optional | Frontend needs to know backend URL |
| **MSAL Client ID** | ✅ For CI/CD | ❌ No | ⚠️ Optional | Frontend auth config (public) |
| **MSAL Authority** | ✅ For CI/CD | ❌ No | ⚠️ Optional | Frontend auth config (public) |
| **MSAL Redirect URI** | ✅ For CI/CD | ❌ No | ⚠️ Optional | Frontend auth config (public) |

**Storage**: GitHub Secrets (primary), Cloudflare (optional backup)
**Why**: These are public values (embedded in frontend bundle). GitHub Secrets inject them at build time via GitHub Actions.

**Note**: Since we're using GitHub Actions to build, Cloudflare env vars are optional (GitHub Actions handles the build).

---

### 🔐 Backend Secrets (Server-Side Only)

| Secret | GitHub Secrets | Convex Env Vars | Cloudflare Env Vars | Notes |
|--------|----------------|-----------------|---------------------|-------|
| **MSAL Client Secret** | ❌ No | ✅ Required | ❌ No | Backend validates tokens |
| **API Keys (3rd party)** | ❌ No | ✅ Required | ❌ No | Backend calls external APIs |
| **Database Connection Strings** | ❌ No | ✅ If needed | ❌ No | If using external DB |
| **Encryption Keys** | ❌ No | ✅ If needed | ❌ No | For data encryption |
| **Webhook Secrets** | ❌ No | ✅ If needed | ❌ No | Verify webhook signatures |

**Storage**: Convex Environment Variables only
**Why**: These are **never** sent to the frontend. They're only used by Convex backend functions.

---

## Detailed Breakdown

### 1. GitHub Secrets (CI/CD Pipeline)

**Purpose**: Store secrets that GitHub Actions needs to deploy your app

**What Goes Here**:
```
✅ Deployment credentials:
   - CONVEX_DEPLOY_KEY_DEV
   - CONVEX_DEPLOY_KEY_PROD
   - CLOUDFLARE_API_TOKEN
   - CLOUDFLARE_ACCOUNT_ID

✅ Frontend build-time environment variables:
   - VITE_CONVEX_URL_DEV
   - VITE_CONVEX_URL_PROD
   - VITE_MSAL_CLIENT_ID_DEV
   - VITE_MSAL_CLIENT_ID_PROD
   - VITE_MSAL_AUTHORITY
   - VITE_MSAL_REDIRECT_URI_DEV
   - VITE_MSAL_REDIRECT_URI_PROD

❌ Does NOT go here:
   - Backend secrets (use Convex env vars)
   - Sensitive keys that frontend shouldn't see
```

**How to Set**:
1. Go to GitHub Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret with exact name

**AI Can Help?**: ❌ No - Manual setup required

---

### 2. Convex Environment Variables (Backend Runtime)

**Purpose**: Store secrets that your Convex backend functions need at runtime

**What Goes Here**:
```
✅ Server-side secrets:
   - AZURE_CLIENT_SECRET (for token validation)
   - SENDGRID_API_KEY (if sending emails)
   - STRIPE_SECRET_KEY (if using Stripe)
   - ENCRYPTION_KEY (for data encryption)
   - WEBHOOK_SECRET (for webhook verification)
   - Any 3rd party API keys used by backend

❌ Does NOT go here:
   - Deployment credentials (use GitHub)
   - Frontend configuration (use GitHub)
   - Public URLs (use GitHub)
```

**How to Set**:

Option 1 - Using Convex CLI:
```bash
npx convex env set AZURE_CLIENT_SECRET "your-secret-value"
npx convex env set SENDGRID_API_KEY "your-api-key"
```

Option 2 - Using Convex Dashboard:
1. Go to https://dashboard.convex.dev
2. Select your deployment
3. Go to Settings → Environment Variables
4. Add your secrets

Option 3 - AI Can Help:
```
Yes! I have tools to set Convex environment variables.
Just tell me which secrets to set and the values.
```

**AI Can Help?**: ✅ Yes - I can use Convex tools

---

### 3. Cloudflare Environment Variables (Optional)

**Purpose**: Backup/override for frontend build-time variables

**What Goes Here**:
```
⚠️ Optional (since GitHub Actions handles builds):
   - VITE_CONVEX_URL
   - VITE_MSAL_CLIENT_ID
   - VITE_MSAL_AUTHORITY
   - VITE_MSAL_REDIRECT_URI

❌ Does NOT go here:
   - Deployment credentials
   - Backend secrets
   - Anything sensitive
```

**How to Set**:
1. Go to Cloudflare Dashboard → Pages → Your Project
2. Settings → Environment Variables
3. Add variables for Production and/or Preview

**When to Use**: Only if you want Cloudflare to build (instead of GitHub Actions)

**AI Can Help?**: ❌ No - Manual setup required

---

## Current Project Setup Recommendation

### For Your TodoApp (Using GitHub Actions for Build):

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Secrets                            │
│  (All deployment + frontend build variables)               │
├─────────────────────────────────────────────────────────────┤
│  CONVEX_DEPLOY_KEY_DEV          ← Deploy backend           │
│  CONVEX_DEPLOY_KEY_PROD         ← Deploy backend           │
│  CLOUDFLARE_API_TOKEN           ← Deploy frontend          │
│  CLOUDFLARE_ACCOUNT_ID          ← Deploy frontend          │
│  VITE_CONVEX_URL_DEV            ← Frontend config          │
│  VITE_CONVEX_URL_PROD           ← Frontend config          │
│  VITE_MSAL_CLIENT_ID_DEV        ← Frontend config          │
│  VITE_MSAL_CLIENT_ID_PROD       ← Frontend config          │
│  VITE_MSAL_AUTHORITY            ← Frontend config          │
│  VITE_MSAL_REDIRECT_URI_DEV     ← Frontend config          │
│  VITE_MSAL_REDIRECT_URI_PROD    ← Frontend config          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Convex Environment Variables                    │
│  (Backend runtime secrets - SENSITIVE!)                     │
├─────────────────────────────────────────────────────────────┤
│  AZURE_CLIENT_SECRET            ← Validate auth tokens     │
│  (Add more as needed in Phase 2+)                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         Cloudflare Environment Variables                     │
│  (Optional - not needed with GitHub Actions)                │
├─────────────────────────────────────────────────────────────┤
│  (Empty - GitHub Actions handles build)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Decision Tree: Where Should My Secret Go?

```
Start: I have a secret to store
│
├─ Is it used by CI/CD to deploy?
│  ├─ Yes → GitHub Secrets
│  └─ No → Continue
│
├─ Is it used by frontend (React)?
│  ├─ Yes → Is it sensitive/private?
│  │  ├─ Yes → ❌ ERROR: Frontend can't have truly sensitive secrets!
│  │  └─ No (public config) → GitHub Secrets (build-time injection)
│  └─ No → Continue
│
└─ Is it used by backend (Convex)?
   └─ Yes → Convex Environment Variables
```

---

## Examples

### Example 1: Microsoft Entra ID (Azure AD) Authentication

```
Frontend needs (Public - Anyone can see):
✅ GitHub Secrets:
   - VITE_MSAL_CLIENT_ID (App ID - public)
   - VITE_MSAL_AUTHORITY (Tenant URL - public)
   - VITE_MSAL_REDIRECT_URI (Where to return - public)

Backend needs (Secret - Must stay private):
✅ Convex Environment Variables:
   - AZURE_CLIENT_SECRET (Validates tokens - SECRET!)
   - AZURE_TENANT_ID (Can be public, but good to keep in backend)
```

### Example 2: SendGrid Email Service

```
Frontend needs:
❌ Nothing - Frontend should never directly send emails

Backend needs (Secret):
✅ Convex Environment Variables:
   - SENDGRID_API_KEY (Secret key)
   - SENDGRID_FROM_EMAIL (Can be in code, but cleaner here)
```

### Example 3: Stripe Payments

```
Frontend needs (Public):
✅ GitHub Secrets:
   - VITE_STRIPE_PUBLISHABLE_KEY (Public by design)

Backend needs (Secret):
✅ Convex Environment Variables:
   - STRIPE_SECRET_KEY (Must stay secret!)
   - STRIPE_WEBHOOK_SECRET (Validates webhooks)
```

---

## How I Can Help with Tools

### ✅ What I Can Do:

**Convex Environment Variables**:
```bash
# I can run these commands for you:
npx convex env list                          # List all env vars
npx convex env get SECRET_NAME               # Get specific value
npx convex env set SECRET_NAME "value"       # Set a value
npx convex env remove SECRET_NAME            # Remove a value
```

Just tell me:
- Secret name
- Secret value
- Which deployment (dev/prod)

### ❌ What I Cannot Do:

**GitHub Secrets**:
- Cannot directly access GitHub API
- You must add these manually in GitHub UI
- I can guide you through the process

**Cloudflare Environment Variables**:
- Cannot directly access Cloudflare API
- You must add these manually in Cloudflare dashboard
- Usually not needed with GitHub Actions

---

## Quick Reference

### Phase 0 Setup (Current):

| Secret | Where | Priority | Status |
|--------|-------|----------|--------|
| CONVEX_DEPLOY_KEY_DEV | GitHub | 🔴 Required | Need to add |
| CLOUDFLARE_API_TOKEN | GitHub | 🔴 Required | Need to add |
| CLOUDFLARE_ACCOUNT_ID | GitHub | 🔴 Required | Need to add |
| VITE_CONVEX_URL_DEV | GitHub | 🔴 Required | Need to add |
| VITE_MSAL_CLIENT_ID_DEV | GitHub | 🟡 Placeholder | Need to add |
| VITE_MSAL_AUTHORITY | GitHub | 🟡 Placeholder | Need to add |
| VITE_MSAL_REDIRECT_URI_DEV | GitHub | 🟡 Placeholder | Need to add |

### Phase 2 (Authentication):

| Secret | Where | Priority | Status |
|--------|-------|----------|--------|
| AZURE_CLIENT_SECRET | Convex | 🔴 Required | Later |
| AZURE_TENANT_ID | Convex | 🟡 Optional | Later |

---

## Common Mistakes to Avoid

### ❌ Don't Do This:

1. **Don't put backend secrets in GitHub Secrets**
   - Example: `AZURE_CLIENT_SECRET` in GitHub
   - Why: Gets embedded in frontend bundle (exposed!)

2. **Don't put deployment credentials in Convex**
   - Example: `CLOUDFLARE_API_TOKEN` in Convex
   - Why: Convex doesn't deploy, GitHub Actions does

3. **Don't put frontend config in Convex**
   - Example: `VITE_CONVEX_URL` in Convex
   - Why: Frontend can't access Convex env vars

4. **Don't duplicate secrets unnecessarily**
   - Put each secret in ONE place
   - Reference from there

---

## Summary Table

| Use Case | Storage Location | AI Can Help? |
|----------|------------------|--------------|
| Deploy backend to Convex | GitHub Secrets | ❌ Manual |
| Deploy frontend to Cloudflare | GitHub Secrets | ❌ Manual |
| Frontend build-time config | GitHub Secrets | ❌ Manual |
| Backend runtime secrets | Convex Env Vars | ✅ Yes! |
| Optional build overrides | Cloudflare Env Vars | ❌ Manual |

---

## Need Help Setting Secrets?

### GitHub Secrets:
→ Follow `/CLOUDFLARE_SETUP_CHECKLIST.md` Step 4

### Convex Environment Variables:
→ Ask me! I can set these using tools

### Cloudflare Environment Variables:
→ Usually not needed (skip for now)

---

**Remember**: 
- GitHub Secrets = CI/CD + Frontend build config
- Convex Env Vars = Backend runtime secrets (I can help!)
- Cloudflare Env Vars = Optional (not needed with GitHub Actions)
