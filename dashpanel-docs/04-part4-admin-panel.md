# 04 - Admin Panel

## Part 4 — Member Management, Administration & Operational Standards

> Document Version: 1.0
>
> Status: Approved for Development

This document completes the Admin Panel specification.

The modules described here form the operational backbone of the JIBB Member Portal.

---

# Member Management Philosophy

The administrator does not simply maintain a database of users.

The administrator manages the relationship between JIBB and every member organization.

Every company progresses through a lifecycle.

```text
Application

↓

Review

↓

Approved

↓

Member Created

↓

Active

↓

Membership Renewal

↓

Expired

↓

Archived
```

The CMS should make this lifecycle visible and manageable.

---

# Module 1 — Manage Members

---

# Purpose

Manage every member company from one place.

Functions include

* Create member
* Edit profile
* Activate / Deactivate
* Upgrade membership
* View activity
* Review engagement
* Archive company

---

# Navigation

```text
Members

↓

Manage Members
```

---

# List View

The list view is the primary operational screen.

---

## Toolbar

Search

Add Member

Bulk Actions

Export (Future)

---

## Filters

Membership Tier

Membership Status

Industry

Country

Membership Expiry

Joined Date

Active / Inactive

Search

Reset

---

## Table Columns

| Column          | Description                          |
| --------------- | ------------------------------------ |
| Company         | Logo + Company Name                  |
| Representative  | Primary Contact                      |
| Designation     | Job Title                            |
| Membership Tier | Associate / Silver / Gold / Platinum |
| Industry        | Industry                             |
| Country         | Country                              |
| Joined          | Membership Start                     |
| Expires         | Membership End                       |
| Last Login      | Last Portal Access                   |
| Status          | Active / Expired / Suspended         |
| Actions         | View / Edit / Archive                |

---

# Member Status

Only one status should exist at a time.

Active

Membership currently valid.

---

Pending

Account created.

Awaiting activation.

---

Expired

Membership period ended.

---

Suspended

Temporarily disabled.

---

Archived

No longer displayed in operational lists.

Historical data preserved.

---

# Add Member

Administrator creates members manually.

No public registration exists.

---

## Required Fields

Company Name

Representative Name

Email

Phone

Designation

Membership Tier

Membership Start Date

Membership End Date

Industry

Country

Password (Temporary)

---

## Optional Fields

Website

Company Logo

Company Description

Products

Services

Looking For

City

Internal Notes

---

# Account Creation Workflow

```text
Administrator

↓

Create Member

↓

Temporary Password Generated

↓

Account Activated

↓

Member Logs In

↓

Password Changed

↓

Portal Access
```

---

# Edit Member

Editable fields

Company Details

Representative Details

Membership

Profile

Notes

Company Logo

Website

Products

Services

Looking For

---

# Member Timeline

Every profile contains an activity timeline.

Example

```text
12 Jan

Membership Created

────────────

18 Jan

Downloaded Report

────────────

22 Jan

Applied Business Matching

────────────

30 Jan

Registered Event
```

Chronological order.

Newest first.

---

# Member Activity Summary

Displayed at top.

Examples

Announcements Viewed

Reports Downloaded

Business Interests

Training Registrations

Event Registrations

Last Login

Membership Age

---

# Bulk Actions

Available for selected rows.

Activate

Deactivate

Archive

Upgrade Tier

Downgrade Tier

Extend Membership

---

# Membership Expiry

Dashboard should warn administrator.

Examples

Expiring Today

Expiring This Week

Expiring This Month

Expired

---

# Member Detail Page

The detail page acts as the 360° operational view of the company.

---

## Header

Logo

Company Name

Membership Badge

Status

Joined

Expires

Quick Actions

---

## Tabs

Overview

Activity

Business Matching

Collaboration

Training

Events

Documents

Internal Notes

Audit History

---

# Overview Tab

Displays

Company Information

Representative

Membership

Industry

Country

Website

Products

Services

Looking For

Contact Details

---

# Activity Tab

Chronological activity feed.

Includes

Downloads

Applications

Registrations

Profile Updates

Logins

---

# Documents Tab

Files uploaded by administrator.

Examples

Membership Agreement

Brochures

Certificates

Contracts

---

# Internal Notes

Visible only to administrator.

Never visible to members.

Example

```text
Interested in expanding into Japanese automotive sector.

Requested follow-up after trade delegation.
```

---

# Member Lifecycle Actions

Administrator may

Renew Membership

Upgrade Tier

Suspend

Reactivate

Archive

Delete (discouraged)

Historical records should be preserved.

---

# Module 2 — Member Directory

---

# Purpose

Provide a searchable directory of approved member companies.

Visible only to authenticated members.

Administrator controls all information.

---

# Directory Management

Administrator controls

Visibility

Profile Approval

Company Information

Logo

Industry

Products

Services

Looking For

---

# Search Filters

Company Name

Industry

Country

Membership Tier

Products

Services

Looking For

---

# Company Card

Displays

Logo

Company

Industry

Country

Membership Tier

Products

Looking For

View Profile

---

# Hidden Information

Never display

Email

Phone

Internal Notes

Membership Dates

