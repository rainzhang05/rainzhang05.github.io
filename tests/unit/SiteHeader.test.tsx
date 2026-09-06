import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SiteHeader } from '@/components/site/SiteHeader';
import { en } from '@/lib/content';

const render_ = () => render(<SiteHeader name="Rain Zhang" links={en.nav} locale="en" />);

describe('SiteHeader', () => {
  it('renders the wordmark as a link back to the top', () => {
    render_();

    expect(screen.getAllByRole('link', { name: 'Rain Zhang' })[0]).toHaveAttribute('href', '#top');
  });

  it('renders every nav link', () => {
    render_();

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    en.nav.forEach((link) => {
      expect(within(nav).getByRole('link', { name: link.label })).toHaveAttribute('href', link.href);
    });
  });

  it('opens external nav links in a new tab and in-page ones in place', () => {
    render_();

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Resume' })).toHaveAttribute('target', '_blank');
    expect(within(nav).getByRole('link', { name: 'Experience' })).not.toHaveAttribute('target');
  });

  it('starts with the mobile sheet closed', () => {
    render_();

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens the sheet from the menu button', async () => {
    const user = userEvent.setup();
    render_();

    await user.click(screen.getByRole('button', { name: 'Menu' }));

    const sheet = screen.getByRole('dialog', { name: 'Menu' });
    expect(sheet).toHaveAttribute('aria-modal', 'true');
    expect(within(sheet).getByRole('link', { name: 'Experience' })).toBeInTheDocument();
  });

  it('closes the sheet on Escape', async () => {
    const user = userEvent.setup();
    render_();

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes the sheet from its close button', async () => {
    const user = userEvent.setup();
    render_();

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.click(screen.getByRole('button', { name: 'Close menu' }));

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes the sheet after following a link out of it', async () => {
    const user = userEvent.setup();
    render_();

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    const sheet = screen.getByRole('dialog', { name: 'Menu' });
    await user.click(within(sheet).getByRole('link', { name: 'Contact' }));

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('offers the language switch', () => {
    render_();

    expect(screen.getByRole('radiogroup', { name: 'Language' })).toBeInTheDocument();
  });
});
