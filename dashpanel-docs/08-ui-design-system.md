# 08 - UI Design System

> **Document Version:** 1.0
>
> **Status:** Approved for Development
>
> **Project:** Japan India Business Bureau (JIBB) Member Portal

---

# Purpose

This document defines the visual language, reusable UI components, interaction patterns, spacing, typography, accessibility, and design principles for the JIBB Member Portal.

The goal is to ensure every page feels like part of the same product regardless of which module or developer created it.

This document should be treated as the **single source of truth** for all UI implementation.

---

# Design Philosophy

The JIBB Member Portal should reflect the identity of an international business organization.

The interface should feel:

* Professional
* Clean
* Modern
* Minimal
* Trustworthy
* Fast
* Accessible

Avoid visual clutter.

Every UI element should have a clear purpose.

---

# Design Inspiration

The visual direction should take inspiration from modern SaaS dashboards rather than traditional government portals.

Examples of design qualities:

* Stripe Dashboard
* Linear
* Notion
* Vercel
* GitHub
* Supabase Dashboard

The goal is **clarity over decoration**.

---

# Design Principles

Every screen should follow these principles.

## Consistency

Identical components should always look and behave the same.

---

## Hierarchy

Important information should be visually prominent.

Secondary information should never compete for attention.

---

## Simplicity

Prefer fewer controls.

Reduce unnecessary visual noise.

---

## Readability

Typography should remain highly readable.

Avoid long lines of text.

---

## Predictability

Buttons, forms, tables, and navigation should behave consistently across every module.

---

# Layout System

Every page follows the same structure.

```text id="drzbcl"
Header

↓

Toolbar

↓

Filters

↓

Content

↓

Pagination

↓

Footer
```

This hierarchy should remain consistent throughout the portal.

---

# Grid System

Desktop

12-column grid.

Tablet

8-column grid.

Mobile

4-column grid.

Use responsive layouts rather than separate mobile pages.

---

# Container Width

Maximum content width

1440px

Centered.

Large tables may use full width.

---

# Spacing System

Use an 8px spacing scale.

Examples

```text id="uz8upw"
4

8

12

16

24

32

40

48

64
```

Avoid arbitrary spacing values.

---

# Border Radius

Use consistent radius values.

Small

6px

Medium

10px

Large

14px

Cards should feel soft but not overly rounded.

---

# Shadows

Minimal.

Use shadows only to establish hierarchy.

Cards

Small shadow.

Dialogs

Medium shadow.

Dropdowns

Medium shadow.

Avoid heavy shadows.

---

# Color Philosophy

The interface should remain neutral.

Use color to communicate state, not decoration.

---

# Primary Brand Colors

These should be mapped to Tailwind theme tokens.

Primary

JIBB Blue

Secondary

Japan Red Accent

Neutral

Slate / Gray

Success

Green

Warning

Amber

Danger

Red

Information

Blue

Exact hex values should be defined in the Tailwind theme configuration.

---

# Typography

Font Family

Modern sans-serif.

Recommended

Geist

or

Inter

---

# Font Scale

Page Title

32px

Section Title

24px

Card Title

18px

Body

16px

Caption

14px

Helper Text

12px

Use font weight to establish hierarchy.

---

# Icons

Use

Lucide React

Only.

Avoid mixing icon libraries.

Icons should remain simple and consistent.

---

# Sidebar

Permanent on desktop.

Collapsible.

Drawer on mobile.

---

## Sidebar Width

Expanded

280px

Collapsed

72px

---

# Header

Fixed.

Contains

Breadcrumb

Search

Membership Badge

Profile Menu

Logout

---

# Cards

Cards are the primary information container.

Use for

Announcements

Reports

Events

Training

Statistics

Company Profiles

---

## Card Structure

```text id="l3px3j"
Header

↓

Content

↓

Metadata

↓

Actions
```

Cards should never exceed one primary action.

---

# Tables

Every table should use the same reusable component.

Supports

Sorting

Filtering

Pagination

Sticky Header

Row Selection

Bulk Actions

---

# Forms

Forms should be divided into logical sections.

Avoid one long scrolling form.

Example

Company Information

↓

Membership

↓

Contact

↓

Additional Details

---

# Form Controls

Standardize

Input

Textarea

Select

Multi Select

Checkbox

Radio

Date Picker

File Upload

Rich Text Editor

Switch

---

# Buttons

Three primary variants.

Primary

Filled

Used for main actions.

Secondary

Outline

Used for secondary actions.

Danger

Red

Used for destructive actions.

---

# Button Sizes

Small

Medium

Large

