# Code Quality Audit Checklist

## Overview
This checklist should be used to audit code quality for every task, feature, or pull request. Each item must be verified before considering work complete.

## Pre-Development Checklist

### Planning
- [ ] Requirements clearly defined and understood
- [ ] Architecture/design reviewed for SOLID principles
- [ ] Technical approach documented
- [ ] Edge cases identified
- [ ] Dependencies and integrations mapped

### Test-Driven Development (TDD)
- [ ] Test cases written BEFORE implementation
- [ ] Test coverage plan defined (aim for >80%)
- [ ] Test scenarios cover happy path and edge cases
- [ ] Integration test needs identified

## Code Quality Standards

### TypeScript & Type Safety
- [ ] No `any` types used (without explicit justification)
- [ ] All function parameters have explicit types
- [ ] All function return types explicitly declared
- [ ] Interfaces defined for all data structures
- [ ] Enums or union types used for fixed value sets
- [ ] Type guards implemented where needed
- [ ] Generic types used appropriately
- [ ] No TypeScript errors (run `npm run build`)

```typescript
// ✅ Good example
interface TodoItem {
  _id: string;
  title: string;
  completed: boolean;
}

function createTodo(title: string): Promise<TodoItem> {
  // ...
}

// ❌ Bad example
function createTodo(title: any): any {
  // ...
}
```

### Component Quality

#### Single Responsibility
- [ ] Each component has one clear purpose
- [ ] Component size is manageable (<200 lines)
- [ ] Complex logic extracted to custom hooks
- [ ] Presentational components separated from container components
- [ ] No business logic in UI components

#### Props & Interfaces
- [ ] All props properly typed with interfaces
- [ ] Optional props marked with `?`
- [ ] Default props provided where appropriate
- [ ] Props destructured for clarity
- [ ] No prop drilling (more than 2 levels)

```typescript
// ✅ Good example
interface TodoItemProps {
  todo: TodoItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function TodoItem({ 
  todo, 
  onEdit, 
  onDelete, 
  className 
}: TodoItemProps) {
  // ...
}
```

#### Component Structure
- [ ] Imports organized (external, internal, types, styles)
- [ ] Types/interfaces defined before component
- [ ] Component logic before JSX return
- [ ] Early returns for conditional rendering
- [ ] Consistent formatting and indentation

### Custom Hooks Quality
- [ ] Hook name starts with "use"
- [ ] Hook has single, clear responsibility
- [ ] Dependencies properly listed in dependency arrays
- [ ] Returns stable references (useCallback/useMemo where needed)
- [ ] Proper cleanup in useEffect
- [ ] No direct DOM manipulation (use refs)

```typescript
// ✅ Good example
function useTodoOperations() {
  const createTodo = useMutation(api.todos.create);
  
  const handleCreate = useCallback(async (title: string) => {
    if (!title.trim()) {
      throw new Error('Title is required');
    }
    return await createTodo({ title: title.trim() });
  }, [createTodo]);
  
  return { create: handleCreate };
}
```

### Convex Backend Quality

#### Queries
- [ ] Query purpose is clear and focused
- [ ] Arguments validated with Convex validators
- [ ] Authentication checked when required
- [ ] Efficient database indexes used
- [ ] Query returns only necessary data
- [ ] Pagination implemented for large datasets
- [ ] No N+1 query problems

```typescript
// ✅ Good example
export const listTodos = query({
  args: {
    completed: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');
    
    const limit = args.limit ?? 50;
    
    let query = ctx.db
      .query('todos')
      .withIndex('by_user', q => q.eq('userId', identity.subject));
    
    if (args.completed !== undefined) {
      query = query.filter(q => q.eq('completed', args.completed));
    }
    
    return await query.take(limit);
  },
});
```

#### Mutations
- [ ] Mutation purpose is atomic and clear
- [ ] Input validation comprehensive
- [ ] Authorization checks performed
- [ ] Error handling explicit and meaningful
- [ ] Side effects properly managed
- [ ] Transaction boundaries appropriate
- [ ] Idempotency considered

