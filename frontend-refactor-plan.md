# Frontend Refactoring Plan

This document outlines the phased approach to refactoring the frontend based on the new design. Please follow these phases sequentially. For each phase, start a new chat session and provide the specified files.

---

## Phase 1: Foundation Setup

**Goal:** Establish the project's foundation, including dependencies, styling, and the root layout.

**AI Prompt for this phase:**
```
I'm refactoring my Next.js health analysis platform frontend with a new design system. This is Phase 1 of a 10-phase implementation plan where I need to establish the foundation - updating dependencies, configuring Tailwind CSS, setting up the root layout, and core utilities.

My current project structure is:
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS with shadcn/ui components
- Three user roles: Patient, Health Worker, Specialist

I need you to help me implement the new foundation files. Please ask me to provide the files one by one in this specific order, and then integrate them into my existing project structure, adapting any paths or configurations to match my current setup.

The files I'll provide are configuration files, global styles, root layout, and utilities that form the foundation of the new design system.
```

**Files to provide in this chat:**

1.  `package.json` (for dependency updates)
2.  `tailwind.config.ts`
3.  `postcss.config.mjs`
4.  `next.config.mjs`
5.  `components.json`
6.  `tsconfig.json`
7.  `app/globals.css` OR `styles/globals.css` (whichever path you have)
8.  `app/layout.tsx`
9.  `lib/utils.ts`

---

## Phase 2: Core UI Components (Part 1 - Basic Components)

**Goal:** Implement the foundational UI components from shadcn/ui.

**AI Prompt for this phase:**
```
I'm continuing the refactoring of my Next.js health analysis platform frontend. This is Phase 2 of 10, where I need to implement the basic foundational UI components from the new design system.

I have a multi-role platform (Patient, Health Worker, Specialist) and need to establish the core shadcn/ui components that will be used throughout all portals. These are the fundamental building blocks like buttons, cards, inputs, and basic display components.

Please ask me to provide these foundational UI component files one by one, and help me integrate them into my existing project at `frontend/src/components/ui/`. Make sure all imports and exports are properly configured to work with the rest of my application.

I'll provide the theme provider and basic UI components that form the foundation of the design system.
```

**Files to provide in this chat:**

1.  `components/theme-provider.tsx`
2.  **Basic UI Components:**
    *   `components/ui/button.tsx`
    *   `components/ui/card.tsx`
    *   `components/ui/input.tsx`
    *   `components/ui/label.tsx`
    *   `components/ui/badge.tsx`
    *   `components/ui/separator.tsx`
    *   `components/ui/avatar.tsx`
    *   `components/ui/skeleton.tsx`

---

## Phase 3: Core UI Components (Part 2 - Form & Navigation)

**Goal:** Implement form and navigation components.

**AI Prompt for this phase:**
```
I'm continuing my Next.js health analysis platform frontend refactoring. This is Phase 3 of 10, focusing on form and navigation UI components.

My platform has three different user portals (Patient, Health Worker, Specialist) that will use these components for:
- Patient registration and biodata forms
- Health worker patient management forms  
- Navigation between different sections of each portal
- Mobile-responsive interactions

Please ask me to provide these form and navigation component files, and help me integrate them into my existing structure. Pay special attention to the hooks - I have both `hooks/` directory and `components/ui/` directory versions, so make sure they're placed correctly and work together.

These components will enable user interactions and navigation throughout the application.
```

**Files to provide in this chat:**

1.  **Form Components:**
    *   `components/ui/form.tsx`
    *   `components/ui/textarea.tsx`
    *   `components/ui/select.tsx`
    *   `components/ui/checkbox.tsx`
    *   `components/ui/radio-group.tsx`
    *   `components/ui/switch.tsx`
2.  **Navigation Components:**
    *   `components/ui/dropdown-menu.tsx`
    *   `components/ui/sheet.tsx`
    *   `components/ui/sidebar.tsx`
    *   `components/ui/navigation-menu.tsx`
    *   `components/ui/breadcrumb.tsx`
