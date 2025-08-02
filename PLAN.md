# National 1031 Exchange - Implementation Plan for Claude Code Agents

**Last Updated**: February 2025  
**Project Status**: Phase 1A - Core Foundation  
**Framework**: Astro + TypeScript + Supabase

## 📋 Overview

This plan provides detailed implementation instructions for Claude Code agents to complete the National 1031 Exchange platform. The project has a complete database architecture but needs the application layer built out according to the Long-Term Development Guide.

## 🎯 Current State

### ✅ Completed Components
- **Database**: 15+ tables with triggers, functions, RLS policies (100% complete)
- **Framework**: Migrated to Astro from SvelteKit
- **Services**: Basic TypeScript services created:
  - `/src/lib/services/database.service.ts` - Database connection management
  - `/src/lib/services/lead.service.ts` - Lead management operations
  - `/src/lib/services/appointment.service.ts` - Appointment handling
  - `/src/lib/services/highlevel.service.ts` - HighLevel CRM integration
- **UI Components**: 
  - Order form with multi-step flow
  - Tax savings calculator
  - Basic marketing pages
  - Admin dashboard skeleton

### ❌ Missing Components
- **Authentication**: No Supabase Auth implementation
- **Admin Features**: All marked as "Coming Soon"
- **Customer Portal**: Not implemented
- **Lead Scoring**: Automated system not connected
- **PWA Features**: No service worker or offline capability
- **Subscription System**: No Stripe integration

## 🚀 Phase 1A: Core Foundation (Current Phase)

### Task 1: Authentication System Implementation

**Goal**: Implement Supabase Auth for admin and customer access

**Files to Create/Modify**:
```
src/lib/services/auth.service.ts       # New auth service
src/pages/login.astro                  # Login page
src/pages/admin/login.astro            # Admin login
src/middleware/auth.ts                 # Auth middleware
src/components/auth/LoginForm.tsx      # Login component
src/components/auth/LogoutButton.tsx   # Logout component
```

**Implementation Steps**:
1. Create `auth.service.ts` with methods:
   - `signIn(email, password)`
   - `signOut()`
   - `getSession()`
   - `isAdmin(user)`
   - `resetPassword(email)`

2. Add auth middleware to protect routes:
   - Check session on all `/admin/*` routes
   - Redirect to login if not authenticated
   - Verify admin role for admin pages

3. Update `AdminLayout.astro` to show user info and logout

4. Create login flows:
   - Customer login at `/login`
   - Admin login at `/admin/login`
   - Password reset functionality

**Database Integration**:
- Use existing `admin_users` table for admin authentication
- Use Supabase Auth for customer accounts
- Link auth users to `leads` table via email

### Task 2: Admin Dashboard - Lead Management

**Goal**: Build functional lead management interface

**Files to Create/Modify**:
```
src/pages/admin/leads.astro           # Lead list page
src/components/admin/LeadTable.tsx     # Lead data table
src/components/admin/LeadDetails.tsx   # Lead detail modal
src/components/admin/LeadFilters.tsx   # Search/filter UI
src/components/admin/LeadBulkOps.tsx   # Bulk operations
```

**Implementation Steps**:
1. Create lead list page with:
   - Paginated data table
   - Search by name, email, phone
   - Filter by status, score, date
   - Sort by any column

2. Add lead details modal showing:
   - Contact information
   - Lead score and status
   - Activity timeline
   - Calculator submissions
   - Appointments

3. Implement bulk operations:
   - Export to CSV
   - Bulk status update
   - Bulk delete (soft delete)

4. Connect to existing services:
   - Use `LeadService` for data operations
   - Implement real-time updates with Supabase subscriptions

### Task 3: Admin Dashboard - Appointment Management

**Goal**: Create appointment management interface

**Files to Create/Modify**:
```
src/pages/admin/appointments.astro         # Appointment list
src/components/admin/AppointmentTable.tsx  # Appointment table
src/components/admin/AppointmentCalendar.tsx # Calendar view
src/components/admin/AppointmentDetails.tsx # Detail view
```

**Implementation Steps**:
1. Build appointment list with:
   - Table and calendar views
   - Filter by date, status, lead
   - Show HighLevel sync status

