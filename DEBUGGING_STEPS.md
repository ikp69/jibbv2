# Debugging Login 500 Error

## ⚠️ FOUND: The Likely Root Cause

The audit_logs table has a **foreign key constraint**:

```sql
user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
```

### The Problem

When you try to insert into audit_logs:
```typescript
await supabase.from("audit_logs").insert({
  user_id: userId,  // ← This user must exist in profiles table
  action: "member_login",
  ...
});
```

If the profile doesn't exist yet, **the insert fails with a foreign key constraint error**, which causes a 500.

### Why This Happens

1. User signs up → `auth.users` record created ✅
2. Trigger `handle_new_user()` should create `profiles` record
3. BUT: Trigger might not have run yet when login action executes
4. Login action tries to insert audit log with `user_id` → **FK constraint fails** ❌
5. Error bubbles up as 500
6. User refreshes → Now the profile exists (trigger ran) → Dashboard works ✅

## Solution Options

### Option 1: Make audit_logs.user_id nullable (Recommended if profiles are sometimes missing)

```sql
ALTER TABLE public.audit_logs ALTER COLUMN user_id DROP NOT NULL;
```

Then in the login action, handle null profiles:
```typescript
const { error: auditError } = await supabase.from("audit_logs").insert({
  user_id: profile ? userId : null,  // nullable
  action: "member_login",
  ...
});
```

### Option 2: Don't audit during login (Simplest)

Skip the audit log insert during login. You already have Supabase auth logs.

```typescript
// Remove this entire section:
// const { error: auditError } = await supabase.from("audit_logs").insert({...});
```

### Option 3: Use the admin client for audit insert (Safe)

The admin client bypasses RLS and FK checks aren't the issue, but being explicit:

```typescript
const { error: auditError } = await adminClient.from("audit_logs").insert({
  user_id: userId,
  action: "member_login",
  ...
});
```

### Option 4: Ensure profile exists before audit (Most correct)

```typescript
// After profile query succeeds
if (!profile) {
  return { success: false, error: "Profile not found" };
}

// Now insert audit log safely
const { error: auditError } = await supabase.from("audit_logs").insert({
  user_id: userId,
  ...
});

if (auditError) {
  console.log("[LOGIN] Audit log insert failed:", auditError);
  // Audit log is not critical - don't fail login
}
```

## What To Do Now

1. **Enable better error logging** (already done in login.ts)
2. **Check Vercel function logs** to confirm FK constraint is the issue
3. **Choose one of the solutions above**

My recommendation: **Option 2** (skip audit during login) or **Option 1** (make user_id nullable).

Audit logs are nice-to-have, not critical for auth. Focus on getting login working first.

## How To Implement Option 2 (Quickest)

In `features/cms/auth/actions/login.ts`, comment out the audit insert:

```typescript
// 3. Create Audit Log for successful login
// DISABLED: Audit logging during login can cause FK constraint errors if profile trigger hasn't run yet
// const headersList = await headers();
// const userAgent = headersList.get("user-agent") || undefined;
// const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

// const { error: auditError } = await supabase.from("audit_logs").insert({...});
```

Then test login. If it works, that's confirmation.


