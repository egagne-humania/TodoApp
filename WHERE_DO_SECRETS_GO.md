# Where Do Secrets Go? - Quick Visual Guide

## TL;DR

```
GitHub Secrets     = Deployment keys + Frontend config
Convex Env Vars    = Backend secrets (I can help set these! ✅)
Cloudflare Env Vars = Not needed (GitHub Actions builds for us)
```

---

## Visual Map

```
┌──────────────────────────────────────────────────────────────────┐
│                       YOUR TODOAPP                                │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ When you push to GitHub
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    GITHUB ACTIONS (CI/CD)                         │
│                                                                   │
│  Uses GitHub Secrets to:                                         │
│  1. Deploy Convex backend    (CONVEX_DEPLOY_KEY_DEV)            │
│  2. Build frontend           (VITE_CONVEX_URL_DEV, etc.)        │
│  3. Deploy to Cloudflare     (CLOUDFLARE_API_TOKEN)             │
└──────────────────────────────────────────────────────────────────┘
                    │                        │
                    │ Deploy                 │ Deploy
                    ↓                        ↓
    ┌──────────────────────┐    ┌──────────────────────┐
    │   CONVEX BACKEND     │    │ CLOUDFLARE FRONTEND  │
    │                      │    │                      │
    │ Uses Convex Env Vars │    │ Uses values baked    │
    │ at runtime:          │    │ into bundle from     │
    │ - AZURE_CLIENT_SECRET│    │ GitHub Secrets       │
    │ - API_KEYS           │    │                      │
    │ - WEBHOOK_SECRETS    │    │                      │
    └──────────────────────┘    └──────────────────────┘
```

---

## The 11 Secrets You Need for Phase 0

### 1️⃣ GitHub Secrets (7 secrets - Manual setup)

**Where**: GitHub → Settings → Secrets and variables → Actions

| Secret Name | What It Is | Who Uses It |
|-------------|------------|-------------|
| `CONVEX_DEPLOY_KEY_DEV` | Key to deploy backend | GitHub Actions |
| `CLOUDFLARE_API_TOKEN` | Key to deploy frontend | GitHub Actions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account | GitHub Actions |
| `VITE_CONVEX_URL_DEV` | Backend URL | Frontend (build time) |
| `VITE_MSAL_CLIENT_ID_DEV` | Azure app ID | Frontend (build time) |
| `VITE_MSAL_AUTHORITY` | Azure login URL | Frontend (build time) |
| `VITE_MSAL_REDIRECT_URI_DEV` | Where to return after login | Frontend (build time) |

**How to get values**:
- See `/CLOUDFLARE_SETUP_CHECKLIST.md`

**Can AI help?**: ❌ No - You must add these manually

---

### 2️⃣ Convex Environment Variables (0 for now, more in Phase 2+)

**Where**: Convex deployment (dev or prod)

**Current Status**: Empty ✅ (Correct for Phase 0!)

**Future Secrets** (Phase 2 - Authentication):
| Secret Name | What It Is | Who Uses It |
|-------------|------------|-------------|
| `AZURE_CLIENT_SECRET` | Secret key for token validation | Convex backend |

**How to set**:
```bash
# Option 1: Ask me! I can set these
"Hey, set AZURE_CLIENT_SECRET to [value] in Convex dev"

# Option 2: Use CLI
npx convex env set AZURE_CLIENT_SECRET "your-value"

# Option 3: Use Dashboard
https://dashboard.convex.dev → Settings → Environment Variables
```

**Can AI help?**: ✅ Yes! I have Convex tools

---

### 3️⃣ Cloudflare Environment Variables

**Where**: Cloudflare Dashboard → Pages → Settings → Environment Variables

**Status**: **Not needed!** ✅

**Why**: Because GitHub Actions builds your frontend, Cloudflare just hosts the static files. GitHub Actions injects the environment variables during build.

**When you would need these**: Only if you let Cloudflare build your app (instead of GitHub Actions)

---

## Decision Chart

```
┌─────────────────────────────────────────────────────────────┐
│ START: I have a secret/config value to store                │
└─────────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Question 1: Who needs this value?                           │
└─────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ↓                 ↓                 ↓
   ┌─────────┐      ┌─────────┐      ┌─────────┐
   │ GitHub  │      │Frontend │      │Backend  │
   │ Actions │      │ (React) │      │(Convex) │
   └─────────┘      └─────────┘      └─────────┘
        │                 │                 │
        ↓                 ↓                 ↓
  GitHub Secrets    GitHub Secrets    Convex Env Vars
  ✅ Store here     ✅ Store here     ✅ Store here
                                      ✅ AI can help!
```

---

## Examples for Your Project

### Example 1: Convex Backend URL

**Value**: `https://elegant-curlew-662.convex.cloud`

**Who needs it?**: Frontend (to connect to backend)

**Where does it go?**: 
- ✅ GitHub Secrets as `VITE_CONVEX_URL_DEV`
- ✅ Local `.env.local` as `VITE_CONVEX_URL`

**Storage**: GitHub Secrets

---

### Example 2: Convex Deploy Key

**Value**: `cvx_prod_abc123...`

**Who needs it?**: GitHub Actions (to deploy backend)