2. Add appointment management:
   - View appointment details
   - Update appointment status
   - Reschedule functionality
   - Cancel with reason tracking

3. HighLevel integration panel:
   - Sync status indicator
   - Manual sync button
   - Error log viewer

### Task 4: Customer Portal Foundation

**Goal**: Create basic customer portal with authentication

**Files to Create/Modify**:
```
src/pages/portal/index.astro          # Customer dashboard
src/pages/portal/login.astro          # Customer login
src/pages/portal/register.astro       # Registration
src/pages/portal/documents.astro      # Document upload
src/pages/portal/timeline.astro       # Exchange timeline
src/layouts/PortalLayout.astro        # Portal layout
```

**Implementation Steps**:
1. Create customer registration:
   - Email/password signup
   - Link to existing lead record
   - Email verification

2. Build customer dashboard:
   - Exchange progress overview
   - Important dates (45/180 days)
   - Next steps checklist
   - Document status

3. Document management:
   - Upload documents to Supabase Storage
   - Categorize by document type
   - Track upload status
   - Download capability

### Task 5: Lead Scoring Automation

**Goal**: Activate the automated lead scoring system

**Files to Modify**:
```
src/lib/services/lead-scoring.service.ts  # New scoring service
src/components/admin/LeadScoreDetails.tsx # Score breakdown UI
```

**Implementation Steps**:
1. Create lead scoring service:
   - Calculate score based on:
     - Calculator completion (+20)
     - Appointment booking (+30)
     - Document uploads (+10 each)
     - Form completion (+15)
   - Call database function `calculate_lead_score`

2. Add score visualization:
   - Show score breakdown
   - Display score history
   - Highlight score changes

3. Trigger score updates on:
   - Activity creation
   - Status changes
   - Form submissions

## 📝 Implementation Instructions for Claude Code Agents

### General Guidelines
1. **Always read existing code** before creating new files
2. **Follow existing patterns** in the codebase
3. **Use TypeScript** with proper types from `database.types.ts`
4. **Test each component** before moving to the next
5. **Update the todo list** as you complete tasks

### Code Standards
- Use Astro components for pages
- Use React components for interactive UI
- Follow existing service layer patterns
- Implement proper error handling
- Add loading states to all async operations
- Ensure mobile responsiveness

### Database Integration
- Use existing database functions where available
- Leverage Row Level Security policies
- Implement proper error handling for database operations
- Use transactions for multi-step operations

### Testing Approach
1. Test authentication flows manually
2. Verify database operations work correctly
3. Check responsive design on mobile
4. Test error states and edge cases
5. Ensure HighLevel integration works

## 🎯 Success Criteria for Phase 1A

- [ ] Admin can login and logout
- [ ] Admin can view and manage leads
- [ ] Admin can view and manage appointments
- [ ] Customers can register and login
- [ ] Customers can upload documents
- [ ] Lead scoring updates automatically
- [ ] All features work on mobile
- [ ] No console errors in production

## 📅 Estimated Timeline

- **Task 1 (Auth)**: 2-3 days
- **Task 2 (Leads)**: 3-4 days
- **Task 3 (Appointments)**: 2-3 days
- **Task 4 (Portal)**: 3-4 days
- **Task 5 (Scoring)**: 1-2 days

**Total Phase 1A**: 2-3 weeks

## 🚀 Next Steps After Phase 1A

Once Phase 1A is complete, move to Phase 1B:
- PWA implementation
- Advanced analytics dashboard
- Automated compliance tracking
- Email/SMS notifications
- A/B testing framework

## 📚 Reference Documents

- `/docs/LONG-TERM-PROJECT-DEVELOPMENT-GUIDE.md` - Complete roadmap
- `/docs/DATABASE-ARCHITECTURE-REFERENCE.md` - Database details
- `/database/MODULAR-SCHEMA-SUMMARY.md` - Schema implementation
- `/docs/PRODUCT-REQUIREMENTS-DOCUMENT.md` - Business requirements

---

**For Claude Code Agents**: Start with Task 1 (Authentication) and work through each task sequentially. Update this document with progress notes as you complete each component.