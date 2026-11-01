import { describe, expect, it } from "vitest";
import { contactSchema, parseContact } from "@/lib/contact/schema";

describe("contactSchema", () => {
  it("accepts a valid message and trims whitespace", () => {
    const result = contactSchema.safeParse({
      name: "  Ada  ",
      email: " ada@example.com ",
      message: "  Hello, I would like to talk.  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Ada");
      expect(result.data.email).toBe("ada@example.com");
    }
  });

  it("enforces name 2-80, email <= 254 and message 10-2000", () => {
    expect(
      contactSchema.safeParse({ name: "A", email: "a@b.co", message: "x".repeat(10) }).success,
    ).toBe(false);
    expect(
      contactSchema.safeParse({ name: "A".repeat(81), email: "a@b.co", message: "x".repeat(10) })
        .success,
    ).toBe(false);
    expect(
      contactSchema.safeParse({
        name: "Ada",
        email: `${"a".repeat(250)}@b.co`,
        message: "x".repeat(10),
      }).success,
    ).toBe(false);
    expect(
      contactSchema.safeParse({ name: "Ada", email: "not-an-email", message: "x".repeat(10) })
        .success,
    ).toBe(false);
    expect(
      contactSchema.safeParse({ name: "Ada", email: "a@b.co", message: "short" }).success,
    ).toBe(false);
    expect(
      contactSchema.safeParse({ name: "Ada", email: "a@b.co", message: "x".repeat(2001) }).success,
    ).toBe(false);
    expect(
      contactSchema.safeParse({ name: "Ada", email: "a@b.co", message: "x".repeat(2000) }).success,
    ).toBe(true);
  });
});

describe("parseContact", () => {
  it("returns one message per failing field and preserves values", () => {
    const result = parseContact({ name: "", email: "nope", message: "hi" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(["email", "message", "name"]);
      expect(result.errors.email).toMatch(/valid email/i);
      expect(result.values).toEqual({ name: "", email: "nope", message: "hi" });
    }
  });

  it("treats missing fields as empty strings", () => {
    const result = parseContact({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.values.name).toBe("");
  });
});
