# Security: Secret Management Best Practices

## Overview

This document explains where secrets should be stored and how they flow through the system, ensuring **zero secrets in source code or committed files**.

---

## Secret Storage Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECRET STORAGE LOCATIONS                      │
└─────────────────────────────────────────────────────────────────┘

✅ SECURE LOCATIONS (Use These):
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  1. GitHub Secrets (Primary Key Vault for CI/CD)                │
│     Location: GitHub Repository → Settings → Secrets             │
│     Used by: GitHub Actions workflows                            │
│     Access: Encrypted, only available during workflow runs       │
│                                                                   │
│  2. .env.local (Local Development Only)                         │
│     Location: Project root (MUST be in .gitignore)              │
│     Used by: Local development                                   │
│     Access: Your machine only, never committed                   │
│                                                                   │
│  3. Cloudflare Environment Variables (Optional)                 │
│     Location: Cloudflare Pages → Settings → Environment vars    │
│     Used by: Cloudflare Pages build/runtime                     │
│     Access: Cloudflare-managed, encrypted                        │
│                                                                   │
│  4. Azure Key Vault (Enterprise - Future Enhancement)           │
│     Location: Azure Portal → Key Vaults                          │
│     Used by: Backend services, advanced scenarios               │
│     Access: Azure-managed, role-based access control            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

❌ INSECURE LOCATIONS (NEVER Use These):
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ❌ Source code files (.ts, .tsx, .js)                          │
│  ❌ .env (committed to git)                                     │
│  ❌ .env.example (only use placeholder values here)             │
│  ❌ Config files committed to git                               │
│  ❌ Documentation with real secrets                             │
│  ❌ Comments in code                                            │
│  ❌ Slack messages / emails                                     │
│  ❌ Shared documents                                            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Secret Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   LOCAL DEVELOPMENT FLOW                         │
└─────────────────────────────────────────────────────────────────┘

Developer
    │
    │ Creates/edits
    ↓
.env.local (gitignored)
    │
    │ Read by Vite at runtime
    ↓
Application (localhost:5173)


┌─────────────────────────────────────────────────────────────────┐
│                   CI/CD DEPLOYMENT FLOW                          │
└─────────────────────────────────────────────────────────────────┘

Developer pushes to main
    │
    ↓
GitHub Actions Triggered
    │
    │ Reads secrets from
    ↓
GitHub Secrets (encrypted key vault)
    │
    ├─────→ Convex Deploy Key → Deploys backend
    │
    ├─────→ Cloudflare API Token → Deploys frontend
    │
    └─────→ Environment Variables → Build-time injection
                │
                ↓
            Built Application (dist/)
                │
                ↓
            Cloudflare Pages
                │
                ↓
            Live Application


┌─────────────────────────────────────────────────────────────────┐
│                   WHAT GETS COMMITTED TO GIT                     │
└─────────────────────────────────────────────────────────────────┘

