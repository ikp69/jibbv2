# 13 - AI Development Guidelines

> **Document Version:** 1.0
>
> **Status:** Approved for Development
>
> **Project:** Japan India Business Bureau (JIBB) Member Portal
>
> **Primary Development Environment:** Kiro IDE

---

# Purpose

This document defines how AI coding agents should contribute to the JIBB Member Portal.

It serves as an operational guide for AI-assisted development and should be read before implementing any feature.

The objective is to ensure that every AI-generated change remains consistent with the project's architecture, coding standards, business workflows, and long-term vision.

---

# Project Context

The repository contains **two logical applications** within a single Next.js project.

```text
JIBB Website
    │
    ├── Public Marketing Website
    │
    └── Member Portal + Admin CMS
```

The existing public website is already operational.

All new development described in these documents belongs to the CMS and must remain isolated under:

```text
app/(cms)
```

The AI must never restructure or unintentionally modify the public website unless explicitly instructed.

---

# Primary Objectives

The AI should optimize for:

* Correctness
* Maintainability
* Consistency
* Simplicity
* Type Safety

Never optimize for the shortest implementation.

---

# Documentation Hierarchy

Before implementing any feature, consult documentation in this order.

```text
01-project-overview.md

↓

02-system-architecture.md

↓

03-database-design.md

↓

04-admin-panel.md

↓

05-member-portal.md

↓

06-tier-based-access-control.md

↓

07-business-workflows.md

↓

08-ui-design-system.md

↓

09-development-roadmap.md

↓

10-feature-specifications.md

↓

11-folder-structure.md

↓

12-coding-standards.md

↓

13-ai-development-guidelines.md
```

Earlier documents define business intent.

Later documents define implementation details.

If documentation appears to conflict, prioritize the lower-numbered document and request clarification before making assumptions.

---

# AI Development Philosophy

The AI is expected to implement the documented architecture.

The AI should **not** redesign:

* Business workflows
* Database schema
* Folder structure
* Navigation
* Membership tiers
* Access control

Architectural changes should only occur after explicit approval.

---

# Required Development Sequence

Every feature should be implemented in the following order.

```text
Read Documentation

↓

Understand Business Workflow

↓

Review Database Design

↓

Review Access Control

↓

Build UI Components

↓

Build Server Actions

↓

Connect Supabase

↓

Implement Validation

↓

Implement Loading States

↓

Implement Error Handling

↓

Implement Empty States

↓

Verify Responsive Behaviour

↓

Self Review

↓

Complete
```

Never skip validation or security.

---

# Feature Isolation

Each implementation should focus on one feature.

Examples

Good

* Member Management
* Announcements
* Reports

Bad

"Build the entire CMS."

Large tasks should be divided into smaller milestones.

---

# Scope Discipline

Implement only the requested feature.

Do not introduce unrelated enhancements.

Examples of changes to avoid unless requested:

* Payment gateway
* Email system
* Notifications
* Analytics
* Multi-admin support
* Chat functionality

Version 1 intentionally excludes these.

---

# Respect Existing Website

The public website must remain stable.

Do not modify:

* Home page
* About page
* Services
* Blog
* Public navigation
* Public layouts

unless explicitly instructed.

All CMS development belongs inside:

```text
app/(cms)
```

---

# Folder Placement Rules

Before creating a file, determine whether it belongs to:

* `components/`
* `features/cms/`
* `lib/`
* `actions/`
* `hooks/`
* `types/`
* `constants/`

Never create arbitrary folders.

Follow `11-folder-structure.md`.

---

# Component Rules

Prefer composition.

Before creating a new component, check whether one already exists.

Reusable components belong in:

```text
components/ui
```

Business-specific components belong inside the corresponding feature module.

---

# Database Rules

Never modify the database schema without checking:

```text
03-database-design.md
```

Do not create duplicate tables.

Do not rename existing entities without updating documentation.

---

# Authentication Rules

Authentication uses Supabase.

Never implement custom authentication.

Always verify:

* Session
* Role
* Membership status
* Tier access

before protected operations.

---