**Where does it go?**:
- ✅ GitHub Secrets as `CONVEX_DEPLOY_KEY_DEV`

**Storage**: GitHub Secrets only

---

### Example 3: Azure Client Secret (Phase 2)

**Value**: `your-azure-secret`

**Who needs it?**: Backend (to validate auth tokens)

**Where does it go?**:
- ✅ Convex Environment Variables as `AZURE_CLIENT_SECRET`

**Storage**: Convex Environment Variables

**AI can help**: ✅ Yes! Just tell me the value

---

### Example 4: Cloudflare API Token

**Value**: `your-cloudflare-token`

**Who needs it?**: GitHub Actions (to deploy frontend)

**Where does it go?**:
- ✅ GitHub Secrets as `CLOUDFLARE_API_TOKEN`

**Storage**: GitHub Secrets only

---

## Current Status Check

Your Convex deployment: `https://elegant-curlew-662.convex.cloud`

### Convex Environment Variables:
```
✅ Status: Empty (correct for Phase 0)
📊 Count: 0 variables
🎯 Next: Add AZURE_CLIENT_SECRET in Phase 2
```

### GitHub Secrets:
```
⏳ Status: Need to add (manual setup)
📋 Required: 7 secrets
📖 Guide: See /CLOUDFLARE_SETUP_CHECKLIST.md
```

---

## How AI Can Help You

### ✅ I CAN Help With:

1. **Setting Convex Environment Variables**
   ```
   Example: "Set AZURE_CLIENT_SECRET to [value] in Convex"
   Example: "List all Convex environment variables"
   Example: "Remove TEST_VAR from Convex"
   ```

2. **Checking Current Convex Variables**
   ```
   Example: "What environment variables are in Convex?"
   Example: "Show me the value of AZURE_CLIENT_SECRET"
   ```

3. **Guidance on All Secrets**
   ```
   Example: "Where should I store my Stripe API key?"
   Example: "How do I set up GitHub Secrets?"
   ```

### ❌ I CANNOT Help With:

1. **GitHub Secrets** - No direct API access
   - You must use GitHub UI
   - I can guide you through the process

2. **Cloudflare Environment Variables** - No direct API access
   - You must use Cloudflare Dashboard
   - Usually not needed anyway

---

## Phase-by-Phase Secret Requirements

### Phase 0 (Setup) - Current Phase ⬅️

**GitHub Secrets** (Required now):
- [x] CONVEX_DEPLOY_KEY_DEV
- [x] CLOUDFLARE_API_TOKEN
- [x] CLOUDFLARE_ACCOUNT_ID
- [x] VITE_CONVEX_URL_DEV
- [x] VITE_MSAL_CLIENT_ID_DEV (placeholder)
- [x] VITE_MSAL_AUTHORITY (placeholder)
- [x] VITE_MSAL_REDIRECT_URI_DEV (placeholder)

**Convex Env Vars** (None needed yet):
- Empty ✅

---

### Phase 2 (Authentication)

**GitHub Secrets** (Update placeholders):
- [ ] VITE_MSAL_CLIENT_ID_DEV (real value)
- [ ] VITE_MSAL_AUTHORITY (real value)
- [ ] VITE_MSAL_REDIRECT_URI_DEV (real value)

**Convex Env Vars** (New):
- [ ] AZURE_CLIENT_SECRET ← ✅ AI can help set this!
- [ ] AZURE_TENANT_ID (optional)

---

### Phase 5+ (Advanced Features)

**Convex Env Vars** (As needed):
- [ ] SENDGRID_API_KEY (if adding email)
- [ ] STRIPE_SECRET_KEY (if adding payments)
- [ ] WEBHOOK_SECRET (if adding webhooks)

✅ AI can help set all of these!

---

## Quick Commands

### Check Convex Environment Variables:
```bash
# List all
npx convex env list

# Get specific one
npx convex env get AZURE_CLIENT_SECRET
```

### Set Convex Environment Variable:
```bash
# Via CLI
npx convex env set SECRET_NAME "secret-value"

# Or ask me!
"Set AZURE_CLIENT_SECRET to [value] in Convex dev"
```

### Check GitHub Secrets:
```
No CLI access - must use GitHub UI:
Repository → Settings → Secrets and variables → Actions
```

---

## Summary

| What | Where | Count | AI Help? | Status |
|------|-------|-------|----------|--------|
| Deployment keys | GitHub | 3 | ❌ Manual | Pending |
| Frontend config | GitHub | 4 | ❌ Manual | Pending |
| Backend secrets | Convex | 0 now | ✅ Yes! | Empty ✅ |
| Build overrides | Cloudflare | 0 | ❌ N/A | Not needed |

---

## Next Steps

1. **Now**: Add GitHub Secrets (follow `/CLOUDFLARE_SETUP_CHECKLIST.md`)
2. **Phase 2**: Tell me to set Convex env vars (I can help!)
3. **Future**: Add more Convex env vars as needed (I can help!)

---

**Want me to set a Convex environment variable?** Just tell me:
- Variable name
- Value
- Which deployment (dev/prod)

Example: "Set TEST_VAR to 'hello' in Convex dev deployment"
