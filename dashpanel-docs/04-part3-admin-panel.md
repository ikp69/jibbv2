# 04 - Admin Panel

## Part 3 — Engagement Modules

> Document Version: 1.0
>
> Status: Approved for Development
>
> This section defines the operational modules responsible for facilitating business relationships, professional development, and member engagement.

Unlike Content Modules (Announcements and Reports), Engagement Modules involve interaction between members and JIBB administrators.

Every workflow follows a review-based approach rather than automatic publishing or approval.

---

# Engagement Module Philosophy

Every engagement module follows the same lifecycle.

```text
Administrator Creates Opportunity

↓

Members View Opportunity

↓

Members Submit Interest

↓

Administrator Reviews

↓

Administrator Approves / Rejects

↓

Activity Recorded
```

This keeps JIBB at the center of every business interaction.

---

# Module 1 — Business Matching

---

# Purpose

Business Matching is the primary mechanism through which JIBB connects Japanese and Indian companies.

The administrator publishes verified business opportunities.

Members express interest.

JIBB reviews every submission before facilitating introductions.

The system is intentionally **not** an open marketplace.

---

# Typical Examples

Looking for:

* Semiconductor Manufacturing Partner
* Indian Electronics Supplier
* Japanese Distributor
* Import Partner
* Export Partner
* OEM Manufacturer
* Technology Partner
* Investment Partner

---

# Navigation

```text
Business

↓

Business Matching
```

---

# Business Workflow

```text
Administrator Creates Opportunity

↓

Publish

↓

Members View Opportunity

↓

Interested Member Applies

↓

Administrator Reviews Submission

↓

Approve

↓

JIBB Facilitates Introduction

↓

Closed
```

---

# List View

Columns

| Column               | Description                |
| -------------------- | -------------------------- |
| Opportunity          | Title                      |
| Industry             | Sector                     |
| Country              | Japan / India              |
| Tier Visibility      | Membership tiers           |
| Deadline             | Closing date               |
| Interested Companies | Count                      |
| Status               | Draft / Published / Closed |
| Updated              | Last modification          |
| Actions              | View / Edit / Close        |

---

# Filters

Search

Industry

Country

Status

Membership Tier

Deadline

Created Date

---

# Create Business Opportunity

---

## Opportunity Title

Required

Maximum

200 characters

---

## Business Overview

Rich text description.

Should explain

* Company background
* Objective
* Business requirement

---

## Looking For

Multi-select

Examples

Distributor

Supplier

Joint Venture

OEM

Buyer

Technology Partner

Investor

Manufacturer

---

## Industry

Dropdown

Examples

Semiconductors

Manufacturing

Healthcare

Automotive

Electronics

Energy

Infrastructure

Food

General

---

## Country

Dropdown

Japan

India

Both

---

## Documents

Optional

PDF

Brochure

Specification Sheet

Proposal

---

## Deadline

Application closing date.

---

## Tier Visibility

Associate

Silver

Gold

Platinum

Multiple selection allowed.

---

## Status

Draft

Published

Closed

---

# Interested Companies

Clicking an opportunity opens

Interested Companies.

Columns

| Company | Message | Applied | Status | Actions |
| ------- | ------- | ------- | ------ | ------- |

Actions

View Company

Approve

Reject

Internal Notes

---

# Company Detail

Displays

Company Profile

Industry

Products

Services

Looking For

Previous Activity

Previous Matchmaking

Internal Notes

---

# Validation Rules

Title required.

Description required.

Deadline required.

Minimum one visible tier.

---

# Member Experience

Members

Browse

↓

View Details

↓

Express Interest

↓

Submit Message

↓

Wait for Review

---

# Future Scope

Status Tracking

Introduction History

Meeting Scheduling

Export Applications

Not included in Version 1.

---

# Module 2 — Collaboration Opportunities

---

# Purpose

Unlike Business Matching, Collaboration Opportunities are broader strategic initiatives.

Examples

Research

Technology

Innovation

Academic

Government

Joint Projects

Knowledge Exchange

The administrator approves all opportunities before publication.

---

# Workflow

```text
Opportunity Created

↓

Published

↓

Member Interested

↓

Administrator Reviews

↓

Introduction

↓

Completed
```

---

# List View

Columns

Title

Industry

Organization

Visible Tier

Interested Companies

Status

Created

Actions

---

# Create Opportunity

Fields

Title

Summary

Detailed Description

Industry

Objectives

Expected Partner

Attachments

Visible Tiers

Closing Date

Status

---

# Objectives

Examples

Technology Transfer

Joint Research

Investment

Manufacturing

Supply Chain

Export Partnership

---

# Member Interest

Members submit

Reason

Message

Supporting Documents

Administrator reviews.

---

# Validation

Description required.

Objectives required.

Visible tiers required.

---

# Future Scope

Project Tracking

Milestones

Shared Workspace

Version 2 only.

---

