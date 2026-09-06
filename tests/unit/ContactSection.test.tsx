import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactSection } from '@/components/site/ContactSection';
import { en } from '@/lib/content';
import { site } from '@/lib/site';

describe('ContactSection', () => {
  it('anchors itself at the id the nav links to', () => {
    const { container } = render(<ContactSection copy={en} onCopyEmail={() => {}} />);

    expect(container.querySelector('section')).toHaveAttribute('id', 'contact');
  });

  it('offers every way to get in touch', () => {
    render(<ContactSection copy={en} onCopyEmail={() => {}} />);

    expect(screen.getByRole('link', { name: site.email })).toHaveAttribute(
      'href',
      `mailto:${site.email}`
    );
    expect(screen.getByRole('link', { name: /linkedin\.com/ })).toHaveAttribute(
      'href',
      site.linkedin
    );
    expect(screen.getByRole('link', { name: /github\.com/ })).toHaveAttribute('href', site.github);
  });

  it('hands the copy action back to the page', async () => {
    const onCopyEmail = vi.fn();
    const user = userEvent.setup();
    render(<ContactSection copy={en} onCopyEmail={onCopyEmail} />);

    await user.click(screen.getByRole('button', { name: en.contact.copy }));

    expect(onCopyEmail).toHaveBeenCalledTimes(1);
  });

  it('embeds the contact form', () => {
    render(<ContactSection copy={en} onCopyEmail={() => {}} />);

    expect(screen.getByLabelText(en.contact.form.name)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: en.contact.form.submit })).toBeInTheDocument();
  });
});
