# Contributing to National 1031 Exchange

## Git Workflow for Netlify Deployments

Since we deploy directly through Netlify without local testing, we follow a strict branch-based workflow to ensure all changes are properly tested before reaching production.

## Branch Strategy

```
main (production)
  └── feature/[description]  # New features
  └── fix/[description]      # Bug fixes
  └── enhance/[description]  # Improvements
  └── hotfix/[description]   # Urgent production fixes
```

## Workflow Steps

### 1. Create a Descriptive Branch

Always create a new branch for any changes:

```bash
# For new features
git checkout -b feature/advanced-calculator

# For bug fixes
git checkout -b fix/form-validation-error

# For enhancements
git checkout -b enhance/seo-optimization

# For urgent fixes
git checkout -b hotfix/critical-security-patch
```

### 2. Make Changes and Commit

- Commit frequently with clear, descriptive messages
- Follow conventional commit format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `enhance:` for improvements
  - `docs:` for documentation
  - `style:` for formatting changes
  - `refactor:` for code restructuring

```bash
git add .
git commit -m "feat: Add social media links to team profiles"
```

### 3. Push to Trigger Netlify Preview

Push your branch to GitHub immediately after commits:

```bash
git push -u origin feature/your-feature-name
```

This triggers a Netlify Deploy Preview for testing.

### 4. Create Pull Request Early

Create a PR as soon as you push your first commit:

1. Go to https://github.com/matthewdnye/national-1031-exchange
2. Click "Compare & pull request"
3. Add a clear description of changes
4. Note the Netlify Deploy Preview URL in the PR

### 5. Continue Development

- Keep pushing commits to the branch
- Each push automatically updates the Netlify preview
- Test your changes on the preview URL
- Request review when ready

### 6. Merge When Ready

After testing on the Netlify preview:

1. Ensure all checks pass
2. Get approval if required
3. Merge via GitHub PR interface
4. Delete the branch after merge

## Important Guidelines

### ✅ DO:

- Create a branch for every change
- Push immediately to get Netlify preview
- Test thoroughly on preview URL
- Keep commits focused and atomic
- Write clear commit messages
- Delete branches after merge

### ❌ DON'T:

- Push directly to main (except emergencies)
- Merge without testing on Netlify preview
- Leave stale branches
- Combine unrelated changes in one PR

## Commit Message Examples

```bash
# Feature
git commit -m "feat: Add email validation to contact form"

# Fix
git commit -m "fix: Resolve 404 error on team member updates"

# Enhancement
git commit -m "enhance: Improve mobile responsiveness for calculator"

# Multiple changes
git commit -m "feat: Add team member social links

- Add Facebook and Twitter fields to admin
- Display social icons on public profile
- Update Person schema for SEO benefits"
```

## Emergency Procedures

For critical production issues:

1. Create `hotfix/` branch from main
2. Make minimal necessary changes
3. Push and create PR immediately
4. Test on Netlify preview
5. Merge ASAP after verification

## Netlify Preview URLs

Preview URLs follow this pattern:

```
https://deploy-preview-[PR-NUMBER]--[SITE-NAME].netlify.app
```

Example:

```
https://deploy-preview-52--national-1031-exchange.netlify.app
```

## Questions?

If you need clarification on any workflow steps, please ask before proceeding. Consistency is key to maintaining a smooth deployment process.
