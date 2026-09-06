import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TechTag, TechTagList } from '@/components/ui/TechTag';

describe('TechTag', () => {
  it('shows the technology mark for a name that has one', () => {
    const { container } = render(<TechTag name="Rust" />);

    const mark = container.querySelector('img');
    expect(mark).toHaveAttribute('src', '/tech/rust.png');
    expect(mark).toHaveAttribute('width', '12');
    expect(mark).toHaveAttribute('height', '12');
    expect(mark).toHaveAttribute('loading', 'lazy');
    expect(screen.getByText('Rust')).toBeInTheDocument();
  });

  it('renders a plain pill when the name has no mark, rather than breaking', () => {
    const { container } = render(<TechTag name="Cypress" />);

    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('Cypress')).toBeInTheDocument();
  });

  it('marks are decorative — the name beside them is the accessible text', () => {
    const { container } = render(<TechTag name="Python" />);

    const mark = container.querySelector('img');
    expect(mark).toHaveAttribute('alt', '');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
  });

  it('sizes the mark up in the md variant', () => {
    const { container } = render(<TechTag name="Python" size="md" />);

    expect(container.querySelector('img')).toHaveAttribute('width', '14');
  });

  it('lists every item it is given', () => {
    render(<TechTagList items={['Rust', 'Python', 'Docker']} />);

    expect(screen.getByText('Rust')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });
});
