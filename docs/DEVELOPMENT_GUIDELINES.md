# Development Guidelines

## Overview
This document provides comprehensive guidelines for developing the TodoApp with Cursor AI. Follow these principles to ensure code quality, maintainability, and security.

## Tech Stack
- **Frontend**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2.4
- **Backend**: Convex BaaS (Backend as a Service)
- **Styling**: Tailwind CSS with Shadcn UI components
- **Authentication**: Microsoft Entra ID
- **State Management**: React hooks + Convex reactive queries
- **Testing**: TDD approach with comprehensive unit tests

## Core Development Principles

### 1. SOLID Principles

#### Single Responsibility Principle (SRP)
- Each component, function, and module should have one clear responsibility
- Break down large components into smaller, focused ones
- Example:
  ```typescript
  // ❌ Bad: Component doing too much
  function TodoList() {
    // handles fetching, rendering, filtering, sorting, editing...
  }
  
  // ✅ Good: Separated concerns
  function TodoList() {
    return <TodoListPresenter todos={todos} />
  }
  function TodoListPresenter({ todos }) { /* rendering only */ }
  function useTodos() { /* data fetching only */ }
  ```

#### Open/Closed Principle (OCP)
- Components should be open for extension but closed for modification
- Use composition patterns and prop injection
- Example:
  ```typescript
  // ✅ Good: Extensible through props
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    children: React.ReactNode;
  }
  ```

#### Liskov Substitution Principle (LSP)
- Subtypes must be substitutable for their base types
- Maintain consistent interfaces and contracts
- Example:
  ```typescript
  // ✅ Good: All button variants work the same way
  <PrimaryButton onClick={handleClick}>Save</PrimaryButton>
  <SecondaryButton onClick={handleClick}>Cancel</SecondaryButton>
  ```

#### Interface Segregation Principle (ISP)
- Don't force components to depend on props they don't use
- Create focused, minimal interfaces
- Example:
  ```typescript
  // ❌ Bad: Too many optional props
  interface TodoItemProps {
    id: string;
    title: string;
    isEditMode?: boolean;
    isDeleteMode?: boolean;
    canShare?: boolean;
    canArchive?: boolean;
    // ... many more optional props
  }
  
  // ✅ Good: Focused interfaces
  interface TodoItemProps {
    todo: Todo;
    actions: TodoActions;
  }
  ```

#### Dependency Inversion Principle (DIP)
- Depend on abstractions, not concrete implementations
- Use dependency injection for flexibility
- Example:
  ```typescript
  // ✅ Good: Injected dependencies
  interface TodoService {
    create(todo: NewTodo): Promise<Todo>;
    update(id: string, todo: Partial<Todo>): Promise<Todo>;
  }
  
  function useTodoOperations(service: TodoService) {
    // Uses the abstract interface
  }
  ```

### 2. DRY (Don't Repeat Yourself)
- Extract reusable logic into custom hooks
- Create shared components for repeated UI patterns
- Use utility functions for common operations
- Example:
  ```typescript
  // ✅ Good: Reusable custom hook
  function useFormValidation<T>(
    initialValues: T,
    validationRules: ValidationRules<T>
  ) {
    // Validation logic used across all forms
  }
  ```

### 3. Additional Best Practices

#### KISS (Keep It Simple, Stupid)
- Prefer simple, straightforward solutions
- Avoid over-engineering
- Write code that's easy to understand

#### YAGNI (You Aren't Gonna Need It)
- Don't add functionality until it's needed
- Avoid premature optimization
- Build what's required now, not what might be needed later

#### Composition Over Inheritance
- Prefer composition patterns in React
- Use hooks for behavior sharing
- Example:
  ```typescript
  // ✅ Good: Composition with hooks
  function TodoItem() {
    const { edit, save } = useEditableTodo();
    const { delete } = useTodoActions();
    return <div>...</div>
  }
  ```

## Code Organization

### Project Structure
```
TodoApp/
├── convex/              # Convex backend functions
│   ├── auth/           # Authentication logic
│   ├── todos/          # Todo CRUD operations
│   └── schema.ts       # Database schema
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # Shadcn UI components
│   │   ├── todo/      # Todo-specific components
│   │   └── layout/    # Layout components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── types/         # TypeScript type definitions
│   ├── styles/        # Global styles and themes
│   └── tests/         # Test files (co-located with components)
├── docs/              # Documentation
└── e2e/               # End-to-end tests
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `TodoList.tsx`, `Button.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useTodos.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `Todo.types.ts`)
- **Tests**: Match the file being tested with `.test.tsx` suffix

## Styling Guidelines

