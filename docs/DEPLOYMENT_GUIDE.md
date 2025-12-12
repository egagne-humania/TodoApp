# Deployment Guide

## Overview
This document outlines the deployment strategy and processes for the TodoApp project. The application uses a continuous deployment pipeline with GitHub Actions, deploying the frontend to Cloudflare and the backend to Convex.

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│           GitHub Repository                 │
│                                             │
│  ┌──────────────┐    ┌──────────────┐     │
│  │ main branch  │    │ prod branch  │     │
│  │ (Dev Env)    │    │ (Prod Env)   │     │
│  └──────┬───────┘    └──────┬───────┘     │
│         │                    │             │
└─────────┼────────────────────┼─────────────┘
          │                    │
          │ GitHub Actions     │ GitHub Actions
          │ (Auto Deploy)      │ (Auto Deploy)
          ↓                    ↓
┌─────────────────┐   ┌─────────────────┐
│  Cloudflare     │   │  Cloudflare     │
│  (Dev Frontend) │   │  (Prod Frontend)│
└─────────────────┘   └─────────────────┘
          ↓                    ↓
┌─────────────────┐   ┌─────────────────┐
│  Convex Dev     │   │  Convex Prod    │
│  (Backend)      │   │  (Backend)      │
└─────────────────┘   └─────────────────┘
```

## Branch Strategy

### Branch Structure

- **`main` branch**: Development environment
  - Automatically deploys to dev environment
  - For active development and testing
  - Less strict review requirements
  - Can have experimental features

- **`prod` branch**: Production environment
  - Automatically deploys to production
  - For stable, production-ready code
  - Strict review requirements
  - Only tested and approved features

### Branch Protection Rules

#### Main Branch (Development)
- [ ] Require pull request before merging
- [ ] Require 1 approval
- [ ] Require status checks to pass
  - All tests pass
  - TypeScript compilation
  - ESLint passes
- [ ] Require branches to be up to date

#### Prod Branch (Production)
- [ ] Require pull request before merging
- [ ] Require 2 approvals
- [ ] Require status checks to pass
  - All tests pass
  - TypeScript compilation
  - ESLint passes
  - Security scan
  - Performance check
- [ ] Require branches to be up to date
- [ ] Require linear history
- [ ] Lock branch (only admins can push)

## Deployment Environments

### Development Environment

**Frontend**: Cloudflare (dev subdomain)
- URL: `https://dev.todoapp.yourdomain.com`
- Auto-deploys on push to `main` branch
- Preview deployments for PRs

**Backend**: Convex (dev deployment)
- Separate dev database
- Dev authentication settings
- Relaxed rate limits for testing

**Purpose**:
- Active development
- Feature testing
- Integration testing
- Demo environment

### Production Environment

**Frontend**: Cloudflare (production domain)
- URL: `https://todoapp.yourdomain.com`
- Auto-deploys on push to `prod` branch
- CDN-optimized
- Production caching

**Backend**: Convex (production deployment)
- Production database
- Production authentication
- Production rate limits
- Monitoring enabled

**Purpose**:
- Live user-facing application
- Stable, tested features only
- High availability
- Performance optimized

## GitHub Actions Workflows

### Continuous Integration (CI)

**File**: `.github/workflows/ci.yml`

```yaml
name: Continuous Integration

on:
  pull_request:
    branches: [main, prod]
  push:
    branches: [main, prod]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd TodoApp
          npm ci
      
      - name: Run linter
        run: |
          cd TodoApp
          npm run lint
      
      - name: Type check
        run: |
          cd TodoApp
          npx tsc --noEmit
      
      - name: Run tests
        run: |
          cd TodoApp
          npm test -- --coverage
      
      - name: Check coverage threshold
        run: |
          cd TodoApp
          npm test -- --coverage --coverageThreshold='{"global":{"lines":80,"functions":80,"branches":80,"statements":80}}'
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./TodoApp/coverage/lcov.info
```

### Development Deployment

**File**: `.github/workflows/deploy-dev.yml`

```yaml
name: Deploy to Development

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Convex CLI
        run: npm install -g convex
      
      - name: Deploy Convex (Dev)
        run: |
          cd TodoApp/convex
          npx convex deploy --cmd 'npm run build' --prod
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY_DEV }}
  
  deploy-frontend:
    needs: deploy-backend
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd TodoApp
          npm ci
      
      - name: Build
        run: |
          cd TodoApp
          npm run build
        env:
          VITE_CONVEX_URL: ${{ secrets.VITE_CONVEX_URL_DEV }}
          VITE_AZURE_CLIENT_ID: ${{ secrets.VITE_AZURE_CLIENT_ID_DEV }}
          VITE_AZURE_TENANT_ID: ${{ secrets.VITE_AZURE_TENANT_ID }}
          VITE_AZURE_AUTHORITY: ${{ secrets.VITE_AZURE_AUTHORITY_DEV }}
          VITE_AZURE_REDIRECT_URI: ${{ secrets.VITE_AZURE_REDIRECT_URI_DEV }}
      
      - name: Deploy to Cloudflare Pages (Dev)
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy TodoApp/dist --project-name=todoapp-dev
```

