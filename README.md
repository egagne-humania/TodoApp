# TodoApp - Enterprise-Grade Todo Application

> A production-ready todo application built with modern web technologies, following enterprise best practices, SOLID principles, and Test-Driven Development (TDD).

## 🎯 Project Overview

TodoApp is a full-stack web application that demonstrates best practices in modern web development. It features Microsoft Entra ID authentication, real-time data synchronization, and a beautiful, accessible user interface.

### Key Features

- ✅ **Real-time Collaboration**: Changes sync instantly across all devices
- 🔐 **Enterprise Authentication**: Secure Microsoft Entra ID integration
- 🎨 **Modern UI**: Beautiful, accessible interface with Shadcn UI components
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🔒 **Security First**: Built with security best practices from the ground up
- 🧪 **Fully Tested**: Comprehensive test coverage with TDD approach
- ⚡ **High Performance**: Optimized for speed and efficiency
- ♿ **Accessible**: WCAG AA compliant

## 🏗️ Tech Stack

### Frontend
- **React 19.2**: Modern React with latest features
- **TypeScript 5.9**: Type-safe development
- **Vite 7.2.4**: Lightning-fast development and builds
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: High-quality component library
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing

### Backend
- **Convex**: Backend-as-a-Service with real-time capabilities
- **TypeScript**: End-to-end type safety
- **Microsoft Entra ID**: Enterprise authentication

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Vitest**: Unit testing framework
- **Playwright**: E2E testing
- **Git**: Version control

## 📁 Project Structure

```
TodoApp/
├── docs/                           # Documentation
│   ├── DEVELOPMENT_GUIDELINES.md   # Development best practices
│   ├── CODE_QUALITY_CHECKLIST.md   # Quality audit checklist
│   ├── SECURITY_GUIDELINES.md      # Security practices
│   ├── TESTING_STRATEGY.md         # TDD and testing guide
│   └── ARCHITECTURE_PATTERNS.md    # Architecture patterns
├── TodoApp/                        # Main application
│   ├── convex/                     # Convex backend
│   │   ├── auth/                   # Authentication logic
│   │   ├── todos/                  # Todo CRUD operations
│   │   ├── schema.ts               # Database schema
│   │   └── _generated/             # Convex generated files
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── ui/                 # Shadcn UI components
│   │   │   ├── todo/               # Todo-specific components
│   │   │   └── layout/             # Layout components
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # Utility functions
│   │   ├── types/                  # TypeScript types
│   │   ├── styles/                 # Global styles and themes
│   │   └── tests/                  # Test utilities
│   ├── e2e/                        # End-to-end tests
│   ├── public/                     # Static assets
│   └── vite.config.ts              # Vite configuration
└── README.md                       # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Version 10 or higher
- **Microsoft Entra ID**: For authentication (or use mock auth in development)
- **Convex Account**: Sign up at [convex.dev](https://convex.dev)

### Installation

1. **Clone the repository**
   ```bash
   cd TodoApp/TodoApp
   npm install
   ```

2. **Set up Convex**
   ```bash
   npx convex dev
   ```
   This will:
   - Initialize Convex in your project
   - Create a new Convex deployment
   - Start the Convex dev server

3. **Configure environment variables**

   Create a `.env.local` file in the `TodoApp` directory:

   ```env
   # Convex
   VITE_CONVEX_URL=your-convex-deployment-url

   # Microsoft Entra ID
   VITE_AZURE_CLIENT_ID=your-client-id
   VITE_AZURE_TENANT_ID=your-tenant-id
   VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
   VITE_AZURE_REDIRECT_URI=http://localhost:5173/auth/callback
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Development Workflow

1. **Start Convex dev server** (in one terminal)
   ```bash
   npx convex dev
   ```

2. **Start Vite dev server** (in another terminal)
   ```bash
   npm run dev
   ```

3. **Run tests** (optional, in another terminal)
   ```bash
   npm test
   ```

## 🧪 Testing

This project follows Test-Driven Development (TDD) principles. All features must have tests written before implementation.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e

