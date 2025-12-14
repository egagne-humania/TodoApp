# Documentation

## Quick Start

New to the project? Read in this order:

1. **`PROJECT_PLAN.md`** - Implementation roadmap and phases
2. **`DEVELOPMENT.md`** - Coding practices, TDD, security, testing
3. **`ARCHITECTURE.md`** - Patterns and design decisions
4. **`DEPLOYMENT.md`** - CI/CD and deployment procedures

## Documents

### [PROJECT_PLAN.md](./PROJECT_PLAN.md)
Implementation plan with 8 phases from setup to production.
- Tech stack overview
- Timeline (6-8 weeks)
- Success criteria
- Risk management

### [DEVELOPMENT.md](./DEVELOPMENT.md)
Complete development guide covering:
- SOLID principles with examples
- Test-Driven Development (TDD)
- TypeScript standards
- Security requirements
- Component patterns
- Quality checklist
- Common mistakes to avoid

### [ARCHITECTURE.md](./ARCHITECTURE.md)
System architecture and design patterns:
- Container/Presentational pattern
- Custom hooks pattern
- Repository pattern (backend)
- Service layer pattern (backend)
- State management strategy
- Performance patterns
- Anti-patterns to avoid

### [DEPLOYMENT.md](./DEPLOYMENT.md)
Deployment and CI/CD guide:
- Branch strategy (main → dev, prod → production)
- Cloudflare Pages setup
- Convex deployment
- Secrets management
- GitHub Actions workflows
- Rollback procedures
- Monitoring

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev              # Start Vite dev server
npx convex dev          # Start Convex backend

# Testing
npm test                # Run all tests
npm test -- --coverage  # With coverage report

# Quality Checks
npm run lint            # Run ESLint
npm run build           # Build for production
npx tsc --noEmit        # Type check
```

### File Structure

```
TodoApp/
├── docs/                # This documentation
├── src/                 # Frontend code
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities
│   └── types/          # TypeScript types
├── convex/             # Backend (Convex)
│   ├── schema.ts       # Database schema
│   └── todos.ts        # CRUD operations
└── e2e/                # End-to-end tests
```

### Core Rules

- ✅ **Always** write tests first (TDD)
- ✅ **Always** use Shadcn UI components
- ✅ **Always** check authentication (backend)
- ✅ **Always** validate inputs
- ❌ **Never** use inline styles
- ❌ **Never** use `any` types
- ❌ **Never** skip authentication checks
- ❌ **Never** commit secrets

## Getting Help

- Check relevant documentation above
- Reference `.cursorrules` for quick rules
- Use MCP tools (Convex, Shadcn, Context7)
- See external docs: [Convex](https://docs.convex.dev/), [Shadcn](https://ui.shadcn.com/), [React](https://react.dev/)

## Contributing

Before contributing:
1. Read DEVELOPMENT.md for coding standards
2. Read ARCHITECTURE.md for patterns
3. Follow TDD approach (tests first)
4. Run quality checks before committing
5. Reference PROJECT_PLAN.md for current phase
