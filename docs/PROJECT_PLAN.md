# TodoApp Implementation Project Plan

## Overview
This document outlines the complete implementation plan for the TodoApp project, following TDD principles, SOLID patterns, and security-first development. The plan is organized into phases with specific tasks, dependencies, and success criteria.

## Project Information

**Tech Stack**:
- Frontend: React 19 + TypeScript + Vite
- Backend: Convex BaaS
- Styling: Tailwind CSS + Shadcn UI
- Authentication: Microsoft Entra ID
- Deployment: Cloudflare Pages (frontend) + Convex (backend)
- CI/CD: GitHub Actions

**Development Approach**:
- Test-Driven Development (TDD)
- SOLID principles
- Security-first
- Theme-based styling only

## Available Components

### Shadcn UI Components (Available in @shadcn registry)

**Core UI**:
- `button` - Primary interaction component
- `card` - Container for todo items
- `checkbox` - Todo completion status
- `input` - Text input for todo titles
- `form` - Form management with React Hook Form
- `label` - Form labels
- `dialog` - Modals for edit/delete confirmation
- `alert-dialog` - Confirmation dialogs
- `dropdown-menu` - Action menus
- `skeleton` - Loading states

**Additional UI**:
- `hover-card` - Tooltip/preview functionality
- `input-group` - Grouped inputs
- `sonner` - Toast notifications (or use toast)

### Convex Components (Explore during implementation)

Research and potentially use:
- Convex Auth helpers (built-in)
- Convex validators (built-in)
- Database queries with indexes (built-in)
- Real-time subscriptions (built-in)

Note: Check Convex documentation and component library during implementation for:
- Rate limiting components
- Audit logging components
- Migration helpers

---

## Project Phases

### Phase 0: Project Setup & Configuration ✅
**Status**: COMPLETE (December 13, 2025)
**Duration**: 1 day

#### Tasks
- [x] Initialize React + Vite project
- [x] Setup TypeScript configuration
- [x] Initialize Convex project
- [x] Setup ESLint and linting rules
- [x] Configure testing framework (Vitest + React Testing Library)
- [x] Setup Playwright for E2E tests
- [x] Configure GitHub Actions workflows
- [ ] Setup Cloudflare Pages project (manual setup required - see /CLOUDFLARE_SETUP_CHECKLIST.md)
- [x] Configure environment variables
- [x] Install Shadcn CLI

**Success Criteria**: ✅ ALL MET
- ✅ Project builds without errors
- ✅ Linting passes
- ✅ Test framework runs
- ✅ Development server starts
- ✅ Convex connects successfully

---

### Phase 1: Foundation & Core Setup
**Duration**: 3-4 days
**Dependencies**: Phase 0

#### Task 1.1: Install Shadcn Components
**Duration**: 1 hour

**Components to install**:
```bash
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

**Tests**: Verify components render correctly

**Success Criteria**:
- All components installed
- No TypeScript errors
- Components visible in src/components/ui/

#### Task 1.2: Setup Theme Configuration
**Duration**: 2 hours

**Steps**:
1. Configure Tailwind theme in tailwind.config.js
2. Setup CSS variables in src/styles/theme.css
3. Configure dark mode support
4. Create theme provider component

**Tests**:
- Test theme switching
- Verify CSS variables apply correctly

**Success Criteria**:
- Theme variables accessible
- Dark mode toggles correctly
- All colors from theme

#### Task 1.3: Database Schema Design (TDD)
**Duration**: 4 hours

**Write tests FIRST**:
```typescript
// convex/schema.test.ts
describe('Todo Schema', () => {
  test('should have required fields', () => {});
  test('should have correct indexes', () => {});
});
```

**Then implement**:
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  todos: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    completed: v.boolean(),
    userId: v.string(),
    priority: v.optional(v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high')
    )),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_completed', ['userId', 'completed'])
    .index('by_user_priority', ['userId', 'priority']),
  
  users: defineTable({
    entraId: v.string(),
    email: v.string(),
    name: v.string(),
    createdAt: v.number(),
  })
    .index('by_entra_id', ['entraId'])
    .index('by_email', ['email']),
});
```

**Tests**:
- Schema validation tests
- Index efficiency tests

**Success Criteria**:
- Schema defines all entities
- Indexes support query patterns
- Tests pass

#### Task 1.4: Type Definitions
**Duration**: 2 hours

**Create**:
```typescript
// src/types/todo.types.ts
export interface Todo {
  _id: string;
  _creationTime: number;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: number;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  _id: string;
  _creationTime: number;
  entraId: string;
  email: string;
  name: string;
  createdAt: number;
}

export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoSort = 'createdAt' | 'dueDate' | 'priority';
```