### Theme-Based Styling with Shadcn
- **NEVER** use inline styles
- **ALWAYS** use Shadcn components as the base
- **ALWAYS** apply styling through themes and CSS classes
- Use Tailwind utility classes within component files
- Customize themes in `src/styles/theme.css`

```typescript
// ❌ Bad: Inline styles
<div style={{ backgroundColor: 'blue', padding: '10px' }}>

// ✅ Good: Theme-based classes
<div className="bg-primary p-4">

// ✅ Better: Shadcn component with theme
<Card className="bg-card">
  <CardContent>
</Card>
```

### Component Styling Pattern
```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TodoItemProps {
  todo: Todo;
  className?: string;
}

export function TodoItem({ todo, className }: TodoItemProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4", className)}>
      <Button variant="default" size="sm">
        Edit
      </Button>
    </div>
  );
}
```

## TypeScript Best Practices

### Type Safety
- Use strict TypeScript configuration
- Avoid `any` types
- Define explicit interfaces and types
- Use discriminated unions for state management

```typescript
// ✅ Good: Explicit types
interface Todo {
  _id: string;
  _creationTime: number;
  title: string;
  completed: boolean;
  userId: string;
}

// ✅ Good: Discriminated union for states
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

### Type Organization
- Keep types close to where they're used
- Create shared types in `src/types/`
- Export types from component files when needed by others
- Use type aliases for complex types

## Error Handling

### Principles
- Never hide or mask errors
- Provide meaningful error messages
- Log errors appropriately
- Show user-friendly error UI

```typescript
// ✅ Good: Proper error handling
try {
  const result = await todoMutation({ title });
  return result;
} catch (error) {
  console.error('Failed to create todo:', error);
  toast.error('Unable to create todo. Please try again.');
  throw error; // Re-throw for upstream handling
}
```

### Error Boundaries
- Implement error boundaries for component trees
- Provide fallback UI for errors
- Log errors to monitoring service

## Component Patterns

### Presentational vs Container Components
```typescript
// Container: Handles data and logic
function TodoListContainer() {
  const todos = useQuery(api.todos.list);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  
  return <TodoListPresenter todos={todos} onDelete={deleteTodo} />;
}

// Presentational: Pure rendering
interface TodoListPresenterProps {
  todos: Todo[];
  onDelete: (id: string) => void;
}

function TodoListPresenter({ todos, onDelete }: TodoListPresenterProps) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo._id} todo={todo} onDelete={onDelete} />
      ))}
    </ul>
  );
}
```

### Custom Hooks Pattern
```typescript
// ✅ Good: Reusable hook with clear interface
function useTodoOperations() {
  const createTodo = useMutation(api.todos.create);
  const updateTodo = useMutation(api.todos.update);
  const deleteTodo = useMutation(api.todos.delete);
  
  const handleCreate = useCallback(async (title: string) => {
    try {
      await createTodo({ title });
      toast.success('Todo created');
    } catch (error) {
      toast.error('Failed to create todo');
      throw error;
    }
  }, [createTodo]);
  
  return {
    create: handleCreate,
    update: updateTodo,
    delete: deleteTodo,
  };
}
```

## Convex Backend Patterns

### Query Design
```typescript
// ✅ Good: Focused query with clear purpose
export const list = query({
  args: {
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    let todos = ctx.db
      .query('todos')
      .withIndex('by_user', q => q.eq('userId', identity.subject));
    
    if (args.completed !== undefined) {
      todos = todos.filter(q => q.eq('completed', args.completed));
    }
    
    return await todos.collect();
  },
});
```

### Mutation Design
```typescript
// ✅ Good: Mutation with validation and error handling
export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: Must be logged in');
    }
    
    if (!args.title.trim()) {
      throw new Error('Validation Error: Title cannot be empty');
    }
    
    const todoId = await ctx.db.insert('todos', {
      title: args.title.trim(),
      completed: false,
      userId: identity.subject,
    });
    
    return todoId;
  },
});
```

## Performance Considerations

### React Optimization
- Use `React.memo` for expensive pure components
- Use `useMemo` for expensive computations
- Use `useCallback` for stable function references
- Avoid unnecessary re-renders

### Convex Optimization
- Design efficient indexes for queries
- Use pagination for large lists
- Avoid over-fetching data
- Leverage reactive subscriptions

## Accessibility (a11y)

- Use semantic HTML elements
- Provide ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast
- Use Shadcn accessible components as base

```typescript
// ✅ Good: Accessible component
<Button
  aria-label="Delete todo item"
  onClick={handleDelete}
  disabled={isDeleting}
>
  <TrashIcon aria-hidden="true" />
</Button>
```

## Documentation Requirements

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props with TypeScript interfaces
- Add inline comments for non-obvious logic
- Keep comments up-to-date

```typescript
/**
 * Custom hook for managing todo operations with optimistic updates
 * @returns Object containing create, update, and delete operations
 * @throws {Error} When user is not authenticated
 */
