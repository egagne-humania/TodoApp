# Cursor AI Development Guide

## Overview
This guide helps software engineers use Cursor AI effectively for developing the TodoApp project. It provides quick references, best practices, and tips for AI-assisted development.

## 📚 Documentation Structure

All project documentation is organized in the `/docs` folder:

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) | SOLID principles, DRY, code organization | Before starting any feature |
| [CODE_QUALITY_CHECKLIST.md](./CODE_QUALITY_CHECKLIST.md) | Quality audit checklist | Before committing code |
| [SECURITY_GUIDELINES.md](./SECURITY_GUIDELINES.md) | Security best practices | When handling auth, data, or user input |
| [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) | TDD guidelines and testing patterns | Before writing any code (TDD) |
| [ARCHITECTURE_PATTERNS.md](./ARCHITECTURE_PATTERNS.md) | Design patterns and architecture | When designing components or features |
| [CURSOR_AI_GUIDE.md](./CURSOR_AI_GUIDE.md) | This file - AI development guide | When working with Cursor AI |

## 🤖 Using Cursor AI Effectively

### Before Starting Development

1. **Review Documentation**
   ```
   Ask Cursor: "Show me the development guidelines for this project"
   Ask Cursor: "What's the recommended architecture pattern for [feature]?"
   ```

2. **Understand the Context**
   - Open relevant files in Cursor
   - Use `@docs` to reference documentation
   - Use `@codebase` for codebase-wide questions

3. **Check Current State**
   ```
   Ask Cursor: "Are there any TypeScript errors in the project?"
   Ask Cursor: "What's the current test coverage?"
   ```

### TDD with Cursor AI

#### Step 1: Write Tests First (RED)

```
Prompt: "Following TDD, write tests for a TodoList component that:
- Displays a list of todos
- Shows empty state when no todos
- Filters by completed status
- Calls onDelete when delete button clicked

Use React Testing Library and follow the patterns in TESTING_STRATEGY.md"
```

**Best Practice**: Explicitly mention TDD and ask for tests first.

#### Step 2: Implement Feature (GREEN)

```
Prompt: "Now implement the TodoList component to make these tests pass.
Follow the Container/Presentational pattern from ARCHITECTURE_PATTERNS.md.
Use Shadcn UI components."
```

#### Step 3: Refactor (REFACTOR)

```
Prompt: "Refactor this code to improve:
- Adherence to SOLID principles
- DRY violations
- Performance optimizations
Keep all tests passing."
```

### Feature Development Workflow

#### 1. Planning Phase

```
Prompt: "I need to implement [feature]. Following our architecture patterns:
1. What components will I need?
2. What Convex queries/mutations?
3. What tests should I write first (TDD)?
4. What security considerations?"
```

#### 2. Implementation Phase

```
Prompt: "Create a [component] that [requirements].
- Follow SOLID principles
- Use TypeScript strictly (no 'any')
- Use Shadcn components
- Include error handling
- Make it accessible (a11y)
- Write tests first (TDD)"
```

#### 3. Review Phase

```
Prompt: "Review this code against:
- CODE_QUALITY_CHECKLIST.md
- SECURITY_GUIDELINES.md
Identify any issues or improvements."
```

### MCP Tools Available

#### Context7 - Library Documentation

Use for getting current, accurate documentation for libraries:

```
Prompt: "Use Context7 to get the latest React hooks documentation"
Prompt: "Get Convex best practices for queries using Context7"
Prompt: "Show me Tailwind CSS responsive design patterns from Context7"
```

**Available Libraries**:
- React (`/websites/react_dev`)
- Convex (`/llmstxt/convex_dev_llms-full_txt`)
- Tailwind CSS (`/websites/tailwindcss`)
- TypeScript
- And many more...

#### Shadcn MCP - Component Library

Use for discovering and implementing UI components:

```
Prompt: "Search Shadcn for a dialog component"
Prompt: "Show me examples of using the Shadcn Button component"
Prompt: "Get the add command for Shadcn Card component"
```

**Common Commands**:
- `mcp_shadcn_search_items_in_registries` - Search for components
- `mcp_shadcn_view_items_in_registries` - View component details
- `mcp_shadcn_get_item_examples_from_registries` - Get usage examples
- `mcp_shadcn_get_add_command_for_items` - Get installation command

#### Convex MCP - Backend Management

