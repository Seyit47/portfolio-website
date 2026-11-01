import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": "203.0.113.5" }),
}));
vi.mock("@/lib/contact/email", () => ({
  sendContactEmail: vi.fn(async () => undefined),
  DeliveryError: class DeliveryError extends Error {},
}));
vi.mock("@/lib/contact/rate-limit", () => ({
  checkRateLimit: vi.fn(async () => ({ success: true, retryAfterSeconds: 0 })),
}));

import { sendContactEmail } from "@/lib/contact/email";
import { checkRateLimit } from "@/lib/contact/rate-limit";
import { processContact, sendContactMessage } from "@/app/contact/actions";

const now = 1_700_000_000_000;
const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I would like to discuss a dashboard project.",
  website: "",
  renderedAt: String(now - 30_000),
};

describe("processContact", () => {
  beforeEach(() => {
    vi.mocked(sendContactEmail).mockClear();
    vi.mocked(checkRateLimit).mockClear();
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("sends a valid message", async () => {
    const state = await processContact(valid, { ipHash: "abc", now });
    expect(state).toEqual({ status: "success" });
    expect(sendContactEmail).toHaveBeenCalledWith(
      { name: "Ada Lovelace", email: "ada@example.com", message: valid.message },
      { to: "seyitbu1111@gmail.com" },
    );
  });

  it("returns field errors without sending", async () => {
    const state = await processContact({ ...valid, email: "bad" }, { ipHash: "abc", now });
    expect(state.status).toBe("invalid");
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("silently rejects honeypot and timing failures", async () => {
    expect(await processContact({ ...valid, website: "spam" }, { ipHash: "abc", now })).toEqual({
      status: "success",
    });
    expect(
      await processContact({ ...valid, renderedAt: String(now - 500) }, { ipHash: "abc", now }),
    ).toEqual({ status: "success" });
    expect(sendContactEmail).not.toHaveBeenCalled();
    expect(checkRateLimit).not.toHaveBeenCalled();
  });

  it("returns limited with a mailto fallback", async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ success: false, retryAfterSeconds: 90 });
    const state = await processContact(valid, { ipHash: "abc", now });
    expect(state).toMatchObject({ status: "limited", retryAfterSeconds: 90 });
    expect(state.status === "limited" && state.mailto).toMatch(/^mailto:seyitbu1111@gmail\.com/);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("returns failed with a mailto fallback when delivery throws", async () => {
    vi.mocked(sendContactEmail).mockRejectedValueOnce(new Error("boom"));
    const state = await processContact(valid, { ipHash: "abc", now });
    expect(state).toMatchObject({ status: "failed" });
    expect(state.status === "failed" && state.mailto).toContain("mailto:");
  });
});

describe("sendContactMessage", () => {
  it("reads form data and request headers", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    const fd = new FormData();
    for (const [k, v] of Object.entries({ ...valid, renderedAt: String(Date.now() - 10_000) }))
      fd.set(k, v);
    const state = await sendContactMessage({ status: "idle" }, fd);
    expect(state).toEqual({ status: "success" });
  });
});