function useTodoOperations() {
  // ...
}
```

### Component Documentation
```typescript
/**
 * TodoItem component displays a single todo item with edit and delete actions
 * 
 * @param todo - The todo object to display
 * @param onEdit - Callback when edit is clicked
 * @param onDelete - Callback when delete is clicked
 * @param className - Optional additional CSS classes
 * 
 * @example
 * ```tsx
 * <TodoItem
 *   todo={myTodo}
 *   onEdit={(id) => navigate(`/edit/${id}`)}
 *   onDelete={deleteTodo}
 * />
 * ```
 */
```

## Git Workflow

### Branch Strategy

The project uses a two-branch deployment strategy:

#### Main Branches

1. **`main` branch** - Development Environment
   - For active development
   - Auto-deploys to dev environment on push
   - Cloudflare (dev) + Convex (dev)
   - Less strict review (1 approval)
   - Can contain experimental features
   - Fast iteration

2. **`prod` branch** - Production Environment
   - For stable, production-ready code
   - Auto-deploys to production on push
   - Cloudflare (prod) + Convex (prod)
   - Strict review (2+ approvals)
   - Only tested features
   - Security and performance verified

#### Feature Branches

Create feature branches from `main`:

```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/my-feature

# Develop with TDD
# ... write tests, implement, refactor ...

# Push and create PR to main
git push origin feature/my-feature
```

### Development Workflow

```
1. Create feature branch from main
   └─> git checkout -b feature/my-feature

2. Develop with TDD
   ├─> Write tests first (RED)
   ├─> Implement code (GREEN)
   └─> Refactor (REFACTOR)

3. Run quality checks
   ├─> npm test
   ├─> npm run lint
   ├─> npm run build
   └─> npx tsc --noEmit

4. Commit with conventional commit message
   └─> git commit -m "feat(todos): add filter by priority"

5. Push and create PR to main
   └─> Create PR with description

6. Code review (1+ approval)
   └─> Address review comments

7. Merge to main (squash and merge)
   └─> GitHub Actions auto-deploys to dev

8. Verify in dev environment
   └─> Test at dev URL
```

### Production Promotion Workflow

```
1. Test thoroughly in dev environment
   └─> Verify all features work

2. Create PR from main to prod
   ├─> Detailed release notes
   ├─> List all changes
   ├─> Document breaking changes
   └─> Include migration guide if needed

3. Extended review process
   ├─> 2+ approvals required
   ├─> Security review
   ├─> Performance check
   └─> Regression testing

4. Merge to prod (merge commit)
   └─> Preserves history

5. Automatic production deployment
   └─> GitHub Actions deploys to prod

6. Post-deployment monitoring
   ├─> Smoke tests
   ├─> Monitor logs
   ├─> Check error rates
   └─> Verify critical paths

7. Rollback if needed
   └─> Revert merge commit
```

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples**:

```bash
# Feature
feat(todos): add filter by priority

Add priority field to todos with filtering functionality.
Includes tests and documentation.

Closes #123

# Bug fix
fix(auth): resolve token refresh issue

Fixed race condition in token refresh that caused
authentication failures.

Fixes #456

# Breaking change
feat(api)!: change todo API response format

BREAKING CHANGE: Todo API now returns nested user object
instead of userId string.

Migration guide in docs/migrations/v2.md
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates
- `perf/description` - Performance improvements
- `test/description` - Test improvements

**Examples**:
- `feature/add-todo-categories`
- `fix/auth-token-refresh`
- `refactor/extract-todo-hooks`
- `docs/update-deployment-guide`

### Branch Protection Rules

#### Main Branch
- Require PR before merging
- Require 1 approval
- Require status checks to pass:
  - All tests pass
  - TypeScript compiles
  - ESLint passes
- Require branches to be up to date

#### Prod Branch
- Require PR before merging
- Require 2 approvals
- Require all status checks to pass
- Require linear history
- Lock branch (admins only can push)

### Deployment Schedule

**Development (main)**: Anytime during work hours
- Continuous deployment
- No restrictions

**Production (prod)**: Scheduled windows
- **Preferred**: Tuesday-Thursday, 10 AM - 2 PM
- **Avoid**: Mondays (week start), Fridays (weekend risk)
- **Emergency**: Anytime with proper approval

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for comprehensive deployment procedures.

## Security Considerations

See [SECURITY_GUIDELINES.md](./SECURITY_GUIDELINES.md) for detailed security practices.

## Testing Strategy

See [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) for comprehensive testing guidelines.

## References

- [React Best Practices](https://react.dev/)
- [Convex Documentation](https://docs.convex.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

