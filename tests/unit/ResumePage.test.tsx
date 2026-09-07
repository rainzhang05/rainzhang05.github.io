import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ResumePage } from '@/components/site/ResumePage';
import { en, ja, resumeEn, resumeJa } from '@/lib/content';
import { resumeFile } from '@/lib/site';

const renderEn = () => render(<ResumePage copy={en} resume={resumeEn} locale="en" />);

describe('ResumePage', () => {
  it('is one page with one h1 — the name', () => {
    renderEn();

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Rain Zhang');
  });

  it('opens with the tagline and every line of the contact block', () => {
    const { container } = renderEn();
    // The email is in the footer too, and the masthead's own location line is
    // repeated under Education, so ask the masthead rather than the page.
    const masthead = within(container.querySelector('main > header')!);

    expect(screen.getByText(resumeEn.tagline)).toBeInTheDocument();
    resumeEn.contact.flat().forEach((part) => {
      const line = masthead.getByText(part.text);
      if (part.href) expect(line.closest('a')).toHaveAttribute('href', part.href);
    });
  });

  it('carries the four sections, in the order the document sets them', () => {
    const { container } = renderEn();

    const headings = [...container.querySelectorAll('h2')].map((h) => h.textContent);
    expect(headings).toEqual([
      resumeEn.headings.experience,
      resumeEn.headings.projects,
      resumeEn.headings.skills,
      resumeEn.headings.education,
    ]);
  });

  it('renders every role and project in full — title, dates and every bullet', () => {
    const { container } = renderEn();

    [...resumeEn.experience, ...resumeEn.projects].forEach((entry) => {
      const row = within(container).getByRole('heading', { name: entry.title }).closest('li');
      expect(row).not.toBeNull();
      expect(within(row!).getAllByRole('listitem')).toHaveLength(entry.bullets.length);
      expect(row).toHaveTextContent(entry.dates);
      entry.bullets.forEach((bullet) => expect(row).toHaveTextContent(bullet));
    });
  });

  it('turns the links inside a project meta line into links', () => {
    renderEn();

    expect(screen.getByRole('link', { name: 'mntrealty.vercel.app' })).toHaveAttribute(
      'href',
      'https://mntrealty.vercel.app'
    );
    const repository = screen.getByRole('link', { name: 'repository' });
    expect(repository).toHaveAttribute('target', '_blank');
    expect(repository).toHaveAttribute('rel', 'noreferrer');
  });

  it('lists every skill group and the whole education block', () => {
    renderEn();

    resumeEn.skills.forEach((group) => {
      expect(screen.getByText(group.label)).toBeInTheDocument();
      expect(screen.getByText(group.items)).toBeInTheDocument();
    });

    const education = within(
      screen.getByRole('heading', { name: resumeEn.headings.education }).closest('section')!
    );
    expect(education.getByText(resumeEn.education.school)).toBeInTheDocument();
    [...resumeEn.education.lines, ...resumeEn.education.notes].forEach((line) => {
      expect(education.getByText(line)).toBeInTheDocument();
    });
  });

  it('downloads the PDF for its own language, in place', () => {
    renderEn();

    const download = screen.getByRole('link', { name: resumeEn.download });
    expect(download).toHaveAttribute('href', resumeFile.en);
    expect(download).toHaveAttribute('download');
    expect(download).not.toHaveAttribute('target');
  });

  it('reads the Japanese resume on the Japanese route', () => {
    render(<ResumePage copy={ja} resume={resumeJa} locale="ja" />);

    expect(screen.getByRole('link', { name: resumeJa.download })).toHaveAttribute(
      'href',
      resumeFile.ja
    );
    expect(screen.getByText(resumeJa.tagline)).toBeInTheDocument();
    expect(screen.queryByText(resumeEn.tagline)).toBeNull();
  });

  it('sends the header and footer back to the home page, not to itself', () => {
    renderEn();

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'href',
      '/#experience'
    );
    expect(within(nav).getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'aria-current',
      'page'
    );

    const footer = screen.getByRole('navigation', { name: 'Footer' });
    within(footer)
      .getAllByRole('link')
      .forEach((link) => expect(link.getAttribute('href')).toMatch(/^\/#/));
  });

  it('carries no section dock — there are no page sections for it to watch', () => {
    const { container } = renderEn();

    expect(container.querySelector('.section-dock')).toBeNull();
    expect(screen.queryByRole('navigation', { name: en.labels.sectionNav })).toBeNull();
  });
});
