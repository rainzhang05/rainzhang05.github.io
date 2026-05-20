import type { ContactErrors, ContactFormState } from "@/lib/types";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact({ name, email, message }: ContactFormState): ContactErrors {
  return {
    name: name.trim().length === 0 ? "Required" : null,
    email:
      email.trim().length === 0
        ? "Required"
        : !EMAIL_RE.test(email.trim())
          ? "Invalid email"
          : null,
    message: message.trim().length === 0 ? "Required" : null,
  };
}