Administrative Information

Private Documents

---

# Request Introduction

Instead of displaying contact information

Members click

Request Introduction

Administrator receives notification inside CMS.

---

# Module 3 — Company Profiles

---

# Purpose

Each member company has one professional profile.

The profile becomes the digital identity of the organization inside JIBB.

---

# Profile Structure

Company Logo

Banner

Overview

Products

Services

Industries

Countries Served

Website

Social Links

Looking For

Membership Tier

---

# Looking For

Examples

Distributor

Supplier

OEM

Buyer

Technology Partner

Joint Venture

Investor

Research Partner

---

# Products & Services

Structured lists.

Avoid long paragraphs.

---

# Company Visibility

Only approved companies appear.

Suspended

Expired

Archived

companies remain hidden.

---

# Module 4 — Settings

---

# Purpose

Manage portal-wide configuration.

Version 1 intentionally keeps Settings minimal.

---

# General

Portal Name

Organization Name

Support Email

Support Phone

Timezone

---

# Membership

Membership Duration

Default

365 Days

Membership Tiers

Associate

Silver

Gold

Platinum

---

# File Upload

Maximum Upload Size

Allowed File Types

Default Storage Bucket

---

# Branding

Logo

Favicon

Primary Color

Secondary Color

Footer Copyright

---

# Security

Session Timeout

Password Requirements

Allow Concurrent Sessions

---

# Module 5 — Audit Logs

---

# Purpose

Maintain a permanent history of administrative actions.

Every significant change should be recorded.

---

# Recorded Actions

Member Created

Member Updated

Membership Renewed

Membership Suspended

Announcement Published

Report Uploaded

Event Created

Training Updated

Business Opportunity Created

File Deleted

Settings Updated

---

# Log Fields

Timestamp

Administrator

Action

Module

Affected Record

IP Address

Browser

---

# Filters

Date

Action

Module

User

---

# Detail View

Shows

Previous Values

New Values

Timestamp

Administrator

---

# Export

Future Version.

CSV

Excel

PDF

---

# UX Guidelines

The administrator should never feel overwhelmed.

---

## Consistency

Every module follows

Toolbar

↓

Filters

↓

Table

↓

Pagination

↓

Actions

---

## Primary Action

Always

Top Right

Examples

Add Member

Create Event

Upload Report

---

## Search

Always

Top Left

Instant server-side search.

---

## Filters

Placed directly beneath toolbar.

Collapsible on smaller screens.

---

## Tables

Consistent spacing.

Sticky header.

Sortable columns.

Row actions aligned right.

---

## Forms

Split into logical sections.

Avoid excessively long forms.

Group related information.

---

## Buttons

Primary

Filled

Secondary

Outline

Danger

Red

---

## Dialogs

Only for

Delete

Archive

Suspend

Other destructive actions.

---

# Validation Rules

Every form should validate

Client-side

AND

Server-side.

---

## Required Fields

Display inline errors.

Never wait until submission.

---

## Dates

End date cannot precede start date.

Membership expiry must be after membership start.

Registration deadline must precede event.

---

## Email

Unique.

Validated.

---

## Uploads

Validate

Extension

File Size

Virus Scan (future)

---

## Membership Tier

Exactly one tier per company.

---

# Error Handling

Explain

What happened.

Why.

How to fix it.

Avoid generic messages.

---

# Success Feedback

Toast notifications.

Examples

Member created successfully.

Membership renewed successfully.

Report uploaded successfully.

---

# Edge Cases

The system should gracefully handle uncommon situations.

---

## Membership Expired

Member can log in but sees an expiry notice and loses access to tier-restricted content until renewed.

---

## Deleted Resources

Resources linked to active records cannot be deleted.

Administrator must remove references first.

---

## Duplicate Companies

Warn administrator if a company with the same name or email already exists.

---

## Storage Failure

If a file upload succeeds but metadata creation fails, the orphaned file should be flagged for cleanup.

---

## Invalid Tier Changes

Downgrading a member should not delete historical activity or registrations.

Only future content visibility changes.

---

## Archived Members

Archived companies remain in audit history and reports but are hidden from operational views.

---

## Session Expiration

If an administrator session expires while editing a record, unsaved changes should be preserved locally when possible and the user redirected to the login page.

---

## Empty States

Every page should provide guidance rather than simply stating that no data exists.

Example

"No members have been added yet.

Create your first member to begin managing the JIBB network."

---

# Operational Principles

The Admin Panel is the command center of the JIBB Member Portal.

Every feature should support one of four operational goals:

* Manage Members
* Publish Content
* Facilitate Business Relationships
* Maintain Organizational Records

If a feature does not contribute to one of these goals, it should not be included in Version 1.

---

# Final Summary

The completed Admin Panel specification defines a purpose-built Business Chamber Management System rather than a generic CMS.

Its architecture is centered on member organizations, with every workflow—from onboarding and content publishing to business introductions and event management—designed to support JIBB's role as the trusted facilitator between Japanese and Indian companies.

The result is a modular, scalable, and operationally focused administration platform that provides a consistent user experience while remaining simple enough for a single administrator to manage efficiently.
