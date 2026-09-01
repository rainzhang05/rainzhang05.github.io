import type { ContactErrors, ContactFormState } from "@/lib/types";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Returns error *codes* rather than messages so the caller can render them in
 * the active locale. See `Copy["contact"]["errors"]` for the message text.
 */
export function validateContact({ name, email, message }: ContactFormState): ContactErrors {
  return {
    name: name.trim().length === 0 ? "required" : null,
    email:
      email.trim().length === 0
        ? "required"
        : !EMAIL_RE.test(email.trim())
          ? "invalid-email"
          : null,
    message: message.trim().length === 0 ? "required" : null,
  };
}
