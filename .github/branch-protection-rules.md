# Branch Protection Rules for main branch

## How to Enable Branch Protection

1. Go to your repository on GitHub
2. Click on **Settings** → **Branches**
3. Click **Add rule**
4. Enter `main` as the branch name pattern
5. Enable the following protections:

### Required Settings

- [x] **Require a pull request before merging**
  - [ ] Require approvals: 1 (optional for solo projects)
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [ ] Require review from CODEOWNERS (optional)
  
- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Select these status checks:
    - `test-and-build (18.x)`
    - `test-and-build (20.x)`
    - `security-scan`

- [x] **Require conversation resolution before merging**

- [x] **Include administrators** (recommended for consistency)

### Optional Enhanced Protections

- [ ] **Require signed commits** (if using GPG signing)
- [ ] **Require linear history** (prevents merge commits)
- [ ] **Require deployments to succeed** (if using deployment environments)

### Bypass Permissions

For emergency fixes, you can temporarily disable "Include administrators" to push directly, but this should be rare.

## After Enabling

Once enabled, all changes to main will require:
1. Creating a feature branch
2. Opening a pull request
3. Passing all CI checks
4. Getting approval (if configured)
5. Merging via GitHub UI

This ensures code quality and prevents accidental breaks to production.