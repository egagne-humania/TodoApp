# Getting Started with TodoApp Implementation

## 🎯 Quick Start Guide

This guide will help you start implementing the TodoApp following the complete [PROJECT_PLAN.md](./docs/PROJECT_PLAN.md).

## ✅ Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js 20+ installed
- [ ] npm 10+ installed
- [ ] Git configured
- [ ] Code editor (VS Code recommended with Cursor)
- [ ] Convex account created
- [ ] Microsoft Azure account (for Entra ID)
- [ ] GitHub account
- [ ] Cloudflare account

## 📋 Phase 0: Initial Setup (Start Here!)

### Step 1: Configure Testing Framework

```bash
cd TodoApp

# Install testing dependencies
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Install Playwright for E2E
npm install -D @playwright/test
npx playwright install
```

**Create test configuration**:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/types/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```typescript
// src/tests/setup.ts
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Update package.json scripts**:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### Step 2: Install Shadcn Components

```bash
# Initialize Shadcn (if not already done)
npx shadcn@latest init

# Install all required components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add checkbox
npx shadcn@latest add form
npx shadcn@latest add dialog
npx shadcn@latest add alert-dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sonner
npx shadcn@latest add skeleton
```

### Step 3: Verify Setup

```bash
# Run tests (should pass with no tests yet)
npm test

# Run linter
npm run lint

# Build project
npm run build

# Check TypeScript
npx tsc --noEmit
```

## 🚀 Phase 1: Start Implementation

### Next Task: Database Schema (TDD)

Follow [PROJECT_PLAN.md - Task 1.3](./docs/PROJECT_PLAN.md#task-13-database-schema-design-tdd)

**Quick Steps**:

1. **Create test file FIRST**:

```bash
mkdir -p convex/__tests__
touch convex/__tests__/schema.test.ts
```

2. **Write failing test**:

```typescript
// convex/__tests__/schema.test.ts
import { describe, test, expect } from 'vitest';
import schema from '../schema';

describe('Todo Schema', () => {
  test('should have todos table defined', () => {
    expect(schema.tables.todos).toBeDefined();
  });
  
  test('should have required fields', () => {
    // Add assertions for required fields
  });
  
  test('should have proper indexes', () => {
    // Add assertions for indexes
  });
});
```

3. **Run test (should fail)**: `npm test`

4. **Implement schema** (see PROJECT_PLAN.md for code)

5. **Run test (should pass)**: `npm test`

6. **Refactor if needed**

## 📚 Key Resources

### Documentation to Reference

While implementing, keep these open:

1. **[PROJECT_PLAN.md](./docs/PROJECT_PLAN.md)** - Your implementation guide
2. **[TESTING_STRATEGY.md](./docs/TESTING_STRATEGY.md)** - TDD approach
3. **[DEVELOPMENT_GUIDELINES.md](./docs/DEVELOPMENT_GUIDELINES.md)** - SOLID principles
4. **[SECURITY_GUIDELINES.md](./docs/SECURITY_GUIDELINES.md)** - Security checks
5. **[QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md)** - Quick patterns

### With Cursor AI

Use these prompts:

```
"Following @PROJECT_PLAN.md Task 1.3, help me implement the database 
schema using TDD approach. Write tests first."
```

```
"Review my schema implementation against @CODE_QUALITY_CHECKLIST.md 
and @SECURITY_GUIDELINES.md"
```

```
"Use Context7 to get Convex best practices for schema design with indexes"
```

## 🎯 Daily Workflow

### Morning
1. Review [PROJECT_PLAN.md](./docs/PROJECT_PLAN.md) for current phase
2. Identify next task
3. Read task requirements and tests to write

### During Development (TDD Cycle)
1. **RED**: Write failing test
2. **GREEN**: Write minimal code to pass
3. **REFACTOR**: Improve code, keep tests green
4. Run: `npm test && npm run lint && npm run build`
5. Commit with good message

### Before Committing
```bash
# Run full quality check
npm test -- --coverage
npm run lint
npm run build
npx tsc --noEmit

