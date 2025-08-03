# Development Setup Guide

This guide will help you set up your development environment for the National 1031 Exchange platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: v18.x or v20.x (recommended)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm**: v9.x or higher (comes with Node.js)
  - Verify installation: `npm --version`

- **Git**: Latest version
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

### Recommended Tools

- **VS Code**: [code.visualstudio.com](https://code.visualstudio.com/)
  - Extensions:
    - Astro
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - GitLens
    - Vitest

- **Supabase CLI** (optional): For local database development
  ```bash
  npm install -g supabase
  ```

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/national-1031-exchange.git
cd national-1031-exchange
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:

- Astro framework
- React and TypeScript
- Tailwind CSS
- Supabase client
- Testing libraries

### 3. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

## Environment Configuration

### Required Environment Variables

Edit `.env` with your configuration:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Settings
PUBLIC_ENVIRONMENT=development
PUBLIC_SITE_URL=http://localhost:4321

# Email Configuration (optional)
EMAIL_FROM=noreply@national1031exchange.com
EMAIL_REPLY_TO=support@national1031exchange.com

# Analytics (optional)
PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Getting Supabase Credentials

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy:
   - `URL` → `PUBLIC_SUPABASE_URL`
   - `anon public` key → `PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

## Database Setup

### Using Supabase Dashboard

1. Navigate to your Supabase project
2. Go to SQL Editor
3. Run the migration scripts in order:
   ```sql
   -- Run each file in database/migrations/ directory
   ```

### Using Supabase CLI (Local Development)

```bash
# Start local Supabase
supabase start

# Run migrations
supabase db push

# Seed database (optional)
supabase db seed
```

## Running the Application

### Development Server

```bash
npm run dev
```

The application will be available at:

- Main site: http://localhost:4321
- Admin panel: http://localhost:4321/admin

### Production Build

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Development Workflow

### Branch Strategy

We follow a feature branch workflow:

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Create bugfix branch
git checkout -b fix/bug-description

# Create hotfix branch
git checkout -b hotfix/critical-fix
```

### Code Quality

#### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

#### Linting and Type Checking

```bash
# Run ESLint
npm run lint

# Run TypeScript type checking
npm run typecheck

# Run Astro checks
npm run astro check
```

### Pre-commit Checks

Before committing, ensure:

1. All tests pass
2. No linting errors
3. No TypeScript errors
4. Code is formatted

You can run all checks with:

```bash
npm run lint && npm run typecheck && npm test
```

### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make your changes**
   - Follow existing code patterns
   - Write tests for new functionality
   - Update documentation if needed

3. **Test your changes**

   ```bash
   npm test
   npm run dev  # Manual testing
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Follow conventional commits:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `style:` Code style
   - `refactor:` Code refactoring
   - `test:` Tests
   - `chore:` Maintenance

5. **Push and create PR**
   ```bash
   git push origin feature/new-feature
   ```

## Project Structure

```
national-1031-exchange/
├── src/
│   ├── components/      # React components
│   │   ├── common/      # Shared components
│   │   ├── auth/        # Authentication components
│   │   └── admin/       # Admin panel components
│   ├── layouts/         # Astro layouts
│   ├── pages/           # Astro pages (routes)
│   ├── lib/             # Business logic
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   └── types/       # TypeScript types
│   ├── styles/          # Global styles
│   └── test/            # Test utilities
├── public/              # Static assets
├── database/            # Database migrations
├── docs/                # Documentation
└── .github/             # GitHub workflows
```

## Common Development Tasks

### Adding a New Page

1. Create file in `src/pages/`
2. Use `.astro` for static pages or `.tsx` for dynamic pages
3. Import layout if needed

```astro
---
import Layout from '@/layouts/Layout.astro';
---

<Layout title="New Page">
  <h1>New Page</h1>
</Layout>
```

### Adding a New Component

1. Create component in `src/components/`
2. Write component with TypeScript
3. Add tests alongside component

```typescript
// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return <h2>{title}</h2>;
}

// src/components/MyComponent.test.tsx
import { render, screen } from '@test/utils/test-helpers';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Working with Supabase

```typescript
import { supabase } from '@/lib/supabase';

// Fetch data
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: false });

// Insert data
const { data, error } = await supabase.from('leads').insert({ email: 'test@example.com' });

// Update data
const { data, error } = await supabase
  .from('leads')
  .update({ status: 'qualified' })
  .eq('id', leadId);
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 4321
lsof -i :4321

# Kill the process
kill -9 <PID>
```

#### Node Version Issues

Use nvm to manage Node versions:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use correct version
nvm install 20
nvm use 20
```

#### Dependency Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Or manually check types
npm run typecheck
```

### Getting Help

1. Check existing documentation
2. Search GitHub issues
3. Ask in team Slack channel
4. Create a GitHub issue with:
   - Clear problem description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

## Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vitest Documentation](https://vitest.dev)

## VS Code Settings

Recommended workspace settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```