3.  **Hooks:**
    *   `hooks/use-mobile.tsx`
    *   `hooks/use-toast.ts`
    *   `components/ui/use-mobile.tsx`
    *   `components/ui/use-toast.ts`

---

## Phase 4: Core UI Components (Part 3 - Advanced Components)

**Goal:** Implement advanced UI components and custom components.

**AI Prompt for this phase:**
```
I'm continuing my health analysis platform frontend refactoring. This is Phase 4 of 10, implementing advanced and custom UI components.

My platform needs sophisticated components for:
- Patient data tables and lists
- Analysis results display with progress indicators
- Modal dialogs for confirmations and detailed views
- Specialist consultation interfaces with collapsible sections
- Custom status indicators for health data
- Toast notifications for user feedback

Please ask me to provide these advanced UI component files, including both standard shadcn/ui components and custom enhanced components that are specific to my health platform. These components will enable complex data visualization and user interactions.

The custom components (enhanced-button, feature-card, status-indicator, empty-state) are specifically designed for health data presentation and should be integrated carefully.
```

**Files to provide in this chat:**

1.  **Advanced UI Components:**
    *   `components/ui/table.tsx`
    *   `components/ui/tabs.tsx`
    *   `components/ui/dialog.tsx`
    *   `components/ui/alert-dialog.tsx`
    *   `components/ui/popover.tsx`
    *   `components/ui/command.tsx`
    *   `components/ui/calendar.tsx`
    *   `components/ui/scroll-area.tsx`
    *   `components/ui/progress.tsx`
    *   `components/ui/slider.tsx`
    *   `components/ui/accordion.tsx`
    *   `components/ui/collapsible.tsx`
2.  **Custom Enhanced Components:**
    *   `components/ui/enhanced-button.tsx`
    *   `components/ui/feature-card.tsx`
    *   `components/ui/status-indicator.tsx`
    *   `components/ui/empty-state.tsx`
3.  **Toast System:**
    *   `components/ui/toast.tsx`
    *   `components/ui/toaster.tsx`
    *   `components/ui/sonner.tsx`

---

## Phase 5: Remaining UI Components & Assets

**Goal:** Complete the UI component library and add missing components.

**AI Prompt for this phase:**
```
I'm finalizing the UI component library for my health analysis platform. This is Phase 5 of 10, completing the remaining shadcn/ui components and any new assets.

My platform will use these remaining components for:
- Data visualization charts for health analytics
- Alert messages for health warnings and notifications
- Carousels for displaying multiple analysis results
- Tooltips for explaining medical terminology
- Pagination for large datasets
- OTP input for secure authentication

Please ask me to provide these final UI component files and any new public assets (images, icons, etc.) that are part of the new design. After this phase, I'll have a complete UI component library ready for building the actual application pages.

Some of these components might be specific to health data presentation, so please integrate them carefully with the existing structure.
```

**Files to provide in this chat:**

1.  **Remaining UI Components:**
    *   `components/ui/alert.tsx`
    *   `components/ui/aspect-ratio.tsx`
    *   `components/ui/carousel.tsx`
    *   `components/ui/chart.tsx`
    *   `components/ui/context-menu.tsx`
    *   `components/ui/drawer.tsx`
    *   `components/ui/hover-card.tsx`
    *   `components/ui/input-otp.tsx`
    *   `components/ui/menubar.tsx`
    *   `components/ui/pagination.tsx`
    *   `components/ui/resizable.tsx`
    *   `components/ui/toggle.tsx`
    *   `components/ui/toggle-group.tsx`
    *   `components/ui/tooltip.tsx`
2.  **Public Assets:** (If any new ones are needed)
    *   Any new files from `public/` directory

---

## Phase 6: Authentication System & Schemas

