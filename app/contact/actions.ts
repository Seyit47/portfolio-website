"use server";

import { headers } from "next/headers";
import { getProfile } from "@/lib/content";
import { DeliveryError, sendContactEmail } from "@/lib/contact/email";
import { clientIp, hashIp } from "@/lib/contact/ip";
import { checkRateLimit } from "@/lib/contact/rate-limit";
import { parseContact, type ContactState } from "@/lib/contact/schema";
import { isHoneypotTripped, isTimingValid } from "@/lib/contact/spam";

function mailto(): string {
  return `mailto:${getProfile().email}?subject=${encodeURIComponent("Portfolio contact")}`;
}

/** Pure pipeline, exported for unit tests; the Server Action below wires in request headers. */
export async function processContact(
  raw: Record<string, unknown>,
  context: { ipHash: string; now?: number },
): Promise<ContactState> {
  const parsed = parseContact(raw);
  if (!parsed.ok) {
    return { status: "invalid", errors: parsed.errors, values: parsed.values };
  }

  if (isHoneypotTripped(raw.website) || !isTimingValid(raw.renderedAt, context.now)) {
    console.info(`[contact] rejected ${context.ipHash.slice(0, 8)}`);
    return { status: "success" };
  }

  const limit = await checkRateLimit(context.ipHash);
  if (!limit.success) {
    console.info(`[contact] limited ${context.ipHash.slice(0, 8)}`);
    return { status: "limited", retryAfterSeconds: limit.retryAfterSeconds, mailto: mailto() };
  }

  try {
    await sendContactEmail(parsed.data, { to: getProfile().email });
  } catch (error) {
    const reason = error instanceof DeliveryError ? error.message : "unknown";
    console.error(`[contact] failed ${context.ipHash.slice(0, 8)}: ${reason}`);
    return { status: "failed", mailto: mailto() };
  }

  console.info(`[contact] sent ${context.ipHash.slice(0, 8)}`);
  return { status: "success" };
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") raw[key] = value;
  }
  const requestHeaders = await headers();
  const ipHash = hashIp(clientIp(requestHeaders));
  return processContact(raw, { ipHash });
}
