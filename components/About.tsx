"use client";
import { useReveal } from "./ui";

export default function About() {
  const ref = useReveal();
  return (
    <section className="about" id="about" ref={ref as any}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">About</span>
          <h2><em>Profile</em></h2>
        </div>
        <div className="about-body">
          <p className="about-lede reveal">
            I take an idea from sketch to production: <em>frontend, backend, infrastructure, and the product polish in between.</em>
          </p>
          <div className="about-supporting reveal" data-delay={1}>
            <p>I'm a Computer Science undergraduate at Simon Fraser University. I build full-stack systems across modern stacks — Python, React, TypeScript, and Rust — by rapidly learning new frameworks, integrating APIs, and turning ideas into shippable products.</p>
            <p>My work emphasizes scalable backend design, responsive interfaces, and maintainable code. I love owning features end to end: shaping the architecture, writing the API, building the UI, wiring up CI/CD, and shipping. Recently I've been applying that same end-to-end approach to authentication and security tooling — but my interest is broader: I want to build great products, full stop.</p>
            <div className="kv-list">
              <dl>
                <div className="kv-row"><dt>Based in</dt><dd>Vancouver, BC</dd></div>
                <div className="kv-row"><dt>Studying</dt><dd>B.Sc. Computer Science · SFU · '27</dd></div>
                <div className="kv-row"><dt>Interests</dt><dd>Full-stack web, developer tooling, security engineering</dd></div>
                <div className="kv-row"><dt>Languages</dt><dd>English · Mandarin</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
