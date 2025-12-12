# Testing Strategy & TDD Guidelines

## Overview
This document outlines the comprehensive testing strategy for the TodoApp project. We follow Test-Driven Development (TDD) principles to ensure high-quality, maintainable, and bug-free code.

## Testing Philosophy

### Core Principles
1. **Test First**: Write tests before implementation code
2. **Red-Green-Refactor**: Follow the TDD cycle religiously
3. **No Broken Tests**: All tests must pass before committing
4. **Tests Are Documentation**: Tests should clearly explain what code does
5. **Fast Feedback**: Tests should run quickly for rapid iteration
6. **Comprehensive Coverage**: Aim for >80% code coverage

### Why TDD?
- **Design Aid**: Forces thinking about API design before implementation
- **Safety Net**: Enables confident refactoring
- **Documentation**: Living documentation that stays up-to-date
- **Bug Prevention**: Catches issues early when they're cheapest to fix
- **Regression Prevention**: Ensures new changes don't break existing functionality

## Test-Driven Development (TDD) Process

### The Red-Green-Refactor Cycle

```
1. RED    → Write a failing test
2. GREEN  → Write minimal code to make it pass
3. REFACTOR → Improve code while keeping tests green
4. REPEAT → Continue until feature complete
```

#### Step-by-Step Process

##### 1. RED: Write a Failing Test
- Write a test for the next bit of functionality
- Test should fail initially (proves test is working)
- Run test to confirm it fails

```typescript
// Example: Start with a failing test
describe('TodoService', () => {
  test('should create a new todo with title', async () => {
    const todoService = new TodoService();
    const todo = await todoService.create({ title: 'Buy milk' });
    
    expect(todo).toBeDefined();
    expect(todo.title).toBe('Buy milk');
    expect(todo.completed).toBe(false);
  });
  // This test will fail because TodoService doesn't exist yet
});
```

##### 2. GREEN: Make It Pass
- Write the minimum code to make test pass
- Don't worry about perfection yet
- Focus on making test green

```typescript
// Minimal implementation to make test pass
class TodoService {
  async create(data: { title: string }) {
    return {
      id: '1',
      title: data.title,
      completed: false,
    };
  }
}
// Test now passes!
```

##### 3. REFACTOR: Improve the Code
- Clean up implementation
- Remove duplication
- Improve design
- Tests must stay green

```typescript
// Refactored with better structure
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

class TodoService {
  private generateId(): string {
    return crypto.randomUUID();
  }
  
  async create(data: { title: string }): Promise<Todo> {
    return {
      id: this.generateId(),
      title: data.title,
      completed: false,
    };
  }
}
```

##### 4. REPEAT: Continue the Cycle
- Add next test case
- Follow RED-GREEN-REFACTOR again
- Build up functionality incrementally

```typescript
// Next test: validation
test('should throw error if title is empty', async () => {
  const todoService = new TodoService();
  await expect(
    todoService.create({ title: '' })
  ).rejects.toThrow('Title cannot be empty');
});

// Make it pass
class TodoService {
  async create(data: { title: string }): Promise<Todo> {
    if (!data.title.trim()) {
      throw new Error('Title cannot be empty');
    }
    // ... rest of implementation
  }
}
```

### TDD Best Practices

#### Write Good Tests
- **One assertion per test** (when practical)
- **Clear test names** that describe behavior
- **Independent tests** that don't depend on each other
- **Fast tests** that run quickly
- **Deterministic tests** with consistent results

#### AAA Pattern: Arrange-Act-Assert
```typescript
test('should mark todo as completed', async () => {
  // Arrange: Set up test data
  const todo = await createTestTodo({ title: 'Test', completed: false });
  
  // Act: Perform the action
  const updated = await completeTodo(todo.id);
  
  // Assert: Verify the result
  expect(updated.completed).toBe(true);
});
```

#### Test Behavior, Not Implementation
```typescript
// ✅ Good: Tests behavior
test('should show error message when login fails', async () => {
  renderLoginForm();
  
  await userEvent.type(screen.getByLabelText('Email'), 'invalid@email.com');
  await userEvent.click(screen.getByRole('button', { name: 'Login' }));
  
  expect(screen.getByRole('alert')).toHaveTextContent('Login failed');
});

// ❌ Bad: Tests implementation details
test('should call setError with "Login failed"', async () => {
  const setError = jest.fn();
  // Testing implementation details makes tests brittle
});
```

## Testing Pyramid

