# JIBB Platform Security Audit Guide & Production Checklist

This document provides a detailed security audit checklist, vulnerability mitigation strategies, and search scripts to ensure no data leaks or authorization bypasses exist in the admin and member portals before moving to final production.

---

## 1. The Core Threat Model

Next.js is a hybrid framework where server-side rendering (RSC) and client-side code interact. Developers often make the mistake of hiding information only on the client UI while sending full database payloads over the wire.

An ethical hacker or developer can easily:
- Open the browser **Inspect Element** panel &rarr; **Network** tab &rarr; inspect Next.js RSC payloads (the payload streaming protocol that ends in `.rsc` or JSON chunk packets).
- Inspect standard Redux, React Context, or component props via React Developer Tools.
- Intercept NextJS Server Action HTTP requests or replay queries using tools like **Postman** or **Burp Suite**.

---

## 2. Security Checklists

### Checklist A: RESTRICTIVE DATA SELECTION (Data Privacy)
- [ ] **No Public `select("*")`**: Never select all columns (`*`) when querying tables containing sensitive data (e.g., `created_by`, `user_id`, `email`, `phone`, `notes`, or `billing_info`) if that data is rendered in a list visible to general members.
- [ ] **Selective Projection**: Explicitly declare columns to retrieve (e.g. `.select("id, title, description, deadline")`).
- [ ] **UUID Isolation**: Do not leak User UUIDs (`created_by`, `user_id`) to general member feeds unless it is strictly necessary (e.g., for linking their own items).

### Checklist B: SERVER-SIDE AUTHORIZATION (Actions & APIs)
- [ ] **Authentication Verification**: Every `"use server"` action MUST verify the user's session internally. Client-side state can be spoofed.
- [ ] **Admin Authorization Guards**: Admin-only server actions must call a helper like `checkAdminAuth()` or check the database profile role before performing operations.
- [ ] **Resource Ownership Validation**: When general members edit or delete data (e.g., updating their own matching proposals), the action must query the row first and check if `record.created_by === user.id` before executing the database write.

### Checklist C: ROW LEVEL SECURITY (RLS)
- [ ] **RLS Enabled**: Check that Supabase RLS is turned `ON` for all tables.
- [ ] **Security Policies**: Ensure policies do not allow anonymous reads to tables holding non-public documents or private member pitches.

---

## 3. Practical Code Examples (Before vs. After Security Audit)

### Vulnerable Code (Business Matching - UUID Leakage)
In previous page rendering code, all columns were fetched:
```typescript
// VULNERABLE: Inspecting the network tab reveals the raw "created_by" User UUIDs
const { data: opportunities } = await supabase
  .from("business_opportunities")
  .select("*")
  .eq("status", "published");
```

### Remediated Secure Code
Explicit column selection prevents leakage of the creator's Supabase UUID to other members:
```typescript
// SECURE: Only non-identifying columns are selected and sent over the wire
const { data: opportunities } = await supabase
  .from("business_opportunities")
  .select("id, title, description, industry, country, looking_for, deadline")
  .eq("status", "published");
```

---

## 4. How to Conduct a Security Search (Audit Commands)

Use the following commands in the workspace root terminal to query potential vulnerabilities:

### A. Find instances of `select("*")` to audit potential data leakage
Run this to identify all Supabase select queries fetching raw objects:
```powershell
# PowerShell
Get-ChildItem -Recurse -Filter "*.tsx" -Path .\app | Select-String -Pattern '\.select\(\s*["'']\*["'']\s*\)'
```

### B. Audit all server actions for session verification
Every Server Action must read user context. Ensure they call `supabase.auth.getUser()`:
```powershell
# PowerShell
Get-ChildItem -Recurse -Filter "*.ts" -Path .\features | Select-String -Pattern '"use server"' -Context 0,25
```

### C. Verify Admin Layout Protection
Ensure that routes inside `app/[locale]/(cms)/admin` block unauthorized users. Verify that `app/[locale]/(cms)/admin/layout.tsx` validates:
```typescript
if (profile.role !== "admin" || profile.status !== "active") {
  redirect("/en/portal/dashboard");
}
```

---

## 5. Specific Modules to Check Before Release

1. **Member Directory** (`app/[locale]/(cms)/portal/member-directory/page.tsx`):
   * *Status*: **SECURE**. Restricts selection to public company info:
     `.select("id, company_name, company_description, industry, country, city, website, looking_for, membership_tier")`
2. **Pitches Expressions** (`opportunity_interest` table):
   * *Status*: **SECURE**. Check that member pitches are only visible to the poster of the matching opportunity and the admin. General members must not be able to fetch pitches they did not write.
3. **Collaboration Requests** (`app/[locale]/(cms)/portal/collaboration/page.tsx`):
   * *Status*: **AUDIT**. Ensure members cannot view other members' private collaboration request message pitches.
