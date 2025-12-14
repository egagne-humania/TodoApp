# Quality Standards & Verification Checklist

## CRITICAL: Task Completion Rules

**NEVER declare a task complete without completing ALL verification steps.**

### Rule #1: Visual Verification is MANDATORY

For any UI/frontend task:
1. ✅ **MUST** check actual browser console for errors (F12 → Console)
2. ✅ **MUST** verify page renders content (not blank/white screen)
3. ✅ **MUST** verify user can interact with UI elements
4. ✅ **MUST** test in actual browser, not just curl/HTTP requests

**If you cannot access the browser:**
- ❌ **DO NOT** declare task complete
- ✅ **ASK USER** to verify and share console errors
- ✅ **WAIT** for user confirmation before proceeding

### Rule #2: Tests Are Necessary But Not Sufficient

**Passing tests ≠ Working application**

Tests can pass while the app is broken because:
- Mocks may hide real integration issues
- Tests don't catch runtime browser errors  
- Import/module resolution works differently in browser vs test env

**Required verification sequence:**
1. Run tests (npm test)
2. Check TypeScript compilation (npx tsc --noEmit)
3. Check ESLint (npm run lint)
4. **Check Convex backend** (npx tsc -p convex/tsconfig.json)
5. **Check Convex dev server logs** for compilation errors
6. **Verify in actual browser** - THIS IS MANDATORY
7. **Check browser console** for runtime errors

### Rule #3: Backend Verification

For Convex/backend changes:
1. ✅ Check Convex dev server terminal for TypeScript errors
2. ✅ Verify `✔ Convex functions ready!` message appears
3. ✅ Test functions with Convex MCP or dashboard
4. ✅ Verify frontend can connect to backend
5. ✅ Check browser Network tab for API calls

### Rule #4: Error Investigation Protocol

When user reports "blank page" or "not working":

**Step 1: Gather Evidence**
- Read terminal logs for Vite/Convex errors
- Check if Convex functions compiled successfully
- Look for module resolution errors
- Check for TypeScript compilation errors

**Step 2: Test Systematically**
```bash
# Run ALL these commands
npm test
npm run lint
npx tsc --noEmit
npx tsc -p convex/tsconfig.json --noEmit
npm run build  # Test production build
```

**Step 3: Browser Investigation**
- Request browser console screenshot/errors from user
- Check Network tab for failed requests
- Verify CSS is loading
- Check for JavaScript errors

**Step 4: Fix Root Cause**
- Don't assume - investigate actual error
- Fix the underlying issue, not symptoms
- Test fix in browser before declaring complete

### Rule #5: Code Quality Standards

**Required Before Task Completion:**
- ✅ Zero TypeScript errors (frontend AND backend)
- ✅ Zero ESLint errors
- ✅ All tests passing
- ✅ Convex functions compiled successfully
- ✅ No console errors in browser
- ✅ Application renders and is interactive
- ✅ Feature works as specified

**Forbidden Shortcuts:**
- ❌ Using `any` types without justification
- ❌ Disabling TypeScript checks
- ❌ Commenting out errors
- ❌ Using `@ts-ignore` without explanation
- ❌ Declaring complete without browser verification

### Rule #6: Communication Standards

**When Reporting Progress:**
- ✅ Be honest about what you can/cannot verify
- ✅ Clearly state what verification steps were completed
- ✅ Ask for user confirmation when needed
- ✅ Don't claim something works if you can't verify it

**When User Reports Issues:**
- ✅ Acknowledge the issue immediately
- ✅ Don't make excuses
- ✅ Investigate thoroughly before responding
- ✅ Request specific information (console errors, screenshots)
- ✅ Don't declare fixed until user confirms

### Rule #7: Temporary Code and Cleanup

**Before Task Completion:**
- ✅ Remove ALL test/temporary files
- ✅ Remove ALL debugging console.logs
- ✅ Remove ALL commented-out code
- ✅ Remove ALL unused imports
- ✅ Remove ALL TODO comments (unless planned features)

**Forbidden in Production:**
- ❌ Test files in src/ (test-*.tsx, *.test.html)
- ❌ Debug/demo pages (ComponentDemo, StyleTest, etc.)
- ❌ Commented-out code blocks
- ❌ Unused dependencies

## Verification Checklist Template

Copy this checklist for every task:

```markdown
## Task: [Description]

### Pre-Implementation
- [ ] Read requirements carefully
- [ ] Understand dependencies  
- [ ] Plan approach
- [ ] Identify verification method

### Implementation
- [ ] Write tests FIRST (TDD)
- [ ] Implement feature
- [ ] Follow SOLID principles
- [ ] Use proper TypeScript types (no `any`)

### Quality Checks
- [ ] `npm test` - All tests pass
- [ ] `npm run lint` - Zero errors
- [ ] `npx tsc --noEmit` - Zero TypeScript errors
- [ ] `npx tsc -p convex/tsconfig.json --noEmit` - Zero Convex errors
- [ ] Check Convex dev terminal - Functions compiled
- [ ] `npm run build` - Production build succeeds

### Browser Verification (MANDATORY FOR UI)
- [ ] Open browser at http://localhost:5173/
- [ ] Check F12 Console - Zero errors
- [ ] Verify page renders correctly (not blank)
- [ ] Test user interactions work
- [ ] Check Network tab - API calls succeed
- [ ] Test in both light and dark mode
- [ ] Verify responsive design

### Cleanup
- [ ] Remove test/temporary files
- [ ] Remove debug console.logs
- [ ] Remove commented code
- [ ] Remove unused imports
- [ ] Update documentation if needed

### User Verification
- [ ] If cannot verify in browser: ASK USER
- [ ] Wait for user confirmation
- [ ] Address any issues user reports
- [ ] Don't declare complete until user confirms
```

## Common Failure Patterns to Avoid

### Pattern 1: "Tests Pass = Task Complete"
**Wrong:** Tests pass, declare complete
**Right:** Tests pass → Verify in browser → Get user confirmation → Complete

### Pattern 2: "Fixed TypeScript Errors = Working App"
**Wrong:** TypeScript compiles, assume app works
**Right:** TypeScript OK → Check Convex → Check browser → Confirm working

### Pattern 3: "Curl Returns HTML = Page Works"
**Wrong:** HTTP 200 response means page loads
**Right:** HTML loads → JavaScript executes → React renders → Verify visually

### Pattern 4: "Made Changes = Fixed Issue"
**Wrong:** Changed code, assume issue fixed
**Right:** Changed code → Verify fix → Test all affected areas → User confirms

### Pattern 5: "Removed Syntax Error = Task Complete"
**Wrong:** Fixed syntax, declare complete
**Right:** Fixed syntax → Run all checks → Browser verify → User confirm

## Consequences of Violating Standards

**What happens when you skip verification:**
1. User sees blank page
2. User wastes time reporting same issue multiple times
3. Trust is damaged
4. Quality standards questioned
5. More work created (documentation, process improvements)

**The cost of proper verification:**
- 5-10 extra minutes per task
- Potential need to ask user for confirmation

**The cost of skipping verification:**
- User frustration
- Multiple iterations on same issue
- Documentation overhead
- Damaged credibility
- Loss of user trust

## Remember

> **"Working on my machine" means nothing if it doesn't work for the user.**

> **Passing tests are necessary but not sufficient for task completion.**

> **When in doubt, ask the user to verify rather than assuming it works.**

---

**These standards are MANDATORY, not optional.**
**Violating these standards damages trust and wastes everyone's time.**
**Take the extra 5 minutes to verify properly.**
