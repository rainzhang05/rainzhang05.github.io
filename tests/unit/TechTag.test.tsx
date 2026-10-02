import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TechTag, TechTagList } from '@/components/ui/TechTag';

describe('TechTag', () => {
  it('draws a line glyph for a name that has one', () => {
    const { container } = render(<TechTag name="Rust" />);

    const glyph = container.querySelector('svg');
    expect(glyph).toBeInTheDocument();
    expect(glyph).toHaveAttribute('width', '14');
    expect(glyph).toHaveAttribute('height', '14');
    expect(glyph).toHaveAttribute('stroke', 'currentColor');
    expect(glyph).toHaveAttribute('stroke-width', '1.5');
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('Rust')).toBeInTheDocument();
  });

  it('renders a plain pill when the name has no glyph, rather than breaking', () => {
    const { container } = render(<TechTag name="Cypress" />);

    expect(container.querySelector('svg')).toBeNull();
    expect(screen.getByText('Cypress')).toBeInTheDocument();
  });

  it('draws the glyph in the colour of the name, on either ground', () => {
    const { container } = render(<TechTag name="Next.js" />);

    // currentColor, not a fill: nothing to invert or outline on charcoal.
    expect(container.querySelector('svg')).toHaveAttribute('fill', 'none');
    expect(container.querySelector('[data-on-dark]')).toBeNull();
  });

  it('glyphs are decorative — the name beside them is the accessible text', () => {
    const { container } = render(<TechTag name="Python" />);

    const glyph = container.querySelector('svg');
    expect(glyph).toHaveAttribute('aria-hidden', 'true');
    expect(glyph).not.toHaveAttribute('role');
  });

  it('sizes the glyph up in the md variant', () => {
    const { container } = render(<TechTag name="Python" size="md" />);

    expect(container.querySelector('svg')).toHaveAttribute('width', '16');
  });

  it('lists every item it is given', () => {
    render(<TechTagList items={['Rust', 'Python', 'Docker']} />);

    expect(screen.getByText('Rust')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });
});
