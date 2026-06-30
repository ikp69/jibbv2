# 07 - Business Workflows

> **Document Version:** 1.0
>
> **Status:** Approved for Development
>
> **Project:** Japan India Business Bureau (JIBB) Member Portal

---

# Purpose

This document defines the operational workflows of the JIBB Member Portal.

Unlike previous documents that describe interfaces and database structures, this document describes how business processes move through the system.

Every workflow reflects how JIBB operates in the real world.

The portal should adapt to these workflows—not the other way around.

---

# Workflow Principles

Every workflow follows these principles.

* Administrator remains in control.
* Members never bypass administrative review.
* Every significant action is recorded.
* Business relationships are facilitated through JIBB.
* Historical data is preserved whenever possible.

---

# Workflow 1 — Membership Lifecycle

## Objective

Convert an approved organization into an active JIBB member.

---

## Actors

* Administrator
* Member Company

---

## Workflow

```text id="gknjfi"
Membership Inquiry

↓

Offline Discussion

↓

Membership Approved

↓

Administrator Creates Account

↓

Temporary Password Assigned

↓

Member Logs In

↓

Changes Password

↓

Membership Activated

↓

Company Updates Profile
```

---

## Business Rules

* No public registration.
* One company = one login.
* Membership starts from administrator approval date.
* Membership expires after 365 days unless renewed.

---

## Success State

Company gains access to the Member Portal based on its membership tier.

---

# Workflow 2 — Member Login

## Objective

Authenticate a verified member and load the correct portal experience.

---

## Workflow

```text id="n2ifd4"
Login

↓

Supabase Authentication

↓

Session Created

↓

Load Profile

↓

Verify Membership Status

↓

Verify Membership Tier

↓

Open Member Dashboard
```

---

## Failure Scenarios

Invalid credentials

↓

Display login error.

Expired membership

↓

Allow login.

↓

Display renewal notice.

↓

Hide tier-protected content.

---

# Workflow 3 — Announcement Publishing

## Objective

Publish official communication to selected member tiers.

---

## Actors

Administrator

↓

Members

---

## Workflow

```text id="g3qdd5"
Create Announcement

↓

Save Draft

↓

Preview

↓

Publish

↓

Visible To Selected Tiers

↓

Members Read Announcement
```

---

## Business Rules

* Drafts are invisible.
* Published announcements follow publish date.
* Pinned announcements appear first.
* Expired announcements automatically disappear from member view.

---

# Workflow 4 — Market Intelligence Report Publishing

## Objective

Distribute premium research to eligible members.

---

## Workflow

```text id="mjlwm0"
Upload PDF

↓

Add Metadata

↓

Select Membership Tiers

↓

Preview

↓

Publish

↓

Available for Download
```

---

## Business Rules

* PDF required.
* Metadata required.
* Download permission based on membership tier.
* Administrator may archive reports without deleting history.

---

# Workflow 5 — Business Matching

## Objective

Facilitate business partnerships between member organizations.

---

## Actors

Administrator

Member Company

---

## Workflow

```text id="csyg6n"
Administrator Creates Opportunity

↓

Publish

↓

Members Browse

↓

Member Expresses Interest

↓

Application Submitted

↓

Administrator Reviews

↓

Approve

↓

JIBB Introduces Companies

↓

Opportunity Closed
```

---

## Business Rules

* Members cannot contact each other directly.
* Every introduction requires administrator approval.
* One opportunity can receive multiple applications.
* Closing an opportunity does not delete historical applications.

---

# Workflow 6 — Collaboration Opportunity

## Objective

Support strategic collaboration beyond traditional business matching.

---

## Workflow

```text id="xgfv7i"
Administrator Creates Collaboration Opportunity

↓

Publish

↓

Members View Opportunity

↓

Interested Member Applies

↓

Administrator Reviews

↓

Approved

↓

Connection Facilitated
```

---

## Typical Collaborations

* Joint Research
* Technology Transfer
* Manufacturing
* Academic Partnerships
* Investment
* Government Cooperation

---

# Workflow 7 — Training Registration

## Objective

Manage enrollment into professional training programs.

---

## Workflow

```text id="c3ltaz"
Administrator Creates Program

↓

Program Published

↓

Members Register

↓

Registration Received

↓

Administrator Reviews

↓

Approved

↓

Training Conducted

↓

Completed
```

---

## Business Rules

* Registration closes automatically after the deadline.
* Capacity cannot be exceeded.
* Members may cancel before the deadline.
* Completed registrations remain in history.

---

# Workflow 8 — Invite Only Events

## Objective

Manage participation in exclusive JIBB events.

---

## Workflow

```text id="cvxgb7"
Create Event

↓

Publish

↓

Members Register

↓

Administrator Reviews

↓

Approved

↓

Attendance

↓

Event Completed
```