✅ Safe to commit:
    - Source code
    - .env.example (with placeholders only)
    - .env (with default NON-sensitive values)
    - Configuration files (no secrets)
    - Documentation
    - GitHub Actions workflows (reference secrets, don't contain them)

❌ NEVER commit:
    - .env.local
    - .env.production
    - .env.*.local
    - Any file with real API keys
    - Deploy keys
    - Auth tokens
    - Passwords
```

---

## Secret Types and Storage

| Secret Type | GitHub Secrets | .env.local | Notes |
|-------------|----------------|------------|-------|
| **Convex Deploy Key** | ✅ Required | ❌ Not needed | CI/CD only |
| **Convex URL (Dev)** | ✅ Required | ✅ Required | Different values |
| **Cloudflare API Token** | ✅ Required | ❌ Not needed | CI/CD only |
| **Cloudflare Account ID** | ✅ Required | ❌ Not needed | CI/CD only |
| **Azure Client ID (Dev)** | ✅ Required | ✅ Required | Different values |
| **Azure Authority** | ✅ Required | ✅ Required | Same value |
| **Azure Redirect URI (Dev)** | ✅ Required | ✅ Required | Different values |

---

## Secret Management Workflow

### Adding a New Secret

```
1. Obtain Secret
   ↓
2. Add to GitHub Secrets
   - Repository → Settings → Secrets → New secret
   ↓
3. Add to .env.local (if needed for local dev)
   - Edit .env.local
   - Verify it's in .gitignore
   ↓
4. Reference in GitHub Actions workflow
   - Use ${{ secrets.SECRET_NAME }}
   ↓
5. Never commit real values
   - Add placeholder to .env.example if needed
```

### Rotating a Secret

```
1. Generate new secret/token
   ↓
2. Update in GitHub Secrets
   - Edit existing secret
   ↓
3. Update in .env.local (if applicable)
   ↓
4. Test deployment
   ↓
5. Revoke old secret (after confirming new one works)
```

---

## Environment-Specific Secrets

### Development Environment

```bash
# GitHub Secrets (for CI/CD)
CONVEX_DEPLOY_KEY_DEV=cvx_prod_abc123...
VITE_CONVEX_URL_DEV=https://app-name-dev.convex.cloud
VITE_MSAL_CLIENT_ID_DEV=dev-client-id-guid
VITE_MSAL_REDIRECT_URI_DEV=https://todoapp-dev.pages.dev

# .env.local (for local dev)
VITE_CONVEX_URL=https://app-name-dev.convex.cloud
VITE_MSAL_CLIENT_ID=dev-client-id-guid
VITE_MSAL_REDIRECT_URI=http://localhost:5173
```

### Production Environment

```bash
# GitHub Secrets (for CI/CD)
CONVEX_DEPLOY_KEY_PROD=cvx_prod_xyz789...
VITE_CONVEX_URL_PROD=https://app-name-prod.convex.cloud
VITE_MSAL_CLIENT_ID_PROD=prod-client-id-guid
VITE_MSAL_REDIRECT_URI_PROD=https://todoapp.yourdomain.com

# No .env.local for production (uses CI/CD secrets only)
```

---

## Security Checklist

### Before Every Commit

- [ ] Run `git status` to check what's being committed
- [ ] Verify no `.env.local` files included
- [ ] Search code for hardcoded secrets: `grep -r "cvx_" .`
- [ ] Check for API keys: `grep -r "sk_" .`
- [ ] Verify `.gitignore` includes `.env*.local`

### Weekly Security Audit

- [ ] Review who has access to GitHub repository
- [ ] Check GitHub Secrets haven't been exposed
- [ ] Verify Cloudflare API token permissions
- [ ] Review Convex deploy key usage
- [ ] Check for any secret leaks in logs

### Monthly Rotation (Best Practice)

- [ ] Rotate Cloudflare API tokens
- [ ] Regenerate Convex deploy keys
- [ ] Review and update Azure app registrations
- [ ] Audit access logs

---

## Incident Response: Secret Exposed

If a secret is accidentally committed or exposed:

### Immediate Actions (Do within 5 minutes)

```
1. REVOKE the exposed secret immediately
   - Cloudflare: Revoke API token
   - Convex: Delete deploy key
   - Azure: Rotate client secret

2. ROTATE to new secret
   - Generate new credentials
   - Update GitHub Secrets
   - Update .env.local

3. VERIFY old secret is revoked
   - Test that old credentials don't work

4. REMOVE from git history (if committed)
   - Use git filter-branch or BFG Repo-Cleaner
   - Force push to rewrite history
   - Notify team members to re-clone
```

### Follow-up Actions (Do within 24 hours)

```
1. Review access logs for unauthorized use
2. Update security documentation
3. Conduct team training on secret management
4. Implement additional safeguards (pre-commit hooks)
```

---

## Git Pre-commit Hook (Recommended)

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Check for .env.local files
if git diff --cached --name-only | grep -q "\.env\.local"; then
    echo "❌ ERROR: Attempting to commit .env.local file!"
    echo "This file should never be committed (contains secrets)"
    exit 1
fi

# Check for common secret patterns
if git diff --cached | grep -E "(cvx_prod_|cvx_deploy|sk_live|api_key|secret_key)"; then
    echo "❌ WARNING: Possible secret detected in commit!"
    echo "Please review your changes carefully"
    exit 1
fi

exit 0
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## Best Practices Summary

### ✅ DO:

- Store secrets in GitHub Secrets (primary key vault)
- Use `.env.local` for local development (gitignored)
- Rotate secrets regularly
- Use different secrets for dev vs prod
- Grant minimal permissions to API tokens
- Audit secret access regularly
- Use pre-commit hooks to prevent accidents

### ❌ DON'T:

- Commit `.env.local` or `.env.production`
- Hardcode secrets in source code
- Share secrets via email/Slack
- Use production secrets in development
- Log secrets (even in debug mode)
- Store secrets in documentation
- Copy secrets to insecure locations
- Use the same secrets across environments

---

## Compliance and Auditing

### Audit Log Locations

| System | Audit Log Location |
|--------|-------------------|
| GitHub Secrets | Settings → Actions → Audit log |
| Cloudflare | Dashboard → Audit log |
| Convex | Dashboard → Deployment history |
| Azure | Portal → Azure AD → Audit logs |

### Regular Audits

**Monthly**: Review access logs for:
- Unusual secret access patterns
- Failed authentication attempts
- Secret rotation compliance
- User access changes

---

## Additional Security Layers (Future)

### Azure Key Vault Integration (Phase 2+)

```typescript
// Future enhancement: Backend service pulling from Azure Key Vault
import { SecretClient } from '@azure/keyvault-secrets';

const client = new SecretClient(
  process.env.KEY_VAULT_URL,
  credential
);

const secret = await client.getSecret('ConvexDeployKey');
```

Benefits:
- Centralized secret management
- Role-based access control
- Automatic rotation
- Audit logging
- Compliance reporting

---

## Resources

- [GitHub Actions Secrets Best Practices](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Azure Key Vault Documentation](https://learn.microsoft.com/en-us/azure/key-vault/)
- [OWASP Secret Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Convex Security Best Practices](https://docs.convex.dev/production/hosting/security)

---

**Remember**: Treating secrets with respect is not optional—it's a fundamental requirement for building secure applications.