### Production Deployment

**File**: `.github/workflows/deploy-prod.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [prod]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Convex CLI
        run: npm install -g convex
      
      - name: Deploy Convex (Prod)
        run: |
          cd TodoApp/convex
          npx convex deploy --cmd 'npm run build' --prod
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY_PROD }}
  
  deploy-frontend:
    needs: deploy-backend
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd TodoApp
          npm ci
      
      - name: Build
        run: |
          cd TodoApp
          npm run build
        env:
          VITE_CONVEX_URL: ${{ secrets.VITE_CONVEX_URL_PROD }}
          VITE_AZURE_CLIENT_ID: ${{ secrets.VITE_AZURE_CLIENT_ID_PROD }}
          VITE_AZURE_TENANT_ID: ${{ secrets.VITE_AZURE_TENANT_ID }}
          VITE_AZURE_AUTHORITY: ${{ secrets.VITE_AZURE_AUTHORITY_PROD }}
          VITE_AZURE_REDIRECT_URI: ${{ secrets.VITE_AZURE_REDIRECT_URI_PROD }}
      
      - name: Deploy to Cloudflare Pages (Prod)
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy TodoApp/dist --project-name=todoapp-prod
      
      - name: Create deployment notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment completed'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

## Deployment Workflow

### Development Deployment (main branch)

```
1. Developer creates feature branch
   └─> git checkout -b feature/my-feature

2. Development and testing (TDD)
   └─> Write tests, implement, refactor

3. Quality checks pass
   ├─> npm test (>80% coverage)
   ├─> npm run lint (no errors)
   ├─> npm run build (successful)
   └─> npx tsc --noEmit (no errors)

4. Create PR to main branch
   └─> PR description with changes

5. Code review and approval
   └─> At least 1 approval required

6. Merge to main
   └─> Squash and merge preferred

7. Automatic deployment triggered
   ├─> GitHub Actions runs CI
   ├─> Tests pass, build succeeds
   ├─> Deploy backend to Convex (dev)
   └─> Deploy frontend to Cloudflare (dev)

8. Verify deployment
   └─> Check dev environment
```

### Production Deployment (prod branch)

```
1. Verify features in dev environment
   └─> Full testing in development

2. Create PR from main to prod
   ├─> Detailed release notes
   ├─> List of changes
   ├─> Breaking changes (if any)
   └─> Migration guide (if needed)

3. Extended code review
   ├─> At least 2 approvals required
   ├─> Security review
   ├─> Performance review
   └─> Regression testing

4. Pre-deployment checks
   ├─> All tests pass
   ├─> Security scan clean
   ├─> Performance benchmarks met
   └─> Documentation updated

5. Merge to prod
   └─> Create merge commit (preserve history)

6. Automatic production deployment
   ├─> GitHub Actions runs full CI
   ├─> Deploy backend to Convex (prod)
   ├─> Deploy frontend to Cloudflare (prod)
   └─> Send notifications

7. Post-deployment verification
   ├─> Smoke tests
   ├─> Monitor logs
   ├─> Check error rates
   └─> Verify user flows

8. Monitor and rollback if needed
   └─> Revert commit if issues found
```

## Required GitHub Secrets

### Repository Secrets

Add these secrets in GitHub repository settings:

#### Convex Secrets
- `CONVEX_DEPLOY_KEY_DEV` - Convex deployment key for dev
- `CONVEX_DEPLOY_KEY_PROD` - Convex deployment key for prod

#### Cloudflare Secrets
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID

#### Environment Variables (Dev)
- `VITE_CONVEX_URL_DEV` - Dev Convex deployment URL
- `VITE_AZURE_CLIENT_ID_DEV` - Dev Azure client ID
- `VITE_AZURE_AUTHORITY_DEV` - Dev Azure authority URL
- `VITE_AZURE_REDIRECT_URI_DEV` - Dev redirect URI

#### Environment Variables (Prod)
- `VITE_CONVEX_URL_PROD` - Prod Convex deployment URL
- `VITE_AZURE_CLIENT_ID_PROD` - Prod Azure client ID
- `VITE_AZURE_AUTHORITY_PROD` - Prod Azure authority URL
- `VITE_AZURE_REDIRECT_URI_PROD` - Prod redirect URI

#### Shared Secrets
- `VITE_AZURE_TENANT_ID` - Azure tenant ID (same for dev/prod)
- `SLACK_WEBHOOK` - Slack webhook for notifications (optional)

## Cloudflare Configuration

### Cloudflare Pages Projects

#### Development Project
- **Project Name**: `todoapp-dev`
- **Build Command**: (handled by GitHub Actions)
- **Build Output**: `dist`
- **Domain**: `dev.todoapp.yourdomain.com`

#### Production Project
- **Project Name**: `todoapp-prod`
- **Build Command**: (handled by GitHub Actions)
- **Build Output**: `dist`
- **Domain**: `todoapp.yourdomain.com`

### Cloudflare Settings

```yaml
# wrangler.toml (for reference)
name = "todoapp"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"
cwd = "TodoApp"