**Success Criteria**:
- All types defined
- No TypeScript errors
- Types match schema

---

### Phase 2: Authentication Implementation
**Duration**: 3-4 days
**Dependencies**: Phase 1

#### Task 2.1: Microsoft Entra ID Setup (TDD)
**Duration**: 4 hours

**Write tests FIRST**:
```typescript
// src/auth/auth.test.ts
describe('Authentication', () => {
  test('should initialize MSAL instance', () => {});
  test('should handle login redirect', () => {});
  test('should handle logout', () => {});
  test('should refresh token', () => {});
});
```

**Then implement**:
1. Register app in Azure Portal
2. Configure MSAL
3. Create auth context
4. Implement login/logout flows
5. Token management

**Files to create**:
- `src/auth/msalConfig.ts`
- `src/auth/AuthContext.tsx`
- `src/auth/ProtectedRoute.tsx`
- `src/hooks/useAuth.ts`

**Tests**:
- Auth flow integration tests
- Token refresh tests
- Logout tests

**Success Criteria**:
- Users can login with Microsoft account
- Tokens stored securely
- Auth state persists
- Logout works correctly

#### Task 2.2: Convex Auth Integration (TDD)
**Duration**: 3 hours

**Write tests FIRST**:
```typescript
// convex/auth.test.ts
describe('Convex Auth', () => {
  test('should verify identity in queries', () => {});
  test('should reject unauthenticated requests', () => {});
});
```

**Then implement**:
```typescript
// convex/auth.ts
import { Auth } from 'convex/server';

export async function requireAuth(ctx: { auth: Auth }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Unauthorized: Authentication required');
  }
  return identity;
}

export async function getUserOrCreate(ctx: any, identity: any) {
  // Check if user exists, create if not
}
```

**Tests**:
- Auth helper tests
- User creation tests

**Success Criteria**:
- Auth helpers work
- Users created on first login
- Identity verified in all queries/mutations

---

### Phase 3: Core Todo CRUD Operations
**Duration**: 5-6 days
**Dependencies**: Phase 2

#### Task 3.1: Create Todo Queries (TDD)
**Duration**: 1 day

**Write tests FIRST**:
```typescript
// convex/todos.test.ts
describe('Todo Queries', () => {
  test('should list todos for authenticated user', () => {});
  test('should filter todos by completion status', () => {});
  test('should get single todo by ID', () => {});
  test('should reject unauthenticated requests', () => {});
  test('should not show other users todos', () => {});
});
```

**Then implement**:
```typescript
// convex/todos.ts
import { query } from './_generated/server';
import { v } from 'convex/values';
import { requireAuth } from './auth';

export const list = query({
  args: {
    filter: v.optional(v.union(
      v.literal('all'),
      v.literal('active'),
      v.literal('completed')
    )),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    
    let query = ctx.db
      .query('todos')
      .withIndex('by_user', q => q.eq('userId', identity.subject));
    
    if (args.filter === 'active') {
      query = query.filter(q => q.eq('completed', false));
    } else if (args.filter === 'completed') {
      query = query.filter(q => q.eq('completed', true));
    }
    
    return await query.collect();
  },
});

export const get = query({
  args: { id: v.id('todos') },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const todo = await ctx.db.get(args.id);
    
    if (!todo) throw new Error('Todo not found');
    if (todo.userId !== identity.subject) throw new Error('Forbidden');
    
    return todo;
  },
});
```

**Tests**:
- Query tests with mocked auth
- Filter tests
- Authorization tests

**Success Criteria**:
- Queries return correct data
- User isolation enforced
- Auth checked
- Tests pass

#### Task 3.2: Create Todo Mutations (TDD)
**Duration**: 1 day

**Write tests FIRST**:
```typescript
describe('Todo Mutations', () => {
  test('should create todo with valid data', () => {});
  test('should update todo', () => {});
  test('should delete todo', () => {});
  test('should toggle completion status', () => {});
  test('should validate input', () => {});
  test('should check ownership before update/delete', () => {});
});
```

