# Architecture Patterns & Design Decisions

## Overview
This document outlines the architectural patterns, design decisions, and best practices for building the TodoApp. It provides guidance on structuring code, managing data flow, and implementing features consistently.

## Architectural Style

### Overall Architecture
```
┌─────────────────────────────────────────┐
│          Frontend (React)               │
│  ┌──────────────────────────────────┐  │
│  │   Presentation Layer             │  │
│  │   - UI Components (Shadcn)       │  │
│  │   - Pages/Routes                 │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │   Business Logic Layer           │  │
│  │   - Custom Hooks                 │  │
│  │   - Context/State                │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │   Data Access Layer              │  │
│  │   - Convex Queries/Mutations     │  │
│  │   - API Client                   │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│      Backend (Convex BaaS)              │
│  ┌──────────────────────────────────┐  │
│  │   API Layer                      │  │
│  │   - Queries (Read)               │  │
│  │   - Mutations (Write)            │  │
│  │   - Actions (External)           │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │   Business Logic                 │  │
│  │   - Validation                   │  │
│  │   - Authorization                │  │
│  │   - Business Rules               │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │   Data Layer                     │  │
│  │   - Schema Definitions           │  │
│  │   - Database Operations          │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│      External Services                  │
│   - Microsoft Entra ID (Auth)           │
│   - Email Service (Future)              │
│   - Analytics (Future)                  │
└─────────────────────────────────────────┘
```

## Design Patterns

### 1. Container/Presentational Pattern

**Purpose**: Separate data fetching/logic from UI rendering

**When to use**: Most component implementations

**Implementation**:

```typescript
// ✅ Container Component (Smart Component)
// Handles data fetching, state management, and business logic
function TodoListContainer() {
  const todos = useQuery(api.todos.list);
  const deleteTodo = useMutation(api.todos.delete);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  const filteredTodos = useMemo(() => {
    if (!todos) return [];
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
  
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteTodo({ id });
      toast.success('Todo deleted');
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  }, [deleteTodo]);
  
  if (todos === undefined) return <LoadingSpinner />;
  
  return (
    <TodoListPresenter
      todos={filteredTodos}
      filter={filter}
      onFilterChange={setFilter}
      onDelete={handleDelete}
    />
  );
}

// ✅ Presentational Component (Dumb Component)
// Pure rendering, receives all data via props
interface TodoListPresenterProps {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  onDelete: (id: string) => void;
}

function TodoListPresenter({
  todos,
  filter,
  onFilterChange,
  onDelete,
}: TodoListPresenterProps) {
  return (
    <div className="space-y-4">
      <FilterBar value={filter} onChange={onFilterChange} />
      
      {todos.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-2">
          {todos.map(todo => (
            <TodoItem key={todo._id} todo={todo} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Benefits**:
- Easier to test (presentational components are pure)
- Better reusability
- Clear separation of concerns
- Easier to optimize performance

### 2. Custom Hooks Pattern

**Purpose**: Extract and reuse stateful logic

**When to use**: Reusable logic, complex state management, side effects

**Implementation**:

```typescript
// ✅ Custom Hook for Todo Operations
function useTodoOperations() {
  const createTodo = useMutation(api.todos.create);
  const updateTodo = useMutation(api.todos.update);
  const deleteTodo = useMutation(api.todos.delete);
  
  const create = useCallback(async (title: string) => {
    if (!title.trim()) {
      throw new Error('Title cannot be empty');
    }
    
    try {
      const id = await createTodo({ title: title.trim() });
      toast.success('Todo created');
      return id;
    } catch (error) {
      console.error('Failed to create todo:', error);
      toast.error('Failed to create todo');
      throw error;
    }
  }, [createTodo]);
  
  const update = useCallback(async (id: string, updates: Partial<Todo>) => {
    try {
      await updateTodo({ id, ...updates });
      toast.success('Todo updated');
    } catch (error) {
      console.error('Failed to update todo:', error);
      toast.error('Failed to update todo');
      throw error;
    }
  }, [updateTodo]);
  
  const remove = useCallback(async (id: string) => {
    try {
      await deleteTodo({ id });
      toast.success('Todo deleted');
    } catch (error) {
      console.error('Failed to delete todo:', error);
      toast.error('Failed to delete todo');
      throw error;
    }
  }, [deleteTodo]);
  
  return {
    create,
    update,
    delete: remove,
  };
}

