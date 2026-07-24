import { createClient } from "./server";
import { SessionService, type ProfileData, type SessionData } from "@/lib/services/session-service";
import { type User } from "@supabase/supabase-js";

/**
 * Extracts the session ID (sid claim) from a Supabase JWT access token payload.
 * Also validates token expiration timestamp (exp claim) if present.
 */
export function getCurrentSessionId(token: string | null | undefined): string | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    // Support Node.js Buffer or browser atob for payload decoding
    const jsonString = typeof window === "undefined" 
      ? Buffer.from(parts[1], "base64").toString("utf8")
      : atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));

    const payload = JSON.parse(jsonString);

    // Validate JWT expiration (exp)
    if (payload.exp && typeof payload.exp === "number") {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      if (payload.exp < nowInSeconds) {
        return null;
      }
    }

    return payload.session_id || payload.sid || null;
  } catch {
    return null;
  }
}

export type VerificationResult =
  | { valid: true; user: User; profile: ProfileData; session: SessionData }
  | { valid: false; error: string; status: number };

/**
 * Centralized authorization guard helper for API Routes and Server Actions.
 * Verifies Supabase authentication context, decodes valid session ID claims,
 * validates active database session state, and enforces RBAC role constraints.
 */
export async function verifyServerRequest(requiredRole?: "admin" | "member"): Promise<VerificationResult> {
  try {
    const supabase = await createClient();

    // 1. Fetch current session & access token in a single call
    const { data: { session: supabaseSession }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !supabaseSession || !supabaseSession.user) {
      return { valid: false, error: "Unauthorized: Missing authentication context.", status: 401 };
    }

    const user = supabaseSession.user;
    const token = supabaseSession.access_token || null;
    const sid = getCurrentSessionId(token);

    if (!sid) {
      return { valid: false, error: "Unauthorized: Invalid or expired session signature.", status: 401 };
    }

    // 2. Query profile status and validation state via SessionService
    const validation = await SessionService.validateSession(user.id, sid);
    if (!validation.valid) {
      return { 
        valid: false, 
        error: "Unauthorized: Session is invalid or revoked.", 
        status: 401 
      };
    }

    const { profile, session } = validation;

    // 3. Validate RBAC role requirements if specified
    if (requiredRole && profile.role !== requiredRole) {
      return { valid: false, error: "Forbidden: Insufficient privileges.", status: 403 };
    }

    // 4. Verification Successful
    return { valid: true, user, profile, session };
  } catch (error) {
    console.error("[AUTH_GUARD] Server request validation exception:", error);
    return { valid: false, error: "Internal Server Error during validation.", status: 500 };
  }
}
