# 12 - Coding Standards

> **Document Version:** 1.0
>
> **Status:** Approved for Development
>
> **Project:** Japan India Business Bureau (JIBB) Member Portal

---

# Purpose

This document defines the coding standards for the JIBB Member Portal.

Every developer and AI coding agent must follow these standards to ensure:

* Consistent architecture
* Maintainable code
* Predictable structure
* Strong type safety
* Clean separation of concerns
* Long-term scalability

These standards apply to both the **Public Website** and the **CMS**, with all new CMS work isolated under `app/(cms)` as defined in the Folder Structure document.

---

# Core Principles

Every implementation should prioritize:

* Readability
* Simplicity
* Type Safety
* Reusability
* Predictability

When two solutions are technically correct, choose the one that is easier to understand six months later.

---

# Technology Stack

The project standard is:

* Next.js 16 (App Router)
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* Supabase
* Server Actions
* Zod

Do not introduce additional frameworks unless there is a clear architectural reason.

---

# TypeScript Standards

## Never Use `any`

Avoid:

```ts
const user: any = data
```

Prefer:

```ts
type MemberProfile = {
  id: string
  companyName: string
}
```

If the shape is unknown, use `unknown` and narrow it.

---

## Prefer Interfaces for Public Models

Use interfaces for entities shared across modules.

```ts
interface MemberProfile {
  id: string
  companyName: string
}
```

Use `type` for unions and utility types.

---

## Strict Type Safety

Enable strict TypeScript mode.

Never silence errors using:

* `@ts-ignore`
* unnecessary type assertions
* `as any`

---

# Naming Conventions

## Files

Use kebab-case.

Examples

```text
member-table.tsx

announcement-card.tsx

report-upload-dialog.tsx
```

---

## Components

PascalCase.

```text
MemberTable

ReportCard

AnnouncementEditor
```

---

## Hooks

camelCase beginning with `use`.

```text
useMembers

usePagination

useSearch
```

---

## Constants

UPPER_SNAKE_CASE.

```ts
MAX_FILE_SIZE

DEFAULT_PAGE_SIZE
```

---

## Variables

camelCase.

```ts
companyName

membershipTier

publishedReports
```

---

## Database Tables

snake_case.

```text
business_opportunities

training_registrations

audit_logs
```

---

# React Standards

---

## Prefer Server Components

Pages should be Server Components unless client interactivity is required.

Use `"use client"` only for:

* Forms
* Dialogs
* Search inputs
* Drag and drop
* Rich text editors

---

## Keep Components Small

One component should solve one problem.

Avoid components larger than approximately 250–300 lines.

Split into smaller components when necessary.

---

## No Business Logic in JSX

Bad

```tsx
<Button onClick={() => {
  // database logic
}}>
```

Good

```tsx
<Button onClick={handleSubmit}>
```

Business logic belongs in:

* Server Actions
* Services
* Utility functions

---

# Server Actions

Server Actions are the preferred way to mutate data.

Examples

* Create member
* Publish announcement
* Upload report
* Register for event

Every Server Action must:

* Validate input
* Verify authentication
* Verify authorization
* Return typed results

---

# Supabase Standards

Never query Supabase directly inside UI components.

Preferred flow:

```text
Page

↓

Server Action

↓

Service

↓

Supabase
```

This keeps database logic centralized.

---

# Validation

All user input must be validated using Zod.

Validation occurs:

1. Client-side (for UX)
2. Server-side (authoritative)

Never rely solely on client-side validation.

---

# Error Handling

Never expose raw database or server errors.

Instead, return meaningful messages.

Example

Instead of:

> duplicate key value violates unique constraint

Use:

> A member with this email already exists.

---

# Forms

Use React Hook Form with Zod.

Forms should:

* Display inline validation
* Preserve entered values on validation failure
* Disable submit while processing

---

# Database Queries

Keep queries inside feature services.

Example

```text
features/cms/members/services/
```

Avoid embedding SQL or Supabase queries in components.

---

# Imports

Always use absolute imports.

Good