```typescript
// ✅ Good example
export const updateTodo = mutation({
  args: {
    id: v.id('todos'),
    title: v.optional(v.string()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }
    
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    
    if (todo.userId !== identity.subject) {
      throw new Error('Forbidden');
    }
    
    if (args.title !== undefined && !args.title.trim()) {
      throw new Error('Title cannot be empty');
    }
    
    await ctx.db.patch(args.id, {
      ...(args.title !== undefined && { title: args.title.trim() }),
      ...(args.completed !== undefined && { completed: args.completed }),
    });
    
    return args.id;
  },
});
```

### Error Handling
- [ ] All async operations wrapped in try-catch
- [ ] Errors logged with context
- [ ] User-friendly error messages shown
- [ ] Errors not silenced or hidden
- [ ] Error boundaries implemented for component trees
- [ ] Network errors handled gracefully
- [ ] Validation errors provide clear feedback

```typescript
// ✅ Good example
try {
  await updateTodo({ id, title: newTitle });
  toast.success('Todo updated successfully');
} catch (error) {
  console.error('Failed to update todo:', { id, error });
  
  if (error.message.includes('Unauthorized')) {
    toast.error('Please log in to continue');
  } else if (error.message.includes('not found')) {
    toast.error('Todo no longer exists');
  } else {
    toast.error('Failed to update todo. Please try again.');
  }
  
  // Don't swallow the error
  throw error;
}
```

### Performance
- [ ] No unnecessary re-renders
- [ ] React.memo used for pure components
- [ ] useMemo used for expensive computations
- [ ] useCallback used for stable callbacks
- [ ] Large lists virtualized or paginated
- [ ] Images optimized and lazy-loaded
- [ ] Code splitting implemented where beneficial
- [ ] Bundle size monitored

### Styling & UI
- [ ] **NO inline styles used**
- [ ] Shadcn components used as base
- [ ] Theme variables used for colors and spacing
- [ ] Tailwind utility classes used consistently
- [ ] Responsive design implemented (mobile-first)
- [ ] Dark mode support (if applicable)
- [ ] Component variants properly styled
- [ ] CSS class organization follows pattern

```typescript
// ❌ Bad: Inline styles
<div style={{ color: 'blue', padding: '10px' }}>

// ✅ Good: Theme-based classes
<div className="text-primary p-4">

// ✅ Better: Shadcn component
<Card>
  <CardContent className="text-primary">
```

### Accessibility (a11y)
- [ ] Semantic HTML elements used
- [ ] ARIA labels provided where needed
- [ ] Keyboard navigation fully functional
- [ ] Focus states visible and logical
- [ ] Color contrast meets WCAG AA standards
- [ ] Images have alt text
- [ ] Forms have proper labels
- [ ] Error messages announced to screen readers

### Code Style & Conventions
- [ ] ESLint rules pass with no errors
- [ ] ESLint warnings addressed or justified
- [ ] Consistent naming conventions followed
- [ ] Code properly formatted (Prettier)
- [ ] No console.log statements (use proper logging)
- [ ] No commented-out code
- [ ] No TODO comments without tickets
- [ ] Import statements organized

### Documentation
- [ ] Complex functions have JSDoc comments
- [ ] Component props documented
- [ ] Non-obvious logic explained with comments
- [ ] README updated if new setup required
- [ ] API changes documented
- [ ] Architecture decisions recorded (ADR)

## Testing Checklist

### Unit Tests
- [ ] All new functions have unit tests
- [ ] All new components have tests
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Test names clearly describe what is being tested
- [ ] Edge cases covered
- [ ] Error cases covered
- [ ] Mock dependencies properly
- [ ] Tests are deterministic (no flaky tests)
- [ ] All tests pass: `npm test`

### Integration Tests
- [ ] Component integration tested
- [ ] API integration tested
- [ ] User workflows tested
- [ ] Authentication flows tested
- [ ] Error scenarios tested

### Test Coverage
- [ ] Coverage meets minimum threshold (>80%)
- [ ] Critical paths have 100% coverage
- [ ] Branch coverage adequate
- [ ] No untested error paths

