# Architecture Decisions (ADR)

> **Project:** Japan India Business Bureau (JIBB) Member Portal
>
> **Version:** 1.0
>
> **Purpose:** Record important architectural and product decisions made during the planning and development of the platform.

---

# What is this document?

This file records the major architectural and product decisions made throughout the project.

Unlike the other documentation, which defines how the system works, this document explains **why those decisions were made**.

Future architectural changes should be added as new decision records rather than modifying previous entries.

---

# ADR-001

## Title

Business Chamber Management System instead of Generic CMS

### Status

Accepted

### Date

Version 1 Planning Phase

### Context

The project originally started as an admin dashboard for the JIBB website.

During planning it became clear that the platform would manage memberships, business introductions, training programs, reports, and collaboration opportunities.

### Decision

The system will be designed as a **Business Chamber Management System (BCMS)** instead of a traditional Content Management System.

### Consequences

Advantages

* Better reflects JIBB's operations.
* Easier future expansion.
* Clearer domain model.
* Business-focused workflows.

---

# ADR-002

## Title

One Repository

Two Logical Applications

### Status

Accepted

### Context

The public JIBB website is already live.

A new Admin CMS and Member Portal need to be developed without disrupting the existing website.

### Decision

Use a single Next.js project containing two logical applications.

```text
Public Website

+

Member Portal & Admin CMS
```

CMS development will be isolated under:

```text
app/(cms)
```

### Consequences

Advantages

* Existing website remains untouched.
* Shared design system.
* Shared deployment.
* Shared authentication.
* Lower maintenance.

---

# ADR-003

## Title

One Company = One Login

### Status

Accepted

### Context

Membership is organization-based rather than employee-based.

### Decision

Each company receives exactly one login.

The company profile becomes the primary identity.

### Consequences

Advantages

* Simpler administration.
* Cleaner permissions.
* Easier membership management.
* Matches current business process.

Trade-off

Multiple users per company may be introduced in a future version if required.

---

# ADR-004

## Title

Single Administrator Model

### Status

Accepted

### Context

Version 1 is intended for one operational administrator.

### Decision

Support only one administrator.

No manager hierarchy.

No staff roles.

### Consequences

Advantages

* Simpler implementation.
* Reduced complexity.
* Easier maintenance.

Future versions may introduce additional administrative roles if operational needs change.

---

# ADR-005

## Title

Tier Based Read Control (TBRC)

### Status

Accepted

### Context

Traditional Role Based Access Control (RBAC) is unnecessary because members perform similar actions.

Only content visibility differs.

### Decision

Use Tier Based Read Control.

Membership tiers

* Associate
* Silver
* Gold
* Platinum

Each content item stores the tiers that can access it.

### Consequences

Advantages

* Easy to understand.
* Flexible.
* Simple implementation.
* Matches JIBB membership model.

---

# ADR-006

## Title

Checkbox-Based Visibility

### Status

Accepted

### Context

Using "Minimum Membership Tier" would make some visibility scenarios difficult.

### Decision

Each content item stores explicit visibility.

Example

```text
☑ Associate

☐ Silver

☑ Gold

☑ Platinum
```

### Consequences

Advantages

* Flexible.
* Future-proof.
* No special hierarchy rules.

---

# ADR-007

## Title

No Public Registration

### Status

Accepted

### Context

Membership is approved offline.

Only verified companies should receive accounts.

### Decision

Remove public signup.

Administrator creates all member accounts.

### Consequences

Advantages

* Higher data quality.
* Verified organizations only.
* Reduced spam.
* Better operational control.

---

# ADR-008

## Title

Administrator Facilitated Introductions

### Status

Accepted

### Context

JIBB's value lies in trusted business introductions.

Direct contact would reduce this value.

### Decision

Members never see each other's private contact details.

Instead:

```text
Member

↓

Request Introduction

↓

Administrator Review

↓

JIBB Connects Companies
```

### Consequences

Advantages

* Privacy.
* Better quality introductions.
* Stronger role for JIBB.

---

# ADR-009

## Title

No Online Payments

### Status

Accepted

### Context

Membership fees are handled outside the platform.

### Decision

Version 1 excludes payment gateways.

Membership renewals are performed manually by the administrator.

### Consequences

Advantages

* Faster implementation.
* Reduced complexity.
* No payment compliance burden.

---

# ADR-010

## Title

Member Portal Focuses on Goals

### Status

Accepted

### Context

Members should not navigate technical modules.

They should accomplish business objectives.

### Decision

The portal is designed around member tasks:

