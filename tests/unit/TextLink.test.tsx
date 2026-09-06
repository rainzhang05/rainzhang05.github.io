import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextLink } from '@/components/ui/TextLink';

describe('TextLink', () => {
  it('is an ordinary link by default', () => {
    render(<TextLink href="/somewhere">Somewhere</TextLink>);

    const link = screen.getByRole('link', { name: 'Somewhere' });
    expect(link).toHaveAttribute('href', '/somewhere');
    expect(link).not.toHaveAttribute('target');
    expect(link.className).toContain('text-sage');
  });

  it('marks an external link and shows the outbound glyph', () => {
    const { container } = render(
      <TextLink href="https://example.com" external>
        Example
      </TextLink>
    );

    const link = screen.getByRole('link', { name: 'Example' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('can drop to the quiet ink tone', () => {
    render(
      <TextLink href="#x" tone="ink">
        Quiet
      </TextLink>
    );

    expect(screen.getByRole('link', { name: 'Quiet' }).className).toContain('text-ink-2');
  });
});
