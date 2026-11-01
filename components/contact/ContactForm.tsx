"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { initialContactState, type ContactState } from "@/lib/contact/state";
import { cn } from "@/lib/utils/cn";

type ContactFormProps = {
  action: (prev: ContactState, formData: FormData) => Promise<ContactState>;
  renderedAt: number;
  email: string;
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-border-strong bg-bg-elevated px-3 py-2.5 text-base text-fg placeholder:text-fg-subtle focus:border-accent";

export function ContactForm({ action, renderedAt, email }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(action, initialContactState);
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "invalid") {
      const first = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
    } else if (state.status !== "idle") {
      statusRef.current?.focus();
    }
  }, [state]);

  const values = state.status === "invalid" ? state.values : { name: "", email: "", message: "" };
  const errors = state.status === "invalid" ? state.errors : {};

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-lg border border-success/40 bg-success/10 p-6 text-fg"
        data-testid="contact-success"
      >
        <p className="font-display text-lg font-semibold">Message sent</p>
        <p className="mt-1 text-fg-muted">
          Thanks. I read every message and usually reply within a day.
        </p>
        <form action={formAction} className="mt-4">
          <input type="hidden" name="reset" value="1" />
          <Button
            type="submit"
            variant="secondary"
            formNoValidate
            onClick={(e) => {
              e.preventDefault();
              window.location.reload();
            }}
          >
            Send another
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="grid gap-5"
      aria-describedby={`${id}-intro`}
    >
      <p id={`${id}-intro`} className="text-sm text-fg-muted">
        All fields are required. Your email is used only to reply.
      </p>

      {(state.status === "limited" || state.status === "failed") && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-danger/40 bg-danger/10 p-4 text-fg"
          data-testid="contact-alert"
        >
          {state.status === "limited" ? (
            <p>
              Too many messages in a short time. Try again in about{" "}
              {Math.max(1, Math.ceil(state.retryAfterSeconds / 60))} minute(s), or{" "}
              <a href={state.mailto} className="text-accent underline underline-offset-4">
                email me directly
              </a>
              .
            </p>
          ) : (
            <p>
              The message could not be sent. Please{" "}
              <a href={state.mailto} className="text-accent underline underline-offset-4">
                email me directly at {email}
              </a>
              .
            </p>
          )}
        </div>
      )}

      <Field id={`${id}-name`} label="Name" error={errors.name}>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={values.name}
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
          className={cn(inputClass, errors.name && "border-danger")}
        />
      </Field>

      <Field id={`${id}-email`} label="Email" error={errors.email}>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          defaultValue={values.email}
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? `${id}-email-error` : undefined}
          className={cn(inputClass, errors.email && "border-danger")}
        />
      </Field>

      <Field id={`${id}-message`} label="Message" error={errors.message}>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          defaultValue={values.message}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? `${id}-message-error` : undefined}
          className={cn(inputClass, "resize-y", errors.message && "border-danger")}
        />
      </Field>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div
        className="absolute top-auto -left-[9999px] h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input
          id={`${id}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <input type="hidden" name="renderedAt" value={renderedAt} />

      <div>
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          aria-busy={pending || undefined}
          className="min-w-44"
        >
          {pending ? "Sending..." : "Send message"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      {children}
      {/* Always rendered so an error message never pushes the fields below it. */}
      <p
        id={`${id}-error`}
        className="mt-1.5 min-h-5 text-sm text-danger"
        data-testid={error ? "field-error" : undefined}
      >
        {error}
      </p>
    </div>
  );
}
