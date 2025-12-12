# Quick Reference Card

> Keep this handy while coding! Quick access to essential guidelines and patterns.

## 🎯 Core Principles

### SOLID
- **S** - Single Responsibility: One reason to change
- **O** - Open/Closed: Open for extension, closed for modification
- **L** - Liskov Substitution: Subtypes must be substitutable
- **I** - Interface Segregation: No unnecessary dependencies
- **D** - Dependency Inversion: Depend on abstractions

### Other Key Principles
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **YAGNI**: You Aren't Gonna Need It

## 🔴🟢🔄 TDD Cycle

```
1. RED    → Write failing test
2. GREEN  → Make it pass (minimal code)
3. REFACTOR → Improve code (keep tests green)
4. REPEAT
```

## ✅ Before Commit Checklist

```bash
# Run these commands:
npm test                    # All tests pass
npm run lint               # No errors
npm run build              # Builds successfully
npx tsc --noEmit          # No TypeScript errors
```

- [ ] Tests pass (>80% coverage)
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Security checked
- [ ] SOLID principles followed
- [ ] No inline styles

## 🎨 Styling Rules

```typescript
// ❌ NEVER
<div style={{ color: 'blue' }}>

// ✅ ALWAYS
<div className="text-primary">

// ✅ BEST
<Card className="bg-card">
  <CardContent className="text-primary">
```

**Rules:**
- Use Shadcn UI components
- Use Tailwind classes
- Use theme variables
- **NEVER** inline styles

## 🔒 Security Checklist

```typescript
// ✅ Always verify auth
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error('Unauthorized');

// ✅ Always check ownership
if (resource.userId !== identity.subject) {
  throw new Error('Forbidden');
}

// ✅ Always validate input
if (!input.trim() || input.length > 500) {
  throw new Error('Invalid input');
}
```

## 🧪 Testing Pattern (AAA)

```typescript
test('should do something', () => {
  // Arrange: Set up
  const data = createTestData();
  
  // Act: Do the thing
  const result = doSomething(data);
  
  // Assert: Verify
  expect(result).toBe(expected);
});
```

## 🏗️ Component Pattern

```typescript
// Container (Smart) - Data & Logic
function TodoListContainer() {
  const todos = useQuery(api.todos.list);
  const handleDelete = useCallback(...);
  
  return <TodoListPresenter todos={todos} onDelete={handleDelete} />;
}

// Presenter (Dumb) - Pure Rendering
interface TodoListPresenterProps {
  todos: Todo[];
  onDelete: (id: string) => void;
}

function TodoListPresenter({ todos, onDelete }: TodoListPresenterProps) {
  return <div>{todos.map(...)}</div>;
}
```

## 🪝 Custom Hook Pattern

```typescript
function useTodoOperations() {
  const create = useMutation(api.todos.create);
  
  const handleCreate = useCallback(async (title: string) => {
    // Validate
    if (!title.trim()) throw new Error('Invalid');
    
    try {
      await create({ title });
      toast.success('Created');
    } catch (error) {
      toast.error('Failed');
      throw error;
    }
  }, [create]);
  
  return { create: handleCreate };
}
```

## 💾 Convex Query Pattern

```typescript
export const listTodos = query({
  args: {
    filter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Auth check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    // 2. Query with user isolation
    const todos = await ctx.db
      .query('todos')
      .withIndex('by_user', q => q.eq('userId', identity.subject))
      .collect();
    
    // 3. Return
    return todos;
  },
});
```

## 💾 Convex Mutation Pattern

```typescript
export const createTodo = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Auth
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    // 2. Validate
    if (!args.title.trim()) throw new Error('Invalid');
    if (args.title.length > 500) throw new Error('Too long');
    
    // 3. Execute
    const id = await ctx.db.insert('todos', {
      title: args.title.trim(),
      userId: identity.subject,
      completed: false,
    });
    
    // 4. Return
    return id;
  },
});
```

## ⚠️ Error Handling

```typescript
try {
  await doSomething();
  toast.success('Success message');
} catch (error) {
  // Log with context
  console.error('Operation failed:', { context, error });
  
  // User-friendly message
  toast.error('Failed to complete action');
  
  // Re-throw for upstream handling
  throw error;
}
```

## 🤖 Cursor AI Quick Prompts

### New Feature
```
"Following @DEVELOPMENT_GUIDELINES.md, @TESTING_STRATEGY.md, 
and @ARCHITECTURE_PATTERNS.md, help me implement [feature] 
using TDD approach."
```

### Quality Check
```
"Audit this code against @CODE_QUALITY_CHECKLIST.md and 
@SECURITY_GUIDELINES.md. Report any issues."
```

### Get Docs
```
"Use Context7 to get [React/Convex/Tailwind] best practices 
for [topic]"
```

### Find Component
```
"Use Shadcn MCP to find a [component type] and show usage examples"
```

## 📏 Type Safety