Use for interacting with Convex backend:

```
Prompt: "Show me the current Convex deployment status"
Prompt: "List all tables in the Convex database"
Prompt: "Run the todos.list query on Convex"
```

**Common Commands**:
- `mcp_convex_status` - Check deployment status
- `mcp_convex_tables` - List database tables
- `mcp_convex_functionSpec` - Get function metadata
- `mcp_convex_run` - Run queries/mutations
- `mcp_convex_logs` - View logs

## 🎯 Common Development Tasks

### Creating a New Component

```
Prompt: "Create a new [ComponentName] following these requirements:
[List requirements]

Requirements:
- Write tests FIRST (TDD approach)
- Follow Container/Presentational pattern
- Use Shadcn UI components (no custom styling)
- Include TypeScript types
- Handle loading and error states
- Add accessibility features
- Follow SOLID principles

Reference:
- @DEVELOPMENT_GUIDELINES.md
- @ARCHITECTURE_PATTERNS.md
- @TESTING_STRATEGY.md"
```

### Adding a Convex Query/Mutation

```
Prompt: "Create a Convex [query/mutation] for [purpose].

Requirements:
- Write tests FIRST
- Include authentication check
- Add authorization (user can only access their data)
- Validate all inputs
- Use Convex validators
- Handle errors properly
- Add JSDoc comments

Reference:
- @SECURITY_GUIDELINES.md
- @CODE_QUALITY_CHECKLIST.md

Use Context7 for Convex best practices."
```

### Implementing Authentication

```
Prompt: "Implement Microsoft Entra ID authentication.

Requirements:
- Secure token storage (not localStorage)
- Token refresh mechanism
- Logout functionality
- Protected routes
- Follow security best practices

Reference:
- @SECURITY_GUIDELINES.md (Authentication Security section)

Use Context7 for Microsoft Entra ID latest docs."
```

### Adding a New Feature

```
Prompt: "I need to add [feature description].

Please:
1. Review the architecture and suggest the best approach
2. Write comprehensive tests FIRST (TDD)
3. Implement the feature following SOLID principles
4. Use Shadcn UI for all components
5. Ensure security best practices
6. Run quality audits

Reference all documentation:
- @DEVELOPMENT_GUIDELINES.md
- @ARCHITECTURE_PATTERNS.md
- @TESTING_STRATEGY.md
- @SECURITY_GUIDELINES.md
- @CODE_QUALITY_CHECKLIST.md"
```

### Refactoring Code

```
Prompt: "Refactor this code to improve:
1. SOLID principles adherence
2. DRY violations
3. Type safety
4. Performance
5. Testability

Keep all tests passing. Reference @DEVELOPMENT_GUIDELINES.md"
```

### Debugging Issues

```
Prompt: "This code has [issue]. 
1. Check TypeScript errors
2. Review test failures
3. Check security implications
4. Suggest fixes following our guidelines

Reference @CODE_QUALITY_CHECKLIST.md and @SECURITY_GUIDELINES.md"
```

## ✅ Code Quality Checks with Cursor AI

### Before Committing

```
Prompt: "Run a complete quality audit on my changes:
1. Check against CODE_QUALITY_CHECKLIST.md
2. Review for security issues (SECURITY_GUIDELINES.md)
3. Verify tests pass and coverage is >80%
4. Check TypeScript errors
5. Review ESLint warnings
6. Verify SOLID principles followed
7. Check for DRY violations

Provide a detailed report with any issues found."
```

### Pre-Pull Request

```
Prompt: "Prepare this code for pull request:
1. Run full quality audit
2. Check documentation is updated
3. Verify all tests pass
4. Generate a PR description
5. List breaking changes (if any)
6. Create a testing guide for reviewers

Reference all docs."
```

## 🔒 Security Review with AI

```
Prompt: "Perform a security audit on [file/feature]:
1. Check authentication/authorization
2. Review input validation
3. Look for XSS vulnerabilities
4. Check for data exposure
5. Review error handling
6. Verify token management

Use SECURITY_GUIDELINES.md as reference."
```

## 🧪 Testing with AI

### Generate Tests

```
Prompt: "Generate comprehensive tests for [component/function]:
1. Unit tests (AAA pattern)
2. Integration tests
3. Edge cases
4. Error cases
5. Accessibility tests

Follow TESTING_STRATEGY.md. Aim for >80% coverage."
```

