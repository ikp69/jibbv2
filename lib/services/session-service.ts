import { createAdminClient } from "@/lib/supabase/admin";
import { redis } from "@/lib/redis";

export type ProfileData = {
  id: string;
  role: "admin" | "member";
  status: "active" | "suspended" | "archived" | "pending";
  country: string | null;
  membership_tier: string | null;
};

export type SessionData = {
  id: string;
  session_id: string;
  revoked_at: string | null;
  logout_at: string | null;
};

export type SessionValidationResult =
  | { valid: true; reason: null; profile: ProfileData; session: SessionData }
  | { valid: false; reason: "revoked" | "expired" | "not_found" | "inactive" | "disabled" | "deleted" | "invalid_role"; profile?: ProfileData };

// Dual-layer Cache Strategy: L1 Memory Map with L2 Distributed Upstash Redis Integration
const SESSION_CACHE_TTL_MS = 30 * 1000;
interface CachedValidation {
  result: SessionValidationResult;
  expiresAt: number;
}
const sessionCache = new Map<string, CachedValidation>();

export class SessionService {
  /**
   * Clears or invalidates a cached session result upon logout or revocation across L1 Memory and L2 Redis layers.
   */
  static async invalidateCache(userId: string, sessionId?: string): Promise<void> {
    // 1. Purge L1 Memory Map
    if (sessionId) {
      sessionCache.delete(`${userId}:${sessionId}`);
    } else {
      for (const key of sessionCache.keys()) {
        if (key.startsWith(`${userId}:`)) {
          sessionCache.delete(key);
        }
      }
    }

    // 2. Purge L2 Upstash Redis Key
    if (redis) {
      try {
        if (sessionId) {
          await redis.del(`session:${userId}:${sessionId}`);
        } else {
          const keys = await redis.keys(`session:${userId}:*`);
          if (keys.length > 0) {
            await redis.del(...keys);
          }
        }
      } catch (err) {
        console.warn("[SESSION_SERVICE] Redis cache purge warning:", err);
      }
    }
  }

  /**
   * Inserts a new active session inside a database transaction, revoking previous ones.
   */
  static async createSession(
    userId: string,
    sessionId: string,
    req: {
      deviceName?: string;
      browser?: string;
      operatingSystem?: string;
      userAgent: string;
      ipAddress?: string;
      country?: string;
      city?: string;
    }
  ): Promise<void> {
    const admin = createAdminClient();

    const { error } = await admin.rpc("create_new_session_tx", {
      p_user_id: userId,
      p_session_id: sessionId,
      p_device_name: req.deviceName || null,
      p_browser: req.browser || null,
      p_operating_system: req.operatingSystem || null,
      p_user_agent: req.userAgent,
      p_ip_address: req.ipAddress || null,
      p_country: req.country || null,
      p_city: req.city || null,
    });

    if (error) {
      console.error("[SESSION_SERVICE] Failed to create session transaction:", error);
      throw new Error(`Failed to create active session: ${error.message}`);
    }

    await SessionService.invalidateCache(userId);
  }

  /**
   * Validates user status and session active state with L1 sliding memory cache + L2 Upstash Redis backed by SQL join query.
   */
  static async validateSession(userId: string, sessionId: string): Promise<SessionValidationResult> {
    const cacheKey = `${userId}:${sessionId}`;
    
    // 1. Check L1 Memory Cache
    const cached = sessionCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.result;
    }

    // 2. Check L2 Redis Cache if present
    if (redis) {
      try {
        const redisCached = await redis.get<SessionValidationResult>(`session:${cacheKey}`);
        if (redisCached) {
          sessionCache.set(cacheKey, { result: redisCached, expiresAt: Date.now() + SESSION_CACHE_TTL_MS });
          return redisCached;
        }
      } catch (redisErr) {
        console.warn("[SESSION_SERVICE] L2 Redis fetch warning:", redisErr);
      }
    }

