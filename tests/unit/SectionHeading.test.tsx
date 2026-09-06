import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionHeading } from '@/components/site/SectionHeading';
import { Eyebrow } from '@/components/ui/Eyebrow';

describe('SectionHeading', () => {
  it('is a level-2 heading, so each section sits under the page h1', () => {
    render(<SectionHeading>Experience</SectionHeading>);

    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument();
  });

  it('can carry an id for a linked section', () => {
    render(<SectionHeading id="work">Work</SectionHeading>);

    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'work');
  });
});

describe('Eyebrow', () => {
  it('renders a div by default', () => {
    const { container } = render(<Eyebrow>Stack</Eyebrow>);

    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(screen.getByText('Stack')).toBeInTheDocument();
  });

  it('can be rendered as another element', () => {
    const { container } = render(<Eyebrow as="span">Stack</Eyebrow>);

    expect(container.firstElementChild?.tagName).toBe('SPAN');
  });
});