# Run specific test file
npm test -- TodoList.test.tsx
```

### Test Coverage Goals

- **Overall**: >80%
- **Critical paths**: 100%
- **Business logic**: >90%
- **UI components**: >70%

See [TESTING_STRATEGY.md](./docs/TESTING_STRATEGY.md) for comprehensive testing guidelines.

## 📋 Development Guidelines

This project follows enterprise-grade development practices:

### Core Principles

1. **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
2. **DRY**: Don't Repeat Yourself
3. **KISS**: Keep It Simple, Stupid
4. **YAGNI**: You Aren't Gonna Need It
5. **TDD**: Test-Driven Development

### Code Quality Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: Zero errors, address warnings
- **Testing**: >80% coverage, all tests passing
- **Security**: Follow security guidelines
- **Accessibility**: WCAG AA compliance

### Required Reading

Before contributing, please read:

1. 📘 [Development Guidelines](./docs/DEVELOPMENT_GUIDELINES.md) - SOLID, DRY, and best practices
2. ✅ [Code Quality Checklist](./docs/CODE_QUALITY_CHECKLIST.md) - Quality audit for every task
3. 🔒 [Security Guidelines](./docs/SECURITY_GUIDELINES.md) - Security best practices
4. 🧪 [Testing Strategy](./docs/TESTING_STRATEGY.md) - TDD and testing guidelines
5. 🏛️ [Architecture Patterns](./docs/ARCHITECTURE_PATTERNS.md) - Design patterns and architecture
6. 🚀 [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) - CI/CD and deployment procedures

## 🛡️ Security

Security is a top priority. All code must pass security audits before deployment.

### Security Checklist

- [ ] Authentication verified on all protected routes
- [ ] Authorization checks in backend
- [ ] Input validation comprehensive
- [ ] No secrets in code or version control
- [ ] XSS prevention implemented
- [ ] HTTPS only in production
- [ ] Dependencies regularly updated

See [SECURITY_GUIDELINES.md](./docs/SECURITY_GUIDELINES.md) for detailed security practices.

## 🎨 Styling Guidelines

### Theme-Based Styling

- **ALWAYS** use Shadcn UI components as the base
- **NEVER** use inline styles
- **ALWAYS** apply styling through themes and Tailwind classes
- Customize themes in `src/styles/theme.css`

```typescript
// ❌ Bad: Inline styles
<div style={{ backgroundColor: 'blue' }}>

// ✅ Good: Theme-based classes
<div className="bg-primary">

// ✅ Better: Shadcn component
<Card className="bg-card">
```

### Shadcn UI

Use Shadcn MCP tools to discover and implement components:

```bash
# Search for components
mcp_shadcn_search_items_in_registries

# View component details
mcp_shadcn_view_items_in_registries

# Get usage examples
mcp_shadcn_get_item_examples_from_registries
```

## 📊 Code Quality Audits

### Before Each Commit

Run these commands to ensure code quality:

```bash
# TypeScript compilation
npm run build

# Linting
npm run lint

# Tests
npm test

# Type checking
npx tsc --noEmit
```

### Quality Gates

All of the following must pass:

- ✅ All tests passing
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ Test coverage >80%
- ✅ Security audit passed
- ✅ Accessibility audit passed

See [CODE_QUALITY_CHECKLIST.md](./docs/CODE_QUALITY_CHECKLIST.md) for complete checklist.

## 🏗️ Architecture

### Layered Architecture

```
┌─────────────────────────────────┐
│   Presentation Layer            │
│   (React Components)            │
├─────────────────────────────────┤
│   Business Logic Layer          │
│   (Custom Hooks, Services)      │
├─────────────────────────────────┤
│   Data Access Layer             │
│   (Convex Queries/Mutations)    │
├─────────────────────────────────┤
│   Data Layer                    │
│   (Convex Database)             │
└─────────────────────────────────┘
```

### Key Patterns

- **Container/Presentational**: Separate data from UI
- **Custom Hooks**: Reusable stateful logic
- **Repository Pattern**: Abstract data access
- **Service Layer**: Business logic encapsulation
- **Provider Pattern**: Global state management

See [ARCHITECTURE_PATTERNS.md](./docs/ARCHITECTURE_PATTERNS.md) for detailed architecture guidance.

## 🔄 Workflow

### Feature Development Workflow

1. **Plan**: Review requirements and design
2. **Write Tests**: Create failing tests (TDD)
3. **Implement**: Write minimal code to pass tests
4. **Refactor**: Improve code while keeping tests green
5. **Audit**: Run quality, security, and regression checks
6. **Document**: Update documentation as needed
7. **Review**: Self-review before creating PR
8. **PR**: Create pull request with detailed description
9. **Deploy**: Merge and deploy after approval

### Git Workflow

#### Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example**:
```
feat(todos): add filter by priority

- Add priority field to todo schema
- Implement priority filter in UI
- Add tests for priority filtering

Closes #123
```

#### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

## 📦 Deployment

### Deployment Strategy

The TodoApp uses **continuous deployment** with GitHub Actions:

- **Frontend**: Cloudflare Pages (CDN-optimized)
- **Backend**: Convex (serverless)
- **CI/CD**: GitHub Actions (automated)

### Branch Strategy

```
main branch  →  Development Environment
  ↓ (Auto-deploy on push)
  └─→ Cloudflare (dev) + Convex (dev)

prod branch  →  Production Environment
  ↓ (Auto-deploy on push)
  └─→ Cloudflare (prod) + Convex (prod)
```

### Development Deployment (Automatic)

When code is merged to `main` branch:

1. **GitHub Actions triggers** automatically
2. **CI runs**: Tests, linting, type checking
3. **Backend deploys** to Convex development
4. **Frontend deploys** to Cloudflare Pages development
5. **Accessible at**: `https://dev.todoapp.yourdomain.com`

