# Japan India Business Bureau (JIBB) Member Portal

> **Software Design Specification (SDS)**
> **Version:** 1.1
> **Status:** Planning & Architecture Complete
> **Project Type:** Business Chamber Management System (BCMS)

---

# Welcome

This documentation defines the complete software architecture, business workflows, database design, UI system, coding standards, and implementation roadmap for the **Japan India Business Bureau (JIBB) Member Portal**.

The objective is to provide a single source of truth for developers and AI coding agents implementing the platform.

This documentation should be considered authoritative. Implementation should follow these documents rather than making architectural decisions during development.

---

# Project Overview

The JIBB Member Portal is a secure membership-based digital platform designed to strengthen business relationships between Japanese and Indian companies.

Unlike a traditional CMS, this platform functions as a **Business Chamber Management System (BCMS)**.

The platform enables JIBB to:

* Manage member organizations
* Publish announcements
* Share premium market intelligence
* Facilitate business matchmaking
* Organize events and training
* Maintain a private member directory
* Support strategic collaboration between member companies

JIBB remains the trusted facilitator of every business relationship.

---

# Repository Architecture

The repository contains **two logical applications** within a single Next.js project.

```text
Next.js Project

├── Public Website
│
│   • Home
│   • About
│   • Services
│   • Membership
│   • Blog
│   • Contact
│
└── Member Portal & Admin CMS
    • Login
    • Admin Dashboard
    • Member Portal
```

The public website already exists.

All new development described in this documentation belongs to the CMS.

The CMS is isolated using the Next.js Route Group:

```text
app/(cms)
```

This architecture ensures the public website remains unaffected while the Member Portal and Admin CMS evolve independently.

---

# Business Vision

Create a premium digital ecosystem where Japanese and Indian organizations can:

* Access exclusive business intelligence
* Discover collaboration opportunities
* Participate in business matchmaking
* Register for training programs
* Attend invite-only events
* Build trusted business relationships through JIBB

The portal should reinforce JIBB's role as the central facilitator rather than exposing member information directly.

---

# Core Principles

Every feature should satisfy one or more of these goals:

* Reduce administrative effort
* Improve member experience
* Encourage business collaboration
* Protect member privacy
* Support future growth
* Remain simple to maintain

If a feature does not support these goals, it should not be included in Version 1.

---

# Membership Model

The platform supports four membership tiers.

* Associate
* Silver
* Gold
* Platinum

Content visibility is controlled through **Tier Based Read Control (TBRC)**.

Administrators decide which membership tiers can access each resource.

---

# Organization Model

The portal follows a simple identity model.

```text
1 Company = 1 Login
```

Each account represents one organization rather than individual employees.

The company profile becomes the primary identity throughout the platform.

---

# Authentication Philosophy

Authentication is handled entirely by Supabase Authentication.

Important design decisions:

* No public registration
* No self-service signup
* Accounts created manually by the administrator
* One administrator
* Members authenticated through Supabase

---

# Member Privacy

The platform is intentionally designed to protect member information.

Members cannot directly contact each other.

Instead, business introductions follow this workflow:

```text
Member

↓

Request Introduction

↓

Administrator Review

↓

JIBB Facilitates Connection
```

This keeps JIBB at the center of business relationships.

---

# Technology Stack

## Frontend

* Next.js 16 (App Router)
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* Lucide React

---

## Backend

* Supabase
* PostgreSQL
* Row Level Security
* Supabase Authentication
* Supabase Storage

---

## Deployment

* Vercel

---

## Development

* GitHub
* Kiro IDE
* AI Coding Agents

---

# Version 1 Scope

## Included

* Authentication
* Admin Dashboard
* Member Dashboard
* Member Management
* Tier Based Read Control
* Announcements
* Market Intelligence Reports
* Business Matching
* Collaboration Opportunities
* Training Programs
* Invite Only Events
* Member Directory
* Company Profiles
* Media Library
* Audit Logs
* Settings

---

## Excluded

The following features are intentionally deferred to future versions.

* Online Payment Gateway
* Automated Membership Renewal
* Multiple Administrators
* Email Campaigns
* Push Notifications
* Calendar Integrations
* AI Assistant
* CRM Integrations
* Mobile Application
* Analytics Dashboard

AI coding agents should not implement these features unless explicitly instructed.

---

# Documentation Structure

The documentation is organized from business concepts to implementation details.

```text
docs/

README.md

01-project-overview.md

02-system-architecture.md

03-database-design.md

04-admin-panel.md

05-member-portal.md

06-tier-based-access-control.md

07-business-workflows.md

08-ui-design-system.md

09-development-roadmap.md

10-feature-specifications.md

11-folder-structure.md

12-coding-standards.md

13-ai-development-guidelines.md

decisions.md
```

---

# Documentation Reading Order

Developers and AI coding agents should read the documents in the following order.

| Step | Document                        | Purpose                 |
| ---- | ------------------------------- | ----------------------- |
| 1    | README.md                       | Project entry point     |
| 2    | 01-project-overview.md          | Business vision         |
| 3    | 02-system-architecture.md       | Technical architecture  |
| 4    | 03-database-design.md           | Database design         |
| 5    | 04-admin-panel.md               | Admin CMS               |
| 6    | 05-member-portal.md             | Member experience       |
| 7    | 06-tier-based-access-control.md | Authorization           |
| 8    | 07-business-workflows.md        | Operational processes   |
| 9    | 08-ui-design-system.md          | UI standards            |
| 10   | 09-development-roadmap.md       | Implementation phases   |
| 11   | 10-feature-specifications.md    | Feature contracts       |
| 12   | 11-folder-structure.md          | Project organization    |
| 13   | 12-coding-standards.md          | Engineering standards   |
| 14   | 13-ai-development-guidelines.md | AI implementation guide |

Earlier documents define **business requirements**.

Later documents define **implementation standards**.

---

# Golden Rules

Every developer and AI coding agent must follow these rules.

1. Do not modify the existing public website unless explicitly instructed.
2. Implement all new portal functionality inside `app/(cms)`.
3. Use Server Components by default.
4. Use Server Actions for data mutations.
5. Never bypass Tier Based Read Control.
6. Never expose private member information.
7. Follow the UI Design System.
8. Follow the approved Folder Structure.
9. Keep documentation synchronized with code.
10. Preserve historical records instead of deleting them.

---

# Development Workflow

Every feature should follow this sequence.

```text
Read Documentation

↓

Understand Business Workflow

↓

Review Database Design

↓

Implement UI

↓

Implement Server Actions

↓

Connect Supabase

↓

Apply Validation

↓

Implement Loading & Empty States

↓

Review

↓

Commit
```

---

# Success Criteria

Version 1 is complete when:

* Administrator can manage the complete member lifecycle.
* Members can securely access tier-based content.
* Business Matching workflows operate correctly.
* Reports, announcements, training, and events are fully manageable.
* Company introductions are facilitated through JIBB.
* Documentation and implementation remain synchronized.

---

# Long-Term Vision

The JIBB Member Portal is intended to become the central digital platform through which Japanese and Indian organizations collaborate.

The system should remain:

* Professional
* Secure
* Maintainable
* Scalable
* AI-friendly

Every architectural decision should reinforce these principles.

---

# Final Guiding Principle

Before implementing any feature, ask:

> **"Does this feature strengthen business relationships between Japanese and Indian companies while keeping the platform simple, secure, and easy for JIBB to manage?"**

If the answer is **no**, the feature should not be included in Version 1.
