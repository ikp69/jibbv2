# 02 - System Architecture

> **Document Version:** 1.0
> **Status:** Approved for Development
> **Project:** Japan India Business Bureau (JIBB) Member Portal

---

# Purpose

This document defines the complete technical architecture of the Japan India Business Bureau (JIBB) Member Portal.

It serves as the architectural blueprint for developers and AI coding agents implementing the project.

This document explains:

* Overall system architecture
* Technology stack
* Folder structure
* Routing
* Authentication
* Authorization
* Data flow
* Storage
* Security
* Design principles

This document intentionally avoids implementation details of individual features, which are documented separately.

---

# High-Level Architecture

The application consists of four primary layers.

```text
                 Public Website
                        │
                        ▼
              Supabase Authentication
                        │
                        ▼
        ┌────────────────────────────┐
        │                            │
        │      Member Portal         │
        │                            │
        └────────────────────────────┘
                        │
                        ▼
        ┌────────────────────────────┐
        │                            │
        │        Admin CMS           │
        │                            │
        └────────────────────────────┘
                        │
                        ▼
          Supabase PostgreSQL Database
                        │
                        ▼
             Supabase Storage Buckets
```

The website is responsible for attracting potential members.

The portal is responsible for delivering value to existing members.

---

# System Components

The platform consists of five major systems.

## 1. Public Website

Purpose

Marketing and information.

Accessible without authentication.

Examples:

* Home
* About
* Membership
* Services
* Contact
* Blog
* Events
* Apply for Membership

No administrative functionality exists here.

---

## 2. Authentication

Handled entirely through Supabase Authentication.

Responsibilities:

* Login
* Session Management
* Password Reset
* Route Protection

There is no public registration.

Accounts are created manually by the administrator.

---

## 3. Member Portal

Accessible only after login.

Responsibilities:

* Consume premium content
* Download reports
* View announcements
* Register for events
* Express business interest
* View company directory
* Update company profile

Members cannot access administrative functionality.

---

## 4. Admin CMS

Accessible only by administrator.

Responsibilities:

* Manage members
* Publish content
* Upload files
* Manage reports
* Manage events
* Review applications
* Moderate collaboration requests
* Manage company directory

---

## 5. Supabase Backend

Provides:

* PostgreSQL Database
* Authentication
* Storage
* Row Level Security
* Server-side API

---

# Technology Stack

## Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* Lucide Icons

---

## Backend

Supabase

Includes:

* PostgreSQL
* Authentication
* Storage
* Row Level Security

---

## Deployment

Frontend

* Vercel

Backend

* Supabase Cloud

---

# Application Architecture

The application follows a modular architecture.

Every feature is treated as an independent module.

Example

```text
Announcements

Reports

Business Matching

Training

Events

Members

Profile
```

Each module contains its own:

* UI
* Validation
* Database operations
* Components
* Types
* Server Actions

Modules should remain independent wherever possible.

---

# Next.js Routing Structure

The application uses the App Router.

```text
app/

(page routes)

(layouts)

(server components)

(client components)
```

---

# Proposed Route Structure

```text
/

├── login

├── about

├── membership

├── services

├── blog

├── events

├── contact

├── apply

│

├── portal

│     ├── dashboard
│     ├── announcements
│     ├── reports
│     ├── business-matching
│     ├── collaboration
│     ├── training
│     ├── events
│     ├── member-directory
│     ├── profile
│

└── admin

      ├── dashboard
      ├── announcements
      ├── reports
      ├── members
      ├── business-matching
      ├── collaboration
      ├── training
      ├── events
      ├── media-library
      ├── audit-logs
      └── settings
```

The public website, member portal, and admin panel are completely separated.

---

# Layout Structure

Three layouts exist.

## Public Layout

Navigation

Footer

Marketing pages

---

## Member Layout

Sidebar

Header

Content Area

Profile Menu

---

## Admin Layout

Sidebar

Top Bar

Breadcrumb

Content Area

Quick Actions

---

# Authentication Flow

```text
User visits login

↓

Supabase Authentication

↓

Session Created

↓

Profile Loaded

↓

Role Verified

↓

Redirect

↓

Admin Dashboard

or

Member Dashboard
```

---

# Authorization

The platform has only two user roles.

## Administrator

Full access.

---

## Member

Limited access.

All content visibility is controlled using **Tier Based Read Control**.

Authorization is therefore divided into two levels.

### Level 1

Role

Admin

Member

---

### Level 2

Tier

Associate

Silver

Gold

Platinum

Roles determine **what a user can do**.

Tiers determine **what a member can see**.

---

# Tier Based Read Control

