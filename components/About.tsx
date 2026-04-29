"use client";
import { useReveal } from "./ui";

export default function About() {
  const ref = useReveal<HTMLElement>();
  return (
    <section className="about" id="about" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">About</span>
          <h2><em>Profile</em></h2>
        </div>
        <div className="about-body">
          <p className="about-lede reveal">
            I take ownership of features end to end:{" "}
            <em>architecture, backend, frontend, deployment, and the polish in between.</em>
          </p>
          <div className="about-supporting reveal" data-delay={1}>
            <p>
              I am a Computer Science undergraduate at Simon Fraser University who builds full-stack systems across
              modern technology stacks, including Python, React, and TypeScript. I have delivered multiple end-to-end
              projects by rapidly learning new frameworks, integrating APIs, and turning ideas into products.
            </p>
            <p>
              My work emphasizes scalable backend design, responsive interfaces, and maintainable code. I am
              particularly interested in full-stack software engineering and technical project execution, where I can
              take ownership of scalable features and deliver reliable solutions in fast-moving environments.
            </p>
            <div className="kv-list">
              <dl>
                <div className="kv-row"><dt>Based in</dt><dd>Vancouver, BC</dd></div>
                <div className="kv-row"><dt>Studying</dt><dd>B.Sc. Computer Science · SFU · Class of &rsquo;27</dd></div>
                <div className="kv-row"><dt>Interests</dt><dd>Full-stack engineering, developer tooling, security &amp; authentication</dd></div>
                <div className="kv-row"><dt>Languages</dt><dd>English · Mandarin</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
