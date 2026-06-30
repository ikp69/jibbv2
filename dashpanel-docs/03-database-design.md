# 03 - Database Design

> **Document Version:** 1.0
> **Status:** Approved for Development
> **Project:** Japan India Business Bureau (JIBB) Member Portal

---

# Purpose

This document defines the complete database architecture for the Japan India Business Bureau (JIBB) Member Portal.

It is the single source of truth for:

* Database tables
* Relationships
* Naming conventions
* Row Level Security (RLS)
* Storage buckets
* Indexing strategy
* Data ownership
* Migration decisions

Every future migration should follow this document.

---

# Design Principles

The database has been designed around the following principles.

## Simplicity

Avoid duplicate tables.

Avoid duplicate data.

Each entity has one clear responsibility.

---

## Normalization

Store information once.

Reference it everywhere else.

---

## Scalability

Although Version 1 targets a relatively small member base, the schema should support future growth without structural redesign.

---

## Business First

Tables should represent business entities rather than UI screens.

Example:

Good

* announcements
* resources
* events

Bad

* dashboard_cards
* homepage_widgets

---

# Core Database Architecture

```text
                     auth.users
                          │
                          │
                    1 : 1
                          │
                          ▼
                     profiles
                          │
        ┌─────────────────┼───────────────────┐
        │                 │                   │
        ▼                 ▼                   ▼
 announcements       resources          opportunities
        │                 │                   │
        │                 │                   │
        ▼                 ▼                   ▼
 audit_logs      resource_downloads   opportunity_interest

                          │
                          ▼
                       events
                          │
                          ▼
                event_registrations

                          │
                          ▼
                 training_programs
                          │
                          ▼
            training_registrations
```

---

# Database Naming Standards

## Table Names

Plural.

Examples

```text
profiles

announcements

resources

events

memberships
```

---

## Primary Keys

Every table uses

```text
id UUID
```

Generated using

```sql
gen_random_uuid()
```

except

profiles

which references

auth.users.id

---

## Foreign Keys

Always end with

```text
_id
```

Examples

```text
member_id

resource_id

event_id

created_by
```

---

## Timestamp Fields

Every table contains

```text
created_at

updated_at
```

UTC only.

---

# User Model

Authentication

↓

auth.users

↓

profiles

Only one profile exists for every authenticated user.

The profile table becomes the central table of the application.

---

# Profiles Table

Purpose

Represents one member company.

One Company = One Login.

Suggested fields

```text
id

full_name

company_name

company_logo

designation

email

phone

website

industry

country

city

company_description

looking_for

membership_tier

membership_start

membership_end

is_active

role

notes

last_login

created_at

updated_at
```

Notes

role

Only

```text
admin

member
```

No additional roles.

---

# Remove These Tables

Current schema contains unnecessary duplication.

Remove

```text
members

admins
```

Reason

All required information belongs inside

profiles

---

# Resources Table

Replace

```text
premium_resources

member_files
```

with one table.

Purpose

Central media repository.

Fields

```text
id

title

description

category

resource_type

thumbnail_url

file_url

file_size

tags

visible_tiers

download_count

created_by

created_at

updated_at
```

Categories

```text
Market Intelligence

Reports

Training

Guidelines

Case Studies

Forms

Other
```

resource_type

```text
pdf

image

video

spreadsheet

presentation

document
```

---

# Announcements

Purpose

Official communication published by JIBB.

Fields

```text
id

title

content

banner_image

attachment

external_link

visible_tiers

is_pinned

status

publish_date

expiry_date

created_by

created_at

updated_at
```

Status

```text
draft

published

archived
```

---

# Business Opportunities

Purpose

Business matching opportunities created by administrator.

Fields

```text
id

title

description

industry

country

looking_for

deadline

visible_tiers

status

created_by

created_at

updated_at
```

Status

```text
draft

published

closed
```

---

# Opportunity Interest

Purpose

Stores member interest.

Fields

```text
id

opportunity_id

member_id

message

status

created_at
```

Status

```text
pending

reviewed

approved

closed
```

---

# Collaboration Opportunities

Purpose

Approved collaboration requests.

Fields

```text
id

title

description

industry

visible_tiers

status

created_by

created_at
```

---

# Collaboration Interest

Fields

```text
id

collaboration_id

member_id

message

status

created_at
```

---

# Events

Purpose

Invite-only member events.

Fields

```text
id

title

description

banner

location

event_date

registration_deadline

capacity

visible_tiers

status

created_by

created_at

updated_at
```

---

# Event Registrations

Fields

```text
id

event_id

member_id

message

status

created_at
```

---

# Training Programs

Purpose

Training catalog.

Fields

```text
id

title

description

category

duration

location

start_date

capacity

visible_tiers

status

created_by
```

Categories

```text
Culture

Language

Corporate

Problem Solving
```

---

# Training Registrations

Fields

```text
id

training_id

member_id

status

created_at
```

---

# Member Directory

The directory is generated from

profiles

No separate table required.

The profile itself becomes the directory entry.

Searchable fields

```text
Company

Industry

Country

Products

Services

Looking For
```

Members never see private notes.

---

# Audit Logs

Purpose

Track administrator activity.

Fields

```text
id

user_id

action

table_name

record_id

old_values

new_values

ip_address

user_agent

created_at
```

JSON should be used for

old_values

new_values

---

# Contact Inquiries

Keep existing table.

Used by

Public Website.

No changes required.

---

# Membership Applications

Keep.

Purpose

Offline membership pipeline.

Suggested additions

```text
approved_membership_start

approved_membership_end

internal_notes
```

---

# Newsletter Subscribers

Keep.

Public website only.

Independent module.

---

# Blog Posts

Keep.

Independent from member portal.

---

# Press Releases

Keep.

Independent from member portal.

---

# LinkedIn Posts

Keep.

No changes required.

---

# Row Level Security Strategy

## Public Tables

Public Read

```text
blog_posts

press_releases

linkedin_posts
```

---

## Member Tables

Authenticated users only.

```text
announcements

resources

events

training

member_directory
```

Visibility further controlled using

visible_tiers

---

## Admin Only

```text
audit_logs

membership_applications

settings

media uploads

member management
```

---

# Storage Buckets

Recommended buckets

```text
company-logos

reports

training

events

public-assets

member-documents
```

Store only file paths inside PostgreSQL.

Never store binary data.

---

# Recommended Indexes

Create indexes on

```text
membership_tier

industry

company_name

event_date

publish_date

created_at

status
```

For search

```text
title

description

company_name
```

---

# Database Relationships

```text
profiles

↓

announcements

↓

resources

↓

events

↓

training

↓

opportunities

↓

interest tables
```

Every business entity links back to

profiles

through

created_by

---

# Migration Plan

Current Database

↓

Merge

premium_resources

*

member_files

↓

resources

---

Remove

members

↓

profiles

---

Remove

admins

↓

profiles.role

---

Replace

min_required_tier

↓

visible_tiers[]

---

Split

business_matches

↓

business_opportunities

*

opportunity_interest

---

Create

training_programs

training_registrations

events

event_registrations

---

# Database Philosophy

The database should model the real-world operations of the Japan India Business Bureau.

Every table should represent a meaningful business concept rather than a user interface element.

A clean schema reduces development complexity, improves maintainability, and allows future modules to be introduced with minimal structural change.

The database should remain the foundation of the platform—not merely a storage layer, but an accurate representation of how JIBB manages members, resources, events, and business relationships.
