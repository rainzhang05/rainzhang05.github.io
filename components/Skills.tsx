"use client";
import { useReveal } from "./ui";

export default function Skills() {
  const ref = useReveal<HTMLElement>();
  const cols = [
    { title: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "Rust", "C / C++"] },
    { title: "Web & Frontend", items: ["React.js", "Next.js", "HTML & CSS", "Tailwind CSS", "REST APIs", "Vite"] },
    { title: "Backend & Cloud", items: ["Flask", "Node / Express", "Docker", "Google Cloud", "GitHub Actions", "Linux"] },
    { title: "Tools & Platforms", items: ["Git", "GitHub", "VS Code", "JetBrains", "WebAuthn / FIDO2", "liboqs"] },
  ];
  return (
    <section className="skills" id="skills" ref={ref}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">Skills</span>
          <h2>Stack &amp; <em>tools</em></h2>
        </div>
        <div className="skills-grid reveal">
          {cols.map((c) => (
            <div className="skill-col" key={c.title}>
              <h4>{c.title}</h4>
              <ul>{c.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