```
        /\
       /  \        E2E Tests (Few)
      /    \       - Full user workflows
     /------\      - Integration of all systems
    /        \     
   /          \    Integration Tests (Some)
  /            \   - Component integration
 /              \  - API integration
/----------------\ 
|                | Unit Tests (Many)
|                | - Functions, components
|                | - Business logic
|________________|
```

### Test Distribution
- **70% Unit Tests**: Fast, focused, isolated
- **20% Integration Tests**: Test component interaction
- **10% E2E Tests**: Test complete user workflows

## Unit Testing

### What to Unit Test
- Pure functions
- Component logic
- Custom hooks
- Utility functions
- Business logic
- Validation functions

### Component Testing with React Testing Library

#### Setup
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConvexProvider } from 'convex/react';
import { TodoList } from './TodoList';

// Helper to render with providers
function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ConvexProvider client={mockConvexClient}>
      {ui}
    </ConvexProvider>
  );
}
```

#### Component Test Examples

```typescript
describe('TodoList', () => {
  test('should render list of todos', () => {
    const todos = [
      { _id: '1', title: 'Todo 1', completed: false },
      { _id: '2', title: 'Todo 2', completed: true },
    ];
    
    renderWithProviders(<TodoList todos={todos} />);
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });
  
  test('should show empty state when no todos', () => {
    renderWithProviders(<TodoList todos={[]} />);
    
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });
  
  test('should call onDelete when delete button clicked', async () => {
    const onDelete = jest.fn();
    const todos = [{ _id: '1', title: 'Todo 1', completed: false }];
    
    renderWithProviders(<TodoList todos={todos} onDelete={onDelete} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledWith('1');
  });
  
  test('should filter completed todos', () => {
    const todos = [
      { _id: '1', title: 'Todo 1', completed: false },
      { _id: '2', title: 'Todo 2', completed: true },
    ];
    
    renderWithProviders(<TodoList todos={todos} filter="completed" />);
    
    expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });
});
```

### Custom Hook Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useTodoOperations } from './useTodoOperations';

describe('useTodoOperations', () => {
  test('should create todo', async () => {
    const { result } = renderHook(() => useTodoOperations());
    
    await waitFor(async () => {
      const todo = await result.current.create('New Todo');
      expect(todo.title).toBe('New Todo');
    });
  });
  
  test('should throw error for empty title', async () => {
    const { result } = renderHook(() => useTodoOperations());
    
    await expect(result.current.create('')).rejects.toThrow('Title cannot be empty');
  });
});
```

### Testing Utilities and Pure Functions

```typescript
describe('formatDate', () => {
  test('should format date as MM/DD/YYYY', () => {
    const date = new Date('2024-03-15T10:30:00Z');
    expect(formatDate(date)).toBe('03/15/2024');
  });
  
  test('should handle invalid dates', () => {
    expect(formatDate(null)).toBe('Invalid Date');
  });
});

describe('validateTodoInput', () => {
  test('should return true for valid input', () => {
    expect(validateTodoInput('Valid title')).toBe(true);
  });
  
  test('should return false for empty string', () => {
    expect(validateTodoInput('')).toBe(false);
  });
  
  test('should return false for whitespace only', () => {
    expect(validateTodoInput('   ')).toBe(false);
  });
  
  test('should return false for title exceeding 500 chars', () => {
    const longTitle = 'a'.repeat(501);
    expect(validateTodoInput(longTitle)).toBe(false);
  });
});
```

## Integration Testing

### What to Integration Test
- Component interaction
- Data flow between components
- Convex query/mutation integration
- Authentication flows
- Form submissions with backend

### Convex Function Testing

```typescript
import { convexTest } from 'convex-test';
import { api } from './_generated/api';
import schema from './schema';

describe('Todo Mutations', () => {
  test('should create todo for authenticated user', async () => {
    const t = convexTest(schema);
    
    // Mock authentication
    const userId = 'user123';
    t.auth.setIdentity({ subject: userId });
    
    const todoId = await t.mutation(api.todos.create, {
      title: 'Test Todo',
    });
    
    const todo = await t.query(api.todos.get, { id: todoId });
    
    expect(todo).toMatchObject({
      title: 'Test Todo',
      completed: false,
      userId,
    });
  });
  
  test('should not create todo for unauthenticated user', async () => {
    const t = convexTest(schema);
    
    // No authentication set
    
    await expect(
      t.mutation(api.todos.create, { title: 'Test Todo' })
    ).rejects.toThrow('Unauthorized');
  });
  
  test('should not allow user to update other user\'s todos', async () => {
    const t = convexTest(schema);
    
    // Create todo as user1
    t.auth.setIdentity({ subject: 'user1' });
    const todoId = await t.mutation(api.todos.create, { title: 'User 1 Todo' });
    
    // Try to update as user2
    t.auth.setIdentity({ subject: 'user2' });
    
    await expect(
      t.mutation(api.todos.update, { id: todoId, title: 'Hacked!' })
    ).rejects.toThrow('Forbidden');
  });
});
```

### Full Feature Integration Tests

```typescript
describe('Todo Creation Flow', () => {
  test('should create todo and display it in list', async () => {
    const user = await loginTestUser();
    
    renderWithAuth(<TodoApp />);
    
    // Wait for todos to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Create new todo
    const input = screen.getByPlaceholderText('Add a todo...');
    await userEvent.type(input, 'Buy groceries');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    
    // Verify todo appears in list
    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });
    
    // Verify todo is not completed
    const checkbox = screen.getByRole('checkbox', { name: /buy groceries/i });
    expect(checkbox).not.toBeChecked();
  });
});
```

## End-to-End (E2E) Testing

### What to E2E Test
- Critical user journeys
- Authentication flows
- Complex multi-step workflows
- Cross-browser compatibility
- Real backend integration

### E2E with Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('Todo Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });
  
  test('should allow user to create and complete todos', async ({ page }) => {
    // Login
    await page.click('text=Login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Create todo
    await page.fill('[placeholder="Add a todo..."]', 'Buy milk');
    await page.click('text=Add');
    
    // Verify todo appears
    await expect(page.locator('text=Buy milk')).toBeVisible();
    
    // Complete todo
    await page.click('[aria-label="Mark as complete"]');
    
    // Verify completed state
    await expect(page.locator('text=Buy milk')).toHaveClass(/completed/);
  });
  
  test('should persist todos after page reload', async ({ page }) => {
    // Login and create todo
    await loginAndCreateTodo(page, 'Persistent todo');
    
    // Reload page
    await page.reload();
    
    // Verify todo still exists
    await expect(page.locator('text=Persistent todo')).toBeVisible();
  });
  
  test('should show error for invalid input', async ({ page }) => {
    await loginUser(page);
    
    // Try to create empty todo
    await page.click('text=Add');
    
    // Verify error message
    await expect(page.locator('[role="alert"]')).toContainText('Title is required');
  });
});
```

## Test Organization

### File Structure
```
src/
├── components/
│   ├── TodoList.tsx
│   ├── TodoList.test.tsx       # Component tests
│   ├── TodoItem.tsx
│   └── TodoItem.test.tsx
├── hooks/
│   ├── useTodos.ts
│   └── useTodos.test.ts        # Hook tests
├── lib/
│   ├── utils.ts
│   └── utils.test.ts           # Utility tests
└── convex/
    ├── todos.ts
    └── todos.test.ts           # Convex function tests

