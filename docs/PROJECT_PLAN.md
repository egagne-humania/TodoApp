# Project Plan

## Overview

TodoApp implementation plan following TDD principles and SOLID patterns.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind + Shadcn UI
- **Backend**: Convex BaaS
- **Auth**: Microsoft Entra ID
- **Deploy**: Cloudflare Pages + GitHub Actions
- **Testing**: Vitest + React Testing Library + Playwright

## Development Approach

- **TDD**: Write tests before implementation
- **SOLID**: Follow all 5 principles
- **Security First**: Authentication and validation on every endpoint
- **Theme-Based**: No inline styles, Shadcn components only

## Implementation Phases

### Phase 0: Setup ✅ COMPLETE
**Duration**: 1 day

- [x] Initialize React + Vite + TypeScript
- [x] Setup Convex
- [x] Configure ESLint, testing (Vitest, Playwright)
- [x] Setup GitHub Actions
- [ ] Configure Cloudflare Pages (see DEPLOYMENT.md)

### Phase 1: Foundation & Core Setup
**Duration**: 3-4 days

**Tasks**:
1. Install Shadcn components (button, card, input, form, etc.)
2. Configure theme (Tailwind, CSS variables, dark mode)
3. Define database schema (TDD approach)
4. Create TypeScript types
5. Setup basic routing

**Success Criteria**:
- All Shadcn components installed
- Theme working with dark mode
- Schema deployed to Convex
- Types defined and used throughout

### Phase 2: Authentication
**Duration**: 3-4 days

**Tasks**:
1. Configure Microsoft Entra ID
2. Implement auth provider with MSAL
3. Create login/logout flows (TDD)
4. Setup Convex authentication integration
5. Implement auth guards and protected routes

**Success Criteria**:
- Users can log in with Microsoft account
- Tokens managed securely (not in localStorage)
- Protected routes redirect to login
- User session persists appropriately

### Phase 3: Core Todo CRUD
**Duration**: 4-5 days

**Tasks**:
1. **Backend** (TDD first):
   - Create todo query (with auth check)
   - List todos query (user isolation)
   - Update todo mutation (ownership verification)
   - Delete todo mutation (ownership verification)
   - Complete/uncomplete todo mutation
   
2. **Frontend** (TDD first):
   - TodoList container + presenter components
   - TodoItem component with actions
   - TodoForm for creating todos
   - Empty state component
   - Loading skeleton

**Success Criteria**:
- All CRUD operations working
- Real-time sync (Convex)
- User can only see/edit own todos
- >80% test coverage
- No inline styles

### Phase 4: Enhanced Features
**Duration**: 3-4 days

**Tasks**:
1. Filters (All, Active, Completed)
2. Search functionality
3. Priority levels (Low, Medium, High)
4. Due dates
5. Todo descriptions

**Success Criteria**:
- Filters work correctly
- Search is performant
- Priority displayed visually (theme colors)
- Due dates validated

### Phase 5: UI Polish & UX
**Duration**: 3-4 days

**Tasks**:
1. Responsive design (mobile, tablet, desktop)
2. Toast notifications (using Sonner)
3. Confirmation dialogs (delete)
4. Keyboard shortcuts
5. Accessibility audit (ARIA labels, keyboard nav)

**Success Criteria**:
- Works on mobile/tablet/desktop
- User feedback for all actions
- WCAG AA compliance
- Keyboard navigation works

### Phase 6: Advanced Features
**Duration**: 4-5 days

**Tasks**:
1. Todo categories/tags
2. Bulk operations (select multiple, delete all completed)
3. Todo reordering (drag & drop)
4. Export/import todos
5. Settings page (preferences)

**Success Criteria**:
- Categories functional
- Bulk actions work
- Drag & drop smooth
- Export/import working

### Phase 7: Performance & Optimization
**Duration**: 2-3 days

**Tasks**:
1. Implement pagination/virtualization for long lists
2. Optimize bundle size (code splitting)
3. Add loading states everywhere
4. Optimize images and assets
5. Performance testing (Lighthouse)

**Success Criteria**:
- Long lists (1000+ todos) perform well
- Lighthouse score >90
- Fast initial load (<3s)
- No layout shifts

### Phase 8: Deployment & Production
**Duration**: 2-3 days

**Tasks**:
1. Setup Cloudflare Pages (see DEPLOYMENT.md)
2. Configure CI/CD fully
3. Setup production Convex deployment
4. Configure production secrets
5. Run full E2E test suite
6. Security audit
7. Production deployment

**Success Criteria**:
- Dev deployment working
- Prod deployment working
- All tests passing in CI
- Security audit passed
- Production app accessible

## Timeline

**Total Duration**: 6-8 weeks (single developer)

```
Week 1-2:  Phase 1-2 (Foundation + Auth)
Week 3-4:  Phase 3-4 (CRUD + Enhanced Features)
Week 5-6:  Phase 5-6 (UI Polish + Advanced Features)
Week 7-8:  Phase 7-8 (Performance + Deployment)
```

## Success Metrics

### Code Quality
- Test coverage >80%
- Zero TypeScript errors
- Zero ESLint errors
- All tests passing

### Security
- Authentication on all protected endpoints
- Authorization (ownership) verified
- Input validation comprehensive
- No secrets in code

### Performance
- Lighthouse score >90
- Initial load <3s
- Smooth interactions (60 FPS)

### Accessibility
- WCAG AA compliant
- Keyboard navigation
- Screen reader compatible

## Risk Management

### Identified Risks

1. **Microsoft Entra ID Setup Complexity**
   - Mitigation: Use placeholder auth initially, implement later

2. **Convex Learning Curve**
   - Mitigation: Start with simple queries, leverage docs and MCP tools

3. **Testing Overhead**
   - Mitigation: TDD actually saves time by catching issues early

4. **Cloudflare Deployment Issues**
   - Mitigation: Test locally with `npm run preview`, use detailed deployment guide

### Contingency Plans

- **Auth delays**: Use mock auth provider for development
- **Convex issues**: Have local mock data fallback
- **Deployment blocks**: Can deploy frontend separately from backend

## Resources

### Documentation
- ARCHITECTURE.md - Patterns and design decisions
- DEVELOPMENT.md - Coding practices and guidelines
- DEPLOYMENT.md - Deployment procedures

### Tools
- Convex MCP - Backend management
- Shadcn MCP - Component discovery
- Context7 MCP - Up-to-date library docs

### External Docs
- [Convex Docs](https://docs.convex.dev/)
- [Shadcn UI](https://ui.shadcn.com/)
- [React Docs](https://react.dev/)
- [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/)

## Next Steps

1. Complete Cloudflare setup (see DEPLOYMENT.md)
2. Start Phase 1: Install Shadcn components
3. Follow TDD approach for all features
4. Reference DEVELOPMENT.md for coding standards
5. Use ARCHITECTURE.md for pattern guidance