### Fix Failing Tests

```
Prompt: "These tests are failing: [test names]
1. Identify the root cause
2. Suggest fixes
3. Ensure no tests are silenced or bypassed
4. Keep tests valid and meaningful

Reference TESTING_STRATEGY.md"
```

## 📊 Performance Optimization

```
Prompt: "Optimize this code for performance:
1. Identify bottlenecks
2. Suggest memoization opportunities
3. Check for unnecessary re-renders
4. Review bundle size impact
5. Ensure optimizations don't harm readability

Follow patterns in ARCHITECTURE_PATTERNS.md"
```

## 🎨 Styling with Shadcn

```
Prompt: "Style this component using:
1. Shadcn UI components as base
2. Tailwind utility classes
3. Theme variables (no inline styles)
4. Responsive design
5. Dark mode support (if applicable)

Use Shadcn MCP to find components and examples."
```

## 📝 Best Practices for AI Prompts

### ✅ Good Prompts

1. **Be Specific and Detailed**
   ```
   ✅ "Create a TodoList component that displays todos with filtering,
       uses Shadcn components, follows TDD, and handles loading states"
   
   ❌ "Make a todo list"
   ```

2. **Reference Documentation**
   ```
   ✅ "Following @DEVELOPMENT_GUIDELINES.md and @TESTING_STRATEGY.md,
       create a custom hook for todo operations"
   
   ❌ "Create a hook"
   ```

3. **Include Requirements**
   ```
   ✅ "Create a mutation with:
       - Authentication check
       - Input validation
       - Error handling
       - Tests first (TDD)
       Reference @SECURITY_GUIDELINES.md"
   
   ❌ "Create a mutation"
   ```

4. **Ask for Best Practices**
   ```
   ✅ "Use Context7 to get React best practices for custom hooks,
       then implement useTodos following those patterns"
   
   ❌ "Make a custom hook"
   ```

5. **Request Quality Checks**
   ```
   ✅ "After implementation, audit against CODE_QUALITY_CHECKLIST.md
       and identify any issues"
   
   ❌ "Done?"
   ```

### ❌ Anti-Patterns to Avoid

1. **Vague Requests**
   - ❌ "Fix this"
   - ✅ "This function has a type error on line 15. Fix it following TypeScript strict mode requirements."

2. **Skipping TDD**
   - ❌ "Create a component"
   - ✅ "Write tests first for a component, then implement it (TDD)"

3. **Ignoring Documentation**
   - ❌ "What should I do?"
   - ✅ "According to DEVELOPMENT_GUIDELINES.md, what's the recommended approach for [task]?"

4. **Not Using MCP Tools**
   - ❌ "How do I use React hooks?"
   - ✅ "Use Context7 to get the latest React hooks documentation"

5. **Accepting Low-Quality Code**
   - ❌ "This works, ship it"
   - ✅ "This works, but audit it against CODE_QUALITY_CHECKLIST.md and improve"

## 🔄 Iterative Development Cycle

### Cycle 1: Plan
```
Cursor AI → Review requirements
         → Check architecture patterns
         → Plan implementation approach
         → Identify dependencies
```

### Cycle 2: Test (RED)
```
Cursor AI → Write failing tests
         → Cover happy path
         → Cover edge cases
         → Cover error cases
```

### Cycle 3: Implement (GREEN)
```
Cursor AI → Write minimal code to pass tests
         → Follow SOLID principles
         → Use proper patterns
         → Handle errors
```

### Cycle 4: Refactor
```
Cursor AI → Improve code quality
         → Remove duplication
         → Optimize performance
         → Keep tests green
```

### Cycle 5: Audit
```
Cursor AI → Quality checklist
         → Security review
         → Performance check
         → Documentation update
```

## 🚀 Productivity Tips

### 1. Use Multi-File Context
Open all related files in Cursor so AI has full context:
- Component file
- Test file
- Related hooks
- Convex queries/mutations
- Documentation files

### 2. Incremental Development
Break large features into small, testable pieces:
```
Prompt: "Let's build [feature] incrementally:
1. First, create the data model and types
2. Then, write Convex queries/mutations
3. Next, create the UI components
4. Finally, integrate everything
Write tests before each step."
```

