# 04 - Admin Panel

## Part 2 — Content Management Modules

> This section documents the Content Management modules of the JIBB Administration Portal.

Content Modules are responsible for publishing information to members.

Unlike traditional CMS platforms, every piece of content is governed by **Tier Based Read Control**, allowing the administrator to determine which membership tiers can access specific resources.

Every content module follows the same lifecycle:

```text
List
↓

Create

↓

Preview

↓

Publish

↓

Edit

↓

Archive
```

This consistent workflow should be maintained throughout the entire application.

---

# Module 1 — Announcements

---

# Purpose

The Announcements module is the official communication channel between JIBB and its members.

Announcements are used to publish:

* Organization updates
* Circulars
* Important notices
* Policy changes
* Meeting reminders
* New report releases
* Event announcements
* Membership notices

Announcements appear on:

* Member Dashboard
* Announcements Page

Announcements should always be sorted by publish date.

Pinned announcements always appear first.

---

# Business Workflow

```text
Create Announcement

↓

Save Draft

↓

Preview

↓

Publish

↓

Visible to Selected Membership Tiers

↓

Edit (if required)

↓

Archive
```

---

# Navigation

```text
Admin

↓

Content

↓

Announcements
```

---

# List View

Purpose

Provide a complete overview of all announcements.

---

## Toolbar

Top Left

* Search

Top Right

* New Announcement

---

## Filters

Search

Status

Visible Tier

Pinned

Date Range

Created By

Reset Filters

---

## Columns

| Column       | Description                       |
| ------------ | --------------------------------- |
| Title        | Announcement title                |
| Status       | Draft / Published / Archived      |
| Visible To   | Membership tiers                  |
| Pinned       | Yes / No                          |
| Publish Date | Publish timestamp                 |
| Expiry Date  | Optional                          |
| Created By   | Administrator                     |
| Updated      | Last modification                 |
| Actions      | Edit / Preview / Archive / Delete |

---

# Create Announcement

Purpose

Create a new announcement.

---

## Form Fields

### Title

Required

Maximum

150 characters

---

### Summary

Optional

Displayed inside cards.

Maximum

250 characters.

---

### Content

Required

Rich Text Editor

Supports

* Headings
* Lists
* Tables
* Images
* Links
* File Attachments

---

### Banner Image

Optional

Recommended

1600 × 900 px

---

### Attachment

Optional

Supported

* PDF
* DOCX
* PPTX
* XLSX
* ZIP

Maximum size

25 MB

---

### External Link

Optional

Used when linking to

* Registration forms
* External websites
* Government portals

---

### Visible To

Checkboxes

☐ Associate

☐ Silver

☐ Gold

☐ Platinum

Administrator selects one or more tiers.

---

### Pin Announcement

Toggle

Pinned announcements always appear first.

---

### Publish Date

Default

Current Date

Can be scheduled.

---

### Expiry Date

Optional.

Expired announcements automatically disappear from member view but remain in the CMS.

---

### Status

Draft

Published

Archived

---

# Preview

The Preview screen should display the announcement exactly as members will see it.

Purpose

Avoid publishing formatting mistakes.

---

# Validation Rules

Title required.

Content required.

Publish date cannot be earlier than creation date.

Expiry date cannot precede publish date.

At least one membership tier must be selected.

---

# Member Experience

Members see

* Banner
* Title
* Publish Date
* Attachment
* Read More

Unread announcements should be visually highlighted.

---

# Database Mapping

Table

announcements

Storage

public-assets

---

# Future Scope

Announcement scheduling

Announcement analytics

Read receipts

Announcement categories

Commenting

Email distribution

(Not included in Version 1.)

---

# Module 2 — Market Intelligence Reports

---

# Purpose

This is one of the most valuable features of the JIBB portal.

The Reports module provides premium research and business intelligence exclusively for members.

Examples

* Semiconductor Industry Reports
* Manufacturing Reports
* Trade Policies
* Investment Opportunities
* Government Guidelines
* Market Analysis
* Country Reports
* White Papers

The Reports module should function more like a digital research library than a simple file upload system.

---

# Business Workflow

```text
Upload File

↓

Add Metadata

↓

Preview

↓

Publish

↓

Available to Selected Membership Tiers
```

---

# Navigation

```text
Admin

↓

Content

↓

Market Intelligence Reports
```

---

# List View

---

## Toolbar

Search

New Report

---

## Filters

Category

Industry

Visible Tier

Status

Date

Tags

---

## Columns

