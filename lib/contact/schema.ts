import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(80, "Name must be 80 characters or fewer."),
  email: z
    .string()
    .trim()
    .max(254, "Email must be 254 characters or fewer.")
    .email("Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(2000, "Message must be 2000 characters or fewer."),
});

export type { ContactField, ContactInput, ContactState } from "./state";
export { initialContactState } from "./state";
import type { ContactField, ContactInput } from "./state";

/** Parses raw form values; returns field errors keyed by field on failure. */
export function parseContact(
  raw: Record<string, unknown>,
):
  | { ok: true; data: ContactInput }
  | { ok: false; errors: Partial<Record<ContactField, string>>; values: ContactInput } {
  const values: ContactInput = {
    name: typeof raw.name === "string" ? raw.name : "",
    email: typeof raw.email === "string" ? raw.email : "",
    message: typeof raw.message === "string" ? raw.message : "",
  };
  const result = contactSchema.safeParse(values);
  if (result.success) return { ok: true, data: result.data };
  const errors: Partial<Record<ContactField, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if ((field === "name" || field === "email" || field === "message") && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { ok: false, errors, values };
}
