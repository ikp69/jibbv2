# 05 - Member Portal

> **Document Version:** 1.0
>
> **Status:** Approved for Development
>
> This document defines the complete Member Portal experience for the Japan India Business Bureau (JIBB).

Unlike the Admin Portal, which focuses on managing the organization, the Member Portal focuses on helping companies discover opportunities, access knowledge, and build trusted business relationships.

---

# 1. Purpose

The Member Portal is the digital workspace for every approved JIBB member company.

It provides secure access to premium resources, business opportunities, training programs, networking events, and company information based on the member's subscription tier.

The portal should feel like an exclusive business network rather than a file repository.

---

# 2. Design Philosophy

Every screen should answer one simple question:

> **"How can JIBB help my company today?"**

Members should never be overwhelmed by excessive menus or unnecessary actions.

The interface should be:

* Clean
* Professional
* Fast
* Mobile-friendly
* Easy to navigate
* Focused on business value

---

# 3. Member Journey

A typical member journey should look like this.

```text
Login

↓

Dashboard

↓

Read Announcements

↓

Download Reports

↓

Discover Business Opportunities

↓

Register for Training

↓

Register for Events

↓

Explore Member Directory

↓

Request Business Introduction

↓

Update Company Profile
```

The dashboard acts as the starting point for every session.

---

# 4. Portal Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
├──────────────┬───────────────────────────────────────────────┤
│              │                                               │
│ Left Sidebar │              Main Content                     │
│              │                                               │
│              │                                               │
├──────────────┴───────────────────────────────────────────────┤
│ Footer                                                       │
└──────────────────────────────────────────────────────────────┘
```

---

# 5. Sidebar Navigation

```text
Dashboard

──────────────

Announcements

Market Intelligence Reports

Business Matching

Exhibition / Event Support

Delegation to Japan

Training Programs

Collaboration Opportunities

Meeting Delegation from Japan

Invite Only Events

──────────────

Member Directory

Profile
```

Pages that are not implemented in Version 1 should display a friendly placeholder.

Example

> "This feature will be available in a future release."

---

# 6. Header

The header remains fixed.

Contains:

* Breadcrumb
* Search
* Membership Tier Badge
* Company Logo
* Profile Menu
* Logout

---

# 7. Dashboard

---

# Purpose

The dashboard should immediately show members everything that is important today.

It should not display empty statistics.

Instead, it should surface actionable information.

---

## Welcome Section

```text
Welcome back,

ABC Corporation

Gold Member

Membership Valid Until