**Then implement**:
```typescript
// convex/todos.ts (continued)
import { mutation } from './_generated/server';

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high')
    )),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    
    // Validation
    if (!args.title.trim()) {
      throw new Error('Title cannot be empty');
    }
    if (args.title.length > 500) {
      throw new Error('Title too long (max 500 characters)');
    }
    
    const now = Date.now();
    const todoId = await ctx.db.insert('todos', {
      title: args.title.trim(),
      description: args.description?.trim(),
      completed: false,
      userId: identity.subject,
      priority: args.priority || 'medium',
      dueDate: args.dueDate,
      createdAt: now,
      updatedAt: now,
    });
    
    return todoId;
  },
});

export const update = mutation({
  args: {
    id: v.id('todos'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high')
    )),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new Error('Todo not found');
    if (todo.userId !== identity.subject) throw new Error('Forbidden');
    
    // Validation
    if (args.title !== undefined) {
      if (!args.title.trim()) throw new Error('Title cannot be empty');
      if (args.title.length > 500) throw new Error('Title too long');
    }
    
    await ctx.db.patch(args.id, {
      ...(args.title !== undefined && { title: args.title.trim() }),
      ...(args.description !== undefined && { description: args.description?.trim() }),
      ...(args.priority !== undefined && { priority: args.priority }),
      ...(args.dueDate !== undefined && { dueDate: args.dueDate }),
      updatedAt: Date.now(),
    });
    
    return args.id;
  },
});

export const toggleComplete = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new Error('Todo not found');
    if (todo.userId !== identity.subject) throw new Error('Forbidden');
    
    await ctx.db.patch(args.id, {
      completed: !todo.completed,
      updatedAt: Date.now(),
    });
    
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id('todos') },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new Error('Todo not found');
    if (todo.userId !== identity.subject) throw new Error('Forbidden');
    
    await ctx.db.delete(args.id);
  },
});
```

**Tests**:
- Mutation tests
- Validation tests
- Authorization tests
- Edge case tests

**Success Criteria**:
- CRUD operations work
- Validation enforced
- Authorization checked
- Tests pass (>80% coverage)

---

### Phase 4: Frontend Components
**Duration**: 6-7 days
**Dependencies**: Phase 3

#### Task 4.1: Custom Hooks (TDD)
**Duration**: 1 day

**Write tests FIRST**:
```typescript
// src/hooks/useTodos.test.ts
describe('useTodos', () => {
  test('should fetch todos', () => {});
  test('should create todo', () => {});
  test('should handle errors', () => {});
});
```

**Then implement**:
```typescript
// src/hooks/useTodos.ts
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';

export function useTodos(filter?: 'all' | 'active' | 'completed') {
  return useQuery(api.todos.list, { filter });
}

export function useTodoOperations() {
  const create = useMutation(api.todos.create);
  const update = useMutation(api.todos.update);
  const toggleComplete = useMutation(api.todos.toggleComplete);
  const remove = useMutation(api.todos.remove);
  
  return {
    createTodo: async (data: CreateTodoInput) => {
      try {
        const id = await create(data);
        toast.success('Todo created');
        return id;
      } catch (error) {
        toast.error('Failed to create todo');
        throw error;
      }
    },
    updateTodo: async (id: string, data: UpdateTodoInput) => {
      try {
        await update({ id, ...data });
        toast.success('Todo updated');
      } catch (error) {
        toast.error('Failed to update todo');
        throw error;
      }
    },
    toggleTodo: async (id: string) => {
      try {
        await toggleComplete({ id });
        toast.success('Todo status updated');
      } catch (error) {
        toast.error('Failed to update todo');
        throw error;
      }
    },
    deleteTodo: async (id: string) => {
      try {
        await remove({ id });
        toast.success('Todo deleted');
      } catch (error) {
        toast.error('Failed to delete todo');
        throw error;
      }
    },
  };
}
```

**Success Criteria**:
- Hooks work correctly
- Error handling proper
- Toast notifications show
- Tests pass

#### Task 4.2: TodoItem Component (TDD)
**Duration**: 1 day

**Write tests FIRST**:
```typescript
// src/components/todo/TodoItem.test.tsx
describe('TodoItem', () => {
  test('should render todo', () => {});
  test('should toggle completion on checkbox click', () => {});
  test('should open edit dialog', () => {});
  test('should call onDelete', () => {});
  test('should show priority indicator', () => {});
  test('should be accessible', () => {});
});
```

