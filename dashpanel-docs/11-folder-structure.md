# 11 - Folder Structure (Revised)

> **Document Version:** 1.1
>
> **Status:** Approved for Development
>
> **Revision:** CMS Isolation Architecture

---

# Purpose

The JIBB website is already developed and deployed.

The objective of this architecture is **not to restructure or disturb the existing website**, but to introduce a complete **Member Portal + Admin CMS** alongside it.

The CMS should remain completely isolated from the marketing/public website while sharing the same Next.js project.

The recommended approach is to use **Next.js App Router Route Groups**.

---

# Architecture Philosophy

The application consists of two independent systems inside one codebase.

```text
JIBB Website
        │
        │
Public Pages
        │
────────┼────────
        │
Member Portal + Admin CMS
```

The existing website should continue functioning exactly as it does today.

The CMS becomes an independent application inside the same repository.

---

# Project Structure

```text
app/

(page.tsx)

about/

services/

membership/

contact/

blog/

...

(cms)/

admin/

portal/

login/

layout.tsx
```

Everything related to the CMS lives inside

```text
app/(cms)
```

The public website remains untouched.

---

# Why Route Groups?

Using

```text
(cms)
```

provides several advantages.

* Does not change URLs
* Separate layouts
* Separate authentication
* Separate providers
* Easier maintenance
* Zero impact on existing pages

Example

Folder

```text
app/(cms)/admin/dashboard/page.tsx
```

URL

```text
/admin/dashboard
```

The `(cms)` folder never appears in the URL.

---

# Recommended Folder Structure

```text
app/

about/

blog/

contact/

events/

membership/

services/

...

(cms)/

layout.tsx

login/

admin/

portal/
```

The public website continues exactly as before.

Only CMS-related development occurs inside `(cms)`.

---

# CMS Structure

```text
app/

(cms)/

layout.tsx

login/

admin/

dashboard/

announcements/

reports/

business-matching/

collaboration/

training/

events/

members/

member-directory/

media-library/

audit-logs/

settings/

portal/

dashboard/

announcements/

reports/

business-matching/

training/

events/

member-directory/

profile/
```

Everything under `(cms)` shares the CMS layout.

---

# CMS Layout

The CMS layout should contain

* Authentication Provider
* Sidebar
* Header
* Breadcrumb
* Theme Provider
* Toast Provider

The public website should not load these components.

---

# Shared Components

Shared reusable UI components remain outside `(cms)`.

Example

```text
components/

ui/

layout/

navigation/

forms/

tables/
```

These can be used by both

* Public Website
* CMS

without duplication.

---

# Feature Modules

Feature modules should be isolated to the CMS.

Recommended

```text
features/

cms/

announcements/

reports/

members/

business-matching/

collaboration/

training/

events/

settings/

audit/
```

This makes it immediately obvious which features belong exclusively to the CMS.

---

# Public Website Features

If future feature modules are required for the public website, organize them separately.

Example

```text
features/

website/

home/

about/

membership/

contact/

blog/
```

This cleanly separates public-facing functionality from internal portal functionality.

---

# Server Actions

Recommended structure

```text
actions/

cms/

website/
```

CMS actions should never interfere with website actions.

---

# Types

Global types remain shared.

CMS-specific types should be grouped.

```text
types/

cms/

website/
```

---

# Constants

Recommended

```text
constants/

cms/

website/
```

Examples

CMS Navigation

Membership Tiers

Industries

Status Values

remain inside

```text
constants/cms
```

---

# Lib

Infrastructure remains shared.

```text
lib/

supabase/

auth/

validators/

formatters/

cache/
```

Both website and CMS use the same infrastructure layer.

---

# Middleware

The middleware should protect only CMS routes.

Example

```text
/admin/**

/portal/**
```

The middleware should never affect

```text
/

/about

/services

/blog

/contact
```

This keeps the marketing website fast and publicly accessible.

---

# Authentication

Only CMS routes require authentication.

Protected

```text
/login

/admin/**

/portal/**
```

Public website remains completely open.

---

# Public Website

Nothing inside the public website should depend on CMS code.

This keeps deployment risk extremely low.

---

# Development Rule

When implementing CMS features:

✅ Work only inside

```text
app/(cms)
```

Do **not** modify:

* Home page
* About page
* Services
* Blog
* Existing navigation
* Existing layouts

unless explicitly required.

---

# Deployment Safety

This architecture ensures:

* Existing website remains operational.
* CMS can be developed incrementally.
* Public pages are not accidentally broken.
* Pull requests remain focused on CMS work.
* Rollbacks are simpler.

---

# Final Folder Philosophy

The JIBB project should be treated as **one repository containing two applications**:

1. **Public Website** — marketing, information, membership details, blogs, and public resources.
2. **Member Portal & Admin CMS** — authenticated workspace for administrators and member companies.

Using the `app/(cms)` route group keeps these applications logically separated while allowing them to share the same design system, infrastructure, and deployment pipeline. This minimizes risk to the existing website and provides a clean foundation for long-term development.