18 March 2027
```

---

## Membership Card

Displays

Current Tier

Membership Start

Membership Expiry

Status

Renewal Contact

---

## Dashboard Sections

Latest Announcements

Featured Reports

Business Opportunities

Upcoming Training

Upcoming Events

Suggested Companies

Recent Activity

---

# Quick Actions

Large buttons.

Examples

Download Reports

Browse Opportunities

View Directory

Register for Event

Register for Training

Update Company Profile

---

# Recent Activity

Displays

Recently Downloaded Reports

Applications Submitted

Events Registered

Training Registered

Recently Viewed Companies

---

# 8. Announcements

Purpose

Official communication from JIBB.

---

# Layout

Card layout.

Pinned announcements first.

Newest to oldest.

---

# Card Displays

Banner

Title

Summary

Published Date

Attachment

Read More

---

# Search

Search by

Title

Keywords

---

# Filters

Newest

Oldest

Pinned

Unread

---

# Member Actions

Open

Download Attachment

Visit External Link

---

# Tier Access

Only announcements visible to the member's tier appear.

Other announcements remain completely hidden.

---

# 9. Market Intelligence Reports

Purpose

Premium knowledge center.

The reports page should resemble a professional research library.

---

# Layout

Cards.

Each card displays

Thumbnail

Title

Category

Industry

Summary

Published Date

Download Button

---

# Filters

Industry

Category

Tags

Newest

Featured

---

# Search

Search titles and descriptions.

---

# Report Detail

Displays

Cover

Executive Summary

Metadata

Download Button

Related Reports

---

# Member Actions

Preview Summary

Download PDF

Bookmark (Future)

---

# 10. Business Matching

Purpose

Allow members to discover business opportunities published by JIBB.

---

# Card Displays

Title

Industry

Country

Looking For

Deadline

Membership Tier

---

# Detail Page

Displays

Full Description

Required Partner

Documents

Deadline

---

# Member Actions

Express Interest

Message

Upload Supporting Document (Optional)

Submit

---

# Status

Submitted

↓

Under Review

↓

Approved

↓

Closed

Members can track their submission status.

---

# 11. Exhibition / Event Support

Version 1 Placeholder

Purpose

Future support for exhibition participation.

Display

"This module is currently under development."

---

# 12. Delegation to Japan

Version 1 Placeholder

Purpose

Future support for delegation management.

---

# 13. Training Programs

Purpose

Browse and register for JIBB training.

---

# Categories

Culture

Language

Corporate

Leadership

Problem Solving

---

# Card Layout

Program

Duration

Venue

Seats Remaining

Registration Deadline

Register Button

---

# Detail Page

Overview

Agenda

Trainer

Schedule

Attachments

---

# Member Actions

Register

Cancel Registration (before deadline)

Download Brochure

---

# Registration Status

Open

Pending Review

Approved

Completed

---

# 14. Collaboration Opportunities

Purpose

Discover strategic collaboration opportunities.

---

# Card Displays

Title

Industry

Objective

Deadline

---

# Member Actions

View Details

Express Interest

Submit Supporting Message

---

# Status

Pending

Approved

Closed

---

# 15. Meeting Delegation from Japan

Version 1 Placeholder

Reserved for future development.

---

# 16. Invite Only Events

Purpose

Premium networking opportunities.

---

# Event Card

Banner

Title

Venue

Date

Seats Remaining

---

# Detail Page

Agenda

Location

Time

Speakers (Optional)

Attachments

---

# Member Actions

Register

Cancel

View Registration Status

---

# Status

Registration Open

Pending Review

Approved

Completed

---

# 17. Member Directory

Purpose

Allow members to discover other organizations inside JIBB.

The directory is private.

Accessible only to authenticated members.

---

# Search

Company

Industry

Country

Products

Services

Looking For

---

# Company Card

Logo

Company Name

Industry

Country

Products

Looking For

View Profile

---

# Company Profile

Displays

Company Logo

Overview

Products

Services

Industries

Countries Served

Website

Looking For

Membership Tier

---

# Hidden Information

Never display

Email

Phone

Internal Notes

Membership Dates

Administrative Notes

---

# Request Introduction

Instead of showing contact details,

display a primary button.

```text
Request Introduction
```

Workflow

```text
Member

↓

Request Introduction

↓

Administrator Review

↓

JIBB Facilitates Connection
```

---

# 18. Profile

Purpose

Allow members to manage their company profile.

---

# Tabs

Company Information

Membership

Downloads

Applications

Events

Training

Account Settings

---

# Company Information

Editable

Company Logo

Description

Products

Services

Website

Looking For

City

Country

---

# Membership

Read-only

Tier

Start Date

Expiry

Status

Support Contact

---

# Downloads

History of downloaded reports.

---

# Applications

Business Matching

Collaboration

Events

Training

Each displays

Status

Date

Outcome

---

# Account Settings

Change Password

Update Contact Details

Logout

---

# 19. Global Search

Search available throughout the portal.

Searches

Reports

Announcements

Events

Training

Companies

Business Opportunities

Results grouped by category.

---

# 20. Tier Based Read Control

Members should never see content that exceeds their membership tier.

Unavailable content should not appear with lock icons.

Instead, it should remain hidden.

This creates a cleaner experience and avoids frustration.

---

# 21. Empty States

Every page should provide guidance.

Example

"No business opportunities are available for your membership tier at the moment.

Please check back soon."

---

# 22. Loading States

Use skeleton loaders.

Avoid blank screens.

---

# 23. Success Messages

Examples

Registration submitted successfully.

Interest sent successfully.

Profile updated successfully.

---

# 24. Error Handling

Errors should be human-readable.

Example

Instead of

> Registration Failed

Use

> Registration has closed for this event.

---

# 25. Accessibility

Keyboard navigation

Screen reader labels

Visible focus states

Proper heading hierarchy

Accessible color contrast

---

# 26. Responsive Behaviour

Desktop

Primary experience.

Tablet

Fully supported.

Mobile

Optimized for browsing, downloading reports, and managing registrations.

---

# 27. Member Experience Principles

Every page should reinforce three ideas:

### Learn

Access trusted reports and announcements.

---

### Connect

Discover organizations and request introductions.

---

### Grow

Participate in training, events, and business opportunities.

---

# 28. Product Principles

The Member Portal should never feel like a corporate intranet.

Instead, it should feel like a premium business network curated by JIBB.

Every interaction should strengthen trust between members and the organization.

The portal exists to help companies discover opportunities, access exclusive knowledge, and build meaningful business relationships while preserving privacy and ensuring that JIBB remains the trusted facilitator of every introduction.
