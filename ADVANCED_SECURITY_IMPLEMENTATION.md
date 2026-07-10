# Advanced Security Implementation Guide for JIBB
## Complete Code Examples & Step-by-Step Implementation

**Target**: Implement 10 critical security features
**Estimated Time**: 40-60 hours
**Complexity**: Medium to Advanced

---

## 1. MULTI-FACTOR AUTHENTICATION (MFA) IMPLEMENTATION

### 1.1 TOTP Setup (Google Authenticator, Authy)

**Step 1: Install Dependencies**
```bash
npm install speakeasy qrcode
```

**Step 2: Create MFA Setup Action**
```typescript
// features/cms/auth/actions/setup-mfa.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function generateMFASecret() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not authenticated" };
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `JIBB (${user.email})`,
      issuer: "JIBB Platform",
      length: 32
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url || "");

    // Store temporary secret (not confirmed yet)
    await supabase.from("mfa_setup_temp").insert({
      user_id: user.id,
      secret: secret.base32,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min expiry
    });

    return {
      secret: secret.base32,
      qrCode,
      backupCodes: generateBackupCodes()
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

function generateBackupCodes(count = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(
      Math.random().toString(36).substring(2, 10).toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
  }
  return codes;
}
```

**Step 3: Verify MFA Token**
```typescript
// features/cms/auth/actions/verify-mfa.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import speakeasy from "speakeasy";

export async function verifyMFAToken(token: string, backupCodes: string[]) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get temporary secret
    const { data: tempMfa } = await supabase
      .from("mfa_setup_temp")
      .select("secret")
      .eq("user_id", user.id)
      .single();

    if (!tempMfa) {
      return { success: false, error: "MFA setup expired. Start over." };
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: tempMfa.secret,
      encoding: "base32",
      token: token,
      window: 2 // Allow 2 time windows (±30 seconds)
    });

    if (!verified) {
      return { success: false, error: "Invalid MFA token" };
    }

    // Save confirmed MFA to profile
    await supabase.from("profiles").update({
      mfa_enabled: true,
      mfa_secret: tempMfa.secret,
      mfa_backup_codes: backupCodes
    }).eq("id", user.id);

    // Clean up temporary
    await supabase.from("mfa_setup_temp").delete().eq("user_id", user.id);

    // Log MFA enablement
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "mfa_enabled",
      table_name: "profiles",
      record_id: user.id,
      old_values: { mfa_enabled: false },
      new_values: { mfa_enabled: true }
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
```

**Step 4: Verify Login with MFA**
```typescript
// features/cms/auth/actions/login-with-mfa.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import speakeasy from "speakeasy";
import { cookies } from "next/headers";

export async function loginWithMFA(email: string, password: string, mfaToken: string) {
  try {
    const supabase = await createClient();

    // Step 1: Sign in with email/password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      // Log failed attempt
      await logFailedLogin(email, "password_invalid");
      return { success: false, error: "Invalid credentials" };
    }

    // Step 2: Check if MFA is enabled
    const { data: profile } = await supabase
      .from("profiles")
      .select("mfa_enabled, mfa_secret")
      .eq("id", authData.user.id)
      .single();

    if (!profile?.mfa_enabled) {
      // No MFA, login successful
      return { success: true, requiresMFA: false };
    }

    // Step 3: Verify MFA token
    const verified = speakeasy.totp.verify({
      secret: profile.mfa_secret,
      encoding: "base32",
      token: mfaToken,
      window: 2
    });

    if (!verified) {
      // Check backup codes
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("mfa_backup_codes")
        .eq("id", authData.user.id)
        .single();

      const backupCodes = userProfile?.mfa_backup_codes || [];
      if (!backupCodes.includes(mfaToken)) {
        await logFailedLogin(email, "mfa_invalid");
        return { success: false, error: "Invalid MFA token" };
      }

      // Backup code used - remove it
      await supabase.from("profiles").update({
        mfa_backup_codes: backupCodes.filter(c => c !== mfaToken)
      }).eq("id", authData.user.id);
    }

    // Log successful login
    await supabase.from("audit_logs").insert({
      user_id: authData.user.id,
      action: "login",
      table_name: "audit_logs",
      record_id: authData.user.id,
      ip_address: getClientIP(),
      user_agent: getClientUserAgent()
    });

    return { success: true, requiresMFA: true, sessionToken: authData.session?.access_token };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

async function logFailedLogin(email: string, reason: string) {
  // Log without requiring user ID
  console.log(`Failed login attempt: ${email} - ${reason}`);
}

function getClientIP(): string | undefined {
  // Implementation in next section
  return undefined;
}

function getClientUserAgent(): string | undefined {
  return undefined;
}
```

