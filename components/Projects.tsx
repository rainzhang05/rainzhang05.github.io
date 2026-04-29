"use client";
import { useState } from "react";
import { projects, type Project } from "@/lib/projects";
import { Arrow, CheckCircle, useReveal } from "./ui";

function Row({ p }: { p: Project }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);
  return (
    <article className={`project-row reveal${open ? " is-open" : ""}`} id={p.id}>
      <div
        className="project-row-head"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) return;
          toggle();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <div className="project-meta-col">
          <span className="project-period">{p.period}</span>
          <h3 className="project-title">{p.title}</h3>
          <div className="project-role">{p.role}</div>
        </div>
        <div className="project-detail-col">
          <p className="project-summary">{p.summary}</p>
          <div className="project-tags">{p.tags.map((t) => <span key={t} className="pill">{t}</span>)}</div>
        </div>
      </div>
      <div className="project-expanded">
        <div>
          <div className="expanded-inner">
            <div className="impact-grid">
              {p.impacts.map((im) => (
                <div className="impact" key={im.title}>
                  <span className="ico"><CheckCircle /></span>
                  <h6>{im.title}</h6>
                  <p>{im.body}</p>
                </div>
              ))}
            </div>
            <div className="expanded-row">
              <div>
                <h6>Technologies</h6>
                <div className="tech-pills">{p.stack.map((s) => <span key={s} className="pill">{s}</span>)}</div>
              </div>
              <div>
                <h6>Links</h6>
                <div className="expanded-links">
                  {p.links.map((l) => (
                    <a key={l.label} className="exp-link" href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label} <Arrow />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const ref = useReveal();
  return (
    <section className="projects" id="projects" ref={ref as any}>
      <div className="wrap">
        <div className="section-head reveal">
          <span className="label">Selected work</span>
          <h2>A few <em>projects</em></h2>
        </div>
        <div className="project-list">{projects.map((p) => <Row key={p.id} p={p} />)}</div>
      </div>
    </section>
  );
}