e2e/
├── auth.spec.ts                # E2E auth tests
├── todos.spec.ts               # E2E todo tests
└── helpers/                    # E2E test helpers
```

### Test Naming Conventions

#### File Names
- Unit/Integration: `ComponentName.test.tsx`
- E2E: `feature-name.spec.ts`

#### Test Descriptions
```typescript
// ✅ Good: Descriptive test names
describe('TodoList', () => {
  test('should display all todos passed as props', () => {});
  test('should call onDelete when delete button is clicked', () => {});
  test('should show empty state when no todos exist', () => {});
});

// ❌ Bad: Vague test names
describe('TodoList', () => {
  test('it works', () => {});
  test('test 1', () => {});
  test('check todos', () => {});
});
```

## Mocking Strategies

### When to Mock
- External APIs
- Database calls in unit tests
- Third-party services
- Time-dependent functions
- Random number generation

### Convex Mocking

```typescript
import { vi } from 'vitest';

// Mock useQuery
vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

// In tests
import { useQuery } from 'convex/react';

test('should display todos from query', () => {
  const mockTodos = [
    { _id: '1', title: 'Todo 1', completed: false },
  ];
  
  (useQuery as jest.Mock).mockReturnValue(mockTodos);
  
  render(<TodoList />);
  
  expect(screen.getByText('Todo 1')).toBeInTheDocument();
});
```

### Time Mocking

```typescript
import { vi } from 'vitest';

