# Contributing to TodoApp

Thank you for your interest in contributing to TodoApp! This document provides guidelines and instructions for contributing to the project.

## Development Workflow

### 1. Clone and Setup

```bash
git clone <repository-url>
cd TodoApp
npm install
cp .env.example .env.local
# Fill in your local environment variables in .env.local
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements

### 3. Follow TDD (Test-Driven Development)

1. Write tests FIRST (RED)
2. Write minimal code to pass tests (GREEN)
3. Refactor and improve (REFACTOR)
4. Repeat

### 4. Code Quality Standards

Before committing, ensure:

```bash
npm test              # All tests pass
npm run lint          # No linting errors
npm run build         # Build succeeds
npx tsc --noEmit      # No TypeScript errors
```

### 5. Commit Your Changes

Use conventional commit messages:

```
feat: add todo filtering by priority
fix: resolve authentication token refresh issue
docs: update API documentation
test: add unit tests for TodoList component
refactor: extract validation logic to separate module
```

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a PR on GitHub using the pull request template.

## Code Standards

### TypeScript
- Strict mode enabled
- No `any` types without justification
- Explicit types for all function parameters and returns

### Styling
- **NEVER** use inline styles
- Use Shadcn UI components as base
- Use Tailwind utility classes
- Use theme variables from `theme.css`

### SOLID Principles
- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

### Security
- Check authentication in ALL Convex queries/mutations
- Verify authorization (user can only access their own data)
- Validate ALL user inputs (backend and frontend)
- Handle errors securely (no sensitive info in messages)

## Project Structure

```
TodoApp/
├── .github/          # GitHub configuration
│   └── workflows/    # CI/CD workflows
├── convex/           # Convex backend
│   ├── _generated/   # Generated types
│   └── *.ts          # Queries, mutations, schemas
├── docs/             # Documentation
├── e2e/              # E2E tests (Playwright)
├── src/              # Frontend source
│   ├── components/   # React components
│   │   └── ui/       # Shadcn UI components
│   ├── config/       # Configuration
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── test/         # Test utilities
│   └── types/        # TypeScript types
└── public/           # Static assets
```

## Testing

### Unit Tests (Vitest)
```bash
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

### E2E Tests (Playwright)
```bash
npm run test:e2e          # Run all
npm run test:e2e:ui       # Interactive UI
npm run test:e2e:headed   # See browser
```

## Documentation

- Reference `/docs` for detailed guidelines
- Update documentation when adding features
- Include JSDoc comments for complex logic
- Keep README.md up to date

## Getting Help

- Check `/docs` directory for detailed documentation
- Review existing code for patterns
- Ask questions in pull request comments

## Code Review Process

1. All PRs require at least 1 approval
2. Production PRs (to `prod` branch) require 2+ approvals
3. CI must pass before merging
4. Follow the PR template checklist

## Branch Strategy

- `main` - Development branch (auto-deploys to dev)
- `prod` - Production branch (auto-deploys to prod)
- Feature branches merge to `main`
- `main` merges to `prod` after testing

## Deployment

- **Development**: Automatic on push to `main`
- **Production**: Automatic on push to `prod`
- **Emergency**: Follow deployment guide procedures

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Questions?

Feel free to open an issue or reach out to the maintainers.

---

Thank you for contributing to TodoApp! 🎉
