# Safe Migration Guide: React to Astro on Netlify

## Current Situation

- **Root directory**: Contains the original Lovable React project
- **website/ directory**: Contains the new Astro site
- **Netlify**: Connected to main branch, expects React build commands

## Safe Migration Strategy

### Option 1: Feature Branch Testing (RECOMMENDED)

This approach lets you test the Astro site on Netlify without affecting your production site.

#### Steps:

1. **Create a feature branch**

```bash
git checkout -b astro-site
```

2. **Move Astro site to root (on feature branch only)**

```bash
# Remove React files (on feature branch)
rm -rf src/ public/ index.html package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js tailwind.config.ts postcss.config.js components.json

# Move Astro site to root
mv website/* .
mv website/.* . 2>/dev/null || true
rmdir website
```

3. **Commit changes**

```bash
git add .
git commit -m "Replace React site with Astro site"
git push origin astro-site
```

4. **Set up branch deploy in Netlify**

- Go to Netlify dashboard → Site settings → Build & deploy
- Under "Branch deploys", add `astro-site` branch
- Netlify will create a preview URL like: `astro-site--your-site-name.netlify.app`

5. **Test thoroughly**

- Check all pages work
- Verify SEO meta tags
- Test responsive design
- Ensure all links work

6. **Merge to production when ready**

```bash
git checkout main
git merge astro-site
git push origin main
```

### Option 2: Subdirectory Deployment (Keep Both Sites)

This keeps both sites available during transition.

1. **Update root netlify.toml**

```toml
[build]
  command = "cd website && npm run build"
  publish = "website/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Commit and push**

```bash
git add .
git commit -m "Deploy Astro site from website subdirectory"
git push origin main
```

### Option 3: Direct Replacement (Higher Risk)

Only use if you're confident and have backups.

1. **Create backup branch**

```bash
git checkout -b react-backup
git push origin react-backup
git checkout main
```

2. **Replace files in main**

```bash
# Remove React files
rm -rf src/ public/ index.html package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js tailwind.config.ts postcss.config.js components.json

# Move Astro site to root
mv website/* .
mv website/.* . 2>/dev/null || true
rmdir website

# Commit and push
git add .
git commit -m "Replace React site with Astro site"
git push origin main
```

## Netlify Configuration Updates

After migration, ensure these settings in Netlify dashboard:

1. **Build command**: `npm run build` (should work automatically)
2. **Publish directory**: `dist` (should work automatically)
3. **Node version**: 18 or higher (if needed, add `.nvmrc` file)

## Rollback Plan

If something goes wrong:

### From Feature Branch:

- Simply don't merge to main
- Delete the feature branch

### From Direct Replacement:

```bash
git checkout react-backup
git branch -D main
git checkout -b main
git push origin main --force
```

## Post-Migration Checklist

- [ ] All pages load correctly
- [ ] Navigation works
- [ ] SEO meta tags present
- [ ] Robots.txt accessible
- [ ] Sitemap.xml generates
- [ ] Contact forms work (when implemented)
- [ ] Analytics tracking active
- [ ] SSL certificate active
- [ ] Custom domain working

## Recommended Approach

**Use Option 1 (Feature Branch Testing)** because:

- Zero risk to production site
- Test everything before going live
- Easy rollback if needed
- Netlify provides preview URL for testing
- Can share preview with team for approval
