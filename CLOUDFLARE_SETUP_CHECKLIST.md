# Cloudflare Setup Checklist - Dev Environment

**Goal**: Set up Cloudflare Pages with all secrets in GitHub Secrets (your key vault)

---

## ☐ Step 1: Convex Backend (10 minutes)

### Create Development Deployment

```bash
cd /Users/egagne/Library/CloudStorage/OneDrive-HumaniaAssuranceInc/coding/TodoApp
npx convex login
npx convex dev
```

- [ ] Convex dev server started
- [ ] Copy your Convex URL from terminal output (save for Step 4)
  - Example: `https://happy-unicorn-123.convex.cloud`

### Get Deploy Key

1. [ ] Open [Convex Dashboard](https://dashboard.convex.dev)
2. [ ] Select your project
3. [ ] Go to **Settings** → **Deploy Keys**
4. [ ] Click **Generate Deploy Key** (for dev deployment)
5. [ ] Copy the deploy key (save for Step 4)

---

## ☐ Step 2: Cloudflare Pages (15 minutes)

### Create Pages Project

1. [ ] Open [Cloudflare Dashboard](https://dash.cloudflare.com)
2. [ ] Click **Pages** in sidebar
3. [ ] Click **Create a project**
4. [ ] Select **Connect to Git**
5. [ ] Authorize GitHub
6. [ ] Select your `TodoApp` repository
7. [ ] Configure:
   - Project name: `todoapp-dev`
   - Production branch: `main`
   - Build command: (leave empty)
   - Build output: `dist`
8. [ ] Click **Save and Deploy**
   - ⚠️ First deploy will fail (expected - no env vars yet)

### Get API Credentials

#### API Token:

1. [ ] Click profile icon → **My Profile**
2. [ ] Go to **API Tokens**
3. [ ] Click **Create Token**
4. [ ] Use **Edit Cloudflare Workers** template
5. [ ] Set permissions:
   - Account → Cloudflare Pages → Edit
6. [ ] Click **Create Token**
7. [ ] **Copy token** (you can't see it again!) - save for Step 4

#### Account ID:

1. [ ] In Cloudflare dashboard sidebar, find **Account ID**
2. [ ] Copy it - save for Step 4

---

## ☐ Step 3: Microsoft Entra ID (Optional - Skip for Now)

**You can do this in Phase 2 when implementing authentication.**

For now, we'll use placeholder values.

---

## ☐ Step 4: GitHub Secrets (10 minutes)

Add all secrets to GitHub (your secure key vault):

1. [ ] Open your GitHub repository
2. [ ] Go to **Settings** → **Secrets and variables** → **Actions**
3. [ ] Click **New repository secret** for each:

### Add These Secrets:

```
CLOUDFLARE_API_TOKEN
→ Paste: [API token from Step 2]

CLOUDFLARE_ACCOUNT_ID
→ Paste: [Account ID from Step 2]

CONVEX_DEPLOY_KEY_DEV
→ Paste: [Deploy key from Step 1]

VITE_CONVEX_URL_DEV
→ Paste: [Convex URL from Step 1]
Example: https://happy-unicorn-123.convex.cloud
```

### Add Placeholder Secrets (Update in Phase 2):

```
VITE_MSAL_CLIENT_ID_DEV
→ Paste: placeholder

VITE_MSAL_AUTHORITY
→ Paste: https://login.microsoftonline.com/common

VITE_MSAL_REDIRECT_URI_DEV
→ Paste: https://todoapp-dev.pages.dev
```

- [ ] All 7 secrets added to GitHub

---

## ☐ Step 5: Local Development Setup (5 minutes)

### Create Local Env File

```bash
# Copy template (this file is gitignored)
cp .env.example .env.local

# Edit with your editor
code .env.local
```

### Add Your Local Values:

```bash
VITE_CONVEX_URL=<your Convex URL from Step 1>
VITE_MSAL_CLIENT_ID=placeholder
VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/common
VITE_MSAL_REDIRECT_URI=http://localhost:5173
VITE_APP_ENV=development
```

- [ ] `.env.local` created and configured
- [ ] Verified `.env.local` is in `.gitignore`

---

## ☐ Step 6: Test Everything (10 minutes)

### Test Local Dev:

```bash
# Terminal 1: Start Convex
npx convex dev

# Terminal 2: Start Vite
npm run dev
```

- [ ] Convex connected successfully
- [ ] App loads at `http://localhost:5173`
- [ ] No console errors

### Test CI/CD Pipeline:

```bash
# Make a test commit
echo "# Deployment test" >> README.md
git add README.md
git commit -m "test: verify deployment pipeline"
git push origin main
```

1. [ ] Go to GitHub → **Actions** tab
2. [ ] "Deploy to Development" workflow started
3. [ ] Wait for workflow to complete (~3-5 minutes)
4. [ ] All jobs pass (green checkmarks)

### Verify Deployment:

1. [ ] Go to Cloudflare dashboard → **Pages** → `todoapp-dev`
2. [ ] See successful deployment
3. [ ] Click **Preview URL**
4. [ ] App loads successfully

---

## ☐ Step 7: Security Verification

- [ ] No secrets in source code
- [ ] `.env.local` is gitignored
- [ ] All secrets in GitHub Secrets
- [ ] No `.env.local` committed to git
- [ ] API token has minimal permissions

Run this to verify:

```bash
# Check what would be committed
git status

# Verify .env.local is ignored
git check-ignore .env.local
# Should output: .env.local

# Search for any hardcoded secrets (should find none)
grep -r "CONVEX_DEPLOY_KEY" --exclude-dir=node_modules --exclude=*.md .
grep -r "CLOUDFLARE_API_TOKEN" --exclude-dir=node_modules --exclude=*.md .
```

- [ ] All security checks passed

---

## ✅ Completion Checklist

You're done when:

- [x] Convex dev deployment running
- [x] Cloudflare Pages project created
- [x] All 7 secrets in GitHub Secrets
- [x] `.env.local` configured (gitignored)
- [x] Local dev working (app loads)
- [x] CI/CD pipeline working (deployment succeeds)
- [x] No secrets in source code
- [x] Deployed app accessible via Cloudflare URL

---

## 🎉 Success!

Your dev environment is now set up with:
- ✅ Automatic deployments on push to `main`
- ✅ All secrets securely stored in GitHub Secrets
- ✅ No secrets in code or committed files
- ✅ Local dev environment working
- ✅ CI/CD pipeline operational

**Next**: Start implementing Phase 1 features!

---

## Need Help?

**Common Issues**:
- Deployment fails → Check GitHub Actions logs
- App won't load → Check browser console
- Convex errors → Check Convex dashboard logs
- Secrets missing → Verify in GitHub Settings → Secrets

**Full Guide**: See `/docs/CLOUDFLARE_SETUP_GUIDE.md`

**Questions?** Reference:
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Convex Docs](https://docs.convex.dev/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
