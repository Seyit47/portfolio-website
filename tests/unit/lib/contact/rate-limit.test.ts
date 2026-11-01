import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Ratelimit } from "@upstash/ratelimit";
import { __setLimiter, checkRateLimit } from "@/lib/contact/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    __setLimiter(undefined);
    vi.unstubAllEnvs();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is a no-op with a single warning when Upstash env is missing", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(checkRateLimit("k")).resolves.toEqual({ success: true, retryAfterSeconds: 0 });
    await expect(checkRateLimit("k")).resolves.toEqual({ success: true, retryAfterSeconds: 0 });
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("blocks the fourth call in the window and reports retry-after", async () => {
    let calls = 0;
    const fake = {
      limit: vi.fn(async () => {
        calls += 1;
        return calls <= 3
          ? {
              success: true,
              reset: Date.now() + 600_000,
              limit: 3,
              remaining: 3 - calls,
              pending: Promise.resolve(),
            }
          : {
              success: false,
              reset: Date.now() + 120_000,
              limit: 3,
              remaining: 0,
              pending: Promise.resolve(),
            };
      }),
    } as unknown as Ratelimit;
    __setLimiter(fake);
    for (let i = 0; i < 3; i += 1) {
      await expect(checkRateLimit("ip")).resolves.toMatchObject({ success: true });
    }
    const fourth = await checkRateLimit("ip");
    expect(fourth.success).toBe(false);
    expect(fourth.retryAfterSeconds).toBeGreaterThan(100);
    expect(fourth.retryAfterSeconds).toBeLessThanOrEqual(120);
  });
});
