"use client";
import Image from "next/image";
import { Arrow, Download, useReveal } from "./ui";

export default function Hero() {
  const ref = useReveal();
  return (
    <header className="hero" id="top" ref={ref as any}>
      <div className="wrap">
        <div className="hero-meta reveal">
          <span className="eyebrow">Vancouver, BC · Open to internship opportunities</span>
        </div>
        <div className="hero-grid">
          <div className="hero-text">
            <h1>
              <span className="word" data-delay={1}><span>Rain</span></span>
              <br />
              <span className="word" data-delay={2}><span>Zhang.</span></span>
            </h1>
            <p className="hero-lede reveal" data-delay={3}>
              Computer Science undergraduate at <em>Simon Fraser University</em>. I build full-stack software end to
              end, and I enjoy quietly making the small things work well.
            </p>
            <div className="hero-actions reveal" data-delay={4}>
              <a className="btn" href="#contact">Say hello <Arrow className="arrow" /></a>
              <a className="btn secondary" href="/Rain-Zhang-Resume.pdf" download>Résumé <Download /></a>
            </div>
          </div>
          <aside className="hero-side reveal" data-delay={2}>
            <div className="portrait">
              <Image src="/portfolio-photo.png" alt="Portrait of Rain Zhang" width={800} height={800} priority />
            </div>
            <div className="fact-card">
              <div className="item"><span className="k">Based in</span><span className="v">Vancouver, BC</span></div>
              <div className="item"><span className="k">Studying</span><span className="v">B.Sc. Computer Science · SFU</span></div>
              <div className="item"><span className="k">Focus</span><span className="v">Full-stack web</span></div>
              <div className="item"><span className="k">Working in</span><span className="v">Python · TypeScript · React · Rust</span></div>
            </div>
          </aside>
        </div>
      </div>
    </header>
  );
}
