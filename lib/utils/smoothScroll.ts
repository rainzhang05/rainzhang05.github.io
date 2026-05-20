export function smoothScrollTo(id: string): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function scrollToProject(id: string, offset = 90): void {
  if (typeof window === "undefined") return;
  const el = document.getElementById(`project-${id}`);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}