# Module 3 — Training Programs

---

# Purpose

Manage all educational and professional training offered by JIBB.

The administrator controls the complete training lifecycle.

---

# Current Programs

Version 1

Cultural Training

Japanese → Indian Culture

Indian → Japanese Culture

---

Basic Language Course

Japanese → Hindi

Hindi → Japanese

---

Corporate Training

---

Problem Solving for Employees

---

Future programs should be created dynamically rather than hardcoded.

---

# Workflow

```text
Create Program

↓

Publish

↓

Members Register

↓

Administrator Reviews

↓

Accepted

↓

Completed
```

---

# Navigation

```text
Content

↓

Training Programs
```

---

# List View

Columns

Program

Category

Duration

Capacity

Registered

Visible Tiers

Status

Actions

---

# Create Program

---

## Title

Required

---

## Category

Dropdown

Culture

Language

Corporate

Leadership

Problem Solving

Workshop

Seminar

---

## Description

Rich text.

---

## Duration

Examples

3 Days

2 Weeks

6 Sessions

---

## Venue

Physical

Online

Hybrid

---

## Start Date

Required

---

## End Date

Required

---

## Capacity

Maximum registrations.

---

## Registration Deadline

Required.

---

## Trainer

Optional.

---

## Attachments

Course Brochure

Agenda

Schedule

Reading Material

---

## Visible Tiers

Checkboxes.

---

## Status

Draft

Open

Closed

Completed

---

# Registrations

Columns

Company

Representative

Registered

Status

Actions

---

Actions

Approve

Reject

View Profile

Download Registration

---

# Validation

Capacity required.

End date after start date.

Registration deadline before start date.

---

# Member Experience

Members

Browse Programs

↓

View Details

↓

Register

↓

Wait for Approval

---

# Future Scope

Attendance

Certificates

Feedback

Course Materials

Version 2.

---

# Module 4 — Invite Only Events

---

# Purpose

Manage premium networking events organized by JIBB.

Examples

Business Delegations

Networking Events

Seminars

Trade Meetings

CEO Roundtables

Government Meetings

Conferences

---

# Workflow

```text
Create Event

↓

Publish

↓

Registration Opens

↓

Members Apply

↓

Administrator Reviews

↓

Approved

↓

Event Conducted

↓

Archived
```

---

# List View

Columns

Event

Location

Date

Capacity

Registered

Visible Tiers

Status

Actions

---

# Create Event

---

## Event Title

Required.

---

## Banner

Optional.

---

## Description

Rich text.

---

## Agenda

Optional.

---

## Event Type

Networking

Conference

Delegation

Seminar

Workshop

Meeting

Roundtable

---

## Location

Venue.

---

## Date

Required.

---

## Start Time

---

## End Time

---

## Capacity

Maximum attendees.

---

## Registration Deadline

---

## Attachments

Agenda

Invitation

Map

Schedule

---

## Visible Tiers

Checkboxes.

---

## Status

Draft

Open

Closed

Completed

Cancelled

---

# Registrations

Columns

Company

Representative

Designation

Registered

Status

Actions

---

# Administrator Actions

Approve

Reject

View Company

Export Registrations

Download List (Future)

---

# Validation

Capacity required.

Deadline required.

End time after start time.

---

# Member Experience

Members

View Event

↓

Register

↓

Receive Pending Status

↓

Administrator Review

↓

Approved

---

# Empty States

Every engagement module should provide meaningful empty states.

Example

Business Matching

"No active business opportunities are available at the moment.

Create your first opportunity to help members discover new partnerships."

Avoid generic "No Data" messages.

---

# Common Module Standards

Every engagement module follows the same design language.

Toolbar

Search

Filters

Primary Action

Data Table

Pagination

Detail Drawer

Confirmation Dialog

Toast Notifications

The administrator should never need to learn different interaction patterns for different modules.

---

# Status Standards

All engagement modules should use consistent status badges.

Draft

Gray

Open / Published

Green

Pending Review

Yellow

Closed

Blue

Completed

Purple

Cancelled / Rejected

Red

Status colors must remain consistent throughout the entire Admin Portal.

---

# Analytics (Version 1)

Each engagement module should display lightweight operational metrics.

Examples

Business Matching

* Active Opportunities
* Pending Interests
* Closed Opportunities

Training

* Active Programs
* Registrations
* Completed Programs

Events

* Upcoming Events
* Registrations
* Capacity Utilization

The goal is to provide administrators with operational visibility rather than deep analytics.

---

# Summary

The Engagement Modules transform the JIBB portal from a simple content management system into a business relationship management platform.

Business Matching, Collaboration Opportunities, Training Programs, and Invite Only Events are all designed around a common principle:

JIBB remains the trusted facilitator between member organizations.

Every interaction is intentional, reviewed, and managed by the administrator, ensuring quality, privacy, and meaningful outcomes while maintaining a consistent administrative experience across all engagement workflows.
