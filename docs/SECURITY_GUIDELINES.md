# Security Audit Guidelines

## Overview
Security is a critical aspect of application development. This document provides comprehensive security guidelines and an audit checklist for the TodoApp project. Every feature, component, and backend function must pass security review before deployment.

## Security Principles

### Defense in Depth
- Implement multiple layers of security controls
- Never rely on a single security mechanism
- Assume breaches will happen and plan accordingly

### Principle of Least Privilege
- Grant minimum necessary permissions
- Users should only access their own data
- Service accounts have minimal required access

### Fail Securely
- Default to deny access
- Handle errors without exposing sensitive information
- Log security-relevant events

### Security by Design
- Consider security from the start
- Don't treat security as an afterthought
- Regular security reviews throughout development

## Authentication Security

### Microsoft Entra ID Integration

#### Configuration Security
- [ ] Client secrets stored in environment variables
- [ ] No secrets in code or version control
- [ ] Redirect URIs properly whitelisted
- [ ] Token validation properly configured
- [ ] Token expiration appropriate (not too long)

```typescript
// ✅ Good: Environment variables
const msalConfig = {
  auth: {
    clientId: process.env.VITE_AZURE_CLIENT_ID!,
    authority: process.env.VITE_AZURE_AUTHORITY!,
    redirectUri: process.env.VITE_AZURE_REDIRECT_URI!,
  },
};

// ❌ Bad: Hardcoded values
const msalConfig = {
  auth: {
    clientId: "abc123-hardcoded-client-id",
    // ...
  },
};
```

#### Token Management
- [ ] Access tokens stored securely (httpOnly cookies or memory)
- [ ] Tokens not stored in localStorage (XSS risk)
- [ ] Token refresh implemented properly
- [ ] Expired tokens handled gracefully
- [ ] Logout clears all tokens

```typescript
// ✅ Good: Token in memory or httpOnly cookie
const AuthContext = createContext<AuthContextType>(null!);

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState<AuthState>({
    token: null, // In memory only
    user: null,
  });
  
  // Token refresh logic
  useEffect(() => {
    const refreshToken = async () => {
      // Implement token refresh
    };
    
    const interval = setInterval(refreshToken, 5 * 60 * 1000); // 5 min
    return () => clearInterval(interval);
  }, []);
  
  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}

// ❌ Bad: Token in localStorage
localStorage.setItem('token', accessToken); // Vulnerable to XSS
```

#### Session Management
- [ ] Session timeout implemented
- [ ] Concurrent session handling defined
- [ ] Session fixation prevented
- [ ] Remember me functionality secure (if implemented)
- [ ] Single logout implemented

### Convex Authentication

#### Identity Verification
- [ ] User identity checked in all protected queries
- [ ] User identity checked in all mutations
- [ ] Identity subject (user ID) used consistently
- [ ] No authentication bypass possible

```typescript
// ✅ Good: Identity verification
export const listTodos = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: Authentication required');
    }
    
    // Use identity.subject for user identification
    return await ctx.db
      .query('todos')
      .withIndex('by_user', q => q.eq('userId', identity.subject))
      .collect();
  },
});

// ❌ Bad: No identity check
export const listTodos = query({
  handler: async (ctx) => {
    // Missing authentication check!
    return await ctx.db.query('todos').collect(); // Returns ALL todos!
  },
});
```

## Authorization Security

### Access Control

#### Resource-Level Authorization
- [ ] Users can only access their own resources
- [ ] Ownership verified before any operation
- [ ] No direct ID-based access without ownership check
- [ ] Shared resources have explicit permission model

```typescript
// ✅ Good: Ownership verification
export const updateTodo = mutation({
  args: { id: v.id('todos'), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new Error('Todo not found');
    
    // Verify ownership
    if (todo.userId !== identity.subject) {
      throw new Error('Forbidden: Not authorized to update this todo');
    }
    
    await ctx.db.patch(args.id, { title: args.title });
    return args.id;
  },
});

// ❌ Bad: No ownership check
export const updateTodo = mutation({
  args: { id: v.id('todos'), title: v.string() },
  handler: async (ctx, args) => {
    // Missing ownership verification!
    await ctx.db.patch(args.id, { title: args.title });
    return args.id;
  },
});
```

#### Role-Based Access Control (RBAC)
- [ ] Roles defined clearly
- [ ] Permissions mapped to roles
- [ ] Role checks in backend, never frontend only
- [ ] Administrative actions properly protected

