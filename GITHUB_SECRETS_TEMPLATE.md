# GitHub Secrets Setup Template

## Your Convex URL

✅ **Already discovered**: `https://elegant-curlew-662.convex.cloud`

---

## The 7 GitHub Secrets You Need

Copy this template when adding secrets to GitHub:

---

### 1. CONVEX_DEPLOY_KEY_DEV

**Where to get it**:
1. Go to https://dashboard.convex.dev/d/elegant-curlew-662
2. Click **Settings** → **Deploy Keys**
3. Click **Generate Deploy Key**
4. Copy the key

**Secret Name**: `CONVEX_DEPLOY_KEY_DEV`

**Secret Value**: `cvx_prod_...` (paste from Convex dashboard)

---

### 2. CLOUDFLARE_API_TOKEN

**Where to get it**:
1. Go to https://dash.cloudflare.com
2. Click profile icon → **My Profile** → **API Tokens**
3. Click **Create Token**
4. Use **Edit Cloudflare Workers** template
5. Set permissions: Account → Cloudflare Pages → Edit
6. Copy the token

**Secret Name**: `CLOUDFLARE_API_TOKEN`

**Secret Value**: `[paste token from Cloudflare]`

---

### 3. CLOUDFLARE_ACCOUNT_ID

**Where to get it**:
1. Go to https://dash.cloudflare.com
2. Look in the right sidebar under "Account details"
3. Copy your Account ID

**Secret Name**: `CLOUDFLARE_ACCOUNT_ID`

**Secret Value**: `[paste account ID from Cloudflare]`

---

### 4. VITE_CONVEX_URL_DEV

**Where to get it**: You already have it!

**Secret Name**: `VITE_CONVEX_URL_DEV`

**Secret Value**: `https://elegant-curlew-662.convex.cloud`

---

### 5. VITE_MSAL_CLIENT_ID_DEV

**Where to get it**: Azure Portal (Phase 2 - use placeholder for now)

**Secret Name**: `VITE_MSAL_CLIENT_ID_DEV`

**Secret Value**: `placeholder` (update in Phase 2)

---

### 6. VITE_MSAL_AUTHORITY

**Where to get it**: Azure Portal (Phase 2 - use placeholder for now)

**Secret Name**: `VITE_MSAL_AUTHORITY`

**Secret Value**: `https://login.microsoftonline.com/common` (placeholder)

---

### 7. VITE_MSAL_REDIRECT_URI_DEV

**Where to get it**: Your Cloudflare Pages URL (after you create it)

**Secret Name**: `VITE_MSAL_REDIRECT_URI_DEV`

**Secret Value**: `https://todoapp-dev.pages.dev` (update after Cloudflare setup)

---

## How to Add to GitHub

1. Go to your repository: https://github.com/YOUR_USERNAME/TodoApp
2. Click **Settings** (repository settings, not profile)
3. Click **Secrets and variables** → **Actions**
4. For each secret above:
   - Click **New repository secret**
   - Enter the **Secret Name** (exact match)
   - Enter the **Secret Value**
   - Click **Add secret**

---

## Checklist

Add these secrets to GitHub (Repository → Settings → Secrets → Actions):

- [ ] `CONVEX_DEPLOY_KEY_DEV` - From Convex dashboard
- [ ] `CLOUDFLARE_API_TOKEN` - From Cloudflare profile
- [ ] `CLOUDFLARE_ACCOUNT_ID` - From Cloudflare dashboard
- [ ] `VITE_CONVEX_URL_DEV` - `https://elegant-curlew-662.convex.cloud`
- [ ] `VITE_MSAL_CLIENT_ID_DEV` - `placeholder` (for now)
- [ ] `VITE_MSAL_AUTHORITY` - `https://login.microsoftonline.com/common` (for now)
- [ ] `VITE_MSAL_REDIRECT_URI_DEV` - `https://todoapp-dev.pages.dev` (after Cloudflare setup)

---

## Production Secrets (Later)

When you're ready for production (Phase 8), add these:

- [ ] `CONVEX_DEPLOY_KEY_PROD` - From Convex prod deployment
- [ ] `VITE_CONVEX_URL_PROD` - From Convex prod deployment
- [ ] `VITE_MSAL_CLIENT_ID_PROD` - From Azure prod app
- [ ] `VITE_MSAL_REDIRECT_URI_PROD` - Your production URL

---

## Verify Your Secrets

After adding all secrets, they should look like this in GitHub:

```
GitHub → Settings → Secrets and variables → Actions

Repository secrets:
- CLOUDFLARE_ACCOUNT_ID          Updated X days ago
- CLOUDFLARE_API_TOKEN            Updated X days ago
- CONVEX_DEPLOY_KEY_DEV           Updated X days ago
- VITE_CONVEX_URL_DEV             Updated X days ago
- VITE_MSAL_AUTHORITY             Updated X days ago
- VITE_MSAL_CLIENT_ID_DEV         Updated X days ago
- VITE_MSAL_REDIRECT_URI_DEV      Updated X days ago
```

---

## What About Convex Environment Variables?

**Current status**: Empty (correct for Phase 0) ✅

**When you need them** (Phase 2):

Example:
```
"Hey AI, set AZURE_CLIENT_SECRET to 'my-secret-value' in Convex dev"
```

I'll use my Convex tools to set it for you! No manual dashboard navigation needed.

---

## Need Help?

**Can't find Convex Deploy Key?**
- See `/CLOUDFLARE_SETUP_CHECKLIST.md` Step 1

**Can't find Cloudflare API Token?**
- See `/CLOUDFLARE_SETUP_CHECKLIST.md` Step 2

**Want to understand why these go in GitHub?**
- See `/WHERE_DO_SECRETS_GO.md`

**Want detailed security info?**
- See `/docs/SECURITY_SECRET_MANAGEMENT.md`
