import { SectionTitle } from "@/components/atoms/SectionTitle";

const ABOUT_PARAGRAPHS = [
  <>
    I&apos;m a{" "}
    <span className="text-[var(--text)]">
      Computer Science undergraduate at Simon Fraser University
    </span>{" "}
    who builds full-stack systems across modern technology stacks — including Python, React, and
    TypeScript.
  </>,
  <>
    I&apos;ve delivered multiple end-to-end projects by rapidly learning new frameworks, integrating
    APIs, and turning ideas into products. My work emphasizes{" "}
    <span className="text-[var(--text)]">
      scalable backend design, responsive interfaces, and maintainable code
    </span>
    .
  </>,
  <>
    I&apos;m particularly interested in full-stack software engineering and technical project
    execution — taking ownership of scalable features and delivering reliable solutions in
    fast-moving environments.
  </>,
];

export function About() {
  return (
    <section id="about" data-section-label="about" className="py-[var(--gap-section)]">
      <SectionTitle kicker="A short read on who I am and how I work.">About</SectionTitle>
      <div className="space-y-5 max-w-[760px]">
        {ABOUT_PARAGRAPHS.map((p, i) => (
          <p
            key={i}
            className="text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.7] text-[var(--text-muted)]"
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
