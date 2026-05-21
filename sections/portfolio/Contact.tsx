"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/atoms/Card";
import { Icon } from "@/components/atoms/Icon";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { validateContact } from "@/lib/utils/validateContact";
import type { ContactFormState, ContactStatus, IconName } from "@/lib/types";

const FORMSPREE_URL = "https://formspree.io/f/xoveaaqo";
const FETCH_TIMEOUT_MS = 15_000;

const CONTACT_FIELDS: Array<{
  name: keyof ContactFormState;
  label: string;
  type: string;
  placeholder: string;
}> = [
  { name: "name", label: "Name", type: "text", placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
];

interface ContactLinkProps {
  href: string;
  icon: IconName;
  label: string;
  external?: boolean;
}

function ContactLink({ href, icon, label, external = false }: ContactLinkProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("mailto:")) return;
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return;
    e.preventDefault();
    const email = href.replace("mailto:", "");
    navigator.clipboard.writeText(email).then(
      () => setCopied(true),
      () => {
        // Clipboard rejected — fall back to mailto navigation.
        window.location.href = href;
      }
    );
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group inline-flex items-center gap-3 text-[var(--text)] hover:text-[var(--accent-strong)] transition-colors relative"
    >
      <Icon name={icon} size={16} />
      <span className="font-mono text-sm" aria-live="polite">
        {copied ? "Email copied!" : label}
      </span>
      {copied ? (
        <span className="text-[10px] bg-[var(--accent)] text-white px-1.5 py-0.5 rounded font-sans ml-1">
          Copied!
        </span>
      ) : (
        <Icon
          name="arrow-up-right"
          size={13}
          className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
        />
      )}
    </a>
  );
}

export function Contact() {
  const [form, setForm] = useState<ContactFormState>({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<ContactStatus>("idle");

  const errors = validateContact(form);
  const valid = !errors.name && !errors.email && !errors.message;

  // Only show the red warning once the user has typed something into a field
  // AND what they typed is still invalid (e.g. a malformed email).
  const showErr = (key: keyof ContactFormState) => form[key].length > 0 && errors[key];

  // Honeypot path: quietly succeed without contacting Formspree. Scheduled via
  // an effect so the timer is cancelled if the component unmounts mid-flight.
  useEffect(() => {
    if (status !== "sending" || !honeypot) return;
    const id = window.setTimeout(() => setStatus("sent"), 1000);
    return () => window.clearTimeout(id);
  }, [status, honeypot]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid) return;
    setStatus("sending");

    // Honeypot path is handled by the effect above; just return here.
    if (honeypot) return;

    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller
      ? window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
      : null;

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
        signal: controller?.signal,
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    } finally {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    }
  };

  const inputClass = (key: keyof ContactFormState) =>
    `w-full bg-transparent border-b ${
      showErr(key) ? "border-red-400" : "border-[var(--border)]"
    } focus:border-[var(--border-strong)] outline-none focus-visible:outline-none py-2.5 text-[var(--text)] placeholder:text-[var(--text-subtle)] transition-colors`;

  return (
    <section id="contact" data-section-label="contact" className="py-[var(--gap-section)]">
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16">
        <div>
          <SectionTitle>Let&apos;s connect.</SectionTitle>
          <p className="text-[var(--text-muted)] mb-8 leading-relaxed max-w-md">
            I&apos;d love to connect — whether about an internship, a project, or just to trade
            notes on full-stack work and post-quantum auth.
          </p>
          <div className="space-y-3">
            <ContactLink
              href="mailto:rainzhang.zty@gmail.com"
              icon="mail"
              label="rainzhang.zty@gmail.com"
            />
            <ContactLink
              href="https://www.linkedin.com/in/rainzhang05/"
              icon="linkedin"
              label="linkedin.com/in/rainzhang05"
              external
            />
            <ContactLink
              href="https://github.com/rainzhang05"
              icon="github"
              label="github.com/rainzhang05"
              external
            />
          </div>
        </div>

        <Card className="p-[var(--gap-card)]">
          {status === "sent" ? (
            <div className="py-12 text-center" role="status" aria-live="polite">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[color-mix(in_oklab,var(--accent)_15%,transparent)] border border-[var(--accent-strong)] mb-4">
                <Icon name="check" size={22} className="text-[var(--accent-strong)]" />
              </div>
              <h3 className="text-xl font-medium mb-1">Message sent.</h3>
              <p className="text-[var(--text-muted)] text-sm">
                Thanks — I&apos;ll get back to you as soon as possible.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="space-y-5"
              noValidate
              aria-busy={status === "sending"}
              aria-label="Contact form"
            >
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="confirm_username"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              {CONTACT_FIELDS.map((f) => {
                const fieldId = `contact-${f.name}`;
                const errorId = `${fieldId}-error`;
                const hasErr = !!showErr(f.name);
                return (
                  <div key={f.name}>
                    <label
                      htmlFor={fieldId}
                      className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] mb-2"
                    >
                      {f.label}
                    </label>
                    <input
                      id={fieldId}
                      type={f.type}
                      value={form[f.name]}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      placeholder={f.placeholder}
                      className={inputClass(f.name)}
                      aria-invalid={hasErr}
                      aria-describedby={hasErr ? errorId : undefined}
                    />
                    {hasErr && (
                      <p id={errorId} className="mt-1 font-mono text-[10px] text-red-400">
                        {errors[f.name]}
                      </p>
                    )}
                  </div>
                );
              })}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] mb-2"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="What are you working on?"
                  className={`${inputClass("message")} resize-none`}
                  aria-invalid={!!showErr("message")}
                  aria-describedby={showErr("message") ? "contact-message-error" : undefined}
                />
                {showErr("message") && (
                  <p id="contact-message-error" className="mt-1 font-mono text-[10px] text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="group relative inline-flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] px-5 py-3 rounded-[calc(var(--r-sm)*1px)] text-sm font-medium shadow-[inset_0_1px_0_color-mix(in_oklab,white_15%,transparent),0_4px_14px_-4px_color-mix(in_oklab,var(--text)_45%,transparent)] hover:shadow-[inset_0_1px_0_color-mix(in_oklab,white_22%,transparent),0_10px_24px_-8px_color-mix(in_oklab,var(--text)_60%,transparent)] hover:-translate-y-[1px] active:translate-y-0 active:shadow-[inset_0_1px_0_color-mix(in_oklab,white_10%,transparent),0_2px_8px_-2px_color-mix(in_oklab,var(--text)_40%,transparent)] transition-[transform,box-shadow] duration-200 ease-out disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
              >
                {status === "sending" ? "Sending…" : "Send message"}
                <Icon
                  name="arrow-right"
                  size={14}
                  className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                />
              </button>
              {status === "error" && (
                <p className="mt-1 font-mono text-[10px] text-red-400" role="alert">
                  Couldn&apos;t reach the server — try emailing me directly.
                </p>
              )}
            </form>
          )}
        </Card>
      </div>
    </section>
  );
}
