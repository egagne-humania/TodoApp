# Environment Variables Setup

This document explains how to configure environment variables for the TodoApp project.

## Overview

The project uses Vite's environment variable system. All environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

## Files

- `.env` - Default values (committed to repo, non-sensitive)
- `.env.local` - Local development overrides (gitignored, your personal config)
- `.env.production` - Production values (set in CI/CD, not committed)
- `.env.example` - Template showing all required variables

## Required Variables

### Convex Backend

```bash
VITE_CONVEX_URL=your-convex-deployment-url
```

Get this from your Convex dashboard at https://dashboard.convex.dev

### Microsoft Entra ID (Azure AD) Authentication

```bash
VITE_MSAL_CLIENT_ID=your-azure-app-client-id
VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
VITE_MSAL_REDIRECT_URI=http://localhost:5173
```

Register your app at https://portal.azure.com to get these values.

### Application Environment

```bash
VITE_APP_ENV=development  # or 'production'
```

## Setup Instructions

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your local development values in `.env.local`

3. Never commit `.env.local` (it's in .gitignore)

### Production Deployment

Set these as secrets in your CI/CD pipeline:
- GitHub Actions: Repository Settings → Secrets and variables → Actions
- Cloudflare Pages: Settings → Environment variables

## Usage in Code

Import from the centralized config:

```typescript
import { env } from '@/config/env';

// Access environment variables
console.log(env.convexUrl);
console.log(env.msal.clientId);
console.log(env.isDevelopment);
```

## Validation

The app validates required environment variables on startup. If any required variables are missing in production, the app will fail to start with a clear error message.

## Security Notes

- ✅ Never commit sensitive values to the repository
- ✅ Use `.env.local` for local secrets
- ✅ Use CI/CD secrets for production values
- ✅ All frontend env vars are public (bundled in client code)
- ❌ Never put backend secrets in VITE_ variables
- ❌ Never commit `.env.local` or `.env.production`
