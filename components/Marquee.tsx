export default function Marquee() {
  const items = [
    "Full-stack engineering","React & TypeScript","Python & Flask APIs","Rust systems",
    "End-to-end product delivery","Cloud & CI/CD","WebAuthn & FIDO2","Post-quantum cryptography",
  ];
  const all = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {all.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}