Avoid custom button sizes.

---

# Status Badges

Use consistent colors across the application.

| Status    | Color  |
| --------- | ------ |
| Draft     | Gray   |
| Published | Green  |
| Pending   | Amber  |
| Approved  | Blue   |
| Active    | Green  |
| Suspended | Red    |
| Archived  | Slate  |
| Completed | Purple |

These colors must remain consistent across every module.

---

# Dialogs

Use dialogs only when necessary.

Examples

Delete

Archive

Suspend

Confirmation

Do not use dialogs for navigation.

---

# Toast Notifications

Used for

Create

Update

Delete

Upload

Registration

Keep messages concise.

Example

Report uploaded successfully.

---

# Empty States

Every empty state should include

Illustration or Icon

Title

Helpful Description

Primary Action

Example

"No reports have been published yet.

Upload your first Market Intelligence Report."

---

# Loading States

Never display blank screens.

Use skeleton loaders.

Loading should feel responsive.

---

# Search

Global search available in both portals.

Instant server-side search.

Grouped results.

Keyboard shortcut

Ctrl + K

---

# Filters

Filters appear directly below the toolbar.

Common filters

Search

Status

Tier

Date

Category

Industry

Reset

---

# Pagination

Default

20 rows

Options

20

50

100

Remember user preference.

---

# File Upload

Drag and Drop

or

Browse Files

Display

Progress

File Size

Status

Preview

Errors

---

# Rich Text Editor

Used for

Announcements

Reports

Training

Events

Supports

Headings

Lists

Tables

Images

Links

Attachments

Avoid excessive formatting.

---

# Charts

Version 1 uses lightweight operational charts only.

Examples

Membership Distribution

Upcoming Events

Training Registrations

Avoid complex analytics dashboards.

---

# Animations

Animations should be subtle.

Examples

Fade

Slide

Scale

Duration

150–250ms

Avoid flashy animations.

---

# Responsive Behaviour

Desktop

Primary experience.

Tablet

Fully supported.

Mobile

Optimized for viewing and light administration.

---

# Accessibility

Minimum WCAG AA compliance.

Requirements

Keyboard navigation

Visible focus states

ARIA labels

Color contrast

Screen reader compatibility

Semantic HTML

---

# Component Library

Every reusable component belongs inside

```text id="p4dnlt"
components/ui
```

Examples

Button

Card

Dialog

Input

Badge

Table

Pagination

Tabs

Sidebar

Avatar

Tooltip

Dropdown

Breadcrumb

Skeleton

Toast

No business logic inside UI components.

---

# Feature Components

Feature-specific components belong inside

```text id="2h7zqg"
features/

announcements/

reports/

members/

events/
```

These components may compose reusable UI components but should not duplicate them.

---

# Theme Tokens

Never hardcode colors or spacing.

Use design tokens.

Examples

```text id="7mkq5u"
primary

secondary

background

foreground

muted

border

success

warning

danger
```

All tokens should be defined in the Tailwind theme.

---

# Naming Conventions

Component names should be descriptive.

Examples

MemberCard

AnnouncementCard

ReportTable

TrainingForm

BusinessOpportunityDialog

Avoid generic names such as

Card2

NewTable

CustomInput

---

# Error States

Errors should explain

What happened

Why

How to fix it

Avoid technical language.

---

# Microcopy Guidelines

Buttons should use action-oriented language.

Examples

Create Member

Publish Announcement

Upload Report

Register

Request Introduction

Avoid vague labels like

Submit

Continue

Click Here

---

# Visual Hierarchy

Every page should clearly distinguish:

1. Primary Action
2. Important Content
3. Supporting Information
4. Metadata

Avoid giving equal visual weight to everything.

---

# Component Development Rules

Before creating a new component, check whether an existing reusable component can satisfy the requirement.

Prefer composition over duplication.

---

# UI Quality Checklist

Before completing any page, verify:

* Uses standard layout
* Uses design tokens
* Responsive
* Accessible
* Loading state implemented
* Empty state implemented
* Error state implemented
* Success feedback implemented
* Uses reusable components
* No duplicated UI

---

# Final Design Philosophy

The JIBB Member Portal should feel like a premium, modern SaaS application built specifically for an international business chamber.

Every interface should reinforce trust, professionalism, and simplicity.

The design system exists not only to make the portal visually consistent but also to reduce development time, improve maintainability, and enable AI coding agents to generate interfaces that naturally fit within the product.

When in doubt, prioritize clarity over visual complexity. A simple, consistent interface will serve JIBB's members and administrators far better than an overly decorative design.