## Security Checklist

### Authentication & Authorization
- [ ] User authentication verified before operations
- [ ] Authorization checks on all protected routes
- [ ] User can only access their own data
- [ ] Tokens handled securely
- [ ] Session management proper

### Input Validation
- [ ] All user inputs validated
- [ ] SQL injection prevented (Convex handles this)
- [ ] XSS prevention implemented
- [ ] CSRF protection in place
- [ ] File upload validation (if applicable)

### Data Protection
- [ ] Sensitive data not logged
- [ ] No secrets in code or commits
- [ ] Environment variables used for config
- [ ] PII handled according to regulations
- [ ] Data encryption where required

See [SECURITY_GUIDELINES.md](./SECURITY_GUIDELINES.md) for complete security audit.

## Regression Testing

### Pre-Deployment
- [ ] All existing tests still pass
- [ ] No unintended behavior changes
- [ ] Related features manually tested
- [ ] Integration points verified
- [ ] Performance not degraded
- [ ] No new TypeScript errors
- [ ] No new linter errors
- [ ] Build succeeds without warnings

### Smoke Testing
- [ ] Application starts successfully
- [ ] Core user flows functional
- [ ] Authentication works
- [ ] Data loads correctly
- [ ] No console errors on startup

## DRY Principle Verification

- [ ] No duplicate code exists
- [ ] Common patterns extracted to utilities
- [ ] Repeated components consolidated
- [ ] Shared logic in custom hooks
- [ ] Constants defined once and imported

## SOLID Principles Verification

- [ ] **S**: Single Responsibility - Each module/component has one reason to change
- [ ] **O**: Open/Closed - Components extensible without modification
- [ ] **L**: Liskov Substitution - Derived components substitute base types
- [ ] **I**: Interface Segregation - No unnecessary dependencies
- [ ] **D**: Dependency Inversion - Depend on abstractions not concretions

## Final Checks

### Before Committing
- [ ] All checklist items above verified
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Build successful
- [ ] Changes reviewed personally
- [ ] Commit message follows conventions

### Before Pull Request
- [ ] PR description clear and complete
- [ ] Screenshots/videos for UI changes
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)
- [ ] Reviewers can test changes locally
- [ ] CI/CD pipeline passes

### Before Merging
- [ ] Code review approved
- [ ] All PR comments addressed
- [ ] Conflicts resolved
- [ ] Final test run successful
- [ ] Documentation updated

## Automated Checks

Run these commands before considering work complete:

```bash
# TypeScript compilation
npm run build

# Linting
npm run lint

# Tests
npm test

# Test coverage
npm test -- --coverage

# Type checking only
npx tsc --noEmit
```

## Quality Metrics

Track these metrics for continuous improvement:

- **Code Coverage**: Target >80%
- **TypeScript Strict Mode**: Always enabled
- **Linter Errors**: Zero tolerance
- **Bundle Size**: Monitor and optimize
- **Lighthouse Score**: Target >90
- **Build Time**: Keep under reasonable limits

## Tools

Use these tools to maintain quality:

- **ESLint**: Enforce code style
- **Prettier**: Format code consistently
- **TypeScript**: Type safety
- **React DevTools**: Debug components
- **Convex Dashboard**: Monitor backend
- **Chrome Lighthouse**: Performance & a11y
- **Axe DevTools**: Accessibility testing

## When to Fail Quality Audit

Work should NOT be considered complete if:

- Any tests are failing
- TypeScript errors exist
- Linter errors not addressed
- Security vulnerabilities identified
- Performance severely degraded
- Accessibility issues found
- Code coverage below threshold
- Documentation missing

## Continuous Improvement

- [ ] Lessons learned documented
- [ ] Patterns added to style guide
- [ ] Reusable components added to library
- [ ] Common issues added to checklist
- [ ] Team knowledge shared

---

**Remember**: Quality is not negotiable. Take the time to do it right. Code that passes this checklist will be maintainable, secure, and reliable.

