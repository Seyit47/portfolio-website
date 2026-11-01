import { Resend } from "resend";
import type { ContactInput } from "./schema";

export type DeliveryTarget = { to: string; from?: string };

export class DeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeliveryError";
  }
}

/**
 * Sends the message through Resend. Without an API key the payload is logged
 * instead, so local development and previews work without secrets.
 */
export async function sendContactEmail(input: ContactInput, target: DeliveryTarget): Promise<void> {
  if (process.env.CONTACT_FORCE_FAIL === "1") {
    throw new DeliveryError("Forced failure (CONTACT_FORCE_FAIL=1)");
  }
  const apiKey = process.env.RESEND_API_KEY;
  const from = target.from ?? process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";
  const subject = `Portfolio contact from ${input.name}`;
  const text = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Sent: ${new Date().toISOString()}`,
    "",
    input.message,
  ].join("\n");

  if (!apiKey) {
    console.info(
      `[contact] RESEND_API_KEY not set; would send:\n${JSON.stringify({ from, to: target.to, subject, replyTo: input.email })}`,
    );
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: target.to,
    replyTo: input.email,
    subject,
    text,
  });
  if (error) {
    throw new DeliveryError(error.message);
  }
}