```typescript
// ✅ Explicit types
interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  userId: string;
}

function createTodo(title: string): Promise<Todo> {
  // Implementation
}

// ❌ Never use 'any'
function doSomething(data: any): any { // NO!
```

## 🎯 File Naming

- Components: `PascalCase.tsx` (TodoList.tsx)
- Hooks: `camelCase.ts` (useTodos.ts)
- Utils: `camelCase.ts` (formatDate.ts)
- Tests: `FileName.test.tsx`
- Types: `PascalCase.types.ts`

## 📁 Import Order

```typescript
// 1. External
import React from 'react';
import { useQuery } from 'convex/react';

// 2. Internal
import { TodoList } from '@/components/TodoList';
import { useTodos } from '@/hooks/useTodos';

// 3. Types
import type { Todo } from '@/types';

// 4. Styles (if any)
import './styles.css';
```

## 🔍 Common Mistakes

### ❌ Don't
```typescript
// Inline styles
<div style={{ color: 'red' }}>

// Missing auth check
export const getTodo = query({
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id); // No auth!
  },
});

// No input validation
await create({ title: userInput }); // Not validated!

// Using 'any'
function process(data: any) { }

// Skipping tests
// "I'll add tests later" ← NO!
```

### ✅ Do
```typescript
// Theme-based styling
<div className="text-destructive">

// Auth check
export const getTodo = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    // ...
  },
});

// Validate input
if (!userInput.trim()) throw new Error('Invalid');
await create({ title: userInput.trim() });

// Strong types
function process(data: ProcessedData) { }

// TDD: Tests first
test('should create todo', () => {
  // Write test first!
});
```

## 📊 Coverage Goals

- Overall: **>80%**
- Critical paths: **100%**
- Business logic: **>90%**
- UI components: **>70%**

## 🚦 Status Indicators

### ✅ Ready to Commit
- All tests pass
- No TS/ESLint errors
- Coverage >80%
- Security checked
- Self-reviewed

### ⚠️ Not Ready
- Failing tests
- TS/ESLint errors
- Low coverage
- Security issues
- Not reviewed

### 🔴 Blocked
- Critical bugs
- Security vulnerabilities
- Architecture issues
- Missing requirements

## 🚀 Deployment Quick Reference

### Branch Strategy

```
main  →  Dev Environment  (Auto-deploy)
prod  →  Prod Environment (Auto-deploy)
```

### Development Deployment

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Develop with TDD
# ... write tests, code, refactor ...

# 3. Push & create PR to main
git push origin feature/my-feature

# 4. Get 1 approval → Merge
# ✅ Auto-deploys to dev!
```

### Production Deployment

```bash
# 1. Test in dev first!

# 2. Create PR: main → prod
# - 2+ approvals required
# - Security review
# - Release notes

# 3. Merge to prod
# ✅ Auto-deploys to prod!
```

### Deployment Checklist

**To Dev (main)**:
- [ ] Tests pass
- [ ] 1 approval
- [ ] No TS/ESLint errors

**To Prod**:
- [ ] Tested in dev
- [ ] 2+ approvals
- [ ] Security reviewed
- [ ] Release notes ready

### Rollback

```bash
# Revert merge commit
git revert -m 1 <commit-hash>
git push origin prod  # Auto-redeploys
```

## 📞 Getting Help

1. **Check docs**: `/docs` folder
2. **Use Cursor AI**: Reference docs in prompts
3. **Search codebase**: Look for similar patterns
4. **Ask team**: Don't stay blocked

## 🎓 Documentation Links

- [Development Guidelines](./DEVELOPMENT_GUIDELINES.md)
- [Code Quality Checklist](./CODE_QUALITY_CHECKLIST.md)
- [Security Guidelines](./SECURITY_GUIDELINES.md)
- [Testing Strategy](./TESTING_STRATEGY.md)
- [Architecture Patterns](./ARCHITECTURE_PATTERNS.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) ⭐
- [Cursor AI Guide](./CURSOR_AI_GUIDE.md)

## 💡 Daily Workflow

```
Morning:
1. Pull latest changes
2. Review assigned tasks
3. Read relevant docs

Development:
1. Write tests (TDD - RED)
2. Implement (TDD - GREEN)
3. Refactor (TDD - REFACTOR)
4. Commit with good message

Before End of Day:
1. Run all quality checks
2. Push changes
3. Update status
4. Document decisions
```

## 🏆 Best Practices Summary

1. **TDD Always**: Tests before code
2. **SOLID Always**: In every component
3. **Security First**: Check auth, validate input
4. **Type Safe**: No `any`, explicit types
5. **Theme Styling**: No inline styles
6. **Quality Audits**: Before every commit
7. **Documentation**: Keep it updated
8. **Clean Code**: Simple, readable, maintainable

---

**Print this page and keep it visible while coding!**

Quick access: `/docs/QUICK_REFERENCE.md`

