import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitResult = { success: boolean; retryAfterSeconds: number };

export const WINDOW = "10 m";
export const LIMIT = 3;

let limiter: Ratelimit | null | undefined;
let warned = false;

function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (!warned) {
      console.warn("[contact] UPSTASH_REDIS_REST_URL/TOKEN not set; rate limiting is disabled.");
      warned = true;
    }
    limiter = null;
    return limiter;
  }
  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(LIMIT, WINDOW),
    prefix: "portfolio:contact",
  });
  return limiter;
}

/** Test seam: replace or clear the limiter instance. */
export function __setLimiter(instance: Ratelimit | null | undefined) {
  limiter = instance;
  warned = false;
}

export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  const instance = getLimiter();
  if (!instance) return { success: true, retryAfterSeconds: 0 };
  const result = await instance.limit(key);
  const retryAfterSeconds = result.success
    ? 0
    : Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
  return { success: result.success, retryAfterSeconds };
}
