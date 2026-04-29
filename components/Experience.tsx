"use client";
import { useReveal } from "./ui";

const stack = [
  "Python",
  "Rust",
  "TypeScript",
  "React.js",
  "Flask",
  "JavaScript",
  "HTML",
  "Tailwind CSS",
  "Docker",
  "Google Cloud",
  "GitHub Actions",
  "WebAuthn / FIDO2",
  "CTAP2",
  "ML-DSA / ML-KEM",
  "liboqs",
];

const outcomes = [
  "Created the company's first developer tools platform — replacing scattered third-party tools and centralizing authentication testing, validation, and debugging in one product.",
  "Developed secure web systems supporting authentication product testing across WebAuthn, FIDO2, CTAP2, and emerging post-quantum (ML-DSA) workflows.",
  "Enabled early post-quantum authenticator development by integrating ML-DSA algorithms into testing platforms and a software authenticator before production hardware was available.",
  "Deployed applications on Linux servers using Docker-based workflows and CI pipelines — improving the reliability and repeatability of testing and demos.",
  "Worked closely with security engineers and product teams to adapt platform behavior, data output, and testing flows to real product development needs.",
  "Reduced user support burden through a self-service authentication demo platform.",
];

export default function Experience() {
  const ref = useReveal<HTMLElement>();
  return (
    <section className="experience" id="work" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">Work</span>
          <h2>Selected <em>experience</em></h2>
        </div>
        <article className="exp-card reveal">
          <header className="exp-top">
            <div className="exp-logo">
              {/* eslint-disable-next-line @next/next/no-img-element -- small inline SVG, next/image adds no value */}
              <img src="/feitian-logo.svg" alt="FEITIAN Technologies" width={56} height={56} />
            </div>
            <div className="exp-titles">
              <h3>Full-Stack Engineer Intern</h3>
              <div className="org">
                <span>FEITIAN Technologies Co., Ltd.</span>
                <span>International Department</span>
                <span>Beijing, China · Remote from Vancouver</span>
              </div>
            </div>
            <div className="exp-period">Sep 2025 — Dec 2025</div>
          </header>
          <div className="exp-body">
            <p className="exp-scope">
              Owned end-to-end development of three production systems for FEITIAN&rsquo;s Post-Quantum Cryptography
              (PQC) initiative &mdash; a user-oriented authentication demo platform, a public Web Authentication
              developer tools platform, and a Rust-based FIDO2 software authenticator. Responsible for architecture
              design, full-stack implementation, server deployment, CI/CD pipelines, and cross-team coordination with
              hardware engineers.
            </p>
            <div className="exp-cols">
              <div>
                <h5 className="col-label">Outcomes</h5>
                <ul className="outcomes">
                  {outcomes.map((o, i) => (
                    <li key={i}><span className="marker" /><span>{o}</span></li>
                  ))}
                </ul>
              </div>
              <div className="exp-side">
                <h5 className="col-label">Stack</h5>
                <div className="tech-pills" style={{ marginBottom: 24 }}>
                  {stack.map((t) => <span key={t} className="pill">{t}</span>)}
                </div>
                <h5 className="col-label">Related projects</h5>
                <div className="tech-pills">
                  <a className="pill is-link" href="#project-demo">↓ Authentication &amp; Security Demo</a>
                  <a className="pill is-link" href="#project-fido2">↓ FIDO2 Software Authenticator</a>
                  <a className="pill is-link" href="#project-webauthn">↓ WebAuthn Developer Platform</a>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
