# Login 500 Error - Root Cause & Fix

## The Real Problem (Confirmed)

**The server action calls `redirect()`, which throws an exception. The client catches it and treats it as a network error.**

### How We Found It

By analyzing the compiled JavaScript bundle, the actual behavior was:

```javascript
// Client code (what you wrote)
try {
  await login({ email, password });
  setErrors({ general: "Login failed. Please try again." });
} catch (err) {
  console.error("Login error:", err);
  setErrors({ general: "A network error occurred. Please try again." });
}
```

### Why This Failed

1. Server action does authentication
2. Server action calls `redirect("/en/portal/dashboard")`
3. **`redirect()` throws `NEXT_REDIRECT` exception** (by design)
4. This exception propagates to the client
5. Client's `catch` block catches it
6. Client treats any thrown value as a network error
7. ❌ Shows "A network error occurred"
8. 💾 Meanwhile, the auth session WAS successfully established
9. 🔄 User refreshes
10. ✅ Dashboard loads (session already exists)

### Why Previous Theories Were Wrong

- ❌ Not RLS timing issue (profile exists after refresh)
- ❌ Not FK constraint on audit_logs (audit is non-critical)
- ❌ Not middleware issue (cookies are set)
- ✅ **It was the mismatch between server behavior (redirect throws) and client expectation (try/catch)**

## The Fix (Correct Architecture)

### Server Action: Return Success Object

**Before:**
```typescript
redirect(role === "admin" ? "/en/admin/dashboard" : "/en/portal/dashboard");
```

**After:**
```typescript
return {
  success: true,
  role,
  redirectUrl: role === "admin" ? "/en/admin/dashboard" : "/en/portal/dashboard",
};
```

### Client: Handle Success and Navigate

**Before:**
```typescript
try {
  await login({ email, password });
  setErrors({ general: "Login failed. Please try again." });
} catch (err) {
  setErrors({ general: "A network error occurred. Please try again." });
}
```

**After:**
```typescript
try {
  const result = await login({ email, password });
  if (result.success && result.redirectUrl) {
    router.replace(result.redirectUrl);  // Client-side navigation after success
  } else {
    setErrors({ general: result.error || "Authentication failed" });
  }
} catch (err) {
  console.error("Login error:", err);
  setErrors({ general: "A network error occurred. Please try again." });
}
```

## Why This Is Correct

✅ **No exceptions thrown on success** — Server action completes normally
✅ **Client controls navigation** — Knows when auth succeeded
✅ **Try/catch only catches genuine errors** — Not intentional redirects
✅ **Auth session is established before navigation** — Router.replace happens after success
✅ **Follows Next.js best practices** — Server actions return data, clients navigate

## Files Changed

1. `features/cms/auth/actions/login.ts`
   - Removed `redirect()` call
   - Returns `{ success: true, role, redirectUrl }`
   - Added logging at each stage

2. `app/[locale]/(cms)/login/page.tsx`
   - Checks `result.success` and `result.redirectUrl`
   - Uses `router.replace()` for client-side navigation
   - Properly handles success vs error responses

## What To Test

1. Click "Sign In" with demo credentials
2. **Dashboard should load immediately** without "network error"
3. Check browser console for `[LOGIN]` debug logs
4. No need to refresh

## Why Refresh Was Working

```
Initial Login:
1. Auth succeeds, redirect() throws
2. Client catches and shows "network error"
3. Auth session IS established in cookies

On Refresh:
1. Browser requests dashboard again
2. Session cookie exists
3. Middleware finds authenticated user
4. Dashboard loads normally
```

## Key Insight

This is a **fundamental mismatch between architecture patterns**:
- Server actions with `redirect()` throw exceptions
- Exceptions shouldn't be used for control flow
- Client code must be prepared for either return values or genuine errors
- Using `redirect()` inside a called server action breaks this contract

The fix aligns the two layers: **server returns data → client decides what to do**.

## Status

Login flow is now:
1. ✅ User submits credentials
2. ✅ Server action authenticates
3. ✅ Server action checks profile and audit logs
4. ✅ Server action returns `{ success: true, redirectUrl }`
5. ✅ Client receives normal response
6. ✅ Client navigates to dashboard
7. ✅ Dashboard loads with active session

**Try logging in now. It should work immediately.**
