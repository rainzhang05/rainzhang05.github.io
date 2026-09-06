import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Intro } from '@/components/site/Intro';
import { en } from '@/lib/content';
import { site } from '@/lib/site';

describe('Intro', () => {
  it('carries the page heading', () => {
    render(<Intro copy={en.intro} onCopyEmail={() => {}} />);

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(en.intro.heading);
  });

  it('states availability and the eyebrow', () => {
    render(<Intro copy={en.intro} onCopyEmail={() => {}} />);

    expect(screen.getByText(en.intro.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(en.intro.availability)).toBeInTheDocument();
  });

  it('links the resume at the path it is served from', () => {
    render(<Intro copy={en.intro} onCopyEmail={() => {}} />);

    expect(screen.getByRole('link', { name: en.intro.resume })).toHaveAttribute(
      'href',
      site.resumeHref
    );
  });

  it('renders the portrait at its real size with a real alt', () => {
    const { container } = render(<Intro copy={en.intro} onCopyEmail={() => {}} />);
    const portrait = container.querySelector('img');

    expect(portrait).toHaveAttribute('alt', en.intro.portraitAlt);
    expect(portrait).toHaveAttribute('width', '128');
    expect(portrait).toHaveAttribute('height', '128');
  });

  it('hands the copy-email action back to the page', async () => {
    const onCopyEmail = vi.fn();
    const user = userEvent.setup();
    render(<Intro copy={en.intro} onCopyEmail={onCopyEmail} />);

    await user.click(screen.getByRole('button', { name: en.intro.copyEmail }));

    expect(onCopyEmail).toHaveBeenCalledTimes(1);
  });
});
