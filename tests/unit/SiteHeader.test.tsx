import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SiteHeader } from '@/components/site/SiteHeader';
import { en, ja } from '@/lib/content';

beforeEach(() => {
  vi.spyOn(HTMLDialogElement.prototype, 'showModal').mockImplementation(function (this: HTMLDialogElement) {
    this.open = true;
  });
  vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(function (this: HTMLDialogElement) {
    this.open = false;
  });
});

afterEach(() => vi.restoreAllMocks());

const render_ = () =>
  render(
    <SiteHeader name="Rain Zhang" links={en.nav} locale="en" themeLabels={en.labels.theme} navigationLabels={en.labels.navigation} />
  );

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

  it('keeps every nav link in this tab — nothing opens a new one', () => {
    render_();

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    en.nav.forEach((link) => {
      expect(within(nav).getByRole('link', { name: link.label })).not.toHaveAttribute('target');
    });
  });

  it('hangs in-page links off the page it is given, and marks the current one', () => {
    render(
      <SiteHeader
        name="Rain Zhang"
        links={en.nav}
        locale="en"
        homeHref="/"
        currentId="resume"
        themeLabels={en.labels.theme}
        navigationLabels={en.labels.navigation}
      />
    );

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'href',
      '/#experience'
    );
    expect(screen.getAllByRole('link', { name: 'Rain Zhang' })[0]).toHaveAttribute('href', '/#top');
    expect(within(nav).getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'aria-current',
      'page'
    );
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
    expect(sheet.tagName).toBe('DIALOG');
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    expect(within(sheet).getByRole('button', { name: 'Close menu' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-controls', sheet.id);
    expect(within(sheet).getByRole('link', { name: 'Experience' })).toBeInTheDocument();
  });

  it('closes the sheet when the browser cancels the dialog', async () => {
    const user = userEvent.setup();
    render_();

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('restores the previous scroll settings on dismissal and unmount', async () => {
    const user = userEvent.setup();
    const root = document.documentElement;
    const body = document.body;
    const rootOverflow = root.style.overflow;
    const bodyOverflow = body.style.overflow;
    root.style.overflow = 'clip';
    body.style.overflow = 'auto';
    const { unmount } = render_();
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(root.style.overflow).toBe('hidden');
    expect(body.style.overflow).toBe('hidden');
    await user.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(root.style.overflow).toBe('clip');
    expect(body.style.overflow).toBe('auto');

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    unmount();
    expect(root.style.overflow).toBe('clip');
    expect(body.style.overflow).toBe('auto');
    root.style.overflow = rootOverflow;
    body.style.overflow = bodyOverflow;
  });

  it('closes the sheet from its wordmark', async () => {
    const user = userEvent.setup();
    render_();
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('link', { name: 'Rain Zhang' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('preserves individual overflow axes and their priorities', async () => {
    const user = userEvent.setup();
    const root = document.documentElement;
    const original = root.style.cssText;
    root.style.setProperty('overflow-x', 'clip', 'important');
    render_();
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.click(screen.getByRole('button', { name: 'Close menu' }));

    expect(root.style.overflowX).toBe('clip');
    expect(root.style.getPropertyPriority('overflow-x')).toBe('important');
    expect(root.style.overflowY).toBe('');
    root.style.cssText = original;
  });

  it('uses the Japanese accessible names', async () => {
    const user = userEvent.setup();
    render(<SiteHeader name="Rain Zhang" links={ja.nav} locale="ja" themeLabels={ja.labels.theme} navigationLabels={ja.labels.navigation} />);
    expect(screen.getByRole('navigation', { name: ja.labels.navigation.primary })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: ja.labels.navigation.menu }));
    expect(screen.getByRole('dialog', { name: ja.labels.navigation.menu })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: ja.labels.navigation.closeMenu })).toHaveFocus();
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
