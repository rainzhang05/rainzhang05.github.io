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
});
