"use client";
import { useState } from "react";
import { Arrow, useReveal } from "./ui";

type Status = "idle" | "sending" | "sent" | "error";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xoveaaqo";

export default function Contact() {
  const ref = useReveal<HTMLElement>();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      form.reset();
      setStatus("sent");
      setTimeout(() => setStatus((s) => (s === "sent" ? "idle" : s)), 5000);
    } catch (err) {
      console.error("Contact form submission failed", err);
      setStatus("error");
      setTimeout(() => setStatus((s) => (s === "error" ? "idle" : s)), 5000);
    }
  }

  const buttonLabel =
    status === "sending" ? "Sending…" :
    status === "sent" ? <>Sent ✓</> :
    status === "error" ? "Try again" :
    <>Send message <Arrow /></>;

  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">Contact</span>
          <h2>Let&rsquo;s <em>talk</em></h2>
        </div>
        <div className="contact-shell reveal">
          <div className="contact-intro">
            <h3>Get in touch</h3>
            <p>
              Feel free to reach out if you have any questions or would like to connect. I&apos;m currently looking for
              SWE or Project Management internship opportunities.
            </p>
            <div className="contact-channels">
              <a className="channel" href="mailto:rainzhang.zty@gmail.com">
                <span className="k">Email</span><span className="v">rainzhang.zty@gmail.com</span><span className="arrow">↗</span>
              </a>
              <a className="channel" href="https://www.linkedin.com/in/rainzhang05/" target="_blank" rel="noopener noreferrer">
                <span className="k">LinkedIn</span><span className="v">in/rainzhang05</span><span className="arrow">↗</span>
              </a>
              <a className="channel" href="https://github.com/rainzhang05" target="_blank" rel="noopener noreferrer">
                <span className="k">GitHub</span><span className="v">@rainzhang05</span><span className="arrow">↗</span>
              </a>
              <a className="channel" href="/Rain-Zhang-Resume.pdf" download>
                <span className="k">Resume</span><span className="v">Rain Zhang · PDF</span><span className="arrow">↓</span>
              </a>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" required placeholder="Your name" autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required placeholder="you@domain.com" autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required placeholder="Tell me about the role, project, or just say hi…" />
            </div>
            <button
              type="submit"
              className="submit-btn"
              disabled={status === "sending" || status === "sent"}
              data-status={status}
            >
              {buttonLabel}
            </button>
            <p className="form-feedback" role="status" aria-live="polite" data-status={status}>
              {status === "sent" && "Thank you for your message! I'll get back to you as soon as possible."}
              {status === "error" && "Something went wrong — please try again, or email me directly at rainzhang.zty@gmail.com."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
