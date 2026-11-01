import { createHash } from "node:crypto";

/** First address in x-forwarded-for, or a fallback. */
export function clientIp(headers: { get(name: string): string | null }): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "0.0.0.0";
}

/** Daily-rotating hash so the rate-limit key never stores a raw address. */
export function hashIp(
  ip: string,
  salt = process.env.CONTACT_IP_SALT ?? "dev-salt",
  day = new Date().toISOString().slice(0, 10),
): string {
  return createHash("sha256").update(`${ip}|${salt}|${day}`).digest("hex");
}
