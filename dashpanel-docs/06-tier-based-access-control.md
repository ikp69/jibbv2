# 06 - Tier Based Access Control

> **Document Version:** 1.0
>
> **Status:** Approved for Development
>
> **Project:** Japan India Business Bureau (JIBB) Member Portal

---

# Purpose

This document defines how access is controlled throughout the JIBB Member Portal.

Unlike traditional enterprise software that relies on Role Based Access Control (RBAC), JIBB uses a simplified permission model built around **Tier Based Read Control (TBRC).**

The objective is to keep administration simple while ensuring members only access content appropriate to their membership.

This document is the single source of truth for:

* Authentication
* Authorization
* Membership Tiers
* Route Protection
* Content Visibility
* Row Level Security
* Storage Permissions

---

# Access Philosophy

The system separates **identity** from **content access**.

Identity answers:

> Who is this user?

Content access answers:

> What can this user see?

These are two different concepts.

---

# Authentication

Authentication is handled entirely by Supabase Authentication.

The authentication system is responsible only for:

* Login
* Logout
* Password Reset
* Session Management
* User Identity

Authentication never decides what content is visible.

---

# Authorization

Authorization determines what a user is allowed to access.

JIBB uses two authorization layers.

## Layer 1

System Role

```text id="ahw3oe"
Administrator

Member
```

Only one administrator exists.

All other users are members.

---

## Layer 2

Membership Tier

```text id="kjlwmr"
Associate

Silver

Gold

Platinum
```

Membership Tier determines content visibility.

---

# User Model

```text id="g0yz0k"
Supabase Auth

↓

Profile

↓

Role

↓

Membership Tier

↓

Portal
```

Example

```text id="6v0qgp"
Authentication

↓

Member

↓

Gold

↓

Can access Gold resources
```

---

# Roles

Only two roles exist.

## Administrator

Responsibilities

Manage portal

Manage members

Publish content

Approve requests

Manage settings

View audit logs

Administrator bypasses Tier Based Read Control.

Administrator always has full access.

---

## Member

Members can

Read content

Download reports

Register for events

Express business interest

Update company profile

Members cannot create, edit or delete portal content.

---

# Membership Tiers

The system supports four membership levels.

```text id="5gjvr0"
Associate

↓

Silver

↓

Gold

↓

Platinum
```

These represent business plans rather than permissions.

---

# Tier Based Read Control

Instead of assigning permissions,

every content item contains a list of membership tiers that may access it.

Example

Announcement

Visible To

```text id="fwjvud"
Associate

Silver

Gold
```

Platinum members can also see it if selected.

If a tier is not selected,

the content is completely hidden.

---

# Why Checkboxes Instead of Minimum Tier

Instead of

```text id="px4k2l"
Minimum Tier

Gold
```

JIBB uses

```text id="v8m0sy"
Visible To

☑ Associate

☐ Silver

☑ Gold

☑ Platinum
```

Advantages

* More flexible
* Easier to understand
* No special business rules
* Supports custom visibility
* Future-proof

---

# Content Visibility Matrix

| Module                      | Tier Based? |
| --------------------------- | ----------- |
| Announcements               | Yes         |
| Reports                     | Yes         |
| Business Matching           | Yes         |
| Collaboration Opportunities | Yes         |
| Training Programs           | Yes         |
| Invite Only Events          | Yes         |

The following modules ignore tiers.

| Module     | Reason        |
| ---------- | ------------- |
| Login      | Public        |
| Profile    | Owner Only    |
| Settings   | Administrator |
| Audit Logs | Administrator |

---

# Route Protection

The application has three route types.

---

## Public Routes

Accessible without login.

Examples

```text id="x6w5hu"
/

/about

/contact

/blog

/membership

/services

/events
```

---

## Member Routes

Authentication required.

Examples

```text id="4p6b8y"
/portal

/portal/dashboard

/portal/reports

/portal/events

/portal/profile
```

---

## Admin Routes

Administrator only.

```text id="oz2if6"
/admin

/admin/dashboard

/admin/members

/admin/settings

/admin/audit-logs
```

---

# Authentication Flow

```text id="kkj5hk"
User visits login

↓

Supabase Auth

↓

Session Created

↓

Profile Loaded

↓

Role Checked

↓

Administrator

↓

Admin Dashboard

────────────

Member

↓

Member Dashboard
```

---

# Member Authorization Flow

Whenever a member requests content

```text id="kydt8x"
Member

↓

Profile

↓

Membership Tier

↓

Requested Content

↓

Visible Tiers

↓

Allowed?

↓

YES

↓

Show

────────────

NO

↓

Hide
```

The UI should never decide permissions.

The database remains the source of truth.

---

# Hidden Content

Content outside the member's tier should not appear as disabled or locked.

Instead,

it should be completely absent.

Example

Associate member

Should NOT see

Gold reports

Gold events

