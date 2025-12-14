# TodoApp

Enterprise-grade todo application built with React, TypeScript, Convex, and Shadcn UI, following TDD and SOLID principles.

## Features

- ✅ Real-time sync across devices
- 🔐 Enterprise authentication (Microsoft Entra ID)
- 🎨 Modern UI with Shadcn components
- 📱 Fully responsive design
- 🔒 Security-first architecture
- 🧪 Comprehensive test coverage (TDD)
- ⚡ High performance
- ♿ WCAG AA accessible

## Tech Stack

- **Frontend**: React 19 + TypeScript 5.9 + Vite 7.2.4
- **Backend**: Convex BaaS
- **UI**: Tailwind CSS + Shadcn UI
- **Auth**: Microsoft Entra ID
- **Testing**: Vitest + React Testing Library + Playwright
- **Deploy**: Cloudflare Pages + GitHub Actions

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Convex account ([convex.dev](https://convex.dev))

### Installation

```bash
# Clone and install
git clone <repository-url>
cd TodoApp
npm install

# Setup Convex
npx convex dev

# Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# Start development
npm run dev
```

Visit `http://localhost:5173`

### Environment Variables

Create `.env.local`:

```bash
VITE_CONVEX_URL=your-convex-url
VITE_MSAL_CLIENT_ID=your-azure-client-id
VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/tenant-id
VITE_MSAL_REDIRECT_URI=http://localhost:5173
```

## Development

### Run Tests

```bash
npm test                # Unit tests
npm test -- --coverage  # With coverage
npm run test:e2e        # E2E tests
```

### Quality Checks

```bash
npm run lint            # ESLint
npm run build           # Build
npx tsc --noEmit        # Type check
```

**All must pass before committing.**

### Development Workflow

1. Write tests first (TDD)
2. Implement minimal code to pass
3. Refactor while keeping tests green
4. Run quality checks
5. Commit with conventional message

```bash
# Example
git checkout -b feature/my-feature
# ... develop with TDD ...
npm test && npm run lint && npm run build
git commit -m "feat: add feature"
git push origin feature/my-feature
```

## Documentation

All documentation is in `/docs`:

- **[PROJECT_PLAN.md](./docs/PROJECT_PLAN.md)** - Implementation roadmap
- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - Coding practices & guidelines
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Design patterns
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - CI/CD & deployment

See [docs/README.md](./docs/README.md) for full documentation index.

## Core Principles

### Test-Driven Development (TDD)
- Write tests before implementation
- Follow Red-Green-Refactor cycle
- Target >80% coverage

### SOLID Principles
- Single Responsibility
- Open/Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

### Security First
- Authentication on all protected endpoints
- Input validation (backend + frontend)
- No secrets in code
- Secure error handling

### Theme-Based Styling
- **Never** use inline styles
- **Always** use Shadcn components
- **Always** use Tailwind classes
- **Always** use theme variables

## Project Structure

```
TodoApp/
├── docs/              # Documentation
├── src/               # Frontend
│   ├── components/   # React components
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilities
│   └── types/        # TypeScript types
├── convex/           # Backend (Convex)
│   ├── schema.ts     # Database schema
│   └── todos.ts      # CRUD operations
└── e2e/              # E2E tests
```

## Deployment

### Branch Strategy

- **`main` → Development**: Auto-deploys to dev environment
- **`prod` → Production**: Auto-deploys to production

### Deploy to Development

```bash
# Merge PR to main → automatic deployment
```

### Deploy to Production

```bash
# Create PR: main → prod
# Get 2+ approvals
# Merge → automatic deployment
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed setup.

## Contributing

Before contributing:

1. Read [DEVELOPMENT.md](./docs/DEVELOPMENT.md)
2. Follow TDD approach (tests first)
3. Apply SOLID principles
4. Use theme-based styling only
5. Run quality checks before committing

## Scripts

```bash
# Development
npm run dev              # Start dev server
npx convex dev          # Start Convex

# Testing
npm test                # Run tests
npm test -- --coverage  # With coverage
npm run test:e2e        # E2E tests

# Quality
npm run lint            # ESLint
npm run build           # Build for production
npx tsc --noEmit        # Type check only

# Preview
npm run preview         # Preview production build
```

## Quality Standards

- ✅ Test coverage >80%
- ✅ Zero TypeScript errors
- ✅ Zero ESLint errors
- ✅ All tests passing
- ✅ WCAG AA accessible
- ✅ Lighthouse score >90

## Common Commands

```bash
# Before committing
npm test && npm run lint && npm run build && npx tsc --noEmit

# If tests fail
npm test -- --watch

# If build fails
rm -rf node_modules && npm install

# If port in use
lsof -ti:5173 | xargs kill -9
```

## Resources

### External Documentation
- [React](https://react.dev/)
- [Convex](https://docs.convex.dev/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

### Internal Documentation
- [docs/README.md](./docs/README.md) - Documentation index
- [docs/PROJECT_PLAN.md](./docs/PROJECT_PLAN.md) - Roadmap
- [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Development guide
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Architecture patterns
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Deployment guide

## License

[Add your license here]

## Support

For issues or questions:
1. Check documentation in `/docs`
2. Search existing issues
3. Create new issue with details

---

**Built with modern web technologies and enterprise best practices**