```ts
import { Button } from "@/components/ui/button"
```

Avoid deep relative imports.

---

# Styling

Use Tailwind utility classes.

Avoid custom CSS unless:

* Third-party integration
* Complex animation
* Global styling

Never use inline styles except for truly dynamic values.

---

# Component Composition

Prefer composition over inheritance.

Example

```tsx
<Card>
  <CardHeader />
  <CardContent />
</Card>
```

Avoid monolithic components with dozens of props.

---

# State Management

Prefer this order:

1. Server state
2. URL parameters
3. Local component state
4. React Context

Do not introduce global state libraries unless a real need emerges.

---

# Async Code

Use `async/await`.

Avoid nested promise chains.

Always handle failures.

---

# Loading States

Every asynchronous page or component should provide a loading state.

Prefer skeletons over spinners.

---

# Empty States

Every data-driven page must define an empty state with:

* Title
* Description
* Primary action

Never leave blank tables.

---

# Accessibility

All interactive elements must include:

* Keyboard support
* Focus styles
* Accessible labels
* Semantic HTML

Buttons should always contain descriptive text.

---

# Logging

Use structured logging on the server.

Avoid leaving `console.log()` statements in production code.

---

# Comments

Write code that is self-explanatory.

Use comments only when explaining **why**, not **what**.

Bad

```ts
// Increment counter
count++
```

Good

```ts
// Membership expiry is calculated from the administrator approval date.
```

---

# Reusable Components

Before creating a component, ask:

1. Can an existing component be reused?
2. Does this belong in `components/ui`?
3. Is it specific to one feature?

Avoid duplicate implementations.

---

# File Size Guidelines

Recommended limits:

| File Type       | Target     |
| --------------- | ---------- |
| React Component | <300 lines |
| Server Action   | <150 lines |
| Utility         | <150 lines |
| Page            | <200 lines |

Large files should be refactored.

---

# Git Standards

Commit messages follow Conventional Commits.

Examples

```text
feat(members): add member creation

fix(reports): validate pdf upload

refactor(layout): simplify sidebar

docs(cms): update member workflow
```

---

# Pull Request Checklist

Before merging:

* Builds successfully
* No TypeScript errors
* No ESLint warnings
* Responsive verified
* Accessibility checked
* Documentation updated

---

# Testing Philosophy

Version 1 emphasizes critical workflow testing.

Priority:

1. Authentication
2. Authorization
3. Member lifecycle
4. Report downloads
5. Event registration
6. Business matching

Bug fixes should include a regression check for the affected workflow.

---

# Security Rules

Never trust the client.

Every protected operation must verify:

```text
Authentication

↓

Authorization

↓

Ownership

↓

Tier Access

↓

Validation

↓

Execute
```

Never expose sensitive data to the client unnecessarily.

---

# Performance Guidelines

Prefer:

* Server Components
* Streaming
* Lazy loading
* Pagination
* Optimized images

Avoid:

* Large client bundles
* Duplicate requests
* Fetching unused data
* Client-side filtering for large datasets

---

# Documentation Rule

Every significant architectural change must be reflected in the documentation.

Documentation is part of the codebase and should evolve with it.

---

# Anti-Patterns

Avoid:

* Business logic inside JSX
* Database queries inside components
* `any` types
* Duplicated UI components
* Massive utility files
* Hardcoded strings scattered throughout the codebase
* Circular dependencies
* Premature abstraction

---

# Code Review Checklist

Before marking work complete, verify:

* Correct folder placement
* Naming conventions followed
* Type safety maintained
* Validation implemented
* Loading state present
* Empty state present
* Error handling complete
* Accessibility considered
* Documentation updated

---

# Engineering Philosophy

The JIBB Member Portal is expected to evolve over many years.

Code should therefore be written for maintainability rather than speed of implementation.

Prefer explicit, readable solutions over clever shortcuts.

Every module should feel like it was written by the same engineering team, regardless of whether the implementation was produced by a human developer or an AI coding agent.

Consistency is a feature of the software, not just the codebase.
