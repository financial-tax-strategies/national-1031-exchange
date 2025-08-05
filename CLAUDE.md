# CLAUDE.md - Project Knowledge Base

This file contains important solutions and project-specific knowledge for Claude Code sessions.

## Team Admin Interface - SSR Solution

**Problem**: Team member updates in the admin interface were saving successfully to the database but not showing immediately. The updates would only appear after a site rebuild.

**Root Cause**: The site was using Astro's Static Site Generation (SSG) mode by default, which pre-builds all pages at deploy time. Database updates wouldn't be reflected until the next build.

**Solution**: Convert to Server-Side Rendering (SSR) to render pages dynamically on each request.

### Implementation Steps:

1. Install Netlify adapter:

   ```bash
   npm install @astrojs/netlify
   ```

2. Update `astro.config.mjs`:

   ```javascript
   import netlify from '@astrojs/netlify';

   export default defineConfig({
     site: 'https://the1031center.com',
     output: 'server', // Enable SSR
     adapter: netlify(), // Use Netlify adapter
     // ... rest of config
   });
   ```

3. Build and deploy - Netlify will automatically detect SSR and set up edge functions.

**Status**: Implemented and merged in PR #47. The live site now renders pages dynamically, so team member updates appear immediately.

## Lint and Type Check Commands

When making code changes, run these commands before marking tasks complete:

```bash
# Run linting
npm run lint

# Run type checking
npm run typecheck
```

If these commands are not found, ask the user for the correct commands and update this file.