---

## 2. CSRF PROTECTION

### 2.1 Install CSRF Package

```bash
npm install next-csrf
```

### 2.2 Middleware Setup

```typescript
// middleware.ts
import { csrf } from "next-csrf";

export const middleware = csrf();

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

### 2.3 Add CSRF to Forms

```typescript
// components/cms/forms/FormWithCSRF.tsx
"use client";

import { useCSRFToken } from "next-csrf/client";
import { FormEvent } from "react";

export default function FormWithCSRF() {
  const csrfToken = useCSRFToken();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    const response = await fetch("/api/submit-form", {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRF-Token": csrfToken
      }
    });

    // Handle response
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="_csrf" value={csrfToken} />
      <input type="text" name="title" required />
      <button type="submit">Submit</button>
    </form>
  );
}
```



---

## 3. SESSION MANAGEMENT & TIMEOUT

### 3.1 Session Timeout Middleware

```typescript
// lib/middleware/session-timeout.ts
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ABSOLUTE_TIMEOUT = 12 * 60 * 60 * 1000; // 12 hours

export async function checkSessionTimeout() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const cookieStore = await cookies();
  const lastActivity = cookieStore.get("last_activity")?.value;
  const sessionStart = cookieStore.get("session_start")?.value;

  // Check absolute timeout
  if (sessionStart) {
    const sessionAge = Date.now() - parseInt(sessionStart);
    if (sessionAge > ABSOLUTE_TIMEOUT) {
      await supabase.auth.signOut();
      return { expired: true, reason: "absolute_timeout" };
    }
  }

  // Check inactivity timeout
  if (lastActivity) {
    const inactiveTime = Date.now() - parseInt(lastActivity);
    if (inactiveTime > INACTIVITY_TIMEOUT) {
      await supabase.auth.signOut();
      return { expired: true, reason: "inactivity_timeout" };
    }
  }

  // Update last activity
  cookieStore.set("last_activity", Date.now().toString(), {
    maxAge: INACTIVITY_TIMEOUT,
    path: "/"
  });

  return { expired: false };
}
```

### 3.2 Session Timeout Alert Component

```typescript
// components/cms/SessionTimeoutWarning.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SessionTimeoutWarning() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkTimeout = setInterval(() => {
      const lastActivity = localStorage.getItem("last_activity");
      if (!lastActivity) return;

      const inactiveTime = Date.now() - parseInt(lastActivity);
      const warningThreshold = 5 * 60 * 1000; // 5 minutes
      const timeoutTime = 30 * 60 * 1000; // 30 minutes

      if (inactiveTime > timeoutTime) {
        router.push("/login");
      } else if (inactiveTime > timeoutTime - warningThreshold) {
        setShowWarning(true);
        setTimeLeft(Math.ceil((timeoutTime - inactiveTime) / 1000));
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => clearInterval(checkTimeout);
  }, [router]);

  if (!showWarning) return null;

  return (
    <div className="fixed top-4 right-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
      <p className="text-yellow-800">
        Your session will expire in {timeLeft} seconds
      </p>
      <button
        onClick={() => {
          localStorage.setItem("last_activity", Date.now().toString());
          setShowWarning(false);
        }}
        className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded"
      >
        Stay Logged In
      </button>
    </div>
  );
}
```

---

## 4. ENCRYPTION OF SENSITIVE DATA

### 4.1 PII Encryption Utility

```typescript
// lib/encryption/pii-encryption.ts
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.PII_ENCRYPTION_KEY!;
const ALGORITHM = "aes-256-cbc";

