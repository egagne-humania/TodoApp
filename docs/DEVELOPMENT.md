# Development Guide

## Overview

This guide covers all development practices for TodoApp: coding standards, testing strategy, security requirements, and quality checklist.

## Tech Stack

- **Frontend**: React 19.2 + TypeScript 5.9 + Vite 7.2.4
- **Backend**: Convex BaaS
- **Styling**: **Tailwind CSS v4.1.18** + Shadcn UI
  - ⚠️ **IMPORTANT**: Uses Tailwind v4 (NOT v3) - completely different syntax
  - Always check Context7 for v4-specific syntax before writing CSS
- **Auth**: Microsoft Entra ID
- **Testing**: Vitest + React Testing Library + Playwright

### Version-Specific Warnings

**Tailwind CSS v4** has breaking changes from v3:
- ❌ v3: `@tailwind base;` → ✅ v4: `@import "tailwindcss";`
- ❌ v3: `@layer base` → ✅ v4: `@theme`
- ❌ v3: HSL colors → ✅ v4: OKLCH colors
- ❌ v3: `--primary` → ✅ v4: `--color-primary`
- ❌ v3: Complex config → ✅ v4: Minimal config

**Always use Context7 MCP to verify syntax for installed versions!**

## Core Principles

### SOLID Principles

**S - Single Responsibility**: One component, one purpose.
```typescript
// ✅ Good: Focused responsibility
function TodoList() { return <TodoListPresenter todos={todos} /> }
function useTodos() { /* data fetching only */ }
```

**O - Open/Closed**: Open for extension, closed for modification.
```typescript
// ✅ Good: Extensible through props
<Button variant="primary" | "secondary" | "danger" size="sm" | "md" | "lg" />
```

**L - Liskov Substitution**: Subtypes must be substitutable.

**I - Interface Segregation**: No unnecessary dependencies.
```typescript
// ✅ Good: Focused interface
interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
}
```

**D - Dependency Inversion**: Depend on abstractions.

### DRY (Don't Repeat Yourself)

Extract reusable logic:
```typescript
// ✅ Good: Reusable hook
function useFormValidation<T>(rules: ValidationRules<T>) {
  // Shared validation logic
}
```

## Styling Rules

### Critical: Tailwind CSS v4 Only

**BEFORE writing any CSS:**
1. ✅ **Use Context7 MCP** to verify Tailwind v4 syntax
2. ✅ Check `package.json` for version (`tailwindcss": "^4.1.18"`)
3. ✅ Review existing `src/index.css` for patterns

**Tailwind v4 Syntax (in `index.css`)**:
```css
/* ✅ v4 - CORRECT */
@import "tailwindcss";

@theme {
  --color-primary: oklch(62% 0.25 250);
  --color-background: oklch(100% 0 0);
}

/* ❌ v3 - WRONG (don't use!) */
@tailwind base;
@layer base {
  :root {
    --primary: 240 5.9% 10%;
  }
}
```

**Component Usage**:
```typescript
// ✅ Good - Use Tailwind utilities with theme colors
<Card className="bg-card text-foreground p-4">
  <CardContent>

// ❌ Bad - Inline styles
<div style={{ backgroundColor: 'blue', padding: '10px' }}>

// ❌ Bad - Custom CSS classes without Tailwind
<div className="my-custom-blue-box">
```

**Theme-Based Only**:
- **NEVER** use inline styles (`style={{...}}`)
- **ALWAYS** use Shadcn components
- **ALWAYS** use Tailwind utility classes
- **ALWAYS** use theme variables (`var(--color-primary)`)

### Responsive Design

Use Tailwind breakpoints:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Debugging Styling Issues

If styles aren't appearing:
1. Check dev server logs for CSS compilation errors
2. Verify Tailwind version matches syntax (v4 != v3)
3. Use Browser MCP to visually inspect rendered CSS
4. Check that `index.css` is imported in `main.tsx`

## TypeScript Standards

### Strict Mode

- No `any` types
- Explicit function types
- Explicit return types

```typescript
// ✅ Good
interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

function createTodo(title: string): Promise<Todo> {
  // ...
}

// ❌ Bad
function createTodo(title: any): any {
  // ...
}
```

## Test-Driven Development (TDD)

### Red-Green-Refactor Cycle

1. **RED**: Write a failing test
2. **GREEN**: Write minimal code to pass
3. **REFACTOR**: Improve code while tests stay green

