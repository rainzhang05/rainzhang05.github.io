import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PortfolioPage } from '@/components/site/PortfolioPage';
import { en, ja } from '@/lib/content';
import { site } from '@/lib/site';
import {
  mockClipboard,
  mockWindowScrollTo,
  type ClipboardController,
  type SpyController,
} from '../setup/dom-mocks';

let clipboard: ClipboardController | null = null;
let scrollTo: SpyController;

beforeEach(() => {
  scrollTo = mockWindowScrollTo();
});

afterEach(() => {
  clipboard?.restore();
  clipboard = null;
  scrollTo.restore();
});

const expanded = (id: string) =>
  document.getElementById(`button-${id}`)?.getAttribute('aria-expanded');

/** The disclosure button of one row, never the related-work link of the same name. */
const row = (id: string) => document.getElementById(`button-${id}`) as HTMLElement;

describe('PortfolioPage', () => {
  it('renders every section of the page in order', () => {
    const { container } = render(<PortfolioPage copy={en} locale="en" />);

    const ids = Array.from(container.querySelectorAll('main section')).map((s) => s.id);
    expect(ids).toEqual(['intro', 'experience', 'work', 'background', 'contact']);
  });

  it('gives the header a target to scroll back to', () => {
    const { container } = render(<PortfolioPage copy={en} locale="en" />);

    expect(container.querySelector('#top')).toBeInTheDocument();
  });

  it('starts with every row closed', () => {
    render(<PortfolioPage copy={en} locale="en" />);

    en.experiences.forEach((e) => expect(expanded(e.id)).toBe('false'));
    en.featured.forEach((p) => expect(expanded(p.id)).toBe('false'));
  });

  it('opens a row, and closes it again on a second click', async () => {
    const user = userEvent.setup();
    render(<PortfolioPage copy={en} locale="en" />);
    const first = en.experiences[0];

    await user.click(row(first.id));
    expect(expanded(first.id)).toBe('true');

    await user.click(row(first.id));
    expect(expanded(first.id)).toBe('false');
  });

  it('keeps only one experience open at a time', async () => {
    const user = userEvent.setup();
    render(<PortfolioPage copy={en} locale="en" />);
    const [first, second] = en.experiences;

    await user.click(row(first.id));
    await user.click(row(second.id));

    expect(expanded(first.id)).toBe('false');
    expect(expanded(second.id)).toBe('true');
  });

  it('keeps only one project open at a time', async () => {
    const user = userEvent.setup();
    render(<PortfolioPage copy={en} locale="en" />);
    const [first, second] = en.featured;

    await user.click(row(first.id));
    await user.click(row(second.id));

    expect(expanded(first.id)).toBe('false');
    expect(expanded(second.id)).toBe('true');
  });

  it('tracks experience and project rows independently', async () => {
    const user = userEvent.setup();
    render(<PortfolioPage copy={en} locale="en" />);
    const experience = en.experiences[0];
    const project = en.featured[0];

    await user.click(row(experience.id));
    await user.click(row(project.id));

    expect(expanded(experience.id)).toBe('true');
    expect(expanded(project.id)).toBe('true');
  });

  it('opens the project an experience points at', async () => {
    const user = userEvent.setup();
    render(<PortfolioPage copy={en} locale="en" />);
    const experience = en.experiences.find((e) => e.related.length > 0)!;
    const targetId = experience.related[0];
    const target = [...en.featured, ...en.other].find((p) => p.id === targetId)!;

    await user.click(row(experience.id));
    const panel = document.getElementById(`panel-${experience.id}`)!;
    await user.click(
      Array.from(panel.querySelectorAll('button')).find((b) => b.textContent === target.title)!
    );

    expect(expanded(targetId)).toBe('true');
  });

  it('copies the email address and confirms it in a live region', async () => {
    const user = userEvent.setup();
    // After userEvent.setup(), which installs a clipboard stub of its own.
    clipboard = mockClipboard();
    render(<PortfolioPage copy={en} locale="en" />);

    await user.click(screen.getByRole('button', { name: en.intro.copyEmail }));

    expect(clipboard.writeText).toHaveBeenCalledWith(site.email);
    const toast = await screen.findByRole('status');
    expect(toast).toHaveTextContent(en.contact.copied);
    expect(toast).toHaveAttribute('aria-live', 'polite');
  });

  it('shows no toast until something is copied', () => {
    render(<PortfolioPage copy={en} locale="en" />);

    expect(screen.queryByText(en.contact.copied)).toBeNull();
  });

  it('renders the Japanese page from the Japanese content', () => {
    render(<PortfolioPage copy={ja} locale="ja" />);

    expect(screen.getAllByRole('heading', { level: 1 })[0]).toHaveTextContent(ja.intro.heading);
  });
});