# Tier Based Read Control

The AI must enforce Tier Based Read Control consistently.

Visibility decisions belong on the server.

The frontend should never determine access.

Unauthorized content should be hidden rather than displayed in a disabled state.

---

# Server Actions

All mutations should use Server Actions.

Examples

* Create member
* Publish announcement
* Upload report
* Register for event

Every Server Action should:

1. Validate input
2. Verify authentication
3. Verify authorization
4. Execute business logic
5. Return typed results

---

# Validation

Use Zod.

Validate on both:

* Client
* Server

Never trust client-side validation alone.

---

# Error Handling

Every implementation should include:

* Validation errors
* Server errors
* Network errors
* Empty states
* Success feedback

Avoid generic messages.

---

# Performance Expectations

Prefer:

* Server Components
* Streaming
* Lazy loading
* Pagination
* Server-side search

Avoid unnecessary client-side JavaScript.

---

# Accessibility

Every feature must support:

* Keyboard navigation
* Focus management
* Screen readers
* Semantic HTML
* Accessible labels

Accessibility is part of the implementation, not an optional enhancement.

---

# Documentation Updates

If implementation requires:

* New folder
* New module
* Database change
* Workflow change
* Architecture change

update the corresponding documentation before considering the task complete.

Documentation and code should remain synchronized.

---

# Self Review Checklist

Before completing a task, verify:

* Correct folder placement
* Naming conventions
* Type safety
* Validation implemented
* Tier access enforced
* Responsive layout
* Loading state
* Empty state
* Error handling
* Success feedback
* Audit logging (where applicable)

---

# Common Mistakes to Avoid

Do not:

* Use `any`
* Query Supabase directly from UI components
* Put business logic inside JSX
* Duplicate reusable components
* Hardcode membership tiers
* Bypass Server Actions
* Ignore Row Level Security
* Modify public website layouts without approval

---

# Preferred Prompt Workflow

For best results, development requests should follow this pattern.

```text
Task

↓

Relevant Documentation

↓

Expected Output

↓

Acceptance Criteria

↓

Constraints
```

Example

```text
Task:
Implement the Member Management table.

Documentation:
04-admin-panel.md
03-database-design.md
06-tier-based-access-control.md

Requirements:
- Server Components by default
- Server-side pagination
- Tier Based Read Control
- Follow Design System

Acceptance Criteria:
Administrator can view, search, filter, and edit members.
```

This provides sufficient context while keeping prompts focused.

---

# Definition of Done

An implementation is complete only when:

* Business workflow implemented
* UI complete
* Database integrated
* Validation complete
* Tier Based Read Control enforced
* Loading state present
* Empty state present
* Error state present
* Responsive layout verified
* Accessibility considered
* Documentation synchronized

---

# Escalation Rules

If documentation is unclear or appears contradictory:

1. Do not invent a new architecture.
2. Do not silently change the design.
3. Identify the conflict.
4. Request clarification.
5. Continue only after the intended direction is confirmed.

Consistency is more valuable than speculation.

---

# Engineering Principles

Every implementation should follow these principles:

* Build reusable solutions before feature-specific ones.
* Prefer explicit code over clever abstractions.
* Keep business logic close to the feature.
* Preserve historical data instead of deleting it.
* Minimize side effects.
* Write code that is easy for another developer—or another AI—to understand.

---

# AI Collaboration Model

The AI should behave as an implementation partner, not a product designer.

Responsibilities include:

* Translating documentation into code.
* Following established architecture.
* Identifying implementation risks.
* Suggesting improvements without changing approved designs.
* Maintaining consistency across the codebase.

The AI should avoid introducing undocumented features or redesigning existing workflows unless specifically requested.

---

# Final Philosophy

The documentation set for the JIBB Member Portal represents the product specification, architecture, and engineering standards.

The AI's role is to faithfully implement that specification while producing clean, maintainable, and production-ready code.

When uncertainty exists, prioritize the documented architecture over assumptions.

The long-term success of this project depends on consistency, disciplined implementation, and respect for the established design rather than individual coding preferences.
