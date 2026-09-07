import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkSection } from '@/components/site/WorkSection';
import { en } from '@/lib/content';

function setup(openId: string | null = null) {
  const onToggle = vi.fn();
  render(<WorkSection copy={en} openId={openId} onToggle={onToggle} />);
  return { onToggle };
}

describe('WorkSection', () => {
  it('anchors itself at the id the nav links to', () => {
    const { container } = render(<WorkSection copy={en} openId={null} onToggle={() => {}} />);

    expect(container.querySelector('section')).toHaveAttribute('id', 'work');
  });

  it('renders both lists under their own headings', () => {
    setup();

    expect(screen.getByText(en.sections.work)).toBeInTheDocument();
    expect(screen.getByText(en.sections.otherWork)).toBeInTheDocument();
  });

  it('renders every project as a row', () => {
    setup();

    [...en.featured, ...en.other].forEach((project) => {
      expect(screen.getByRole('button', { name: project.title })).toBeInTheDocument();
    });
  });

  it('ranks selected work above other work in the heading outline', () => {
    setup();

    const featured = en.featured[0];
    const other = en.other[0];
    expect(screen.getByRole('heading', { level: 3, name: featured.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: other.title })).toBeInTheDocument();
  });

  it('shows the primary marks and every project link while collapsed', () => {
    setup();
    const project = en.featured[0];
    const row = document.getElementById(`row-${project.id}`)!;

    // The panel is always in the DOM, and its stack repeats these names, so
    // scope to the always-visible part of the row.
    const collapsed = within(row).getByRole('button', { name: project.title }).closest('div')!
      .parentElement!.parentElement!;
    project.primary.forEach((name) => {
      expect(within(collapsed).getAllByText(name).length).toBeGreaterThan(0);
    });
    project.links.forEach((link) => {
      expect(within(row).getByRole('link', { name: new RegExp(link.label) })).toHaveAttribute(
        'href',
        link.href
      );
    });
  });

  it('leaves no links in the panel — they all sit on the collapsed row', () => {
    setup();
    const project = en.featured.find((p) => p.links.length > 1)!;

    expect(document.querySelectorAll(`#panel-${project.id} a`)).toHaveLength(0);
    expect(
      document.getElementById(`row-${project.id}`)!.querySelectorAll('a[target="_blank"]')
    ).toHaveLength(project.links.length);
  });

  it('reports which row was clicked', async () => {
    const user = userEvent.setup();
    const { onToggle } = setup();
    const project = en.featured[0];

    await user.click(screen.getByRole('button', { name: project.title }));

    expect(onToggle).toHaveBeenCalledWith(project.id);
  });

  it('fills an open panel with the write-up, stack and status', () => {
    const project = en.featured[0];
    setup(project.id);
    const panel = document.getElementById(`panel-${project.id}`)!;

    project.sections.forEach((section) => {
      expect(within(panel).getByText(section.label)).toBeInTheDocument();
      expect(within(panel).getByText(section.text)).toBeInTheDocument();
    });
    expect(within(panel).getByText(en.labels.stack)).toBeInTheDocument();
    expect(within(panel).getByText(project.status)).toBeInTheDocument();
  });

  it('shows a project screenshot with real alt text when there is one', () => {
    const withImage = [...en.featured, ...en.other].find((p) => p.image);
    if (!withImage) return;

    setup(withImage.id);
    const panel = document.getElementById(`panel-${withImage.id}`)!;

    expect(within(panel).getByAltText(withImage.image!.alt)).toBeInTheDocument();
  });
});