### 3. Leverage MCP Tools
Always use MCP tools for current information:
- Context7 for library docs
- Shadcn MCP for UI components
- Convex MCP for backend operations

### 4. Document as You Go
```
Prompt: "After implementing [feature], update:
- JSDoc comments
- README if needed
- Add ADR for significant decisions"
```

### 5. Regular Quality Checks
Don't wait until the end:
```
Prompt: "Quick quality check:
- Any TypeScript errors?
- Are all tests passing?
- Coverage still >80%?
- Any security issues?"
```

## 📖 Quick Reference Commands

### Documentation
- `@DEVELOPMENT_GUIDELINES.md` - Development best practices
- `@CODE_QUALITY_CHECKLIST.md` - Quality checklist
- `@SECURITY_GUIDELINES.md` - Security practices
- `@TESTING_STRATEGY.md` - Testing guide
- `@ARCHITECTURE_PATTERNS.md` - Architecture patterns

### MCP Tools
- Context7: `Use Context7 to get [library] documentation`
- Shadcn: `Use Shadcn MCP to find [component]`
- Convex: `Use Convex MCP to [action]`

### Common Tasks
- New Component: Reference all docs + use Shadcn + TDD
- New Query/Mutation: Security + validation + TDD
- Refactor: SOLID + DRY + keep tests green
- Debug: Check errors + tests + security
- Audit: Run full quality checklist

## 🎓 Learning Resources

### Understanding the Codebase
```
Prompt: "Explain the architecture of this project using ARCHITECTURE_PATTERNS.md"
Prompt: "What are the key SOLID principles used in this codebase?"
Prompt: "Show me examples of the Container/Presentational pattern in this project"
```

### Best Practices
```
Prompt: "Use Context7 to get React best practices for [topic]"
Prompt: "What does SECURITY_GUIDELINES.md say about [security topic]?"
Prompt: "Show me the TDD workflow from TESTING_STRATEGY.md"
```

## ⚠️ Important Reminders

### Always Remember
1. **TDD First**: Write tests before implementation
2. **No Inline Styles**: Use Shadcn + Tailwind + themes
3. **Security First**: Check auth, validate input, handle errors
4. **SOLID Principles**: Every component, every function
5. **Documentation**: Reference and update as needed
6. **Quality Audits**: Before committing, always audit
7. **MCP Tools**: Use them for current, accurate information

### Never Forget
1. **Never skip tests** - They're your safety net
2. **Never bypass errors** - Fix them properly
3. **Never commit failing tests** - All must pass
4. **Never use inline styles** - Theme-based only
5. **Never skip security checks** - Security is critical
6. **Never ignore TypeScript errors** - Fix them all
7. **Never assume** - Check documentation

## 🆘 When You're Stuck

1. **Check Documentation**
   ```
   Prompt: "Review all documentation and suggest an approach for [problem]"
   ```

2. **Use Context7**
   ```
   Prompt: "Use Context7 to get current best practices for [problem]"
   ```

3. **Review Similar Code**
   ```
   Prompt: "Find similar patterns in @codebase and show me how they solved [problem]"
   ```

4. **Ask for Multiple Approaches**
   ```
   Prompt: "Suggest 3 different approaches to [problem], with pros/cons for each,
           following our architecture patterns"
   ```

5. **Request Step-by-Step**
   ```
   Prompt: "Break down [complex task] into small, testable steps with TDD approach"
   ```

## 🎯 Success Metrics

Track these to ensure AI-assisted development quality:

- [ ] All tests passing (>80% coverage)
- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors
- [ ] All security checks passed
- [ ] Documentation up to date
- [ ] SOLID principles followed
- [ ] TDD approach used
- [ ] Code quality audit passed
- [ ] Performance acceptable
- [ ] Accessibility compliant

---

## 🌟 Final Tips

1. **Trust but Verify**: AI suggestions are helpful, but always review against guidelines
2. **Iterate**: Don't expect perfection on first try, iterate and improve
3. **Learn**: Use AI to learn best practices, not just generate code
4. **Document**: Keep documentation updated as patterns evolve
5. **Collaborate**: Use AI as a pair programming partner, not a replacement for thinking

**Remember**: The goal is to write high-quality, maintainable, secure code. Use Cursor AI as a tool to achieve that goal, always referencing and following the established guidelines and best practices.

---

For questions or improvements to this guide, please contribute to the documentation.