### Example TDD Workflow

```typescript
// 1. RED: Write failing test
test('should create todo with title', async () => {
  const todo = await createTodo({ title: 'Buy milk' });
  expect(todo.title).toBe('Buy milk');
  expect(todo.completed).toBe(false);
});

// 2. GREEN: Minimal implementation
async function createTodo(data: { title: string }) {
  return {
    id: '1',
    title: data.title,
    completed: false,
  };
}

// 3. REFACTOR: Improve code
class TodoService {
  async create(data: { title: string }): Promise<Todo> {
    if (!data.title.trim()) throw new Error('Title required');
    return {
      id: generateId(),
      title: data.title.trim(),
      completed: false,
    };
  }
}
```

### Testing Best Practices

**AAA Pattern**: Arrange-Act-Assert
```typescript
test('should mark todo as completed', async () => {
  // Arrange
  const todo = await createTodo({ title: 'Test' });
  
  // Act
  const updated = await completeTodo(todo.id);
  
  // Assert
  expect(updated.completed).toBe(true);
});
```

**Test Behavior, Not Implementation**
```typescript
// ✅ Good: Tests behavior
test('should show error when login fails', async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Login' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Login failed');
});

// ❌ Bad: Tests implementation
test('should call setError', () => {
  const setError = jest.fn();
  // ...
});
```

### Coverage Goals

- **Overall**: >80%
- **Critical paths**: 100%
- **Business logic**: >90%

## Security Requirements

### Authentication & Authorization

**Always check authentication in Convex**:
```typescript
export const listTodos = query({
  handler: async (ctx) => {
    // REQUIRED: Check authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    // Query with user isolation
    return await ctx.db
      .query('todos')
      .withIndex('by_user', q => q.eq('userId', identity.subject))
      .collect();
  },
});
```

**Always verify ownership**:
```typescript
export const updateTodo = mutation({
  args: { id: v.id('todos'), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new Error('Not found');
    
    // REQUIRED: Verify ownership
    if (todo.userId !== identity.subject) {
      throw new Error('Forbidden');
    }
    
    await ctx.db.patch(args.id, { title: args.title });
  },
});
```

### Input Validation

**Backend validation (required)**:
```typescript
export const createTodo = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    // REQUIRED: Validate input
    if (!args.title.trim()) throw new Error('Title required');
    if (args.title.length > 500) throw new Error('Title too long');
    
    return await ctx.db.insert('todos', {
      title: args.title.trim(),
      userId: identity.subject,
      completed: false,
    });
  },
});
```

**Frontend validation (UX only)**:
```typescript
function TodoForm() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  
  const validate = (value: string) => {
    if (!value.trim()) return 'Title required';
    if (value.length > 500) return 'Title too long';
    return '';
  };
  
  // Validation for UX, backend still validates
}
```

### XSS Prevention

React escapes automatically:
```typescript
// ✅ Good: Automatic escaping
<div>{todo.title}</div>

// ❌ Bad: Never use dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### Secrets Management

```bash
# ✅ Good: Environment variables
VITE_CONVEX_URL=your-convex-url
VITE_AZURE_CLIENT_ID=your-client-id