// Usage
function TodoForm() {
  const { create } = useTodoOperations();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create(title);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Benefits**:
- Reusable across components
- Testable in isolation
- Encapsulates complex logic
- Follows DRY principle

### 3. Compound Component Pattern

**Purpose**: Create components that work together while maintaining flexibility

**When to use**: Complex UI components with multiple related parts

**Implementation**:

```typescript
// ✅ Compound Component with Context
interface TodoCardContextValue {
  todo: Todo;
  onEdit: () => void;
  onDelete: () => void;
}

const TodoCardContext = createContext<TodoCardContextValue | null>(null);

function useTodoCard() {
  const context = useContext(TodoCardContext);
  if (!context) {
    throw new Error('TodoCard compound components must be used within TodoCard');
  }
  return context;
}

// Main Component
function TodoCard({ 
  todo, 
  onEdit, 
  onDelete, 
  children 
}: {
  todo: Todo;
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  return (
    <TodoCardContext.Provider value={{ todo, onEdit, onDelete }}>
      <Card className="p-4">{children}</Card>
    </TodoCardContext.Provider>
  );
}

// Sub-components
TodoCard.Title = function TodoCardTitle() {
  const { todo } = useTodoCard();
  return <CardTitle>{todo.title}</CardTitle>;
};

TodoCard.Description = function TodoCardDescription() {
  const { todo } = useTodoCard();
  return <CardDescription>{todo.description}</CardDescription>;
};

TodoCard.Actions = function TodoCardActions() {
  const { onEdit, onDelete } = useTodoCard();
  return (
    <div className="flex gap-2">
      <Button onClick={onEdit} variant="outline" size="sm">Edit</Button>
      <Button onClick={onDelete} variant="destructive" size="sm">Delete</Button>
    </div>
  );
};

// Usage
function TodoItem({ todo }: { todo: Todo }) {
  return (
    <TodoCard todo={todo} onEdit={handleEdit} onDelete={handleDelete}>
      <TodoCard.Title />
      <TodoCard.Description />
      <TodoCard.Actions />
    </TodoCard>
  );
}
```

**Benefits**:
- Flexible composition
- Implicit prop passing via context
- Clear component relationships
- Better API design

### 4. Provider Pattern

**Purpose**: Share data and functionality across component tree

**When to use**: Global state, authentication, theme, configuration

**Implementation**:

```typescript
// ✅ Auth Provider Pattern
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Initialize auth state
    checkAuthStatus().then(setUser).finally(() => setIsLoading(false));
  }, []);
  
  const login = useCallback(async (credentials: Credentials) => {
    setIsLoading(true);
    try {
      const user = await authenticateUser(credentials);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);
  
  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Usage
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes />
      </Router>
    </AuthProvider>
  );
}

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

**Benefits**:
- Centralized state management
- Avoid prop drilling
- Easy to test
- Single source of truth

### 5. Higher-Order Component (HOC) Pattern

**Purpose**: Enhance components with additional functionality

**When to use**: Cross-cutting concerns, component enhancement

**Implementation**:

```typescript
// ✅ withAuth HOC
function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return <Component {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);

// ✅ withErrorBoundary HOC
function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function ComponentWithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Usage
const SafeTodoList = withErrorBoundary(TodoList);

// ✅ Compose multiple HOCs
const EnhancedDashboard = compose(
  withAuth,
  withErrorBoundary,
  withAnalytics
)(Dashboard);
```

**Benefits**:
- Code reuse
- Separation of concerns
- Composable enhancements
- Clean component code

### 6. Render Props Pattern

**Purpose**: Share code between components using a prop whose value is a function

**When to use**: Dynamic rendering, component logic sharing

**Implementation**:

```typescript
// ✅ Render Props Pattern
interface DataFetcherProps<T> {
  queryFn: () => T | undefined;
  children: (data: {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
  }) => React.ReactNode;
}

function DataFetcher<T>({ queryFn, children }: DataFetcherProps<T>) {
  const data = queryFn();
  const isLoading = data === undefined;
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (data === undefined) {
      // Check for errors
    }
  }, [data]);
  
  return <>{children({ data, isLoading, error })}</>;
}

// Usage
function TodoList() {
  return (
    <DataFetcher queryFn={() => useQuery(api.todos.list)}>
      {({ data, isLoading, error }) => {
        if (isLoading) return <LoadingSpinner />;
        if (error) return <ErrorMessage error={error} />;
        return <TodoItems todos={data} />;
      }}
    </DataFetcher>
  );
}
```

**Benefits**:
- Flexible rendering
- Inversion of control
- Type-safe
- Dynamic behavior

### 7. Repository Pattern (Backend)

**Purpose**: Abstract data access logic

**When to use**: Complex queries, data layer abstraction

**Implementation**:

```typescript
// ✅ Repository Pattern in Convex
// convex/repositories/todoRepository.ts
import { v } from 'convex/values';
import { MutationCtx, QueryCtx } from '../_generated/server';

export class TodoRepository {
  constructor(private ctx: QueryCtx | MutationCtx) {}
  
  async findByUserId(userId: string) {
    return await this.ctx.db
      .query('todos')
      .withIndex('by_user', q => q.eq('userId', userId))
      .collect();
  }
  
