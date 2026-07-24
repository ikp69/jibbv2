import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

const fallbackStore = new Map<string, number[]>();

/**
 * Distributed rate limiter powered by Upstash Redis sliding window algorithm.
 * Automatically falls back to in-memory sliding window if Redis credentials are absent or unreachable.
 */
export async function isRateLimited(
  identifier: string,
  maxRequests: number = 5,
  windowSeconds: number = 60
): Promise<{ rateLimited: boolean; remaining: number; resetSeconds: number }> {
  if (redis) {
    try {
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
        analytics: true,
      });

      const { success, remaining, reset } = await ratelimit.limit(identifier);
      const resetSeconds = Math.ceil((reset - Date.now()) / 1000);

      return {
        rateLimited: !success,
        remaining,
        resetSeconds: resetSeconds > 0 ? resetSeconds : windowSeconds,
      };
    } catch (err) {
      console.warn("[RATE_LIMITER] Upstash Redis execution error; falling back to memory:", err);
    }
  }

  // Local Memory Fallback Strategy
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const cutoff = now - windowMs;

  const timestamps = (fallbackStore.get(identifier) || []).filter((ts) => ts > cutoff);

  if (timestamps.length >= maxRequests) {
    const oldest = timestamps[0] || now;
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return { rateLimited: true, remaining: 0, resetSeconds };
  }

  timestamps.push(now);
  fallbackStore.set(identifier, timestamps);

  return {
    rateLimited: false,
    remaining: maxRequests - timestamps.length,
    resetSeconds: windowSeconds,
  };
}