```bash
# Development workflow
git checkout -b feature/my-feature
# ... develop with TDD ...
git push origin feature/my-feature
# Create PR to main → Review → Merge
# Automatic deployment to dev! ✅
```

### Production Deployment (Automatic)

When code is merged to `prod` branch:

1. **Create PR** from `main` to `prod`
2. **Extended review**: 2+ approvals required
3. **Merge to prod** triggers deployment
4. **GitHub Actions deploys** to production
5. **Accessible at**: `https://todoapp.yourdomain.com`

```bash
# Production workflow
# After testing in dev environment
git checkout main
git pull origin main
git checkout prod
git pull origin prod
# Create PR from main to prod
# Get approvals → Merge
# Automatic deployment to prod! ✅
```

### Local Build (for testing)

```bash
# Build locally
npm run build

# Preview production build
npm run preview
```

### Required GitHub Secrets

Set these in your repository settings:

**Cloudflare**:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

**Convex**:
- `CONVEX_DEPLOY_KEY_DEV`
- `CONVEX_DEPLOY_KEY_PROD`

**Environment Variables**:
- Dev: `VITE_CONVEX_URL_DEV`, `VITE_AZURE_CLIENT_ID_DEV`, etc.
- Prod: `VITE_CONVEX_URL_PROD`, `VITE_AZURE_CLIENT_ID_PROD`, etc.

### Deployment Checklist

**Before deploying to dev (main)**:
- [ ] All tests pass
- [ ] No TypeScript/ESLint errors
- [ ] Code reviewed (1+ approval)
- [ ] Feature tested locally

**Before deploying to prod**:
- [ ] Tested in dev environment
- [ ] Security review completed
- [ ] Performance verified
- [ ] 2+ approvals received
- [ ] Release notes prepared
- [ ] Rollback plan ready

See [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) for comprehensive deployment documentation.

## 🤝 Contributing

### Before Contributing

1. Read all documentation in `/docs`
2. Understand SOLID principles
3. Familiarize yourself with TDD
4. Review architecture patterns
5. Set up development environment

### Contribution Process

1. **Create Issue**: Describe the feature or bug
2. **Get Approval**: Wait for maintainer approval
3. **Create Branch**: Follow naming conventions
4. **Write Tests**: TDD approach
5. **Implement**: Follow guidelines
6. **Quality Check**: Run all audits
7. **Create PR**: Detailed description with screenshots
8. **Address Feedback**: Respond to review comments
9. **Merge**: After approval

### Code Review Checklist

- [ ] Tests written and passing
- [ ] Code follows SOLID principles
- [ ] No security vulnerabilities
- [ ] Accessibility requirements met
- [ ] Documentation updated
- [ ] Performance acceptable
- [ ] No TypeScript/ESLint errors

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

#### Convex Not Connecting

1. Check `.env.local` has correct `VITE_CONVEX_URL`
2. Ensure `npx convex dev` is running
3. Verify network connection

#### Tests Failing

1. Check test environment setup
2. Ensure all dependencies installed
3. Clear test cache: `npm test -- --clearCache`

#### Build Errors

1. Clean install: `rm -rf node_modules && npm install`
2. Clear cache: `rm -rf .vite`
3. Check TypeScript errors: `npx tsc --noEmit`

## 📚 Resources

### Documentation

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Convex](https://docs.convex.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)
- [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/)

### Best Practices

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Test-Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [React Best Practices](https://react.dev/learn/thinking-in-react)

## 📝 License

[Add your license here]

## 👥 Team

[Add team information here]

## 📞 Support

For questions or issues:

1. Check documentation in `/docs`
2. Search existing issues
3. Create a new issue with detailed information

---

## 🎯 Project Goals

This project aims to demonstrate:

- **Enterprise-grade code quality**
- **Security-first approach**
- **Test-driven development**
- **Modern web development practices**
- **Accessible and performant applications**
- **Clean architecture and design patterns**

## 🔮 Future Enhancements

- [ ] Real-time collaboration features
- [ ] Todo sharing and permissions
- [ ] Rich text editing
- [ ] File attachments
- [ ] Email notifications
- [ ] Mobile applications
- [ ] Offline support
- [ ] Analytics dashboard
- [ ] API for third-party integrations
- [ ] Internationalization (i18n)

## ⚡ Quick Reference

### Essential Commands

```bash
# Development
npm run dev              # Start dev server
npx convex dev          # Start Convex dev server

# Testing
npm test                # Run tests
npm test -- --coverage  # Run with coverage
npm run test:e2e        # Run E2E tests

# Quality
npm run lint            # Run ESLint
npm run build           # Build for production
npx tsc --noEmit        # Type check

# Documentation
npm run docs            # Generate docs (if configured)
```

### Important Files

- `.env.local` - Environment variables (DO NOT COMMIT)
- `convex/schema.ts` - Database schema
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules

---

**Built with ❤️ using modern web technologies and best practices**

For detailed guidance on any aspect of development, please refer to the comprehensive documentation in the `/docs` folder.