  async findById(id: string) {
    return await this.ctx.db.get(id);
  }
  
  async create(data: {
    title: string;
    userId: string;
    completed?: boolean;
  }) {
    return await this.ctx.db.insert('todos', {
      title: data.title,
      userId: data.userId,
      completed: data.completed ?? false,
    });
  }
  
  async update(id: string, updates: Partial<Todo>) {
    await this.ctx.db.patch(id, updates);
  }
  
  async delete(id: string) {
    await this.ctx.db.delete(id);
  }
  
  async findCompleted(userId: string) {
    return await this.ctx.db
      .query('todos')
      .withIndex('by_user_completed', q => 
        q.eq('userId', userId).eq('completed', true)
      )
      .collect();
  }
}

// Usage in queries/mutations
export const listTodos = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    const repo = new TodoRepository(ctx);
    return await repo.findByUserId(identity.subject);
  },
});
```

**Benefits**:
- Centralized data access
- Easier to test
- DRY - reuse queries
- Easier to refactor

### 8. Service Layer Pattern (Backend)

**Purpose**: Encapsulate business logic

**When to use**: Complex operations, business rules

**Implementation**:

```typescript
// ✅ Service Layer Pattern
// convex/services/todoService.ts
import { MutationCtx } from '../_generated/server';
import { TodoRepository } from '../repositories/todoRepository';

export class TodoService {
  private repo: TodoRepository;
  
  constructor(private ctx: MutationCtx) {
    this.repo = new TodoRepository(ctx);
  }
  
  async createTodo(userId: string, title: string) {
    // Business validation
    if (!title.trim()) {
      throw new Error('Title cannot be empty');
    }
    
    if (title.length > 500) {
      throw new Error('Title too long');
    }
    
    // Business logic
    const normalizedTitle = title.trim();
    
    // Check for duplicates
    const existing = await this.repo.findByUserId(userId);
    if (existing.some(t => t.title === normalizedTitle)) {
      throw new Error('Todo with this title already exists');
    }
    
    // Create todo
    return await this.repo.create({
      title: normalizedTitle,
      userId,
    });
  }
  
  async completeTodo(userId: string, todoId: string) {
    const todo = await this.repo.findById(todoId);
    
    if (!todo) {
      throw new Error('Todo not found');
    }
    
    if (todo.userId !== userId) {
      throw new Error('Unauthorized');
    }
    
    if (todo.completed) {
      throw new Error('Todo already completed');
    }
    
    await this.repo.update(todoId, { 
      completed: true,
      completedAt: Date.now(),
    });
    
    // Business logic: trigger notifications, etc.
    await this.notifyCompletion(todo);
  }
  
  private async notifyCompletion(todo: Todo) {
    // Send notification logic
  }
}

// Usage in mutations
export const createTodo = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    const service = new TodoService(ctx);
    return await service.createTodo(identity.subject, args.title);
  },
});
```

**Benefits**:
- Business logic centralized
- Testable business rules
- Reusable across endpoints
- Clear domain model

## Data Flow Architecture

### Unidirectional Data Flow

```
┌──────────────────────────────────────┐
│          User Interaction            │
│    (Button Click, Form Submit)       │
└─────────────┬────────────────────────┘
              │
              ↓
┌──────────────────────────────────────┐
│         Event Handler                │
│     (onClick, onSubmit)              │
└─────────────┬────────────────────────┘
              │
              ↓
┌──────────────────────────────────────┐
│      Custom Hook / Action            │
│    (useMutation, useState)           │
└─────────────┬────────────────────────┘
              │
              ↓
┌──────────────────────────────────────┐
│      Convex Mutation                 │
│    (Backend Processing)              │
└─────────────┬────────────────────────┘
              │
              ↓
┌──────────────────────────────────────┐
│       Database Update                │
│    (Convex Reactive DB)              │
└─────────────┬────────────────────────┘
              │
              ↓
┌──────────────────────────────────────┐
│      Automatic Re-query              │
│    (Convex Reactivity)               │
└─────────────┬────────────────────────┘
              │
              ↓
┌──────────────────────────────────────┐
│        Component Re-render           │
│       (React Update)                 │
└──────────────────────────────────────┘
```

### State Management Strategy

#### 1. Server State (Convex)
- Use for data from backend
- Automatically synchronized
- Single source of truth

```typescript
// ✅ Server state with Convex
function TodoList() {
  const todos = useQuery(api.todos.list); // Auto-synced
  return <div>{todos?.map(...)}</div>;
}
```

#### 2. Local Component State
- Use for UI-only state
- Temporary state
- Form inputs

```typescript
// ✅ Local state for UI
function TodoForm() {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ...
}
```

#### 3. Global UI State (Context)
- Use for app-wide UI state
- Theme, modals, notifications
- Not for server data

```typescript
// ✅ Global UI state
function ThemeProvider() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  // ...
}
```

## Error Handling Architecture

### Error Boundary Hierarchy

```
<AppErrorBoundary> (Top Level)
  └─ <AuthProvider>
       └─ <Router>
            ├─ <RouteErrorBoundary> (Route Level)
            │    └─ <Page />
            │         └─ <ComponentErrorBoundary> (Component Level)
            │              └─ <Feature />
            └─ ...