**Then implement**:
```typescript
// src/components/todo/TodoItem.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Todo } from '@/types/todo.types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const priorityColors = {
    low: 'border-l-blue-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-red-500',
  };
  
  return (
    <Card className={`border-l-4 ${priorityColors[todo.priority || 'medium']}`}>
      <CardContent className="flex items-center gap-4 p-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo._id)}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        
        <div className="flex-1">
          <h3 className={`font-semibold ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className="text-sm text-muted-foreground">{todo.description}</p>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              •••
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEdit(todo._id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(todo._id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
```

**Success Criteria**:
- Component renders
- User interactions work
- Accessible
- Tests pass

#### Task 4.3: TodoList Component (TDD)
**Duration**: 1 day

**Write tests FIRST**, then implement following Container/Presentational pattern

**Success Criteria**:
- Lists todos correctly
- Empty state shows
- Loading state shows
- Filters work
- Tests pass

#### Task 4.4: TodoForm Component (TDD)
**Duration**: 1 day

**Write tests FIRST**, then implement with React Hook Form

**Success Criteria**:
- Form validates
- Creates/updates todos
- Error handling
- Accessible
- Tests pass

#### Task 4.5: Main App Layout (TDD)
**Duration**: 1 day

**Implement**:
- App shell with header
- Navigation
- Filter controls
- Responsive layout

**Success Criteria**:
- Layout responsive
- Navigation works
- Filters apply
- Tests pass

---

### Phase 5: Advanced Features
**Duration**: 4-5 days
**Dependencies**: Phase 4

#### Task 5.1: Todo Filtering & Sorting
**Duration**: 1 day

**Features**:
- Filter by status (all/active/completed)
- Filter by priority
- Sort by date, priority
- Search functionality

**Success Criteria**:
- Filters work
- Sort works
- Search works
- Tests pass

#### Task 5.2: Due Date Management
**Duration**: 1 day

**Features**:
- Add due date picker
- Visual indicators for overdue
- Date formatting
- Due date filtering

**Success Criteria**:
- Date picker works
- Overdue todos highlighted
- Tests pass

#### Task 5.3: Bulk Operations
**Duration**: 1 day

**Features**:
- Select multiple todos
- Bulk complete/uncomplete
- Bulk delete
- Select all/none

**Success Criteria**:
- Selection works
- Bulk operations work
- Tests pass

#### Task 5.4: Todo Statistics
**Duration**: 1 day

**Features**:
- Total todos count
- Completed percentage
- Priority breakdown
- Overdue count

**Success Criteria**:
- Statistics accurate
- Visual display
- Tests pass

---

### Phase 6: Polish & UX Enhancements
**Duration**: 3-4 days
**Dependencies**: Phase 5

#### Task 6.1: Loading States
**Duration**: 1 day

**Implement**:
- Skeleton loaders
- Loading spinners
- Optimistic updates
- Transition animations

**Success Criteria**:
- No jarring loading states
- Smooth transitions
- Tests pass

#### Task 6.2: Error Handling & Feedback
**Duration**: 1 day

**Implement**:
- Error boundaries
- Toast notifications
- Retry mechanisms
- User-friendly error messages

**Success Criteria**:
- Errors handled gracefully
- Users informed
- Recovery options available
- Tests pass

#### Task 6.3: Accessibility (a11y)
**Duration**: 1 day

**Implement**:
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast

**Success Criteria**:
- WCAG AA compliant
- Keyboard navigable
- Screen reader friendly
- Tests pass

#### Task 6.4: Responsive Design
**Duration**: 1 day

**Implement**:
- Mobile layout
- Tablet layout
- Desktop layout
- Touch-friendly interactions

**Success Criteria**:
- Works on all screen sizes
- Touch interactions smooth
- Tests pass

---

### Phase 7: Testing & Quality Assurance
**Duration**: 3-4 days
**Dependencies**: Phase 6

#### Task 7.1: Unit Test Coverage
**Duration**: 1 day

**Actions**:
- Review coverage report
- Add tests for uncovered code
- Achieve >80% coverage
- Fix any failing tests

**Success Criteria**:
- Coverage >80%
- All tests pass
- No skipped tests

#### Task 7.2: Integration Testing
**Duration**: 1 day

**Test**:
- Complete user workflows
- Auth flows
- CRUD operations
- Error scenarios

**Success Criteria**:
- All workflows tested
- Tests pass

#### Task 7.3: E2E Testing with Playwright
**Duration**: 1 day

**Test**:
- Login flow
- Create/edit/delete todos
- Filtering and sorting
- Error handling
- Cross-browser

**Success Criteria**:
- Critical paths covered
- Tests pass on all browsers

#### Task 7.4: Security Audit
**Duration**: 1 day

**Review**:
- Authentication
- Authorization
- Input validation
- XSS prevention
- Secret management
- Error handling

**Success Criteria**:
- Security checklist complete
- No vulnerabilities
- Documentation updated

---

### Phase 8: Deployment & Documentation
**Duration**: 2-3 days
**Dependencies**: Phase 7

#### Task 8.1: GitHub Actions Setup
**Duration**: 1 day

**Create workflows**:
- CI (test, lint, build)
- Deploy to dev (main branch)
- Deploy to prod (prod branch)

**Success Criteria**:
- Workflows run successfully
- Auto-deploy works
- Notifications sent

#### Task 8.2: Environment Configuration
**Duration**: 0.5 day

**Setup**:
- GitHub Secrets
- Cloudflare Pages projects
- Convex deployments
- Environment variables

**Success Criteria**:
- All secrets configured
- Both environments working

#### Task 8.3: Documentation Updates
**Duration**: 1 day

**Update**:
- README with setup instructions
- API documentation
- Component documentation
- Deployment guide updates

**Success Criteria**:
- Documentation complete
- Clear instructions
- Examples provided

#### Task 8.4: Production Deployment
**Duration**: 0.5 day

**Actions**:
- Deploy to production
- Run smoke tests
- Monitor for errors
- Update status

**Success Criteria**:
- Production live
- No errors
- Monitoring active

---

## Timeline Summary

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 0: Setup | 1 day | 10 |
| Phase 1: Foundation | 3-4 days | 4 |
| Phase 2: Authentication | 3-4 days | 2 |
| Phase 3: CRUD Operations | 5-6 days | 2 |
| Phase 4: Frontend Components | 6-7 days | 5 |
| Phase 5: Advanced Features | 4-5 days | 4 |
| Phase 6: Polish & UX | 3-4 days | 4 |
| Phase 7: Testing & QA | 3-4 days | 4 |
| Phase 8: Deployment | 2-3 days | 4 |
| **Total** | **30-42 days** | **39 tasks** |

**Estimated Duration**: 6-8 weeks for single developer
**Recommended Team**: 2-3 developers (reduce to 4-5 weeks)

---

## Risk Management

### High-Risk Areas

1. **Authentication Integration**
   - Risk: Microsoft Entra ID configuration issues
   - Mitigation: Follow official documentation, test thoroughly
   - Contingency: Use mock auth for development

2. **Real-time Sync**
   - Risk: Convex subscription issues
   - Mitigation: Test with multiple clients
   - Contingency: Polling fallback

3. **Security**
   - Risk: Authorization bypass
   - Mitigation: Security audits, peer review
   - Contingency: Additional auth layers

### Medium-Risk Areas

1. **Performance**
   - Risk: Slow queries with large datasets
   - Mitigation: Proper indexing, pagination
   - Contingency: Query optimization

2. **Browser Compatibility**
   - Risk: Features not working in some browsers
   - Mitigation: E2E testing across browsers
   - Contingency: Polyfills, fallbacks

---

## Success Metrics

### Development Metrics
- [ ] All tests passing (>80% coverage)
- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors
- [ ] Build succeeds without warnings
- [ ] All documentation complete

### Quality Metrics
- [ ] SOLID principles followed
- [ ] Security checklist complete
- [ ] Accessibility WCAG AA compliant
- [ ] Performance benchmarks met
- [ ] Code review approved

### User Experience Metrics
- [ ] Page load < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] No UI jank
- [ ] Mobile-friendly
- [ ] Intuitive interface

---

## Development Best Practices

### Daily Workflow
1. Start with failing test (TDD - RED)
2. Write minimal code to pass (TDD - GREEN)
3. Refactor and improve (TDD - REFACTOR)
4. Run quality checks
5. Commit with good message
6. Push and create PR

### Code Review Checklist
- [ ] Tests written first
- [ ] All tests pass
- [ ] SOLID principles followed
- [ ] Security checked
- [ ] No inline styles
- [ ] Accessible
- [ ] Documentation updated

### Definition of Done
A task is complete when:
- [ ] Tests written FIRST (TDD)
- [ ] All tests pass (>80% coverage)
- [ ] Code reviewed and approved
- [ ] No TypeScript/ESLint errors
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Deployed to dev and verified

---

## Resources

### Documentation
- [React](https://react.dev/)
- [Convex](https://docs.convex.dev/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/)
- [Tailwind CSS](https://tailwindcss.com/)

### Internal Documentation
- [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)
- [CODE_QUALITY_CHECKLIST.md](./CODE_QUALITY_CHECKLIST.md)
- [SECURITY_GUIDELINES.md](./SECURITY_GUIDELINES.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [ARCHITECTURE_PATTERNS.md](./ARCHITECTURE_PATTERNS.md)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## Next Steps

1. **Review this plan** with team
2. **Setup project tracking** (GitHub Projects/Issues)
3. **Assign tasks** to team members
4. **Start Phase 1** with foundation setup
5. **Daily standups** to track progress
6. **Weekly reviews** to adjust plan

---

**Remember**: This is a living document. Update it as the project evolves. Follow TDD, SOLID principles, and security-first development always.

**Last Updated**: 2024-12-12
**Version**: 1.0
**Status**: Ready for implementation