# All should pass! ✅
```

### End of Day
1. Push changes
2. Update task status in PROJECT_PLAN
3. Plan tomorrow's tasks

## 📊 Progress Tracking

### Recommended Tool
Create GitHub Issues from PROJECT_PLAN tasks:

```bash
# Example: Create issues for Phase 1
# Issue #1: Task 1.1 - Install Shadcn Components
# Issue #2: Task 1.2 - Setup Theme Configuration
# Issue #3: Task 1.3 - Database Schema Design (TDD)
# Issue #4: Task 1.4 - Type Definitions
```

Use GitHub Projects to track:
- **Todo**: Not started
- **In Progress**: Currently working
- **Testing**: Tests written and running
- **Review**: Ready for code review
- **Done**: Merged and deployed to dev

## 🚦 Success Criteria

You're on track when:
- ✅ Tests written BEFORE implementation
- ✅ All tests passing (>80% coverage)
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ Code follows SOLID principles
- ✅ Security checklist passed
- ✅ Components use Shadcn (no inline styles)

## 🆘 Getting Help

### Stuck on a Task?

1. **Check Documentation**:
   - Read task details in PROJECT_PLAN.md
   - Review relevant pattern in ARCHITECTURE_PATTERNS.md
   - Check examples in TESTING_STRATEGY.md

2. **Use Cursor AI**:
   ```
   "I'm stuck on @PROJECT_PLAN.md Task X.Y. Following TDD, help me:
   1. Write the tests first
   2. Implement minimal code to pass
   3. Refactor while keeping tests green"
   ```

3. **Search for Similar Code**:
   - Look for similar patterns in codebase
   - Check Shadcn examples
   - Review Convex documentation

4. **Ask Team**:
   - Don't stay blocked
   - Share your progress and challenge
   - Pair programming session

## 🎉 Quick Wins

Start with these to build momentum:

### Win 1: First Test (5 minutes)
```bash
# Create a simple test
mkdir -p src/lib/__tests__
cat > src/lib/__tests__/utils.test.ts << 'EOF'
import { describe, test, expect } from 'vitest';

describe('Utils', () => {
  test('should work', () => {
    expect(true).toBe(true);
  });
});
EOF

npm test  # Should pass! ✅
```

### Win 2: First Component Test (15 minutes)
```bash
# Install Shadcn button
npx shadcn@latest add button

# Test it
cat > src/components/__tests__/Button.test.tsx << 'EOF'
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  test('should render', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
EOF

npm test  # Should pass! ✅
```

### Win 3: First Convex Query (30 minutes)
Follow Task 1.3 in PROJECT_PLAN.md to create schema with tests!

## 📅 Milestone Schedule

### Week 1: Foundation
- [ ] Phase 0 complete (setup)
- [ ] Phase 1 complete (schema, types, theme)
- [ ] First commit to dev branch
- [ ] Tests passing

### Week 2: Authentication
- [ ] Phase 2 complete (Microsoft Entra ID)
- [ ] Login/logout working
- [ ] Protected routes implemented
- [ ] Tests >80% coverage

### Week 3-4: Core Features
- [ ] Phase 3 complete (CRUD operations)
- [ ] Phase 4 in progress (UI components)
- [ ] Todo creation working
- [ ] Todo list rendering

### Week 5: Advanced Features
- [ ] Phase 5 complete (filtering, sorting)
- [ ] All CRUD operations working
- [ ] UI polished

### Week 6: Polish & Deploy
- [ ] Phase 6 complete (UX enhancements)
- [ ] Phase 7 complete (testing & QA)
- [ ] Phase 8 started (deployment)
- [ ] Dev environment live

### Week 7-8: Production
- [ ] Phase 8 complete
- [ ] Production deployment
- [ ] Documentation complete
- [ ] Project delivered! 🎉

## 🎓 Learning Path

If you're new to any technology:

- **React 19**: Use Context7 in Cursor: "Get React 19 best practices"
- **Convex**: Read docs at https://docs.convex.dev/
- **Shadcn**: Browse components at https://ui.shadcn.com/
- **TDD**: Study TESTING_STRATEGY.md
- **SOLID**: Review DEVELOPMENT_GUIDELINES.md

## 💡 Pro Tips

1. **Start Small**: Don't try to implement everything at once
2. **Test First**: Always write tests before code (TDD)
3. **Commit Often**: Small, focused commits
4. **Refactor Fearlessly**: Tests give you confidence
5. **Use Shadcn**: Don't create custom UI from scratch
6. **Ask Cursor AI**: Reference docs in your prompts
7. **Review Daily**: Check code quality checklist
8. **Deploy Early**: Push to dev often to catch issues

## 🚀 Ready to Start?

1. ✅ Complete Phase 0 setup above
2. ✅ Create first test file
3. ✅ Read Task 1.3 in PROJECT_PLAN.md
4. ✅ Write your first failing test
5. ✅ Make it pass (TDD!)
6. ✅ Push to GitHub
7. ✅ Auto-deploy to dev! 🎉

---

**You've got this!** Follow the plan, use TDD, and build something great! 💪

For the complete roadmap, see [PROJECT_PLAN.md](./docs/PROJECT_PLAN.md)

**Last Updated**: 2024-12-12
**Version**: 1.0

