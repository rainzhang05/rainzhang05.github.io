"use client";
import { useReveal } from "./ui";

export default function Education() {
  const ref = useReveal<HTMLElement>();
  return (
    <section className="education" id="education" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">Education</span>
          <h2><em>Studies</em></h2>
        </div>
        <div className="edu-grid">
          <article className="edu-card reveal">
            <span className="edu-period">Sep 2023 — Apr 2027 (Expected)</span>
            <h3>Simon Fraser University</h3>
            <p className="sub">Burnaby, BC · Faculty of Applied Science</p>
            <ul>
              <li>Bachelor of Science in Computer Science</li>
              <li>CGPA — 3.43 / 4.33</li>
              <li>Dean&rsquo;s Honor Roll · Fall 2024</li>
              <li>Dean&rsquo;s Honor Roll · Summer 2025</li>
            </ul>
          </article>
          <article className="edu-card reveal" data-delay={1}>
            <span className="edu-period">Sep 2018 — Jun 2023</span>
            <h3>Semiahmoo Secondary</h3>
            <p className="sub">Surrey, BC</p>
            <ul>
              <li>High School Diploma</li>
              <li>CGPA — 3.9 / 4.0</li>
              <li>Programming Club member · 2021 — 2023</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