Every content item stores a list of visible membership tiers.

Example

```text
Visible To

Associate

Silver

Gold
```

When a member requests content:

```text
Read Profile

↓

Read Membership Tier

↓

Compare

↓

Grant Access

or

Hide Content
```

No hardcoded logic should exist inside the UI.

All visibility decisions originate from the database.

---

# Data Flow

Example

Administrator uploads report.

```text
Admin

↓

Validation

↓

Supabase Storage

↓

Database Record

↓

Visible To

↓

Members
```

Example

Member downloads report.

```text
Member

↓

Permission Check

↓

Storage

↓

Download

↓

Activity Log
```

---

# Server Components

By default, pages should be implemented as Server Components.

Use Client Components only when necessary.

Examples:

* Forms
* Dialogs
* Search
* Rich Editors
* Drag and Drop
* Interactive Tables

Everything else should remain server-rendered.

---

# Server Actions

Business logic should live inside Server Actions whenever possible.

Examples:

Create Announcement

Upload Report

Approve Member

Create Event

Delete Resource

Avoid unnecessary API routes unless required by external integrations.

---

# Folder Structure

Recommended structure.

```text
src/

app/

components/

features/

lib/

hooks/

types/

actions/

utils/

styles/

constants/
```

---

# Feature Module Structure

Every feature should follow the same organization.

Example

```text
features/

announcements/

components/

actions/

schemas/

types/

hooks/

utils/

constants/
```

Repeat this structure for every module.

---

# UI Components

Reusable components belong inside:

```text
components/ui
```

Examples

Button

Dialog

Table

Card

Badge

Input

Dropdown

Pagination

Sidebar

These components should never contain business logic.

---

# Feature Components

Feature-specific components remain inside each feature.

Example

```text
features/

announcements/

AnnouncementCard

AnnouncementEditor

AnnouncementTable
```

---

# File Upload Strategy

Binary files should never be stored inside PostgreSQL.

Instead:

Files

↓

Supabase Storage

↓

Database stores metadata

Metadata includes:

* Title
* Description
* Storage Path
* File Size
* Category
* Visible Tiers
* Created By

---

# Storage Buckets

Recommended buckets.

```text
public-assets

member-documents

reports

training

events

company-logos

profile-images
```

Each bucket should have independent storage policies.

---

# Database Philosophy

The database should store business data only.

It should never contain:

* UI state
* Temporary filters
* Cached values
* Presentation logic

Keep database models clean and normalized.

---

# State Management

Prefer the following order.

Server State

↓

URL Parameters

↓

React State

↓

Context

Avoid unnecessary global state libraries until genuinely required.

---

# Search Strategy

Large datasets should always be searched inside PostgreSQL.

Avoid downloading entire datasets to the client.

Filtering

Sorting

Pagination

Search

should all happen server-side.

---

# Error Handling

Every page should support:

Loading State

Empty State

Success State

Permission Denied

Unexpected Error

Network Failure

Every Server Action should return typed responses.

---

# Security Principles

Never trust the frontend.

Every action must be validated server-side.

Examples:

Delete Member

Upload Report

Update Profile

Approve Event

Every sensitive operation should verify:

Authentication

Authorization

Ownership

Tier Access

Validation

---

# Performance Principles

Prefer:

Server Components

Streaming

Lazy Loading

Code Splitting

Image Optimization

Pagination

Avoid:

Large client bundles

Unnecessary re-renders

Duplicate requests

Massive database queries

---

# Design Philosophy

The interface should feel:

Professional

Minimal

Modern

Fast

Accessible

Consistent

The design should reflect the professionalism expected from an international business organization rather than a generic admin dashboard.

---

# Future Scalability

Although Version 1 targets a relatively small number of organizations, the architecture should support future expansion without requiring structural redesign.

Potential future enhancements include:

* Multi-admin support
* Email campaigns
* Payment gateway
* Membership renewals
* Calendar integrations
* AI assistant
* Mobile application
* CRM integrations
* Analytics dashboards

These features are intentionally excluded from Version 1 but should not be blocked by architectural decisions made today.

---

# Architecture Principles

Every future implementation should respect the following principles.

## Modular

Each feature is independent.

---

## Secure

Authentication and authorization happen server-side.

---

## Scalable

New modules can be added without changing existing architecture.

---

## Maintainable

Consistent folder structures, naming conventions, and reusable components reduce long-term maintenance costs.

---

## Business First

Technology decisions should always support the operational needs of JIBB rather than introducing unnecessary complexity.

The architecture should remain focused on helping administrators efficiently manage members and facilitating meaningful business relationships between Japanese and Indian organizations.
