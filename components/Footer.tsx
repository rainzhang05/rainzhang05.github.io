export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2 className="footer-display">Rain&nbsp;<em>Zhang.</em></h2>
        <p className="footer-tagline">
          Computer Science student at Simon Fraser University · Full-stack &amp; security-focused software
        </p>
        <div className="footer-row">
          <div>© {year} Rain Zhang. All rights reserved.</div>
          <div className="footer-links">
            <a href="mailto:rainzhang.zty@gmail.com">Email</a>
            <a href="https://github.com/rainzhang05" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/rainzhang05/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
        <p className="footer-built">Built with Next.js, TypeScript, and React.</p>
      </div>
    </footer>
  );
}
