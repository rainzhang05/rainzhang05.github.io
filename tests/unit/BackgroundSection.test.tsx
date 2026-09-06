import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BackgroundSection } from '@/components/site/BackgroundSection';
import { en } from '@/lib/content';

describe('BackgroundSection', () => {
  it('anchors itself at the id the footer links to', () => {
    const { container } = render(<BackgroundSection copy={en} />);

    expect(container.querySelector('section')).toHaveAttribute('id', 'background');
  });

  it('states the education entry in full', () => {
    render(<BackgroundSection copy={en} />);

    expect(screen.getByRole('heading', { name: en.education.school })).toBeInTheDocument();
    expect(screen.getByText(en.education.dates)).toBeInTheDocument();
    expect(screen.getByText(en.education.meta)).toBeInTheDocument();
    expect(screen.getByText(en.education.detail)).toBeInTheDocument();
  });

  it('lists every skill group with its technologies', () => {
    const { container } = render(<BackgroundSection copy={en} />);

    en.skills.forEach((group) => {
      const label = screen.getByText(group.label);
      const row = label.parentElement as HTMLElement;
      group.items.forEach((item) => {
        expect(within(row).getByText(item)).toBeInTheDocument();
      });
    });
    expect(container).toBeTruthy();
  });
});
