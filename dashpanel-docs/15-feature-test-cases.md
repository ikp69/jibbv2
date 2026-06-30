# 15 - Feature Test Cases

> **Document Version:** 1.0
>
> **Status:** Quality Assurance Specification
>
> **Project:** Japan India Business Bureau (JIBB) Member Portal
>
> **Purpose:** Define functional test cases for every feature in Version 1.

---

# Purpose

This document defines the functional test cases for every feature in the JIBB Member Portal.

Unlike the audit checklist, this document verifies **business functionality** from end-to-end.

Every test case should verify:

* User interaction
* UI behaviour
* Server Action
* Database update
* Storage update (if applicable)
* Audit Log
* Refresh persistence
* Error handling

A feature is **not considered complete** until every applicable test passes.

---

# Test Case Standard

Every test case follows the same structure.

```text
Test ID

Feature

Scenario

Preconditions

Test Steps

Expected UI Result

Expected Database Result

Expected Storage Result

Expected Audit Log

Expected Error Handling

Expected Success Feedback

Refresh Verification

Pass / Fail
```

---

# Authentication

## TC-AUTH-001

### Feature

Administrator Login

### Preconditions

* Administrator account exists.
* Account is active.

### Test Steps

1. Open `/login`
2. Enter valid credentials.
3. Click Login.

### Expected UI

* Login successful.
* Redirect to `/admin/dashboard`.

### Expected Database

No data modification.

### Audit Log

Login event recorded.

### Success Feedback

Optional welcome toast.

### Refresh Verification

Session persists.

---

## TC-AUTH-002

Invalid Login

### Test Steps

Enter incorrect password.

### Expected

* Validation message.
* No session created.
* Stay on login page.

PASS if login is rejected.

---

# Settings

## TC-SET-001

Update Administrator Profile

### Preconditions

Administrator logged in.

### Test Steps

1. Open `/admin/settings`
2. Change Designation.
3. Click Save.

### Expected UI

* Save button shows loading.
* Success toast appears.
* Updated designation immediately visible.

### Expected Database

`profiles.designation` updated.

### Audit Log

"Administrator Profile Updated"

### Refresh Verification

Refresh page.

Designation remains updated.

PASS only if value persists after refresh.

---

## TC-SET-002

Empty Required Field

### Steps

Clear required field.

Click Save.

### Expected

Validation displayed.

No database update.

No audit log.

PASS

---

# Announcements

## TC-ANN-001

Create Announcement

### Steps

Create announcement.

Publish.

### Expected UI

Announcement appears in list.

### Database

New row created.

### Audit

Announcement Created.

### Refresh

Still visible.

PASS

---

## TC-ANN-002

Tier Visibility

Create announcement visible only to Gold.

### Expected

Associate cannot view.

Silver cannot view.

Gold can view.

Platinum can view.

PASS

---

# Market Intelligence Reports

## TC-REP-001

Upload PDF

### Steps

Upload PDF.

### Expected UI

Upload successful.

Preview available.

### Storage

PDF exists.

### Database

Metadata stored.

### Refresh

Still downloadable.

PASS

---

## TC-REP-002

Reject Invalid File

Upload EXE.

Expected

Upload rejected.

No database row.

No storage object.

PASS

---

# Business Matching

## TC-BM-001

Create Opportunity

Expected

Opportunity visible.

Correct tier visibility.

Audit created.

PASS

---

## TC-BM-002

Member Applies

Expected

Interest stored.

Administrator sees application.

Status Pending.

PASS

---

## TC-BM-003

Duplicate Application

Apply twice.

Expected

Second application blocked.

Friendly message shown.

PASS

---

# Collaboration

## TC-COL-001

Create Collaboration Opportunity

Expected

Visible to selected tiers.

PASS

---

## TC-COL-002

Member Registers Interest

Expected

Application stored.

Admin dashboard updated.

PASS

---

# Training Programs

## TC-TRN-001

Create Training

PASS if visible.

---

## TC-TRN-002

Register

Expected

Registration stored.

Capacity updated.

PASS

---

## TC-TRN-003

Capacity Full

Expected

Registration rejected.

Friendly message displayed.

PASS

---

# Events

## TC-EVT-001

Create Event

PASS

---

## TC-EVT-002

Member Registration

PASS

---

## TC-EVT-003