**Goal:** Build the complete authentication flow, including layouts, forms, and validation schemas.

**AI Prompt for this phase:**
```
I'm implementing the authentication system for my health analysis platform. This is Phase 6 of 10, building the complete auth flow with role-based access.

My platform has three distinct user roles with different authentication needs:
- Patients: Self-registration with biodata collection
- Health Workers: Login only (registered by admin)
- Specialists: Login only (registered by admin)

The authentication system needs:
- Zod schemas for form validation (patient biodata and registration)
- Role-based dynamic login routing
- Multi-step patient registration (account creation → biodata collection)
- Form components that integrate with the UI library we've built

Please ask me to provide these authentication files, and help me integrate them with my existing backend auth system. The schemas should work with react-hook-form, and the pages should use the UI components we've already implemented.
```

**Files to provide in this chat:**

1.  **Schemas:**
    *   `lib/schemas/patient-biodata-schema.ts`
    *   `lib/schemas/patient-registration-schema.ts`
2.  **Form Components:**
    *   `components/patient-biodata-form.tsx`
3.  **Auth Pages:**
    *   `app/auth/layout.tsx`
    *   `app/auth/login/[role]/page.tsx`
    *   `app/auth/patient/login/page.tsx`
    *   `app/auth/patient/register/page.tsx`
    *   `app/auth/patient/register/biodata/page.tsx`
    *   `app/auth/specialist/login/page.tsx`

---

## Phase 7: Landing Page

**Goal:** Implement the public-facing landing page.

**AI Prompt for this phase:**
```
I'm implementing the landing page for my health analysis platform. This is Phase 7 of 10, creating the public-facing homepage that welcomes users and directs them to appropriate portals.

My landing page needs to:
- Present the platform's value proposition for health analysis
- Provide clear navigation to three different user portals (Patient, Health Worker, Specialist)
- Have a modern, professional design suitable for healthcare
- Be responsive and accessible
- Include call-to-action buttons for registration/login

Please ask me to provide the landing page component and root page file, and help me integrate them with my existing routing structure. The landing page should use the UI components we've built and maintain consistency with the overall design system.
```

**Files to provide in this chat:**

1.  `components/landing-page.tsx`
2.  `app/page.tsx`

---

## Phase 8: Patient Portal

**Goal:** Construct the patient-facing part of the application.

**AI Prompt for this phase:**
```
I'm building the Patient Portal for my health analysis platform. This is Phase 8 of 10, creating the complete patient-facing interface.

The Patient Portal needs:
- A sidebar navigation for easy access to all patient features
- Dashboard showing overview of health status and recent analyses
- Results page displaying analysis outcomes in an understandable format
- New analysis request functionality
- Complete analysis history with filtering/search
- Profile settings for updating personal information
- Help/support section

My patients should be able to:
- View their health analysis results
- Request new analyses
- Track their health data over time
- Update their profile information
- Get help when needed

Please ask me to provide these patient portal files in order, and help me integrate them into my existing structure. These pages should use the UI components we've built and follow the established design patterns, while being specifically tailored for patient needs and health data visualization.
```

**Files to provide in this chat (in order):**

1.  `components/patient-sidebar.tsx`
2.  `app/patient/layout.tsx`
3.  `app/patient/dashboard/page.tsx`
4.  `app/patient/results/page.tsx`
5.  `app/patient/new-analysis/page.tsx`
6.  `app/patient/analysis-history/page.tsx`
7.  `app/patient/profile-settings/page.tsx`
8.  `app/patient/help/page.tsx`

---

## Phase 9: Health Worker Portal

**Goal:** Build the portal for health workers to manage patients and data.