export function encryptPII(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

export function decryptPII(encrypted: string): string {
  const [ivHex, encryptedHex] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
```

### 4.2 Encrypt Before Storage

```typescript
// features/cms/profile/actions/update-profile-encrypted.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { encryptPII } from "@/lib/encryption/pii-encryption";

export async function updateProfileWithEncryption(input: ProfileInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Encrypt sensitive fields
  const encryptedEmail = encryptPII(input.email);
  const encryptedPhone = encryptPII(input.phone);

  // Update profile with encrypted data
  const { error } = await supabase.from("profiles").update({
    email: encryptedEmail,
    phone: encryptedPhone,
    full_name: input.fullName, // NOT encrypted - non-sensitive
    designation: input.designation
  }).eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
```

---

## 5. PII MASKING IN RESPONSES

### 5.1 Masking Utility Functions

```typescript
// lib/security/pii-masking.ts
import { decryptPII } from "@/lib/encryption/pii-encryption";

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local}@${domain}`;
  
  const masked = local[0] + "*".repeat(local.length - 2) + local[local.length - 1];
  return `${masked}@${domain}`;
}

export function maskPhone(phone: string): string {
  // +91 9876543210 -> +91 XXXX XXX 3210
  return phone.replace(/(\+\d{2})(\d{4})(\d{3})(\d{4})/, "$1 XXXX XXX $4");
}

export function maskName(name: string): string {
  // John Doe -> J*** D***
  const parts = name.split(" ");
  return parts.map(part => part[0] + "*".repeat(Math.max(0, part.length - 1))).join(" ");
}

export async function buildSecureUserResponse(
  user: any,
  requestingUserId: string,
  userRole: "admin" | "member"
) {
  const baseResponse = {
    id: user.id,
    company_name: user.company_name,
    designation: user.designation,
  };

  // Self can see everything
  if (requestingUserId === user.id) {
    return {
      ...baseResponse,
      email: decryptPII(user.email),
      phone: decryptPII(user.phone),
      full_name: user.full_name,
    };
  }

  // Admin sees masked PII
  if (userRole === "admin") {
    return {
      ...baseResponse,
      email: maskEmail(decryptPII(user.email)),
      phone: maskPhone(decryptPII(user.phone)),
      full_name: maskName(user.full_name),
      status: user.status,
    };
  }

  // Members see minimal public info
  return baseResponse;
}
```

---

## 6. SECURITY HEADERS

### 6.1 Next.js Security Headers Configuration

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()"
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' fonts.gstatic.com; connect-src 'self' *.supabase.co"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

---

## 7. RATE LIMITING

### 7.1 Install Rate Limiting Library

```bash
npm install @upstash/ratelimit redis
```

### 7.2 Rate Limiting Middleware

```typescript
// lib/middleware/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Different rate limits for different actions
const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 attempts per 15 min
  analytics: true,
  prefix: "ratelimit:login",
});

const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"), // 100 requests per hour
  analytics: true,
  prefix: "ratelimit:api",
});

export async function checkLoginRateLimit(email: string) {
  const { success, remaining } = await loginRateLimit.limit(email);
  return { success, remaining };
}

export async function checkAPIRateLimit(userId: string) {
  const { success, remaining } = await apiRateLimit.limit(userId);
  return { success, remaining };
}
```

### 7.3 Apply Rate Limit to Login

```typescript
// features/cms/auth/actions/login-with-rate-limit.ts
"use server";

import { checkLoginRateLimit } from "@/lib/middleware/rate-limit";
import { createClient } from "@/lib/supabase/server";

export async function loginWithRateLimit(email: string, password: string) {
  // Check rate limit
  const { success } = await checkLoginRateLimit(email);
  
  if (!success) {
    return {
      success: false,
      error: "Too many login attempts. Try again later."
    };
  }

  // Proceed with login
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}
```



---

## 8. ENHANCED AUDIT LOGGING

### 8.1 Comprehensive Audit Log Action

```typescript
// lib/audit/audit-logger.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type AuditAction =
  | "login"
  | "logout"
  | "login_failed"
  | "mfa_enabled"
  | "mfa_disabled"
  | "password_changed"
  | "profile_updated"
  | "role_changed"
  | "permission_granted"
  | "permission_revoked"
  | "data_exported"
  | "data_deleted";

export async function logAudit(
  userId: string,
  action: AuditAction,
  tableName: string,
  recordId: string,
  oldValues?: any,
  newValues?: any,
  additionalData?: any
) {
  try {
    const supabase = await createClient();
    const headersList = await headers();
    
    // Get client IP
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] ||
               headersList.get("x-real-ip") ||
               "unknown";
    
    const userAgent = headersList.get("user-agent") || "unknown";

    // Detect suspicious patterns
    const riskLevel = detectRiskLevel(action, additionalData);

    await supabase.from("audit_logs").insert({
      user_id: userId,
      action,
      table_name: tableName,
      record_id: recordId,
      ip_address: ip,
      user_agent: userAgent,
      old_values: oldValues,
      new_values: newValues,
      risk_level: riskLevel,
      additional_data: additionalData,
      created_at: new Date().toISOString()
    });

    // Alert on high-risk actions
    if (riskLevel === "high" || riskLevel === "critical") {
      await sendSecurityAlert(userId, action, ip, additionalData);
    }
  } catch (err) {
    console.error("Failed to log audit:", err);
  }
}

function detectRiskLevel(action: AuditAction, data?: any): "low" | "medium" | "high" | "critical" {
  const highRiskActions: AuditAction[] = [
    "role_changed",
    "permission_granted",
    "permission_revoked",
    "data_exported",
    "data_deleted"
  ];

  if (highRiskActions.includes(action)) return "high";
  
  if (action === "login_failed" && data?.attemptCount > 3) return "critical";
  
  return "low";
}

async function sendSecurityAlert(
  userId: string,
  action: string,
  ip: string,
  data?: any
) {
  // Send email or Slack notification
  console.log(`SECURITY ALERT: ${userId} performed ${action} from ${ip}`);
  // Implementation depends on notification service
}
```

### 8.2 Apply Comprehensive Logging

```typescript
// features/cms/auth/actions/login-enhanced.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit/audit-logger";

export async function loginEnhanced(email: string, password: string) {
  try {
    const supabase = await createClient();

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Log failed attempt
      await logAudit(
        email, // Use email as identifier for failed login
        "login_failed",
        "auth",
        email,
        undefined,
        undefined,
        { reason: error.message }
      );
      return { success: false, error: "Invalid credentials" };
    }

    // Log successful login
    await logAudit(
      data.user.id,
      "login",
      "profiles",
      data.user.id,
      undefined,
      { logged_in_at: new Date() },
      { email }
    );

    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
```

---

## 9. INCIDENT RESPONSE & ALERTS

### 9.1 Security Alert System

```typescript
// lib/security/alert-system.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export type SecurityAlertSeverity = "info" | "warning" | "critical";

export async function createSecurityAlert(
  title: string,
  description: string,
  severity: SecurityAlertSeverity,
  affectedUsers: string[],
  metadata?: any
) {
  const supabase = await createClient();

  await supabase.from("security_alerts").insert({
    title,
    description,
    severity,
    affected_users: affectedUsers,
    metadata,
    status: "open",
    created_at: new Date().toISOString()
  });

  // Notify admins for critical alerts
  if (severity === "critical") {
    await notifyAdmins(title, description, affectedUsers);
  }
}

async function notifyAdmins(title: string, description: string, affectedUsers: string[]) {
  // Send email/Slack/webhook
  console.log(`CRITICAL ALERT: ${title}`);
  console.log(`Affected users: ${affectedUsers.join(", ")}`);
  console.log(`Description: ${description}`);
}
```

### 9.2 Detect Suspicious Activities

```typescript
// lib/security/threat-detection.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { createSecurityAlert } from "@/lib/security/alert-system";

export async function detectThreatPatterns() {
  const supabase = await createClient();

  // Check 1: Multiple failed logins
  const { data: failedLogins } = await supabase
    .from("audit_logs")
    .select("user_id, ip_address")
    .eq("action", "login_failed")
    .gt("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

  const failedByIP: Record<string, number> = {};
  failedLogins?.forEach(log => {
    failedByIP[log.ip_address] = (failedByIP[log.ip_address] || 0) + 1;
  });

  for (const [ip, count] of Object.entries(failedByIP)) {
    if (count > 10) {
      await createSecurityAlert(
        "Brute Force Attack Detected",
        `${count} failed login attempts from IP ${ip}`,
        "critical",
        [],
        { ip, attemptCount: count }
      );
    }
  }

  // Check 2: Unusual access locations
  const { data: recentLogins } = await supabase
    .from("audit_logs")
    .select("user_id, ip_address")
    .eq("action", "login")
    .gt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  // Group by user
  const loginsByUser: Record<string, string[]> = {};
  recentLogins?.forEach(log => {
    if (!loginsByUser[log.user_id]) {
      loginsByUser[log.user_id] = [];
    }
    loginsByUser[log.user_id].push(log.ip_address);
  });

  // Check for multiple IPs per user in short time
  for (const [userId, ips] of Object.entries(loginsByUser)) {
    const uniqueIPs = [...new Set(ips)];
    if (uniqueIPs.length > 3) {
      await createSecurityAlert(
        "Unusual Login Activity",
        `User ${userId} logged in from ${uniqueIPs.length} different locations`,
        "warning",
        [userId],
        { userId, locations: uniqueIPs }
      );
    }
  }
}
```

---

## 10. GDPR COMPLIANCE FEATURES

### 10.1 Data Export (Right to Portability)

```typescript
// features/cms/profile/actions/export-user-data.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit/audit-logger";
import { decryptPII } from "@/lib/encryption/pii-encryption";

export async function exportUserData() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not authenticated" };
    }

    // Fetch all user data
    const [profile, opportunities, interests, activities] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("business_opportunities").select("*").eq("created_by", user.id),
      supabase.from("opportunity_interest").select("*").eq("member_id", user.id),
      supabase.from("audit_logs").select("*").eq("user_id", user.id)
    ]);

    // Decrypt PII
    const decryptedProfile = {
      ...profile.data,
      email: decryptPII(profile.data.email),
      phone: decryptPII(profile.data.phone)
    };

    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: decryptedProfile,
      opportunities: opportunities.data,
      interests: interests.data,
      activities: activities.data
    };

    // Log data export
    await logAudit(
      user.id,
      "data_exported",
      "profiles",
      user.id,
      undefined,
      { exported_at: new Date() },
      { fields_exported: Object.keys(exportData) }
    );

    // Return JSON file
    return {
      success: true,
      data: exportData,
      filename: `jibb-data-${user.id}-${Date.now()}.json`
    };
  } catch (err: any) {
    return { error: err.message };
  }
}
```

### 10.2 Account Deletion (Right to Erasure)

```typescript
// features/cms/profile/actions/delete-user-account.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit/audit-logger";

export async function deleteUserAccount(password: string, reason: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not authenticated" };
    }

    // Verify password before deletion
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password
    });

    if (error) {
      return { error: "Invalid password" };
    }

    // Log deletion (before deletion)
    await logAudit(
      user.id,
      "data_deleted",
      "profiles",
      user.id,
      undefined,
      { deleted_at: new Date() },
      { reason, gdpr_compliance: true }
    );

    // Anonymize profile instead of hard delete
    await supabase.from("profiles").update({
      email: "deleted@jibb.platform",
      phone: "deleted",
      full_name: "Deleted User",
      company_name: "Deleted",
      company_description: null,
      website: null,
      notes: null,
      is_active: false,
      deleted_at: new Date().toISOString()
    }).eq("id", user.id);

    // Delete auth user
    const adminClient = createAdminClient();
    await adminClient.auth.admin.deleteUser(user.id);

    return { success: true, message: "Account deleted successfully" };
  } catch (err: any) {
    return { error: err.message };
  }
}
```

---

## 11. IMPLEMENTATION PRIORITY & TIMELINE

### Phase 1: Foundation (Weeks 1-2)
- ✅ CSRF Protection (2 hours)
- ✅ Security Headers (1 hour)
- ✅ Session Timeout (3 hours)
- ✅ Enhanced Audit Logging (4 hours)

**Total**: ~10 hours

### Phase 2: Authentication (Weeks 3-4)
- ✅ MFA (TOTP) Implementation (6 hours)
- ✅ Rate Limiting (2 hours)
- ✅ Password Security Policy (4 hours)

**Total**: ~12 hours

### Phase 3: Data Protection (Weeks 5-6)
- ✅ PII Encryption (6 hours)
- ✅ PII Masking (4 hours)
- ✅ Database RLS Verification (2 hours)

**Total**: ~12 hours

### Phase 4: Compliance & Monitoring (Weeks 7-8)
- ✅ Threat Detection (6 hours)
- ✅ GDPR Features (Data Export/Deletion) (6 hours)
- ✅ Incident Response Framework (4 hours)

**Total**: ~16 hours

---

## TOTAL ESTIMATED EFFORT: 50 Hours (1-2 developer-weeks)