Registration Closed

PASS

---

# Manage Members

## TC-MEM-001

Create Member

### Expected

* Supabase Auth user created.
* Profile row created.
* Membership dates assigned.
* Tier assigned.
* Audit log created.

Refresh.

Member still exists.

PASS

---

## TC-MEM-002

Edit Member

PASS

---

## TC-MEM-003

Suspend Member

Expected

Cannot login.

History preserved.

PASS

---

## TC-MEM-004

Renew Membership

Expected

Expiry extended by one year.

Audit recorded.

PASS

---

# Member Directory

## TC-DIR-001

Directory Search

Expected

Search accurate.

PASS

---

## TC-DIR-002

Request Introduction

Expected

Application stored.

Administrator notified (inside CMS).

PASS

---

## TC-DIR-003

Private Information

Expected

Email hidden.

Phone hidden.

Internal notes hidden.

PASS

---

# Media Library

## TC-MED-001

Upload Image

PASS

---

## TC-MED-002

Delete Asset

Expected

Storage deleted.

Database updated.

Broken references prevented.

PASS

---

# Audit Logs

## TC-AUD-001

Every Admin Action

Perform:

Create

Update

Delete

Approve

Reject

### Expected

Every action logged.

Timestamp correct.

User correct.

PASS

---

# Tier Based Read Control

## TC-TBRC-001

Associate

Verify Associate only sees allowed content.

PASS

---

## TC-TBRC-002

Silver

PASS

---

## TC-TBRC-003

Gold

PASS

---

## TC-TBRC-004

Platinum

PASS

---

# Refresh Verification Tests

Every feature must pass refresh verification.

Example

```text
Create Record

↓

Refresh Browser

↓

Record Still Exists

↓

PASS
```

Never consider a feature complete unless refresh succeeds.

---

# Database Verification

Every Create/Update/Delete action must be verified inside Supabase.

Checklist

* Row inserted
* Row updated
* Timestamp updated
* Foreign keys correct
* Soft delete respected
* No duplicate records

---

# Storage Verification

For uploads

Verify

* File exists
* URL accessible
* Metadata correct
* Delete removes object

---

# UI Verification

Every action must verify

* Loading indicator
* Disabled button while saving
* Success toast
* Error toast
* Validation message
* No browser alerts

Browser `alert()`, `confirm()`, and `prompt()` dialogs are **not permitted** in production. Use the project's toast and dialog components instead.

---

# Error Testing

Every feature must intentionally test:

* Invalid input
* Empty fields
* Duplicate data
* Unauthorized access
* Expired membership
* Missing files
* Network failure
* Server error

Application must fail gracefully.

---

# Regression Testing

Whenever a feature changes, rerun all related test cases.

Example

Changing Member Management requires retesting:

* Authentication
* Member Directory
* Profile
* Audit Logs
* Tier Access

---

# Pass Criteria

A feature passes only if:

* UI works.
* Database updated correctly.
* Storage updated (if applicable).
* Audit log written.
* Refresh persists changes.
* No console errors.
* No browser alerts.
* Error handling verified.
* Success feedback displayed.
* Documentation requirements satisfied.

---

# Fail Criteria

A feature automatically fails if any of the following occur:

* Success message shown but database not updated.
* Changes disappear after refresh.
* Missing audit log.
* Browser `alert()` used.
* Validation missing.
* Tier restrictions bypassed.
* Unauthorized access succeeds.
* Data corruption.
* Console errors during normal operation.

---

# AI Functional Testing Prompt

After implementing any feature, execute the following verification process:

1. Perform the feature workflow exactly as a real user.
2. Verify the UI behaviour.
3. Verify the Server Action executed successfully.
4. Verify the database state in Supabase.
5. Verify storage changes if files are involved.
6. Verify the audit log entry.
7. Refresh the page and verify persistence.
8. Test common failure scenarios.
9. Record PASS or FAIL with evidence.

Do not report a feature as complete unless every verification step succeeds.

---

# Final Quality Principle

A feature is **not complete because a button was clicked**.

A feature is complete only when:

* The correct business operation occurred.
* The correct data was persisted.
* The correct feedback was shown.
* The state survives a page refresh.
* Security and Tier Based Read Control remain intact.

The definition of success is **verified functionality**, not merely the absence of visible errors.