* Learn
* Connect
* Grow

rather than administrative workflows.

### Consequences

Advantages

* Better user experience.
* Easier navigation.
* Business-oriented interface.

---

# ADR-011

## Title

Feature-First Architecture

### Status

Accepted

### Context

Large projects become difficult to maintain when files are organized only by type.

### Decision

Adopt a feature-first architecture.

Example

```text
features/

cms/

announcements/

members/

reports/

events/
```

Shared UI remains inside

```text
components/
```

### Consequences

Advantages

* Better scalability.
* Easier maintenance.
* Clear ownership.

---

# ADR-012

## Title

Server Components by Default

### Status

Accepted

### Context

Most pages display data without requiring client-side interactivity.

### Decision

Use Server Components unless client-side behavior is required.

### Consequences

Advantages

* Better performance.
* Smaller bundles.
* Improved SEO where applicable.

---

# ADR-013

## Title

Server Actions for Data Mutations

### Status

Accepted

### Context

Next.js Server Actions simplify secure data updates.

### Decision

All create, update, delete, and approval operations use Server Actions.

### Consequences

Advantages

* Cleaner architecture.
* Better security.
* Less API boilerplate.

---

# ADR-014

## Title

Supabase as Backend Platform

### Status

Accepted

### Context

The project requires authentication, database, file storage, and Row Level Security.

### Decision

Use Supabase for:

* Authentication
* PostgreSQL
* Storage
* RLS

### Consequences

Advantages

* Unified backend.
* Faster development.
* Excellent Next.js integration.

---

# ADR-015

## Title

Documentation-Driven Development

### Status

Accepted

### Context

The project is being developed with AI assistance.

### Decision

Documentation becomes the primary source of truth.

Implementation follows documentation—not the reverse.

### Consequences

Advantages

* Consistent AI output.
* Easier onboarding.
* Better maintainability.
* Clear engineering standards.

---

# ADR-016

## Title

Preserve Historical Data

### Status

Accepted

### Context

Business records should remain available for auditing and reporting.

### Decision

Prefer:

* Archive
* Suspend
* Close

instead of permanent deletion.

### Consequences

Advantages

* Better traceability.
* Improved reporting.
* Reduced accidental data loss.

---

# ADR-017

## Title

Privacy by Default

### Status

Accepted

### Context

Member organizations trust JIBB with their business information.

### Decision

Private information such as email addresses, phone numbers, membership history, and internal notes will never be exposed to other members.

Only approved public profile information is displayed in the Member Directory.

### Consequences

Advantages

* Greater trust.
* Compliance with privacy expectations.
* Supports JIBB's role as a trusted intermediary.

---

# Future Decision Template

Use the following format for every new decision.

```markdown
# ADR-XXX

## Title

...

### Status

Proposed | Accepted | Superseded | Rejected

### Context

Why was this decision needed?

### Decision

What was decided?

### Consequences

Advantages

Trade-offs

Future considerations
```

---

# Decision Log

| ADR     | Decision                                | Status   |
| ------- | --------------------------------------- | -------- |
| ADR-001 | Business Chamber Management System      | Accepted |
| ADR-002 | Single repository with `app/(cms)`      | Accepted |
| ADR-003 | One Company = One Login                 | Accepted |
| ADR-004 | Single Administrator                    | Accepted |
| ADR-005 | Tier Based Read Control                 | Accepted |
| ADR-006 | Checkbox-Based Visibility               | Accepted |
| ADR-007 | No Public Registration                  | Accepted |
| ADR-008 | Administrator Facilitated Introductions | Accepted |
| ADR-009 | No Online Payments                      | Accepted |
| ADR-010 | Goal-Oriented Member Portal             | Accepted |
| ADR-011 | Feature-First Architecture              | Accepted |
| ADR-012 | Server Components by Default            | Accepted |
| ADR-013 | Server Actions for Mutations            | Accepted |
| ADR-014 | Supabase Backend Platform               | Accepted |
| ADR-015 | Documentation-Driven Development        | Accepted |
| ADR-016 | Preserve Historical Data                | Accepted |
| ADR-017 | Privacy by Default                      | Accepted |

---

# Final Principle

Architectural decisions should be deliberate, documented, and preserved.

If a future decision changes an existing one, do **not** delete the old record.

Instead:

1. Create a new ADR.
2. Mark the old decision as **Superseded**.
3. Reference the newer ADR.

This provides a complete history of the project's evolution and ensures that both developers and AI coding agents understand not only *how* the system is built, but *why* it was designed that way.