Gold opportunities

There should be no "Upgrade to View" placeholders in Version 1.

---

# Administrator Override

Administrator always has unrestricted access.

Administrator ignores

Membership Tier

Visibility Rules

Expiry

Content Restrictions

Administrator can preview everything.

---

# Membership Expiry

Members retain authentication.

However,

expired memberships lose access to tier-controlled content.

Workflow

```text id="4mjlwm"
Login

↓

Membership Expired

↓

Portal Opens

↓

Dashboard Notice

↓

Restricted Content Hidden

↓

Contact Administrator
```

This allows members to contact JIBB while preventing access to premium resources.

---

# Row Level Security (RLS)

Supabase RLS should enforce permissions.

The frontend must never be trusted.

---

## Profiles

Member

Read

Own Profile

Update

Own Profile

Administrator

Full Access

---

## Announcements

Member

Read

Only visible tiers

Administrator

CRUD

---

## Reports

Member

Read

Visible tiers only

Administrator

CRUD

---

## Business Opportunities

Member

Read

Visible tiers

Create Interest

Own submissions only

Administrator

CRUD

---

## Events

Member

Read

Visible tiers

Create registration

View own registration

Administrator

CRUD

---

## Training

Member

Read

Visible tiers

Create registration

Administrator

CRUD

---

## Collaboration

Member

Read

Visible tiers

Submit interest

Administrator

CRUD

---

# Storage Permissions

Storage follows the same principles.

Members

Read

Allowed files only

Never upload

Administrator

Upload

Replace

Delete

Archive

---

# Company Privacy

Members should never view

Email

Phone

Internal Notes

Membership History

Audit Logs

Administrative Notes

Members only view public company information.

---

# Ownership Rules

Members may update only

Company Description

Website

Products

Services

Looking For

Logo

They cannot update

Membership Tier

Membership Dates

Account Status

Role

Internal Notes

---

# Password Management

Members

Change own password.

Administrator

Cannot view passwords.

Password resets handled through Supabase Authentication.

---

# Session Rules

One authenticated session per company account.

Future versions may support concurrent sessions if required.

---

# Unauthorized Access

Attempting to access unauthorized routes should return

Administrator Routes

↓

Redirect

↓

403

or

Member Dashboard

Tier Restricted Content

↓

Not Found

Avoid exposing internal authorization logic.

---

# API Security

Every Server Action must verify

Authentication

↓

Role

↓

Ownership

↓

Tier

↓

Validation

↓

Execute

The frontend must never bypass these checks.

---

# Audit Requirements

The following actions should always be logged.

Member Login

Member Logout

Profile Update

Membership Renewal

Announcement Publish

Report Upload

Event Creation

Training Update

Business Opportunity Creation

Settings Update

Logs provide accountability and traceability.

---

# Security Principles

The platform follows a "deny by default" model.

Unless access is explicitly granted,

the user should not receive the resource.

---

# Access Control Matrix

| Resource          | Public |   Member   | Admin |
| ----------------- | :----: | :--------: | :---: |
| Public Website    |    ✓   |      ✓     |   ✓   |
| Login             |    ✓   |      ✓     |   ✓   |
| Member Dashboard  |    ✗   |      ✓     |   ✓   |
| Admin Dashboard   |    ✗   |      ✗     |   ✓   |
| Announcements     |    ✗   | Tier Based |   ✓   |
| Reports           |    ✗   | Tier Based |   ✓   |
| Business Matching |    ✗   | Tier Based |   ✓   |
| Collaboration     |    ✗   | Tier Based |   ✓   |
| Training          |    ✗   | Tier Based |   ✓   |
| Events            |    ✗   | Tier Based |   ✓   |
| Member Directory  |    ✗   |      ✓     |   ✓   |
| Profile           |    ✗   |     Own    |   ✓   |
| Audit Logs        |    ✗   |      ✗     |   ✓   |
| Settings          |    ✗   |      ✗     |   ✓   |

---

# Implementation Principles

Every developer implementing access control should follow these rules.

1. Never trust the frontend.
2. Perform authorization checks on every server action.
3. Keep permission logic inside the backend.
4. Hide unauthorized content instead of disabling it.
5. Treat the database as the single source of truth.
6. Use Tier Based Read Control consistently across all content modules.
7. Preserve member privacy by exposing only approved company information.
8. Keep the authorization model simple and predictable.

---

# Final Summary

The JIBB Member Portal intentionally avoids the complexity of enterprise RBAC systems.

Instead, it uses a lightweight but robust authorization model built on two concepts:

* **Role** determines what a user can do (Administrator or Member).
* **Tier** determines what content a member can see (Associate, Silver, Gold, Platinum).

This approach matches JIBB's operational workflow, simplifies development, reduces maintenance complexity, and provides a secure, scalable foundation for future growth while preserving the organization's role as the trusted facilitator of business relationships.
