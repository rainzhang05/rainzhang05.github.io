import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, ButtonLink } from '@/components/ui/Button';

describe('Button', () => {
  it('defaults to a non-submitting primary button', () => {
    render(<Button>Send</Button>);

    const button = screen.getByRole('button', { name: 'Send' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button.className).toContain('bg-ink');
  });

  it('applies the requested variant and size', () => {
    render(
      <Button variant="quiet" size="sm">
        Copy
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Copy' });
    expect(button.className).toContain('bg-transparent');
    expect(button.className).toContain('h-8');
  });

  it('forwards clicks and honours disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);

    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>
    );
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('ButtonLink', () => {
  it('is a plain link by default', () => {
    render(<ButtonLink href="/rain-zhang-resume.pdf">Resume</ButtonLink>);

    const link = screen.getByRole('link', { name: 'Resume' });
    expect(link).toHaveAttribute('href', '/rain-zhang-resume.pdf');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('opens in a new tab only when marked external', () => {
    render(
      <ButtonLink href="https://github.com/rainzhang05" external>
        GitHub
      </ButtonLink>
    );

    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('keeps a one-line label on one line at a fixed height', () => {
    render(<Button size="sm">Short</Button>);

    const cls = screen.getByRole('button').className;
    expect(cls).toContain('whitespace-nowrap');
    expect(cls).toContain('h-8');
  });

  it('lets a wrapping label run to a second line and grow', () => {
    render(
      <Button size="sm" wrap>
        A label long enough to need two lines
      </Button>
    );

    const cls = screen.getByRole('button').className;
    expect(cls).not.toContain('whitespace-nowrap');
    expect(cls).toContain('min-h-8');
  });
});
