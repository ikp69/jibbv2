# Supabase Database Schema Documentation

This document lists all the tables in the `public` schema of the Supabase database along with their columns, data types, primary keys, and foreign key relationships.

---

## Table of Contents
1. [profiles](#1-publicprofiles)
2. [premium_resources](#2-publicpremium_resources)
3. [contact_inquiries](#3-publiccontact_inquiries)
4. [membership_applications](#4-publicmembership_applications)
5. [business_matches](#5-publicbusiness_matches)
6. [event_registrations](#6-publicevent_registrations)
7. [career_applications](#7-publiccareer_applications)
8. [newsletter_subscribers](#8-publicnewsletter_subscribers)
9. [linkedin_posts](#9-publiclinkedin_posts)
10. [blog_posts](#10-publicblog_posts)
11. [press_releases](#11-publicpress_releases)
12. [member_files](#12-publicmember_files)
13. [announcements](#13-publicannouncements)
14. [audit_logs](#14-publicaudit_logs)
15. [member_sessions](#15-publicmember_sessions)
16. [members](#16-publicmembers)
17. [admins](#17-publicadmins)

---

## 1. `public.profiles`
Stores additional user profile details linked to the authentication system.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | |
| `full_name` | `text` | No | |
| `company_name` | `text` | Yes | |
| `designation` | `text` | Yes | |
| `membership_tier` | `text` | No | Default: `'associate'::text`<br>Check: `ANY (ARRAY['associate', 'silver', 'gold', 'platinum', 'admin'])` |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |
| `updated_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |
| `is_active` | `boolean` | No | Default: `false` |
| `membership_valid_from` | `date` | Yes | |
| `membership_valid_until` | `date` | Yes | |
| `phone` | `text` | Yes | |
| `industry` | `text` | Yes | |
| `notes` | `text` | Yes | |
| `membership_start_date` | `timestamptz` | Yes | |
| `membership_end_date` | `timestamptz` | Yes | |
| `last_login` | `timestamptz` | Yes | |
| `role` | `text` | Yes | Default: `'user'::text` |

### Foreign Keys
- `id` references `auth.users.id`
- Also referenced by:
  - `public.member_sessions.member_id` -> `profiles.id`
  - `public.audit_logs.user_id` -> `profiles.id`
  - `public.announcements.created_by` -> `profiles.id`
  - `public.member_files.created_by` -> `profiles.id`
  - `public.membership_applications.approved_by` -> `profiles.id`

---

## 2. `public.premium_resources`
Stores assets or materials downloadable by members depending on their tier.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `title` | `text` | No | |
| `title_ja` | `text` | No | |
| `description` | `text` | Yes | |
| `description_ja` | `text` | Yes | |
| `resource_type` | `text` | No | Check: `ANY (ARRAY['pdf', 'brochure', 'report', 'newsletter', 'video', 'slides'])` |
| `file_path` | `text` | No | |
| `file_size` | `text` | Yes | |
| `min_required_tier` | `text` | No | Default: `'associate'::text`<br>Check: `ANY (ARRAY['associate', 'silver', 'gold', 'platinum', 'admin'])` |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |

---

## 3. `public.contact_inquiries`
Handles public contact/inquiry forms.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `inquiry_type` | `text` | No | |
| `name` | `text` | No | |
| `email` | `text` | No | |
| `phone` | `text` | Yes | |
| `message` | `text` | No | |
| `status` | `text` | No | Default: `'new'::text`<br>Check: `ANY (ARRAY['new', 'reviewing', 'contacted', 'closed'])` |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |

---

## 4. `public.membership_applications`
Applications for membership tiers.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `membership_tier` | `text` | No | Check: `ANY (ARRAY['associate', 'silver', 'gold', 'platinum'])` |
| `company_name` | `text` | No | |
| `contact_person` | `text` | No | |
| `email` | `text` | No | |
| `phone` | `text` | No | |
| `industry` | `text` | Yes | |
| `company_size` | `text` | Yes | |
| `message` | `text` | Yes | |
| `status` | `text` | No | Default: `'new'::text`<br>Check: `ANY (ARRAY['new', 'reviewing', 'approved', 'rejected', 'contacted', 'closed'])` |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |
| `approved_by` | `uuid` | Yes | Foreign Key |
| `approved_at` | `timestamptz` | Yes | |

### Foreign Keys
- `approved_by` references `public.profiles.id`

---

## 5. `public.business_matches`
Business matchmaking requests.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `member_id` | `uuid` | Yes | Foreign Key |
| `title` | `text` | No | |
| `details` | `text` | No | |
| `target_sector` | `text` | No | |
| `status` | `text` | No | Default: `'new'::text`<br>Check: `ANY (ARRAY['new', 'reviewing', 'contacted', 'closed'])` |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |
| `admin_notes` | `text` | Yes | |
| `updated_at` | `timestamptz` | Yes | Default: `now()` |

### Foreign Keys
- `member_id` references `auth.users.id`

---

## 6. `public.event_registrations`
Registrations for events.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `event_id` | `text` | No | |
| `name` | `text` | No | |
| `company` | `text` | No | |
| `designation` | `text` | No | |
| `email` | `text` | No | |
| `phone` | `text` | No | |
| `attendee_type` | `text` | No | Default: `'general'::text`<br>Check: `ANY (ARRAY['general', 'vip', 'speaker', 'sponsor'])` |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |

---

## 7. `public.career_applications`
Applications for careers/jobs.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `name` | `text` | No | |
| `email` | `text` | No | |
| `phone` | `text` | No | |
| `position` | `text` | No | |
| `resume_url` | `text` | No | |
| `cover_letter` | `text` | Yes | |
| `status` | `text` | No | Default: `'new'::text`<br>Check: `ANY (ARRAY['new', 'reviewing', 'contacted', 'closed'])` |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |

---

## 8. `public.newsletter_subscribers`
Subscribers to newsletters.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `email` | `text` | No | Unique |
| `source` | `text` | No | Default: `'footer'::text` |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |

---

## 9. `public.linkedin_posts`
LinkedIn post logs or references.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `share_urn` | `text` | No | Unique |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |

---

## 10. `public.blog_posts`
Blog post metadata and content.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `slug` | `text` | No | Unique |
| `title` | `text` | No | |
| `meta_description` | `text` | Yes | |
| `cover_image_path` | `text` | Yes | |
| `cover_image_alt` | `text` | Yes | |
| `content_markdown` | `text` | No | Default: `''::text` |
| `author_id` | `uuid` | Yes | Foreign Key |
| `author_name` | `text` | Yes | |
| `tags` | `ARRAY` (`_text`) | Yes | Default: `'{}'::text[]` |
| `status` | `text` | No | Default: `'draft'::text`<br>Check: `ANY (ARRAY['draft', 'published'])` |
| `published_at` | `timestamptz` | Yes | |
| `created_at` | `timestamptz` | No | Default: `now()` |
| `updated_at` | `timestamptz` | No | Default: `now()` |

### Foreign Keys
- `author_id` references `auth.users.id`

---

## 11. `public.press_releases`
Press releases.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `headline` | `text` | No | |
| `source_name` | `text` | No | |
| `source_url` | `text` | No | |
| `publication_date` | `date` | No | |
| `summary` | `text` | Yes | |
| `is_published` | `boolean` | No | Default: `true` |
| `created_at` | `timestamptz` | No | Default: `now()` |

---

## 12. `public.member_files`
Files shared with members.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `category` | `text` | No | Check: `ANY (ARRAY['market-intelligence', 'reports', 'guidelines', 'case-studies', 'training-materials', 'opportunities', 'announcements', 'other'])` |
| `file_name` | `text` | No | |
| `file_description` | `text` | Yes | |
| `file_url` | `text` | No | |
| `file_type` | `text` | No | Check: `ANY (ARRAY['pdf', 'image', 'document', 'video', 'spreadsheet'])` |
| `file_size` | `integer` | Yes | |
| `min_required_tier` | `text` | No | Check: `ANY (ARRAY['associate', 'silver', 'gold', 'platinum', 'admin'])` |
| `created_by` | `uuid` | No | Foreign Key |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |
| `updated_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |

### Foreign Keys
- `created_by` references `public.profiles.id`

---

## 13. `public.announcements`
Member portal announcements.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `title` | `text` | No | |
| `content` | `text` | No | |
| `min_required_tier` | `text` | No | Check: `ANY (ARRAY['associate', 'silver', 'gold', 'platinum', 'admin'])` |
| `is_pinned` | `boolean` | Yes | Default: `false` |
| `created_by` | `uuid` | No | Foreign Key |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |
| `updated_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |

### Foreign Keys
- `created_by` references `public.profiles.id`

---

## 14. `public.audit_logs`
System action audit trails.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `action_type` | `text` | No | Check: `ANY (ARRAY['add_member', 'update_member', 'delete_member', 'upgrade_tier', 'upload_file', 'delete_file', 'create_announcement', 'update_announcement', 'delete_announcement', 'approve_application', 'reject_application', 'member_login', 'member_logout', 'download_file', 'other'])` |
| `resource_type` | `text` | No | Check: `ANY (ARRAY['member', 'file', 'announcement', 'application', 'session', 'other'])` |
| `resource_id` | `text` | Yes | |
| `user_id` | `uuid` | Yes | Foreign Key |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |
| `action_details` | `jsonb` | Yes | |
| `ip_address` | `inet` | Yes | |
| `user_agent` | `text` | Yes | |

### Foreign Keys
- `user_id` references `public.profiles.id`

---

## 15. `public.member_sessions`
Sessions of members.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | Default: `gen_random_uuid()` |
| `member_id` | `uuid` | No | Foreign Key |
| `ip_address` | `inet` | Yes | |
| `device_info` | `text` | Yes | |
| `last_login` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |

### Foreign Keys
- `member_id` references `public.profiles.id`

---

## 16. `public.members`
Member records linked to auth users.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | |
| `full_name` | `text` | No | |
| `company_name` | `text` | Yes | |
| `designation` | `text` | Yes | |
| `membership_tier` | `text` | No | Default: `'associate'::text`<br>Check: `ANY (ARRAY['associate', 'silver', 'gold', 'platinum'])` |
| `phone` | `text` | Yes | |
| `industry` | `text` | Yes | |
| `notes` | `text` | Yes | |
| `membership_start_date` | `timestamptz` | Yes | |
| `membership_end_date` | `timestamptz` | Yes | |
| `last_login` | `timestamptz` | Yes | |
| `is_active` | `boolean` | Yes | Default: `true` |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |
| `updated_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |

### Foreign Keys
- `id` references `auth.users.id`

---

## 17. `public.admins`
Admin details and permissions.

* **RLS Enabled:** Yes
* **Primary Key:** `id`

### Columns
| Column Name | Data Type | Nullable | Default Value / Constraints |
|---|---|---|---|
| `id` * (PK) | `uuid` | No | |
| `admin_level` | `text` | No | Default: `'standard'::text`<br>Check: `ANY (ARRAY['standard', 'super'])` |
| `permissions` | `jsonb` | Yes | Default: `'[]'::jsonb` |
| `notes` | `text` | Yes | |
| `created_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |
| `updated_at` | `timestamptz` | No | Default: `timezone('utc'::text, now())` |

### Foreign Keys
- `id` references `auth.users.id`
