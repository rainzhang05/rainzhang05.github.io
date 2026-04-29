"use client";
import { useReveal } from "./ui";

export default function Experience() {
  const ref = useReveal();
  return (
    <section className="experience" id="work" ref={ref as any}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">Work</span>
          <h2>Selected <em>experience</em></h2>
        </div>
        <article className="exp-card reveal">
          <header className="exp-top">
            <div className="exp-logo"><img src="/feitian-logo.svg" alt="FEITIAN Technologies" /></div>
            <div className="exp-titles">
              <h3>Full-Stack Engineer Intern</h3>
              <div className="org">
                <span>FEITIAN Technologies Co., Ltd.</span>
                <span>International Department</span>
                <span>Beijing, China · Remote from Vancouver</span>
              </div>
            </div>
            <div className="exp-period">Sep 2025 — Present</div>
          </header>
          <div className="exp-body">
            <p className="exp-scope">
              Owned end-to-end development of three production web systems — designing the architecture, writing the
              full-stack code, and handling deployment, CI/CD, and cross-team coordination with hardware and product
              engineers. Worked across React, TypeScript, Python, and Rust, with a focus on shipping reliable products
              for real users.
            </p>
            <div className="exp-cols">
              <div>
                <h5 className="col-label">Outcomes</h5>
                <ul className="outcomes">
                  <li><span className="marker" /><span>Designed and shipped the company's first developer tools platform — replacing scattered third-party tools and centralizing testing, validation, and debugging into one product.</span></li>
                  <li><span className="marker" /><span>Built three full-stack web applications end to end — frontend, backend, auth, testing, CI/CD, and deployment — in a fast-moving product environment.</span></li>
                  <li><span className="marker" /><span>Led product engineering for early post-quantum (ML-DSA) workflows, integrating the algorithms into web platforms and a software authenticator before production hardware was available.</span></li>
                  <li><span className="marker" /><span>Deployed applications on Linux servers using Docker-based workflows and CI pipelines — improving reliability and repeatability of testing and demos.</span></li>
                  <li><span className="marker" /><span>Reduced user support burden through a self-service authentication demo platform.</span></li>
                </ul>
              </div>
              <div className="exp-side">
                <h5 className="col-label">Stack</h5>
                <div className="tech-pills" style={{ marginBottom: 24 }}>
                  {["Python","Rust","TypeScript","React","Flask","Tailwind","Docker","Google Cloud","GitHub Actions","WebAuthn","FIDO2 / CTAP2","ML-DSA","liboqs"].map((t) => <span key={t} className="pill">{t}</span>)}
                </div>
                <h5 className="col-label">Related projects</h5>
                <div className="tech-pills">
                  <a className="pill is-link" href="#project-webauthn">↓ WebAuthn Developer Platform</a>
                  <a className="pill is-link" href="#project-fido2">↓ FIDO2 Software Authenticator</a>
                  <a className="pill is-link" href="#project-demo">↓ Auth &amp; Security Demo</a>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
