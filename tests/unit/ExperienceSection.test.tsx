import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExperienceSection } from '@/components/site/ExperienceSection';
import { en } from '@/lib/content';

function setup(openId: string | null = null) {
  const onToggle = vi.fn();
  const onOpenProject = vi.fn();
  render(
    <ExperienceSection
      copy={en}
      openId={openId}
      onToggle={onToggle}
      onOpenProject={onOpenProject}
    />
  );
  return { onToggle, onOpenProject };
}

describe('ExperienceSection', () => {
  it('anchors itself at the id the nav links to', () => {
    const { container } = render(
      <ExperienceSection copy={en} openId={null} onToggle={() => {}} onOpenProject={() => {}} />
    );

    expect(container.querySelector('section')).toHaveAttribute('id', 'experience');
  });

  it('renders a row per experience, with its role, org line and dates', () => {
    setup();

    en.experiences.forEach((item) => {
      expect(screen.getByRole('button', { name: item.role })).toBeInTheDocument();
      expect(screen.getByText(item.orgLine)).toBeInTheDocument();
      expect(screen.getByText(item.dates)).toBeInTheDocument();
    });
  });

  it('shows each company mark with the organisation as its alt text', () => {
    setup();

    en.experiences
      .filter((item) => item.mark)
      .forEach((item) => {
        const mark = screen.getByAltText(item.org);
        const { width, height } = item.mark!;
        expect(mark).toHaveAttribute('src', item.mark!.src);
        // One cap height for every mark, whatever shape the source file is.
        expect(mark).toHaveAttribute('height', '18');
        expect(mark).toHaveAttribute('width', String(Math.round((width / height) * 18)));
      });
  });

  it('leads the row with the mark, so work does not read like a project', () => {
    setup();

    en.experiences
      .filter((item) => item.mark)
      .forEach((item) => {
        const mark = screen.getByAltText(item.org);
        const title = screen.getByRole('button', { name: item.role });

        expect(mark.parentElement).toBe(title.parentElement);
        expect(mark.compareDocumentPosition(title)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      });
  });

  it('reports which row was clicked', async () => {
    const user = userEvent.setup();
    const { onToggle } = setup();
    const first = en.experiences[0];

    await user.click(screen.getByRole('button', { name: first.role }));

    expect(onToggle).toHaveBeenCalledWith(first.id);
  });

  it('lists the technologies of an open row', () => {
    const withTech = en.experiences[0];
    setup(withTech.id);

    const panel = document.getElementById(`panel-${withTech.id}`)!;
    withTech.tech.forEach((name) => {
      expect(within(panel).getByText(name)).toBeInTheDocument();
    });
  });

  it('opens a related project by its title rather than its id', async () => {
    const user = userEvent.setup();
    const withRelated = en.experiences.find((e) => e.related.length > 0)!;
    const { onOpenProject } = setup(withRelated.id);

    const targetId = withRelated.related[0];
    const target = [...en.featured, ...en.other].find((p) => p.id === targetId)!;
    const panel = document.getElementById(`panel-${withRelated.id}`)!;

    await user.click(within(panel).getByRole('button', { name: target.title }));

    expect(onOpenProject).toHaveBeenCalledWith(targetId);
  });

  it('drops the related-work block for a role that has none', () => {
    const withoutRelated = en.experiences.find((e) => e.related.length === 0);
    if (!withoutRelated) return;

    setup(withoutRelated.id);
    const panel = document.getElementById(`panel-${withoutRelated.id}`)!;

    expect(within(panel).queryByText(en.labels.relatedWork)).toBeNull();
  });
});
