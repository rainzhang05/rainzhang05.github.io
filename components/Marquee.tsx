export default function Marquee() {
  const items = [
    "Full-stack software engineering",
    "Scalable backend design",
    "Responsive interfaces",
    "End-to-end product delivery",
    "WebAuthn & FIDO2",
    "Post-quantum cryptography",
    "React · TypeScript · Python · Rust",
    "Cloud · CI/CD · Docker",
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
