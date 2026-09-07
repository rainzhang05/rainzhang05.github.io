import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Intro } from '@/components/site/Intro';
import { en } from '@/lib/content';
import { resumePage } from '@/lib/site';

describe('Intro', () => {
  it('carries the page heading', () => {
    render(<Intro copy={en.intro} resumeHref={resumePage.en} onCopyEmail={() => {}} />);

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(en.intro.heading);
  });

  it('states the eyebrow and the body copy', () => {
    render(<Intro copy={en.intro} resumeHref={resumePage.en} onCopyEmail={() => {}} />);

    expect(screen.getByText(en.intro.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(en.intro.body)).toBeInTheDocument();
  });

  it('sends the resume button to the resume page, not the PDF', () => {
    render(<Intro copy={en.intro} resumeHref={resumePage.en} onCopyEmail={() => {}} />);

    const resume = screen.getByRole('link', { name: en.intro.resume });

    expect(resume).toHaveAttribute('href', resumePage.en);
    expect(resume).not.toHaveAttribute('href', expect.stringContaining('.pdf'));
    expect(resume).not.toHaveAttribute('target');
  });

  it('carries no image — the hero is type only', () => {
    const { container } = render(<Intro copy={en.intro} resumeHref={resumePage.en} onCopyEmail={() => {}} />);

    expect(container.querySelector('img')).toBeNull();
  });

  it('hands the copy-email action back to the page', async () => {
    const onCopyEmail = vi.fn();
    const user = userEvent.setup();
    render(<Intro copy={en.intro} resumeHref={resumePage.en} onCopyEmail={onCopyEmail} />);

    await user.click(screen.getByRole('button', { name: en.intro.copyEmail }));

    expect(onCopyEmail).toHaveBeenCalledTimes(1);
  });
});
