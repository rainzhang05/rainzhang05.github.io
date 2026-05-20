/**
 * Inline script injected into <head> that synchronously reads the saved theme
 * preference from localStorage and sets `data-theme` on <html> BEFORE first
 * paint. Without this the user briefly sees the default theme before the React
 * theme hook runs (FOUC).
 */
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem("portfolio.theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
