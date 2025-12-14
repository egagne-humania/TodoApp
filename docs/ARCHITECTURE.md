# Architecture Guide

## Overview

TodoApp follows a layered architecture with React frontend and Convex backend. This document outlines key patterns and design decisions.

## System Architecture

```
┌─────────────────────────────────────────┐
│          React Frontend                 │
│  ┌────────────────────────────────┐    │
│  │  UI Components (Shadcn)        │    │
│  │  Custom Hooks                  │    │
│  │  State Management              │    │
│  └────────────────────────────────┘    │
└──────────────┬──────────────────────────┘
               │ (Convex Client)
┌──────────────┴──────────────────────────┐
│      Convex Backend (BaaS)              │
│  ┌────────────────────────────────┐    │
│  │  Queries (Read)                │    │
│  │  Mutations (Write)             │    │
│  │  Database                      │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## Key Patterns

### 1. Container/Presentational Pattern

Separate data logic from UI rendering.

```typescript
// Container (Smart Component) - handles data and logic
function TodoListContainer() {
  const todos = useQuery(api.todos.list);
  const deleteTodo = useMutation(api.todos.delete);
  
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteTodo({ id });
      toast.success('Todo deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  }, [deleteTodo]);
  
  if (todos === undefined) return <LoadingSpinner />;
  
  return <TodoListPresenter todos={todos} onDelete={handleDelete} />;
}

// Presentational (Dumb Component) - pure rendering
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

### 2. Custom Hooks

Extract reusable stateful logic.

```typescript
function useTodoOperations() {
  const createTodo = useMutation(api.todos.create);
  
  const create = useCallback(async (title: string) => {
    if (!title.trim()) throw new Error('Title required');
    
    try {
      return await createTodo({ title: title.trim() });
    } catch (error) {
      console.error('Create failed:', error);
      throw error;
    }
  }, [createTodo]);
  
  return { create };
}

// Usage
function TodoForm() {
  const { create } = useTodoOperations();
  // ... use create
}
```

### 3. Repository Pattern (Backend)

Abstract data access logic.

```typescript
// convex/repositories/todoRepository.ts
export class TodoRepository {
  constructor(private ctx: QueryCtx | MutationCtx) {}
  
  async findByUserId(userId: string) {
    return await this.ctx.db
      .query('todos')
      .withIndex('by_user', q => q.eq('userId', userId))
      .collect();
  }
  
  async create(data: { title: string; userId: string }) {
    return await this.ctx.db.insert('todos', {
      title: data.title,
      userId: data.userId,
      completed: false,
    });
  }
}

// Usage in query
export const listTodos = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    const repo = new TodoRepository(ctx);
    return await repo.findByUserId(identity.subject);
  },
});
```

### 4. Service Layer Pattern (Backend)

Encapsulate business logic.

```typescript
// convex/services/todoService.ts
export class TodoService {
  private repo: TodoRepository;
  
  constructor(private ctx: MutationCtx) {
    this.repo = new TodoRepository(ctx);
  }
  
  async createTodo(userId: string, title: string) {
    // Business validation
    if (!title.trim()) throw new Error('Title cannot be empty');
    if (title.length > 500) throw new Error('Title too long');
    
    // Business logic
    const normalizedTitle = title.trim();
    
    // Check duplicates
    const existing = await this.repo.findByUserId(userId);
    if (existing.some(t => t.title === normalizedTitle)) {
      throw new Error('Duplicate todo');
    }
    
    return await this.repo.create({ title: normalizedTitle, userId });
  }
}
```

## State Management

### Server State (Convex)
Use for backend data - automatically synchronized.

```typescript
function TodoList() {
  const todos = useQuery(api.todos.list); // Auto-synced
  return <div>{todos?.map(...)}</div>;
}
```

### Local UI State
Use for UI-only state.

```typescript
function TodoForm() {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
}
```

### Global UI State (Context)
Use for app-wide UI state.

```typescript
function ThemeProvider() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return <ThemeContext.Provider value={{ theme, setTheme }}>
    {children}
  </ThemeContext.Provider>;
}
```

## Data Flow

```
User Action → Event Handler → Custom Hook → 
Convex Mutation → Database Update → Auto Re-query → 
Component Re-render
```

## Performance Patterns

```typescript
// Memoize expensive computations
const stats = useMemo(() => {
  return {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
  };
}, [todos]);

// Memoize components
const TodoItem = memo(function TodoItem({ todo }: { todo: Todo }) {
  return <div>...</div>;
});

// Code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

## Anti-Patterns to Avoid

### ❌ Prop Drilling
```typescript
// Bad: Passing props through many levels
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
```

Use Context or custom hooks instead.

### ❌ God Components
```typescript
// Bad: Component doing everything
function TodoApp() {
  // 1000+ lines handling auth, routing, data, rendering...
}
```

Break into smaller, focused components.

### ❌ Magic Values
```typescript
// Bad
if (status === 3) { ... }

// Good
const TodoStatus = {
  PENDING: 0,
  ACTIVE: 1,
  COMPLETED: 2,
} as const;

if (status === TodoStatus.COMPLETED) { ... }
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Shadcn components
│   ├── todo/         # Feature components
│   └── layout/       # Layout components
├── hooks/            # Custom hooks
├── lib/              # Utilities
└── types/            # Type definitions

convex/
├── todos/            # Todo operations
├── repositories/     # Data access
├── services/         # Business logic
└── schema.ts         # Database schema
```

## Design Decisions

### Use Convex for Backend
- Real-time sync out of the box
- TypeScript end-to-end
- Serverless deployment
- Built-in authentication

### Use Shadcn UI
- High-quality, accessible components
- Theme-based customization
- No vendor lock-in (copy components)

### Use TDD Approach
- Tests first ensure better design
- Safety net for refactoring
- Living documentation

## Resources

- [React Patterns](https://reactpatterns.com/)
- [Convex Best Practices](https://docs.convex.dev/best-practices)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