```

### Error Handling Strategy

```typescript
// ✅ Layered Error Handling
// 1. Component Level
function TodoList() {
  const todos = useQuery(api.todos.list);
  const [error, setError] = useState<Error | null>(null);
  
  if (error) {
    return <ErrorMessage error={error} retry={() => setError(null)} />;
  }
  
  return <div>...</div>;
}

// 2. Error Boundary Level
class FeatureErrorBoundary extends React.Component {
  render() {
    if (this.state.hasError) {
      return <FeatureFallback />;
    }
    return this.props.children;
  }
}

// 3. Global Level
class AppErrorBoundary extends React.Component {
  render() {
    if (this.state.hasError) {
      return <GlobalErrorPage />;
    }
    return this.props.children;
  }
}
```

## Performance Optimization Patterns

### 1. Code Splitting

```typescript
// ✅ Route-based code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TodoList = lazy(() => import('./pages/TodoList'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/todos" element={<TodoList />} />
      </Routes>
    </Suspense>
  );
}
```

### 2. Memoization

```typescript
// ✅ Memoize expensive computations
function TodoStats({ todos }: { todos: Todo[] }) {
  const stats = useMemo(() => {
    return {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      active: todos.filter(t => !t.completed).length,
    };
  }, [todos]);
  
  return <div>...</div>;
}

// ✅ Memoize components
const TodoItem = memo(function TodoItem({ todo }: { todo: Todo }) {
  return <div>...</div>;
});
```

### 3. Virtualization

```typescript
// ✅ Virtualize long lists
import { VirtualList } from './components/VirtualList';

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <VirtualList
      items={todos}
      height={600}
      itemHeight={50}
      renderItem={(todo) => <TodoItem todo={todo} />}
    />
  );
}
```

## Architecture Decision Records (ADR)

### ADR Template

Create an ADR for significant architectural decisions:

```markdown
# ADR-001: Use Convex for Backend

## Status
Accepted

## Context
We need a backend solution for our TodoApp that provides:
- Real-time data synchronization
- Type-safe queries
- Serverless deployment
- Authentication integration

## Decision
We will use Convex as our Backend-as-a-Service.

## Consequences

### Positive
- Real-time updates out of the box
- TypeScript end-to-end
- Simplified deployment
- Built-in authentication

### Negative
- Vendor lock-in
- Learning curve for team
- Limited to Convex's features

## Alternatives Considered
- Firebase
- Supabase
- Custom Node.js backend
```

## Best Practices Summary

### Component Design
- Keep components small and focused
- Use composition over inheritance
- Separate container from presentational
- Type all props explicitly
- Use Shadcn components as base

### State Management
- Server state with Convex
- Local UI state with useState
- Global UI state with Context
- Avoid redundant state

### Code Organization
- Feature-based folder structure
- Co-locate related files
- Clear naming conventions
- Consistent file structure

### Performance
- Code split routes
- Memoize expensive operations
- Virtualize long lists
- Optimize images

### Testing
- Test behavior, not implementation
- Use TDD approach
- Mock external dependencies
- Maintain high coverage

### Security
- Authentication on all protected routes
- Authorization in backend
- Validate all inputs
- Never trust client

## Anti-Patterns to Avoid

### ❌ Prop Drilling
```typescript
// Bad: Passing props through many levels
<App>
  <Layout user={user}>
    <Sidebar user={user}>
      <Nav user={user}>
        <UserMenu user={user} />
```

### ❌ God Components
```typescript
// Bad: Component doing everything
function TodoApp() {
  // 1000+ lines of code
  // Handles auth, routing, data fetching, rendering, etc.
}
```

### ❌ Mixing Concerns
```typescript
// Bad: UI component with business logic
function TodoItem() {
  // Complex validation logic
  // API calls
  // Business rules
  // Rendering
}
```

### ❌ Magic Numbers/Strings
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

## Resources

- [React Patterns](https://reactpatterns.com/)
- [Convex Best Practices](https://docs.convex.dev/best-practices)
- [TypeScript Patterns](https://www.typescriptlang.org/docs/handbook/patterns.html)

---

**Remember**: Architecture evolves. These patterns are guidelines, not strict rules. Adapt them to your specific needs while maintaining consistency across the codebase.