---

## Business Rules

* Registration deadline enforced.
* Capacity enforced.
* Waiting list reserved for future versions.
* Cancelled events remain archived.

---

# Workflow 9 — Member Directory

## Objective

Allow members to discover organizations without exposing private information.

---

## Workflow

```text id="2j8kt7"
Member Opens Directory

↓

Searches Company

↓

Views Public Profile

↓

Requests Introduction

↓

Administrator Reviews

↓

JIBB Connects Companies
```

---

## Business Rules

Visible Information

* Company Name
* Logo
* Industry
* Products
* Services
* Website
* Looking For

Hidden Information

* Email
* Phone
* Internal Notes
* Membership History

---

# Workflow 10 — Company Profile Update

## Objective

Allow companies to keep their information current.

---

## Workflow

```text id="vwy7qz"
Member Opens Profile

↓

Edits Company Information

↓

Save

↓

Validation

↓

Profile Updated
```

---

## Editable Fields

* Description
* Website
* Logo
* Products
* Services
* Looking For

---

## Read-Only Fields

* Membership Tier
* Membership Dates
* Status
* Role

---

# Workflow 11 — Membership Renewal

## Objective

Extend membership after offline renewal.

---

## Workflow

```text id="ndgrg9"
Membership Near Expiry

↓

Administrator Receives Reminder

↓

Offline Renewal Completed

↓

Membership Dates Updated

↓

Portal Access Continues
```

---

## Business Rules

* No online payments in Version 1.
* Membership renewal is performed manually.
* Historical renewal records should be retained.

---

# Workflow 12 — Member Lifecycle

## Objective

Track the complete journey of a member organization.

---

## Workflow

```text id="x7mxhr"
Prospect

↓

Application

↓

Approved

↓

Active Member

↓

Training

↓

Events

↓

Business Matching

↓

Collaboration

↓

Renewal

↓

Long-Term Member
```

---

# Workflow 13 — File Upload

## Objective

Maintain a centralized media library.

---

## Workflow

```text id="grw6ra"
Administrator Uploads File

↓

Validation

↓

Supabase Storage

↓

Metadata Saved

↓

File Available Across Portal
```

---

## Business Rules

* Store binary files in Supabase Storage.
* Store metadata in PostgreSQL.
* Files referenced by active records cannot be deleted.

---

# Workflow 14 — Audit Logging

## Objective

Maintain operational transparency.

---

## Workflow

```text id="6w8f1v"
Administrator Performs Action

↓

Action Validated

↓

Database Updated

↓

Audit Record Created
```

---

## Logged Actions

* Create
* Update
* Delete
* Archive
* Membership Renewal
* Profile Update
* Content Publishing
* Settings Changes

---

# Workflow 15 — Tier Based Read Control

## Objective

Ensure members only access content appropriate to their membership.

---

## Workflow

```text id="bkwjlwm"
Member Requests Resource

↓

Read Membership Tier

↓

Compare Visible Tiers

↓

Access Granted

────────────

OR

↓

Resource Hidden
```

---

## Business Rules

* Hidden content should not appear in listings.
* The frontend should never determine permissions.
* Authorization is enforced by the backend and RLS policies.

---

# Cross-Module Operational Rules

The following rules apply to every workflow.

## Administrator Review

Any action involving another company requires administrator review.

Examples

* Business Matching
* Collaboration
* Member Introductions

---

## Data Preservation

Historical records should never be deleted unless legally required.

Prefer:

* Archive
* Deactivate
* Close

instead of permanent deletion.

---

## Validation

Every workflow validates:

* Authentication
* Authorization
* Required fields
* Business rules
* Ownership

before data is committed.

---

## Audit Logging

Every important workflow generates an audit log entry.

This ensures traceability and accountability.

---

# Workflow Status Standards

To maintain consistency, workflows should use standardized status values wherever applicable.

| Status    | Meaning                          |
| --------- | -------------------------------- |
| Draft     | Not yet visible                  |
| Published | Visible to members               |
| Pending   | Awaiting administrator review    |
| Approved  | Accepted                         |
| Rejected  | Not accepted                     |
| Open      | Accepting applications           |
| Closed    | No longer accepting applications |
| Completed | Finished successfully            |
| Archived  | Retained for history             |

---

# Operational Philosophy

The JIBB Member Portal is designed around **facilitated business relationships**, not unrestricted networking.

Every workflow reinforces three principles:

* **Trust** — JIBB validates and oversees interactions.
* **Privacy** — Member contact details remain protected.
* **Quality** — Administrators curate opportunities, introductions, and content before they reach members.

This workflow-driven approach ensures that the software reflects the operational practices of JIBB while remaining simple to manage, scalable for future growth, and aligned with the organization's mission of strengthening Japan–India business collaboration.
