import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon } from '@/components/ui/Icon';

describe('Icon', () => {
  it('renders the requested glyph at the requested size', () => {
    const { container } = render(<Icon name="check" size={22} />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '22');
    expect(svg).toHaveAttribute('height', '22');
    expect(svg?.querySelectorAll('path')).toHaveLength(1);
  });

  it('is hidden from assistive tech when it carries no meaning of its own', () => {
    const { container } = render(<Icon name="plus" />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
  });

  it('becomes a labelled image when given a label', () => {
    render(<Icon name="mail" label="Email" />);

    const svg = screen.getByRole('img', { name: 'Email' });
    expect(svg).not.toHaveAttribute('aria-hidden');
  });

  it('uses the design system stroke weight rather than a filled glyph', () => {
    const { container } = render(<Icon name="arrow-right" />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('stroke-width', '1.5');
    expect(svg).toHaveAttribute('fill', 'none');
  });
});
