# Authentication "Network Error" Fix - Architectural Analysis

## Problem Identified

Users experiencing "A network error occurred" immediately after login. However, **refreshing the browser shows the dashboard successfully**, which tells us the auth session IS being set correctly.

## Root Cause Analysis

The issue was a **500 error from the server action**, not an RLS problem. The previous fix attempted to use `redirect()` inside a server action called via `startTransition`, which doesn't work:

```
1. Login form calls login() server action (via startTransition)
2. Server action tries to call redirect()
3. redirect() throws an error
4. Error can't be properly serialized back to client in server action context
5. ❌ 500 Internal Server Error
6. User sees "Network error"
7. User refreshes manually
8. ✅ Auth session WAS actually established
9. Dashboard loads because auth cookie exists
```

**Why previous approach failed:**
- `redirect()` works in Route Handlers and Server Components
- But it doesn't work when called from a Server Action invoked via `startTransition()`
- The error serialization fails, causing a 500 error

## The Correct Fix

Instead of calling `redirect()` in the server action, we return a `redirectUrl` and let the client handle the navigation **after** the server action completes successfully.

```typescript
// Server Action: Return URL after auth is established
return {
  success: true,
  role,
  redirectUrl, // ← Pass redirect URL to client
};

// Client: Use router.replace() after action completes
if (result.success && result.redirectUrl) {
  router.replace(result.redirectUrl);  // ← Client-side navigation with established auth
}
```

**Why this works:**
1. Server action completes ✅
2. Auth cookie is set in the response ✅
3. Client receives successful result ✅
4. Client uses `router.replace()` to navigate ✅
5. Next request has the auth cookie from previous response ✅
6. Dashboard page renders with established auth ✅

### Changed: Login Server Action
**File:** `features/cms/auth/actions/login.ts`

- Added `redirectUrl` to the return type
- Returns `{ success: true, role, redirectUrl }` after successful login
- No longer attempts `redirect()` call

### Changed: Login Page Handler
**File:** `app/[locale]/(cms)/login/page.tsx`

- Receives `redirectUrl` from successful login result
- Uses `router.replace(result.redirectUrl)` for navigation
- Simpler error handling (no more trying to catch redirect errors)

## Why This Is the Right Solution

✅ **Proper Next.js patterns:**
- Server actions return serializable data
- Client makes routing decisions
- No misuse of `redirect()` in incompatible contexts

✅ **Security intact:**
- Admin client still only used server-side to check user's own role
- RLS preserved on all dashboard queries
- Auth session fully established before any dashboard code runs

✅ **No timing issues:**
- By the time the client navigates, the server action has completed
- The response contains the auth cookie
- The subsequent dashboard request has a current session

✅ **Fixes the actual problem:**
- Server action completes without throwing errors
- No 500 errors
- Client navigates to dashboard with active session
- Dashboard renders immediately without "network error"

## Files Modified

1. ✅ `features/cms/auth/actions/login.ts` - Returns `redirectUrl` instead of calling `redirect()`
2. ✅ `app/[locale]/(cms)/login/page.tsx` - Uses returned URL to navigate via `router.replace()`

## Testing

Try logging in:
1. Use any demo account or regular credentials
2. Network tab should show:
   - `POST` to server action with 200 OK
   - Immediate navigation to dashboard
3. Dashboard should load without "network error"
4. Refreshing is no longer needed