| Column      | Description              |
| ----------- | ------------------------ |
| Title       | Report title             |
| Category    | Report category          |
| Industry    | Industry focus           |
| Tier Access | Visible tiers            |
| Downloads   | Download count           |
| Published   | Publish date             |
| Status      | Draft / Published        |
| Actions     | Edit / Preview / Archive |

---

# Create Report

---

## Title

Required

---

## Executive Summary

Short overview.

Displayed in cards.

Maximum

400 characters.

---

## Report Description

Rich text.

Supports formatting.

---

## Category

Dropdown

Examples

Market Intelligence

Industry Report

Research

White Paper

Government Policy

Trade Guide

Investment

Other

---

## Industry

Dropdown

Examples

Semiconductors

Manufacturing

Automotive

Electronics

Healthcare

Energy

Food Processing

Textiles

Infrastructure

General

---

## Tags

Free-form chips.

Example

Japan

India

Supply Chain

Electronics

AI

Manufacturing

---

## Report Thumbnail

Optional.

Used inside cards.

---

## PDF Upload

Required.

Supported

PDF only.

Maximum

50 MB

---

## Visible To

Checkboxes

Associate

Silver

Gold

Platinum

---

## Featured Report

Toggle.

Featured reports appear on the Member Dashboard.

---

## Publish Date

Current date.

Can be scheduled.

---

## Status

Draft

Published

Archived

---

# Preview

Preview metadata and PDF before publishing.

---

# Validation Rules

Title required.

PDF required.

Category required.

At least one visible tier required.

---

# Member Experience

Members can

Search

Filter

Preview summary

Download PDF

Featured reports appear on the Dashboard.

---

# Database Mapping

Table

resources

Category

Market Intelligence

Storage

reports

---

# Future Scope

Version control

Report analytics

Related reports

Bookmarks

Recommendations

Recently viewed

(Not included in Version 1.)

---

# Module 3 — Media Library

---

# Purpose

The Media Library is the central repository for all uploaded assets.

Instead of uploading the same file repeatedly across different modules, administrators upload assets once and reuse them.

This reduces duplication and keeps storage organized.

---

# Supported Assets

Images

PDF

PowerPoint

Word Documents

Excel Files

ZIP Archives

Videos (future)

---

# Navigation

```text
Admin

↓

Media Library
```

---

# Library Layout

Supports two views.

Grid View

List View

Administrator preference should be remembered.

---

# Toolbar

Search

Upload

Bulk Delete

---

# Filters

File Type

Category

Upload Date

Created By

Unused Files

Storage Bucket

---

# Upload Workflow

```text
Select File

↓

Validate

↓

Upload to Supabase Storage

↓

Create Metadata Record

↓

Available Across Portal
```

---

# Metadata

Every uploaded asset stores

Title

Description

Category

File Type

Storage Bucket

File Size

Created By

Created At

Last Used

Usage Count

---

# Storage Buckets

Recommended

company-logos

reports

training

events

public-assets

member-documents

---

# Usage Tracking

Every file should record where it is being used.

Example

```text
Used In

Announcement

Annual Meeting

----------------

Report

Semiconductor Outlook

----------------

Training

Japanese Culture Workshop
```

Files currently in use should not be deletable.

---

# Validation Rules

Maximum upload size determined by file type.

Duplicate filenames are allowed.

Invalid file extensions rejected.

Virus scanning may be introduced in future versions.

---

# File Preview

Supported previews

Images

PDF

Office documents (basic metadata)

Unknown file types should show a download option only.

---

# Deletion Rules

Files currently referenced by another module cannot be permanently deleted.

Instead

Administrator receives:

"This file is currently used in 3 records. Remove those references before deleting."

---

# Database Mapping

Table

resources

Storage

Supabase Storage

Metadata only stored inside PostgreSQL.

---

# UX Guidelines

The Media Library should behave similarly to a lightweight Digital Asset Management (DAM) system.

Primary goals:

* Fast uploads
* Easy search
* Asset reuse
* Safe deletion
* Consistent organization

It is not intended to replace cloud storage services but to act as the authoritative source of files used throughout the JIBB Member Portal.

---

# Summary

The Content Management section forms the publishing backbone of the JIBB Member Portal.

Announcements keep members informed, Market Intelligence Reports deliver premium business value, and the Media Library provides a centralized repository for reusable digital assets.

Together, these modules establish a consistent content lifecycle—Create, Preview, Publish, Edit, Archive—ensuring that administrators can manage information efficiently while maintaining quality, organization, and controlled access through Tier Based Read Control.
