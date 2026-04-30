export default function Marquee() {
  const items = [
    "Full-Stack Engineering",
    "UI/UX Designing",
    "Security & Authentication",
    "Post-Quantum Cryptography",
    "Cloud & DevOps",
    "Developer Platforms & Tooling",
  ];
  const all = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {all.map((t, i) => <span key={`${t}-${i}`}>{t}</span>)}
      </div>
    </div>
  );
}