```typescript
// ✅ Good: Role-based authorization
export const deleteAnyTodo = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    // Check if user is admin
    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', q => q.eq('subject', identity.subject))
      .first();
    
    if (!user || user.role !== 'admin') {
      throw new Error('Forbidden: Admin access required');
    }
    
    await ctx.db.delete(args.id);
  },
});
```

### Data Isolation
- [ ] Multi-tenancy properly implemented
- [ ] User data completely isolated
- [ ] No data leakage between users
- [ ] Indexes support data isolation efficiently

```typescript
// ✅ Good: Proper data isolation with index
// In schema.ts
defineSchema({
  todos: defineTable({
    title: v.string(),
    completed: v.boolean(),
    userId: v.string(),
  })
    .index('by_user', ['userId'])
    .index('by_user_completed', ['userId', 'completed']),
});

// In query
export const listTodos = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    return await ctx.db
      .query('todos')
      .withIndex('by_user', q => q.eq('userId', identity.subject))
      .collect();
  },
});
```

## Input Validation & Sanitization

### Backend Validation

#### Convex Validators
- [ ] All mutation args have validators
- [ ] All query args have validators
- [ ] Validators match expected data types
- [ ] String length limits enforced
- [ ] Numeric ranges validated
- [ ] Enums used for fixed value sets

```typescript
// ✅ Good: Comprehensive validation
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    // Additional business validation
    if (args.title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    
    if (args.title.length > 500) {
      throw new Error('Title too long (max 500 characters)');
    }
    
    if (args.dueDate && args.dueDate < Date.now()) {
      throw new Error('Due date cannot be in the past');
    }
    
    return await ctx.db.insert('todos', {
      title: args.title.trim(),
      description: args.description?.trim(),
      dueDate: args.dueDate,
      priority: args.priority,
      userId: identity.subject,
      completed: false,
    });
  },
});
```

#### Business Logic Validation
- [ ] Domain rules enforced
- [ ] Data consistency checked
- [ ] Cross-field validation performed
- [ ] State transitions validated

### Frontend Validation

#### Form Validation
- [ ] User-friendly validation messages
- [ ] Real-time validation feedback
- [ ] Client-side validation for UX only
- [ ] **Never trust client-side validation alone**
- [ ] Server-side validation always present

```typescript
// ✅ Good: Frontend validation with proper error handling
function TodoForm() {
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const createTodo = useMutation(api.todos.create);
  
  const validateTitle = (value: string): string[] => {
    const errors: string[] = [];
    if (!value.trim()) errors.push('Title is required');
    if (value.length > 500) errors.push('Title too long (max 500 characters)');
    return errors;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateTitle(title);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      await createTodo({ title });
      toast.success('Todo created');
      setTitle('');
    } catch (error) {
      // Backend might catch additional validation issues
      toast.error(error.message || 'Failed to create todo');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setErrors(validateTitle(e.target.value));
        }}
        aria-invalid={errors.length > 0}
        aria-describedby="title-error"
      />
      {errors.length > 0 && (
        <span id="title-error" className="text-destructive">
          {errors[0]}
        </span>
      )}
      <Button type="submit">Create</Button>
    </form>
  );
}
```

### XSS Prevention

#### Content Sanitization
- [ ] User input never rendered as HTML directly
- [ ] React's built-in XSS protection utilized
- [ ] dangerouslySetInnerHTML avoided
- [ ] If HTML rendering needed, use DOMPurify
- [ ] User-generated URLs validated

```typescript
// ✅ Good: React handles escaping automatically
function TodoItem({ todo }: { todo: Todo }) {
  return (
    <div>
      <h3>{todo.title}</h3> {/* Automatically escaped */}
      <p>{todo.description}</p>
    </div>
  );
}

// ❌ Bad: Rendering unsanitized HTML
function TodoItem({ todo }: { todo: Todo }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: todo.description }} />
  );
}

// ✅ Good: If HTML needed, sanitize first
import DOMPurify from 'dompurify';

function TodoItem({ todo }: { todo: Todo }) {
  const sanitizedHTML = DOMPurify.sanitize(todo.richDescription);
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
  );
}
```

#### URL Validation
- [ ] External links validated
- [ ] javascript: protocol blocked
- [ ] data: URLs handled carefully
- [ ] User-provided URLs sanitized

```typescript
// ✅ Good: URL validation
function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (!isValidHttpUrl(href)) {
    console.warn('Invalid URL blocked:', href);
    return <span>{children}</span>;
  }
  
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" // Security: prevents window.opener access
    >
      {children}
    </a>
  );
}
```

