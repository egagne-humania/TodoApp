# Styling Guide - Tailwind CSS v4

## ⚠️ Critical: Tailwind v4 Syntax

This project uses **Tailwind CSS v4.1.18**, which has **completely different syntax** from v3.

### Before Writing Any CSS

1. ✅ **Use Context7 MCP** to check Tailwind v4 documentation
2. ✅ Verify version in `package.json`
3. ✅ Check existing `src/index.css` for patterns
4. ✅ Never assume v3 syntax will work

## Tailwind v4 vs v3 Comparison

### CSS File Structure

```css
/* ❌ WRONG (Tailwind v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary: 240 5.9% 10%;
    --background: 0 0% 100%;
  }
}

/* ✅ CORRECT (Tailwind v4) */
@import "tailwindcss";

@theme {
  --color-primary: oklch(62% 0.25 250);
  --color-background: oklch(100% 0 0);
}
```

### Color System

| v3 Syntax | v4 Syntax | Notes |
|-----------|-----------|-------|
| `--primary: 240 5.9% 10%` | `--color-primary: oklch(62% 0.25 250)` | v4 uses OKLCH color space |
| `hsl(var(--primary))` | `var(--color-primary)` | v4 colors are complete values |
| HSL format | OKLCH format | Better perceptual uniformity |

### Dark Mode

```css
/* ❌ v3 */
.dark {
  --primary: 0 0% 98%;
}

/* ✅ v4 */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-primary: oklch(70% 0.20 250);
  }
}
```

### Config File

```javascript
/* ❌ v3 - Complex config with HSL */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        background: 'hsl(var(--background))',
      },
    },
  },
  plugins: [],
}

/* ✅ v4 - IMPORTANT: Must map utilities to CSS variables */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        // ... map ALL theme colors
      },
    },
  },
}
```

**CRITICAL**: In Tailwind v4, you MUST map utility classes to CSS variables in the config, even though colors are defined in `@theme` blocks. Without this mapping, utilities like `bg-primary` won't work!

## Project Color System

### Color Variable Naming

All colors use `--color-*` prefix:

```css
@theme {
  /* Base Colors */
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(20% 0.02 250);
  --color-card: oklch(100% 0 0);
  
  /* Brand Colors */
  --color-primary: oklch(62% 0.25 250);
  --color-secondary: oklch(96% 0.01 250);
  --color-accent: oklch(65% 0.25 290);
  
  /* Semantic Colors */
  --color-success: oklch(55% 0.18 150);
  --color-warning: oklch(65% 0.22 70);
  --color-destructive: oklch(62% 0.23 25);
  
  /* Priority Colors */
  --color-priority-low: oklch(55% 0.18 150);
  --color-priority-medium: oklch(65% 0.22 70);
  --color-priority-high: oklch(60% 0.23 25);
}
```

### Using Colors in Components

```typescript
// ✅ Correct - Tailwind utilities
<Card className="bg-card text-foreground border-border">
  <CardContent className="text-muted-foreground">
    <Button className="bg-primary text-primary-foreground">
      Click Me
    </Button>
  </CardContent>
</Card>

// ✅ Correct - Custom CSS with theme variables
.my-component {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
}

// ❌ Wrong - Inline styles
<div style={{ backgroundColor: 'blue' }}>

// ❌ Wrong - Hardcoded colors
<div className="bg-blue-500">
```

## Custom Utilities

### Defined in `src/index.css`

```css
/* Touch-friendly tap targets */
.tap-target {
  min-height: 44px;
  min-width: 44px;
}

/* Smooth transitions */
.transition-smooth {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Priority badges */
.priority-low {
  background-color: var(--color-priority-low);
  color: var(--color-priority-low-foreground);
  font-weight: 600;
}

/* Glass effect */
.glass-effect {
  background-color: color-mix(in srgb, var(--color-background) 80%, transparent);
  backdrop-filter: blur(12px);
}
```

### Usage

```typescript
<Button className="tap-target transition-smooth">
  Click Me
</Button>

<Badge className="priority-high">
  High Priority
</Badge>

<header className="glass-effect">
  Sticky Header
</header>
```

## Shadcn UI Integration

All Shadcn components automatically use theme colors:

```typescript
// These work out of the box
<Button variant="default">Uses --color-primary</Button>
<Button variant="secondary">Uses --color-secondary</Button>
<Button variant="destructive">Uses --color-destructive</Button>

<Card>Uses --color-card</Card>
<Input>Uses --color-input and --color-border</Input>
```

## Responsive Design

Tailwind v4 uses same breakpoints as v3:

```typescript
<div className="
  w-full                    // Mobile first
  md:w-1/2                  // Tablet
  lg:w-1/3                  // Desktop
  xl:w-1/4                  // Large desktop
">
```

## Dark Mode

Theme switches based on system preference:

```css
/* Light mode (default) */
@theme {
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(20% 0.02 250);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: oklch(20% 0.02 250);
    --color-foreground: oklch(98% 0 0);
  }
}
```

Components automatically adapt:

```typescript
// No dark: prefix needed!
<Card className="bg-card text-foreground">
  Automatically adapts to light/dark mode
</Card>
```

## Common Mistakes

### ❌ Using v3 Syntax

```css
/* DON'T DO THIS */
@tailwind base;
@layer base {
  :root {
    --primary: 240 5.9% 10%;
  }
}
```

**Error**: `Cannot apply unknown utility class`

**Fix**: Use v4 syntax with `@import` and `@theme`

### ❌ Wrong Color Format

```css
/* DON'T DO THIS */
--color-primary: hsl(240 5.9% 10%);
```

**Error**: Colors won't work correctly

**Fix**: Use OKLCH format: `oklch(62% 0.25 250)`

### ❌ Missing `--color-` Prefix

```css
/* DON'T DO THIS */
--primary: oklch(62% 0.25 250);
```

**Error**: Tailwind utilities won't find the color

**Fix**: Use `--color-primary`

## Debugging Checklist

If styles aren't working:

1. ✅ Check dev server logs for PostCSS/Tailwind errors
2. ✅ Verify `@import "tailwindcss"` at top of `index.css`
3. ✅ Verify colors use `--color-*` naming
4. ✅ Verify colors use OKLCH format
5. ✅ Check `postcss.config.js` has `@tailwindcss/postcss`
6. ✅ Check `tailwind.config.js` is minimal (no color definitions)
7. ✅ Use Browser MCP to inspect rendered styles
8. ✅ Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/v4-beta) - Official v4 documentation
- [OKLCH Color Picker](https://oklch.com/) - Generate OKLCH colors
- Context7 MCP - Query for latest v4 syntax
- [Migration Guide](https://tailwindcss.com/docs/upgrade-guide) - v3 to v4 migration

## Quick Reference

### Check Version
```bash
npm list tailwindcss
# Should show: tailwindcss@4.1.18
```

### Valid CSS Structure
```css
@import "tailwindcss";

@theme {
  /* Define colors here using OKLCH */
  --color-primary: oklch(62% 0.25 250);
}

@media (prefers-color-scheme: dark) {
  @theme {
    /* Dark mode overrides */
  }
}

/* Custom utilities */
.my-utility {
  /* Custom CSS */
}
```

### Valid Config
```javascript
// tailwind.config.js
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // That's it! Colors in CSS @theme block
}
```

---

**Remember**: Always use Context7 MCP to verify current Tailwind v4 syntax before writing CSS!