test('should format date correctly', () => {
  const fixedDate = new Date('2024-03-15T10:00:00Z');
  vi.setSystemTime(fixedDate);
  
  const result = formatRelativeTime();
  
  expect(result).toBe('March 15, 2024');
  
  vi.useRealTimers();
});
```

### API Mocking

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/todos', (req, res, ctx) => {
    return res(ctx.json([
      { id: '1', title: 'Todo 1', completed: false },
    ]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Testing Best Practices

### Do's ✅
- **Write tests first** (TDD)
- **Test behavior**, not implementation
- **Keep tests simple** and focused
- **Use descriptive test names**
- **Arrange-Act-Assert** pattern
- **Independent tests** (no test interdependence)
- **Fast tests** (< 1s per test)
- **Clean up after tests**
- **Use test factories** for data generation
- **Test error cases** thoroughly

### Don'ts ❌
- **Don't skip failing tests** - fix them!
- **Don't test implementation details**
- **Don't write tests after code** (defeats TDD purpose)
- **Don't share state between tests**
- **Don't use real database in unit tests**
- **Don't commit with failing tests**
- **Don't ignore flaky tests** - fix them!
- **Don't test third-party libraries**
- **Don't duplicate test logic**
- **Don't hide errors** in tests

## Test Coverage

### Coverage Goals
- **Overall**: >80%
- **Critical paths**: 100%
- **Business logic**: >90%
- **UI components**: >70%
- **Utilities**: 100%

### Running Coverage

```bash
# Run tests with coverage
npm test -- --coverage

# Generate coverage report
npm test -- --coverage --coverageReporters=html

# View coverage
open coverage/index.html
```

### Coverage Configuration

```javascript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
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
});
```

## Continuous Integration

### CI Pipeline Tests

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run type check
        run: npx tsc --noEmit
        
      - name: Run unit tests
        run: npm test
        
      - name: Run coverage
        run: npm test -- --coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Test Data Management

### Test Factories

```typescript
// testFactories.ts
import { faker } from '@faker-js/faker';

export function createTestTodo(overrides?: Partial<Todo>): Todo {
  return {
    _id: faker.string.uuid(),
    _creationTime: Date.now(),
    title: faker.lorem.sentence(),
    completed: false,
    userId: faker.string.uuid(),
    ...overrides,
  };
}

export function createTestUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    ...overrides,
  };
}

// Usage in tests
test('should display todo', () => {
  const todo = createTestTodo({ title: 'Specific title' });
  render(<TodoItem todo={todo} />);
  expect(screen.getByText('Specific title')).toBeInTheDocument();
});
```

### Test Fixtures

```typescript
// fixtures/todos.ts
export const todoFixtures = {
  completed: [
    { _id: '1', title: 'Completed 1', completed: true, userId: 'user1' },
    { _id: '2', title: 'Completed 2', completed: true, userId: 'user1' },
  ],
  active: [
    { _id: '3', title: 'Active 1', completed: false, userId: 'user1' },
    { _id: '4', title: 'Active 2', completed: false, userId: 'user1' },
  ],
};
```

## Debugging Tests

### Common Issues and Solutions

#### Tests Timing Out
```typescript
// Increase timeout for slow tests
test('slow operation', async () => {
  // ...
}, 10000); // 10 second timeout
```

#### Async Issues
```typescript
// Always use await and waitFor
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

#### Act Warnings
```typescript
// Wrap state updates in act
await act(async () => {
  await updateSomething();
});
```

### Test Debugging Tools

```typescript
// Log component output
import { screen, debug } from '@testing-library/react';

test('debug test', () => {
  render(<Component />);
  screen.debug(); // Prints DOM to console
});

// Check what queries are available
screen.logTestingPlaygroundURL();
```

## Performance Testing

### Monitor Test Performance
```bash
# Run tests with timing
npm test -- --verbose

# Profile slow tests
npm test -- --detectLeaks
```

### Optimize Slow Tests
- Mock expensive operations
- Use test.concurrent for independent tests
- Minimize test setup/teardown
- Use beforeAll for shared setup

## Testing Checklist

Before considering any task complete:

- [ ] All tests passing
- [ ] New features have tests
- [ ] Tests follow TDD approach
- [ ] Coverage meets threshold (>80%)
- [ ] No skipped/disabled tests
- [ ] No flaky tests
- [ ] Tests run in CI
- [ ] Integration tests for critical paths
- [ ] Error cases tested
- [ ] Edge cases covered
- [ ] Tests well-organized and named
- [ ] No console errors in test output

## Resources

- [React Testing Library](https://testing-library.com/react)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Convex Testing Guide](https://docs.convex.dev/testing)

---

**Remember**: Tests are your safety net. Invest time in writing good tests, and they'll save you countless hours of debugging and give you confidence to refactor and improve your code.

