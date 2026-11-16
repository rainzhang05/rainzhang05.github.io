import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const params = vi.hoisted(() => ({ current: {} as { locale?: string } }));
vi.mock('next/navigation', () => ({ useParams: () => params.current }));

import LocaleError from '@/app/[locale]/error';
import { FullPageMessage } from '@/components/site/FullPageMessage';
import { NotFound } from '@/components/site/NotFound';
import { errorCopy } from '@/lib/content/error';
import { locales } from '@/lib/site';

afterEach(() => {
  params.current = {};
  vi.restoreAllMocks();
});

describe('FullPageMessage', () => {
  it('is one main landmark with the page’s only h1 and a way out', () => {
    render(
      <FullPageMessage label="404" heading="Gone." body="Nothing here.">
        <a href="/">Home</a>
      </FullPageMessage>
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Gone.');
    expect(screen.getByText('Nothing here.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  });

  it('fills the visible screen, not the one behind a phone’s toolbar', () => {
    render(
      <FullPageMessage label="404" heading="Gone." body="Nothing here.">
        {null}
      </FullPageMessage>
    );

    expect(screen.getByRole('main')).toHaveClass('min-h-dvh');
  });
});

describe('NotFound', () => {
  it('says the page is missing and points home', () => {
    render(<NotFound />);

    expect(screen.getByRole('heading', { name: 'This page does not exist.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Rain Zhang/ })).toHaveAttribute('href', '/');
  });
});

describe('the error page', () => {
  const failure = new Error('boom');

  it.each(locales)('speaks the language of the route it replaced (%s)', (locale) => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    params.current = { locale };
    render(<LocaleError error={failure} reset={() => {}} />);

    const copy = errorCopy[locale];
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(copy.heading);
    expect(screen.getByRole('button', { name: copy.retry })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: copy.home })).toHaveAttribute(
      'href',
      locale === 'en' ? '/' : '/ja'
    );
  });

  it('falls back to English when the route has no language it knows', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    params.current = { locale: 'xx' };
    render(<LocaleError error={failure} reset={() => {}} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(errorCopy.en.heading);
  });

  it('tries again from its button, and reports what it caught', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    const reset = vi.fn();
    const user = userEvent.setup();
    render(<LocaleError error={failure} reset={reset} />);

    await user.click(screen.getByRole('button', { name: errorCopy.en.retry }));

    expect(reset).toHaveBeenCalledTimes(1);
    expect(logged).toHaveBeenCalledWith(failure);
  });
});

describe('error copy', () => {
  it('says the same five things in both languages, and none of them is empty', () => {
    expect(Object.keys(errorCopy.ja)).toEqual(Object.keys(errorCopy.en));
    for (const locale of locales) {
      for (const value of Object.values(errorCopy[locale])) expect(value.trim()).not.toBe('');
    }
    expect(errorCopy.ja.heading).not.toBe(errorCopy.en.heading);
  });
});
