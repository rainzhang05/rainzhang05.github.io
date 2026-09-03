import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { Nav } from "@/components/chrome/Nav";
import { JA_COPY } from "@/lib/i18n/ja/copy";
import { JA_CONTENT } from "@/lib/i18n/ja/content";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { About } from "@/sections/portfolio/About";
import { Contact } from "@/sections/portfolio/Contact";
import { Education } from "@/sections/portfolio/Education";
import { Experience } from "@/sections/portfolio/Experience";
import { Footer } from "@/sections/portfolio/Footer";
import { Hero } from "@/sections/portfolio/Hero";
import { Projects } from "@/sections/portfolio/Projects";
import { Skills } from "@/sections/portfolio/Skills";
import { mockMatchMedia } from "@/tests/setup/dom-mocks";

function renderJa(ui: ReactElement) {
  return render(<LocaleProvider locale="ja">{ui}</LocaleProvider>);
}

describe("Japanese section rendering", () => {
  it("renders the Japanese hero copy and CTAs", () => {
    const mm = mockMatchMedia(false);
    try {
      renderJa(<Hero animate />);
      // The name stays romanized — there is no official Japanese form.
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Rain/);
      expect(screen.getByText(JA_COPY.hero.tagRole)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: new RegExp(JA_COPY.hero.resume) })).toHaveAttribute(
        "href",
        "/rain-zhang-resume.pdf"
      );
      expect(
        screen.getByRole("link", { name: new RegExp(JA_COPY.hero.getInTouch) })
      ).toBeInTheDocument();
    } finally {
      mm.restore();
    }
  });

  it("renders Japanese section headings", () => {
    renderJa(
      <>
        <About />
        <Skills />
        <Education />
      </>
    );
    for (const title of [JA_COPY.about.title, JA_COPY.skills.title, JA_COPY.education.title]) {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
    }
  });

  it("keeps section anchors in English so scroll spy and hash links still work", () => {
    const { container } = renderJa(
      <>
        <About />
        <Skills />
        <Education />
        <Contact />
      </>
    );
    const ids = Array.from(container.querySelectorAll("section")).map((s) => s.id);
    expect(ids).toEqual(["about", "skills", "education", "contact"]);
  });

  it("renders the Japanese experience labels and outcomes", () => {
    renderJa(<Experience />);
    // One "担当範囲" / "主な成果" label per entry.
    const count = JA_CONTENT.experiences.length;
    expect(screen.getAllByText(JA_COPY.experience.scope)).toHaveLength(count);
    expect(screen.getAllByText(JA_COPY.experience.outcomes)).toHaveLength(count);

    for (const exp of JA_CONTENT.experiences) {
      expect(screen.getByRole("heading", { level: 3, name: exp.role })).toBeInTheDocument();
      expect(screen.getByText(exp.summary)).toBeInTheDocument();
      for (const outcome of exp.outcomes) {
        expect(screen.getByText(outcome)).toBeInTheDocument();
      }
    }
  });

  it("renders Japanese project titles and the localized expand affordance", () => {
    renderJa(<Projects openId={null} setOpenId={() => {}} />);
    for (const project of JA_CONTENT.projects) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
    expect(screen.getAllByText(JA_COPY.projects.readMore).length).toBe(JA_CONTENT.projects.length);
  });

  it("renders Japanese form labels with no placeholder text", () => {
    renderJa(<Contact />);
    for (const label of [
      JA_COPY.contact.nameLabel,
      JA_COPY.contact.emailLabel,
      JA_COPY.contact.messageLabel,
    ]) {
      const field = screen.getByLabelText(label);
      expect(field).toBeInTheDocument();
      expect(field).not.toHaveAttribute("placeholder");
    }
    expect(
      screen.getByRole("button", { name: new RegExp(JA_COPY.contact.submit) })
    ).toBeInTheDocument();
    expect(screen.getByRole("form", { name: JA_COPY.contact.formLabel })).toBeInTheDocument();
  });

  it("renders Japanese footer labels and keeps the honeypot hidden", () => {
    renderJa(<Footer />);
    expect(screen.getByText(JA_COPY.footer.tagline)).toBeInTheDocument();
    expect(screen.getByText(JA_COPY.footer.navigateLabel)).toBeInTheDocument();
    expect(screen.getByText(JA_COPY.footer.contactLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(JA_COPY.footer.backToTop)).toBeInTheDocument();
  });

  it("renders Japanese nav labels and aria labels", () => {
    renderJa(<Nav activeSection="intro" theme="light" onToggleTheme={() => {}} />);
    for (const item of JA_CONTENT.navItems.slice(1)) {
      expect(screen.getByRole("link", { name: item.label })).toBeInTheDocument();
    }
    expect(screen.getByLabelText(JA_COPY.theme.toDark)).toBeInTheDocument();
    expect(screen.getByLabelText(JA_COPY.nav.openMenu)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: JA_COPY.nav.sectionsLabel })).toBeInTheDocument();
  });
});