**AI Prompt for this phase:**
```
I'm building the Health Worker Portal for my health analysis platform. This is Phase 9 of 10, creating the interface for healthcare staff to manage patients and data collection.

The Health Worker Portal needs:
- Sidebar navigation for health worker functions
- Dashboard showing patient queue, recent activities, and statistics
- Patient management system (view, register, search patients)
- Data upload interface for health measurements and files
- Patient queue management for organizing analysis requests
- Individual patient detail views
- Results viewing for completed analyses

Health workers should be able to:
- Register new patients and collect their biodata
- Upload patient health data (measurements, images, documents)
- Manage the queue of patients waiting for analysis
- View individual patient records and history
- See analysis results to discuss with patients

Please ask me to provide these health worker portal files in order, including loading states. Help me integrate them with my existing backend API endpoints and ensure they use the UI components we've built. The interface should be efficient for healthcare workflows.
```

**Files to provide in this chat (in order):**

1.  `components/health-worker/sidebar.tsx`
2.  `components/health-worker/patient-registration-form.tsx`
3.  `app/health-worker/layout.tsx`
4.  `app/health-worker/dashboard/page.tsx`
5.  `app/health-worker/dashboard/loading.tsx`
6.  `app/health-worker/patients/page.tsx`
7.  `app/health-worker/patients/loading.tsx`
8.  `app/health-worker/patients/register/page.tsx`
9.  `app/health-worker/patients/[id]/page.tsx`
10. `app/health-worker/upload/page.tsx`
11. `app/health-worker/upload/loading.tsx`
12. `app/health-worker/queue/page.tsx`
13. `app/health-worker/queue/loading.tsx`
14. `app/health-worker/queue/[id]/results/page.tsx`

---

## Phase 10: Specialist Portal

**Goal:** Build the portal for specialists to analyze patient data.

**AI Prompt for this phase:**
```
I'm building the Specialist Portal for my health analysis platform. This is the final Phase 10 of 10, creating the advanced interface for medical specialists to review and analyze patient data.

The Specialist Portal needs:
- Dashboard showing queue of patients awaiting specialist review
- Advanced patient analysis interface with multiple data panels
- AI assessment integration for decision support
- Consultation workflow tools for managing patient interactions
- Comprehensive data visualization for health metrics
- Detailed patient information displays

Specialists should be able to:
- Review patient queue and prioritize cases
- Analyze patient health data with AI assistance
- View comprehensive patient information and history
- Examine vital signs and health metrics
- Access data visualizations and charts
- Follow consultation workflows for patient care
- Provide professional assessments and recommendations

Please ask me to provide these specialist portal files in order, including the specialized component panels. This portal requires the most sophisticated UI components we've built, as it handles complex medical data analysis and decision-making workflows.
```

**Files to provide in this chat (in order):**

1.  `app/specialist/layout.tsx`
2.  `app/specialist/dashboard/page.tsx`
3.  `app/specialist/dashboard/loading.tsx`
4.  **Specialist Components:**
    *   `components/specialist/patient-info-panel.tsx`
    *   `components/specialist/vital-signs-panel.tsx`
    *   `components/specialist/data-visualization-panel.tsx`
    *   `components/specialist/ai-assessment-panel.tsx`
    *   `components/specialist/consultation-workflow-panel.tsx`
5.  `app/specialist/patient/[patientId]/page.tsx`
6.  `app/specialist/patient/[patientId]/loading.tsx`

---

## Summary

**Total Phases: 10**

This plan now matches your actual frontend structure. Each phase is designed to be manageable in a single chat session while building upon the previous phases. The phases are ordered to ensure dependencies are handled properly:

1. **Foundation** - Core setup and configuration
2. **Basic UI** - Essential components  
3. **Form & Navigation** - Interactive components
4. **Advanced UI** - Complex components
5. **Remaining UI** - Complete the component library
6. **Auth System** - User authentication and validation
7. **Landing Page** - Public interface
8. **Patient Portal** - Patient-facing features
9. **Health Worker Portal** - Staff interface
10. **Specialist Portal** - Expert analysis interface

Each phase builds on the previous ones, so it's important to follow them sequentially. 