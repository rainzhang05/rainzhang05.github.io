"use client";
import { useState } from "react";
import { Arrow, useReveal } from "./ui";

export default function Contact() {
  const ref = useReveal();
  const [sent, setSent] = useState(false);
  return (
    <section className="contact" id="contact" ref={ref as any}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">Contact</span>
          <h2>Let's <em>talk</em></h2>
        </div>
        <div className="contact-shell reveal">
          <div className="contact-intro">
            <h3>Have a role, a project, or just curious?</h3>
            <p>I'm currently interning at FEITIAN through December 2025, and I'm open to internships and full-stack roles starting Summer 2026 — based in Vancouver. Drop a note and I'll usually reply within a day.</p>
            <div className="contact-channels">
              <a className="channel" href="mailto:rainzhang.zty@gmail.com"><span className="k">Email</span><span className="v">rainzhang.zty@gmail.com</span><span className="arrow">↗</span></a>
              <a className="channel" href="https://www.linkedin.com/in/rainzhang05/" target="_blank" rel="noopener noreferrer"><span className="k">LinkedIn</span><span className="v">in/rainzhang05</span><span className="arrow">↗</span></a>
              <a className="channel" href="https://github.com/rainzhang05" target="_blank" rel="noopener noreferrer"><span className="k">GitHub</span><span className="v">@rainzhang05</span><span className="arrow">↗</span></a>
              <a className="channel" href="/Rain-Zhang-Resume.pdf" download><span className="k">Résumé</span><span className="v">Rain Zhang · PDF</span><span className="arrow">↓</span></a>
            </div>
          </div>
          <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 2400); (e.target as HTMLFormElement).reset(); }}>
            <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" required placeholder="Your name" /></div>
            <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required placeholder="you@domain.com" /></div>
            <div className="field"><label htmlFor="message">Message</label><textarea id="message" name="message" required placeholder="Tell me about the role, project, or just say hi…" /></div>
            <button type="submit" className="submit-btn">{sent ? <>Sent ✓</> : <>Send message <Arrow /></>}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