# ❌ Never commit secrets
# .env.local is gitignored
```

### Error Handling

**Generic user messages, detailed logging**:
```typescript
try {
  await updateTodo({ id, title });
} catch (error) {
  // Detailed logging (server-side only)
  console.error('Update failed:', { id, error: error.message });
  
  // Generic user message
  if (error.message === 'Unauthorized') {
    toast.error('Please log in');
  } else {
    toast.error('Failed to update todo');
  }
  
  throw error; // Don't swallow errors
}
```

## Code Quality Checklist

### Before Committing

Run these commands:
```bash
npm test                # All tests pass
npm run lint            # No linter errors
npm run build           # Build succeeds
npx tsc --noEmit        # No TypeScript errors
```

### Component Quality

- [ ] Single responsibility
- [ ] Props properly typed
- [ ] No inline styles
- [ ] Shadcn components used
- [ ] Accessible (ARIA labels)
- [ ] Error handling present

### Backend Quality

- [ ] Authentication checked
- [ ] Authorization verified
- [ ] Input validated
- [ ] Errors handled properly
- [ ] No sensitive data logged

### Testing Quality

- [ ] Tests written first (TDD)
- [ ] All tests passing
- [ ] Coverage >80%
- [ ] Edge cases covered
- [ ] No skipped tests

## Component Patterns

### Container/Presentational

```typescript
// Container: Data + Logic
function TodoListContainer() {
  const todos = useQuery(api.todos.list);
  const deleteTodo = useMutation(api.todos.delete);
  
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteTodo({ id });
      toast.success('Deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  }, [deleteTodo]);
  
  if (!todos) return <Skeleton />;
  
  return <TodoListPresenter todos={todos} onDelete={handleDelete} />;
}

// Presenter: Pure UI
interface TodoListPresenterProps {
  todos: Todo[];
  onDelete: (id: string) => void;
}

function TodoListPresenter({ todos, onDelete }: TodoListPresenterProps) {
  return (
    <Card>
      {todos.map(todo => (
        <TodoItem key={todo._id} todo={todo} onDelete={onDelete} />
      ))}
    </Card>
  );
}
```

### Custom Hooks

```typescript
function useTodoOperations() {
  const create = useMutation(api.todos.create);
  
  const handleCreate = useCallback(async (title: string) => {
    if (!title.trim()) throw new Error('Title required');
    
    try {
      const id = await create({ title: title.trim() });
      toast.success('Todo created');
      return id;
    } catch (error) {
      console.error('Create failed:', error);
      toast.error('Failed to create');
      throw error;
    }
  }, [create]);
  
  return { create: handleCreate };
}
```

## Error Handling

### Principles

- Never hide errors
- Log with context (no PII)
- Show user-friendly messages
- Always re-throw for upstream handling

```typescript
// ✅ Good
try {
  await operation();
} catch (error) {
  console.error('Operation failed:', { context, error: error.message });
  toast.error('User-friendly message');
  throw error; // Re-throw for upstream
}

// ❌ Bad
try {
  await operation();
} catch (error) {
  // Silently swallowed!
}
```

## File Organization

```
src/
├── components/
│   ├── ui/              # Shadcn components
│   ├── todo/            # Todo components
│   │   ├── TodoList.tsx
│   │   ├── TodoList.test.tsx
│   │   ├── TodoItem.tsx
│   │   └── TodoItem.test.tsx
│   └── layout/          # Layout components
├── hooks/
│   ├── useTodos.ts
│   └── useTodos.test.ts
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── types/
    └── todo.types.ts

convex/
├── todos.ts             # Queries & mutations
├── todos.test.ts
├── schema.ts
└── repositories/
    └── todoRepository.ts
```

## Naming Conventions

- **Components**: PascalCase (`TodoList.tsx`)
- **Hooks**: camelCase with `use` prefix (`useTodos.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`Todo.types.ts`)
- **Tests**: `*.test.tsx` or `*.spec.ts`

## Accessibility

- Use semantic HTML
- Provide ARIA labels
- Ensure keyboard navigation
- Maintain color contrast
- Test with screen readers

```typescript
<Button
  aria-label="Delete todo"
  onClick={handleDelete}
>
  <TrashIcon aria-hidden="true" />
</Button>
```

## Performance

```typescript
// Memoize computations
const stats = useMemo(() => ({
  total: todos.length,
  completed: todos.filter(t => t.completed).length,
}), [todos]);

// Memoize components
const TodoItem = memo(function TodoItem({ todo }: Props) {
  return <div>...</div>;
});

// Code splitting
const Dashboard = lazy(() => import('./Dashboard'));
```

## Common Mistakes to Avoid

### ❌ NEVER Do

- Use inline styles
- Skip writing tests first
- Use `any` type
- Skip authentication checks
- Skip input validation
- Hide or mask errors
- Commit with failing tests
- Log sensitive data (PII, passwords)
- Hardcode secrets

### ✅ ALWAYS Do

- Write tests before code (TDD)
- Use theme-based styling
- Check authentication
- Validate all inputs
- Handle errors properly
- Follow SOLID principles
- Run quality checks before commit
- Keep code clean and simple

## Quick Reference

### Essential Commands

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
npm run build           # Build
npx tsc --noEmit        # Type check
```

### Before Committing

```bash
npm test && npm run lint && npm run build && npx tsc --noEmit
```

All must pass before commit.

## Resources

- [React Best Practices](https://react.dev/)
- [Convex Docs](https://docs.convex.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [TDD Guide](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