## Data Protection

### Sensitive Data Handling

#### Personal Identifiable Information (PII)
- [ ] PII minimized (only collect what's needed)
- [ ] PII encrypted at rest
- [ ] PII encrypted in transit (HTTPS)
- [ ] PII not logged
- [ ] PII not exposed in URLs
- [ ] PII access audited

```typescript
// ✅ Good: Proper PII handling
export const getUserProfile = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', q => q.eq('subject', identity.subject))
      .first();
    
    // Log access without exposing PII
    console.log('User profile accessed', { userId: identity.subject });
    
    return user;
  },
});

// ❌ Bad: Logging PII
export const getUserProfile = query({
  handler: async (ctx) => {
    // ... get user ...
    console.log('Profile accessed:', user.email, user.name); // Don't log PII!
    return user;
  },
});
```

#### Secrets Management
- [ ] No secrets in code
- [ ] No secrets in version control
- [ ] Environment variables for configuration
- [ ] .env files in .gitignore
- [ ] Secrets rotation plan in place

```bash
# ✅ Good: .env.local (not committed)
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_TENANT_ID=your-tenant-id
VITE_AZURE_REDIRECT_URI=http://localhost:5173/auth/callback
CONVEX_DEPLOYMENT=your-convex-deployment

# .gitignore should include:
.env
.env.local
.env.*.local
```

```typescript
// ✅ Good: Using environment variables
const config = {
  azure: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    tenantId: import.meta.env.VITE_AZURE_TENANT_ID,
  },
};

// Runtime check for required env vars
if (!config.azure.clientId) {
  throw new Error('VITE_AZURE_CLIENT_ID is required');
}
```

### Data Transmission Security

#### HTTPS Only
- [ ] All communication over HTTPS
- [ ] HTTP redirects to HTTPS
- [ ] Secure cookies (secure flag set)
- [ ] HSTS headers configured
- [ ] Mixed content warnings resolved

#### API Security
- [ ] Authentication required for all protected endpoints
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Request size limits enforced

## Error Handling & Information Disclosure

### Secure Error Messages

#### User-Facing Errors
- [ ] Generic error messages to users
- [ ] No stack traces exposed
- [ ] No internal details revealed
- [ ] No database structure exposed
- [ ] No file paths revealed

```typescript
// ✅ Good: Generic user error, detailed logging
export const updateTodo = mutation({
  args: { id: v.id('todos'), title: v.string() },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error('Unauthorized');
      
      const todo = await ctx.db.get(args.id);
      if (!todo) throw new Error('NotFound');
      
      if (todo.userId !== identity.subject) throw new Error('Forbidden');
      
      await ctx.db.patch(args.id, { title: args.title });
      return args.id;
    } catch (error) {
      // Log detailed error for debugging
      console.error('Update failed:', {
        error: error.message,
        todoId: args.id,
        userId: ctx.auth.getUserIdentity()?.subject,
      });
      
      // Return generic error to user
      if (error.message === 'Unauthorized') {
        throw new Error('Authentication required');
      } else if (error.message === 'NotFound') {
        throw new Error('Todo not found');
      } else if (error.message === 'Forbidden') {
        throw new Error('Not authorized');
      } else {
        throw new Error('Failed to update todo');
      }
    }
  },
});

// ❌ Bad: Exposing internal details
catch (error) {
  throw new Error(`Database error: ${error.stack}`); // Reveals internals!
}
```

#### Logging
- [ ] Errors logged with context
- [ ] Security events logged
- [ ] Logs don't contain PII
- [ ] Logs don't contain passwords/tokens
- [ ] Log level appropriate for environment

```typescript
// ✅ Good: Proper logging
console.error('Authentication failed', {
  timestamp: new Date().toISOString(),
  userId: identity?.subject, // ID only, no PII
  action: 'update_todo',
  error: error.message,
});

// ❌ Bad: Logging sensitive data
console.error('Auth failed:', user.email, user.password); // Never log passwords!
```

## Dependency Security

### Package Management
- [ ] Dependencies regularly updated
- [ ] Security advisories monitored
- [ ] `npm audit` run regularly
- [ ] Vulnerable packages patched or replaced
- [ ] Unused dependencies removed
- [ ] Package lock file committed

```bash
# Regular security checks
npm audit
npm audit fix

# Check for outdated packages
npm outdated

# Update dependencies
npm update
```

### Third-Party Libraries
- [ ] Libraries from trusted sources
- [ ] License compatibility checked
- [ ] Minimal necessary dependencies
- [ ] Regular security scans performed

## Frontend Security

### Client-Side Security

#### State Management
- [ ] Sensitive data not in Redux/state unnecessarily
- [ ] State reset on logout
- [ ] No sensitive data in URLs
- [ ] No sensitive data in browser history

#### Browser Storage
- [ ] No sensitive data in localStorage
- [ ] sessionStorage cleared on logout
- [ ] Cookies with appropriate flags (httpOnly, secure, sameSite)

```typescript
// ✅ Good: Secure cookie configuration
document.cookie = `session=${token}; Secure; HttpOnly; SameSite=Strict; Max-Age=3600`;

// ❌ Bad: Insecure storage
localStorage.setItem('token', accessToken); // Vulnerable to XSS
localStorage.setItem('password', password); // Never store passwords!
```

#### Content Security Policy (CSP)
- [ ] CSP headers configured
- [ ] Inline scripts avoided or nonce-based
- [ ] External script sources whitelisted
- [ ] eval() not used

```html
<!-- ✅ Good: CSP meta tag -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'nonce-{random}'; style-src 'self' 'nonce-{random}'; img-src 'self' https:;"
/>
```

## Security Testing

### Testing Checklist
- [ ] Authentication bypass attempts tested
- [ ] Authorization bypass attempts tested
- [ ] Input validation tested with malicious inputs
- [ ] SQL injection attempts (though Convex protects)
- [ ] XSS attempts tested
- [ ] CSRF protection verified
- [ ] Session management tested
- [ ] Rate limiting verified

### Test Cases

```typescript
// ✅ Good: Security test examples
describe('Todo API Security', () => {
  test('should reject unauthenticated requests', async () => {
    await expect(
      listTodos.handler({} as any, {})
    ).rejects.toThrow('Unauthorized');
  });
  
  test('should not allow user to access other users todos', async () => {
    // Create todo as user A
    // Try to access as user B
    // Should fail
  });
  
  test('should sanitize malicious input', async () => {
    const maliciousTitle = '<script>alert("XSS")</script>';
    const result = await createTodo({ title: maliciousTitle });
    const todo = await getTodo({ id: result });
    // Should be escaped/sanitized
    expect(todo.title).not.toContain('<script>');
  });
  
  test('should enforce title length limits', async () => {
    const longTitle = 'a'.repeat(1000);
    await expect(
      createTodo({ title: longTitle })
    ).rejects.toThrow('Title too long');
  });
});
```

## Incident Response

### Security Incident Plan
1. **Detect**: Monitor logs and alerts
2. **Assess**: Determine severity and scope
3. **Contain**: Limit damage and prevent spread
4. **Eradicate**: Remove threat and vulnerabilities
5. **Recover**: Restore normal operations
6. **Learn**: Document and improve

### Security Contacts
- [ ] Security contact defined
- [ ] Escalation path documented
- [ ] Response team identified
- [ ] Communication plan ready

## Compliance & Regulations

### Data Privacy
- [ ] GDPR compliance (if applicable)
- [ ] User consent obtained
- [ ] Data retention policy defined
- [ ] Right to deletion implemented
- [ ] Privacy policy published

### Audit Trail
- [ ] Security events logged
- [ ] User actions auditable
- [ ] Admin actions logged
- [ ] Logs tamper-proof
- [ ] Log retention appropriate

## Security Review Process

### Before Each Release
1. Run security checklist
2. Review code changes for security implications
3. Test authentication and authorization
4. Verify input validation
5. Check for sensitive data exposure
6. Run automated security scans
7. Update dependencies
8. Review access controls

### Regular Security Audits
- [ ] Quarterly security reviews
- [ ] Annual penetration testing
- [ ] Regular dependency audits
- [ ] Access control reviews
- [ ] Incident response drills

## Tools & Resources

### Security Tools
- **npm audit**: Check for vulnerable dependencies
- **OWASP ZAP**: Web application security scanner
- **Snyk**: Continuous security monitoring
- **ESLint Security Plugin**: Detect security issues in code

### Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Convex Security Best Practices](https://docs.convex.dev/security)
- [React Security Best Practices](https://react.dev/learn/security)
- [Microsoft Entra ID Security](https://learn.microsoft.com/en-us/entra/identity/)

---

**Remember**: Security is everyone's responsibility. When in doubt, err on the side of caution. Always assume malicious input and design defenses accordingly.

