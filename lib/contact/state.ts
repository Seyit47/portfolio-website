/** Client-safe contact form state (no validation library imports). */
export type ContactInput = { name: string; email: string; message: string };
export type ContactField = keyof ContactInput;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "invalid";
      errors: Partial<Record<ContactField, string>>;
      values: ContactInput;
    }
  | { status: "limited"; retryAfterSeconds: number; mailto: string }
  | { status: "failed"; mailto: string };

export const initialContactState: ContactState = { status: "idle" };
