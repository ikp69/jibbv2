import { createClient } from "./server";
import { SessionService } from "@/lib/services/session-service";

/**
 * Extracts the session ID (sid claim) from a Supabase JWT access token.
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * This helper directly extracts the 'sid' (session identifier) claim from the 
 * decrypted JWT payload. This represents a Supabase-specific implementation detail.
 * If Supabase changes how session identifiers are exposed or represented in tokens, 
 * this helper function MUST be updated. All other components, middleware, and 
 * actions rely strictly on this function to get the current session ID, ensuring 
 * that any future upstream adjustments are localized here.
 */
export function getCurrentSessionId(token: string | null | undefined): string | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
    return payload.session_id || payload.sid || null;
  } catch {
    return null;
  }
}

export type VerificationResult =
  | { valid: true; user: any; profile: any; session: any }
  | { valid: false; error: string; status: number };

/**
 * Centralized authorization helper for API Routes and Server Actions.
 */
export async function verifyServerRequest(requiredRole?: "admin" | "member"): Promise<VerificationResult> {
  try {
    const supabase = await createClient();

    // 1. Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { valid: false, error: "Unauthorized: Missing authentication context.", status: 401 };
    }

    // 2. Fetch the session token and extract the session_id (sid)
    const { data: { session: supabaseSession } } = await supabase.auth.getSession();
    const token = supabaseSession?.access_token || null;
    const sid = getCurrentSessionId(token);

    if (!sid) {
      return { valid: false, error: "Unauthorized: Invalid session signature.", status: 401 };
    }

    // 3. Query profile status and validation using SessionService
    const validation = await SessionService.validateSession(user.id, sid);
    if (!validation.valid) {
      return { 
        valid: false, 
        error: `Unauthorized: Session is invalid. Reason: ${validation.reason}`, 
        status: 401 
      };
    }

    const { profile, session } = validation;

    // 4. Validate Role check if specified
    if (requiredRole && profile.role !== requiredRole) {
      return { valid: false, error: "Forbidden: Insufficient privileges.", status: 403 };
    }

    // 5. Success
    return { valid: true, user, profile, session };
  } catch (error) {
    console.error("[AUTH_GUARD] Request validation exception:", error);
    return { valid: false, error: "Internal Server Error during validation.", status: 500 };
  }
}
