import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toast } from '@/components/ui/Toast';

describe('Toast', () => {
  it('announces its message politely', () => {
    render(<Toast message="Email copied" />);

    const toast = screen.getByRole('status');
    expect(toast).toHaveTextContent('Email copied');
    expect(toast).toHaveAttribute('aria-live', 'polite');
  });

  it('keeps its live region in the page while it has nothing to say', () => {
    // A region mounted together with its text is a new node, not a change to
    // one, and is often not announced. So it is there first, and empty.
    const { rerender } = render(<Toast message={null} />);

    const region = screen.getByRole('status');
    expect(region).toBeEmptyDOMElement();

    rerender(<Toast message="Email copied" />);
    expect(screen.getByRole('status')).toBe(region);
    expect(region).toHaveTextContent('Email copied');
  });

  it('never takes a press meant for the page under it', () => {
    render(<Toast message="Email copied" />);

    expect(screen.getByRole('status')).toHaveClass('pointer-events-none');
  });
});