    try {
      const admin = createAdminClient();

      const { data: session, error: sessionError } = await admin
        .from("sessions")
        .select("id, session_id, revoked_at, logout_at, profiles!sessions_user_id_fkey!inner(id, role, status, country, membership_tier)")
        .eq("user_id", userId)
        .eq("session_id", sessionId)
        .maybeSingle();

      if (sessionError) {
        console.error("[SESSION_SERVICE] Session validation query error:", sessionError);
        return { valid: false, reason: "not_found" };
      }

      if (!session) {
        const failure: SessionValidationResult = { valid: false, reason: "not_found" };
        sessionCache.set(cacheKey, { result: failure, expiresAt: Date.now() + 5000 });
        return failure;
      }

      if (session.revoked_at) {
        const failure: SessionValidationResult = { valid: false, reason: "revoked" };
        sessionCache.set(cacheKey, { result: failure, expiresAt: Date.now() + SESSION_CACHE_TTL_MS });
        return failure;
      }

      const rawProfile = Array.isArray(session.profiles) ? session.profiles[0] : session.profiles;
      
      if (!rawProfile) {
        return { valid: false, reason: "deleted" };
      }

      const profile: ProfileData = {
        id: String(rawProfile.id),
        role: rawProfile.role as "admin" | "member",
        status: rawProfile.status as "active" | "suspended" | "archived" | "pending",
        country: rawProfile.country ?? null,
        membership_tier: rawProfile.membership_tier ?? null,
      };

      if (profile.status !== "active") {
        const failure: SessionValidationResult = { valid: false, reason: "disabled", profile };
        sessionCache.set(cacheKey, { result: failure, expiresAt: Date.now() + SESSION_CACHE_TTL_MS });
        return failure;
      }

      const sessionRecord: SessionData = {
        id: String(session.id),
        session_id: String(session.session_id),
        revoked_at: session.revoked_at ?? null,
        logout_at: session.logout_at ?? null,
      };

      const success: SessionValidationResult = { valid: true, reason: null, profile, session: sessionRecord };
      
      // Store in L1 Memory Map
      sessionCache.set(cacheKey, { result: success, expiresAt: Date.now() + SESSION_CACHE_TTL_MS });

      // Store in L2 Redis with 30s TTL
      if (redis) {
        redis.set(`session:${cacheKey}`, success, { ex: 30 }).catch(() => {});
      }

      return success;

    } catch (err) {
      console.error("[SESSION_SERVICE] Exception during session validation:", err);
      return { valid: false, reason: "not_found" };
    }
  }

  /**
   * Revokes a single session and invalidates cache across L1 memory and L2 Redis stores.
   */
  static async revokeSession(sessionId: string, revokedBy: string, reason: string): Promise<void> {
    const admin = createAdminClient();
    await admin
      .from("sessions")
      .update({
        revoked_at: new Date().toISOString(),
        revoked_by: revokedBy,
        revoke_reason: reason,
      })
      .eq("session_id", sessionId);

    for (const [key, val] of sessionCache.entries()) {
      if (val.result.valid && val.result.session.session_id === sessionId) {
        const parts = key.split(":");
        await SessionService.invalidateCache(parts[0], sessionId);
      }
    }
  }

  /**
   * Revokes all active sessions for a specific user and invalidates cache across layers.
   */
  static async revokeAllSessions(userId: string, revokedBy: string, reason: string): Promise<void> {
    const admin = createAdminClient();
    await admin
      .from("sessions")
      .update({
        revoked_at: new Date().toISOString(),
        revoked_by: revokedBy,
        revoke_reason: reason,
      })
      .eq("user_id", userId)
      .is("revoked_at", null);

    await SessionService.invalidateCache(userId);
  }

  /**
   * Updates last activity timestamp, throttled at 5-minute intervals.
   */
  static async touchSession(sessionId: string): Promise<void> {
    try {
      const admin = createAdminClient();
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

      await admin
        .from("sessions")
        .update({ last_activity: new Date().toISOString() })
        .eq("session_id", sessionId)
        .lt("last_activity", fiveMinutesAgo);
    } catch (touchError) {
      console.warn("[SESSION_SERVICE] Touch session failed (non-fatal):", touchError);
    }
  }
}
