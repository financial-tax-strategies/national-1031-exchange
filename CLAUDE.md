# Claude Code Guidelines for National 1031 Exchange Website

## Project Overview

**What**: Marketing website for The 1031 Center (national-1031-exchange.com)
**Stack**: Astro 5, React 19 (islands), TypeScript, Tailwind CSS 4, Supabase, Vercel SSR
**Rendering**: Server-Side Rendering (SSR) via Vercel adapter

## Quick Commands

```bash
# Development
npm run dev              # Start Astro dev server
npm run build            # Production build
npm run preview          # Preview production build

# Quality checks (run before completing any task)
npm run typecheck        # TypeScript validation
npm run lint             # ESLint (auto-fix)

# Testing
npm run test             # Vitest watch mode
npm run test:ci          # CI mode with coverage
npm run test:ui          # Vitest UI
```

## Architecture

### SSR Configuration
The site uses SSR (not static generation) for dynamic content:

```javascript
// astro.config.mjs
output: 'server'
adapter: vercel()
```

**Why SSR**: Database updates (like team member changes) appear immediately without rebuild.

### React Islands
Use React components for interactive UI within Astro pages:
```astro
---
import MyComponent from '../components/MyComponent';
---
<MyComponent client:load />
```

## Key Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro + Vercel SSR configuration |
| `src/pages/` | File-based routing |
| `src/components/` | Astro + React components |
| `src/layouts/` | Page layouts |

## Before Completing Any Task

```bash
npm run typecheck    # Must pass
npm run lint         # Must pass
npm run build        # Must succeed
```

## Known Solutions

### Team Admin Interface - SSR Fix
**Problem**: Team member updates weren't showing until site rebuild.
**Solution**: Converted to SSR mode (see `astro.config.mjs`).
**PR**: #47

## Supabase Integration

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);
```

## Deployment

- **Platform**: Vercel
- **SSR**: Vercel Serverless Functions (auto-configured by adapter)
- **Preview Deploys**: PR previews via Vercel Git integration

## ⚠️ Critical Notes

- **SSR mode** - Pages render on each request, not at build time
- **Astro 5** - Uses latest content collections and features
- **Tailwind CSS 4** - New syntax (use `@import "tailwindcss"`)
- **React 19** - Latest React with islands architecture
- **Node 20+** - Required by engine specification