[env.development]
name = "todoapp-dev"

[env.production]
name = "todoapp-prod"
```

## Rollback Procedures

### Quick Rollback (Production)

If critical issues are found after production deployment:

```bash
# Method 1: Revert the merge commit
git checkout prod
git revert -m 1 <merge-commit-hash>
git push origin prod
# This triggers automatic redeployment

# Method 2: Cloudflare rollback
# In Cloudflare Pages dashboard:
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "Rollback to this deployment"
```

### Convex Rollback

```bash
# View deployment history
npx convex deployments list

# Rollback to specific deployment
npx convex deployments restore <deployment-id>
```

## Monitoring and Alerts

### What to Monitor

1. **Deployment Success Rate**
   - Track GitHub Actions success/failure
   - Alert on deployment failures

2. **Application Health**
   - Frontend loading times
   - API response times
   - Error rates

3. **Convex Metrics**
   - Query/mutation performance
   - Database load
   - Function errors

4. **Cloudflare Metrics**
   - Page load times
   - CDN hit rates
   - Bandwidth usage

### Setting Up Alerts

```yaml
# Example: GitHub Actions status notification
# Add to deployment workflows
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment failed! Check logs.'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Pre-Deployment Checklist

### Before Merging to Main (Dev)
- [ ] All tests pass locally
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Code reviewed and approved
- [ ] Feature flag added (if needed)
- [ ] Documentation updated

### Before Merging to Prod (Production)
- [ ] Feature tested in dev environment
- [ ] All tests pass with >80% coverage
- [ ] Security review completed
- [ ] Performance benchmarks met
- [ ] Breaking changes documented
- [ ] Migration guide created (if needed)
- [ ] Rollback plan ready
- [ ] 2+ approvals received
- [ ] Stakeholders notified
- [ ] Release notes prepared

## Post-Deployment Checklist

### After Dev Deployment
- [ ] Verify deployment succeeded
- [ ] Check dev environment loads
- [ ] Test core functionality
- [ ] Review console for errors

### After Prod Deployment
- [ ] Verify deployment succeeded
- [ ] Run smoke tests
- [ ] Check error monitoring
- [ ] Monitor performance metrics
- [ ] Verify user flows work
- [ ] Check authentication works
- [ ] Monitor for 30 minutes
- [ ] Update status page (if applicable)
- [ ] Notify stakeholders

## Troubleshooting

### Deployment Failures

#### GitHub Actions Fails
```bash
# Check logs in GitHub Actions tab
# Common issues:
1. Tests failing → Fix tests
2. Build errors → Check environment variables
3. Secret missing → Add required secrets
4. Permission denied → Check GitHub permissions
```

#### Cloudflare Deployment Fails
```bash
# Check Cloudflare Pages dashboard
# Common issues:
1. Build size too large → Optimize bundle
2. API token expired → Regenerate token
3. Invalid configuration → Check wrangler.toml
```

#### Convex Deployment Fails
```bash
# Check Convex dashboard logs
# Common issues:
1. Schema validation failed → Fix schema
2. Migration errors → Review migrations
3. Deploy key expired → Regenerate key
```

### Emergency Procedures

#### Production is Down
```
1. Immediately rollback to last working version
2. Alert team via Slack/email
3. Investigate root cause
4. Fix in dev environment
5. Test thoroughly
6. Deploy fix to prod
7. Post-mortem meeting
```

## Best Practices

### Do's ✅
- **Always test in dev first** before promoting to prod
- **Use feature flags** for gradual rollouts
- **Write comprehensive release notes**
- **Monitor deployments** for at least 30 minutes
- **Keep main and prod branches in sync**
- **Use semantic versioning** for releases
- **Document breaking changes**
- **Test rollback procedures** regularly

### Don'ts ❌
- **Never skip CI checks**
- **Never deploy on Fridays** (unless emergency)
- **Never force push** to main or prod
- **Never bypass code review**
- **Never deploy untested code**
- **Never ignore deployment failures**
- **Never forget to update secrets**

## Deployment Schedule

### Recommended Schedule

**Development Deployments**: Continuous
- Merge and deploy anytime during work hours
- No deployment restrictions

**Production Deployments**: Scheduled windows
- **Preferred**: Tuesday-Thursday, 10 AM - 2 PM
- **Avoid**: Mondays (week start), Fridays (weekend risk)
- **Emergency deployments**: Anytime with approval

## Version Management

### Semantic Versioning

Use semantic versioning for releases:

```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1 (patch: bug fix)
1.0.1 → 1.1.0 (minor: new feature)
1.1.0 → 2.0.0 (major: breaking change)
```

### Creating Releases

```bash
# Create a release tag when merging to prod
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0

# GitHub Release with notes
# Create release in GitHub UI with changelog
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Convex Deployment Guide](https://docs.convex.dev/production/hosting)
- [Semantic Versioning](https://semver.org/)

---

**Remember**: Deployment is not the end of development. Monitor, learn, and improve continuously.

