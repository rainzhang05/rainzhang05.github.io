import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { SiteFooter } from '@/components/site/SiteFooter';
import { en } from '@/lib/content';
import { site } from '@/lib/site';

describe('SiteFooter', () => {
  it('names the site and its tagline', () => {
    render(<SiteFooter copy={en} />);

    expect(screen.getByText(site.name)).toBeInTheDocument();
    expect(screen.getByText(en.footer.tagline)).toBeInTheDocument();
  });

  it('links every section from the footer nav', () => {
    render(<SiteFooter copy={en} />);

    const nav = screen.getByRole('navigation', { name: 'Footer' });
    ['#experience', '#work', '#background', '#contact'].forEach((href) => {
      expect(nav.querySelector(`a[href="${href}"]`)).toBeInTheDocument();
    });
  });

  it('lists the elsewhere links, external ones in a new tab', () => {
    render(<SiteFooter copy={en} />);

    const github = screen.getByRole('link', { name: /GitHub/ });
    expect(github).toHaveAttribute('href', site.github);
    expect(github).toHaveAttribute('target', '_blank');
    expect(github).toHaveAttribute('rel', 'noreferrer');
  });

  it('offers the resume and a mailto', () => {
    render(<SiteFooter copy={en} />);

    expect(screen.getByRole('link', { name: /Resume/ })).toHaveAttribute(
      'href',
      '/rain-zhang-resume.pdf'
    );
    expect(screen.getAllByRole('link', { name: new RegExp(site.email) })[0]).toHaveAttribute(
      'href',
      `mailto:${site.email}`
    );
  });

  it('dates the copyright to the current year, naming Rain once', () => {
    const { container } = render(<SiteFooter copy={en} />);

    expect(container).toHaveTextContent(`${en.footer.credit} · © ${new Date().getFullYear()}`);
    expect(en.footer.credit).toContain(site.name);
  });

  it('offers a way back to the top', () => {
    render(<SiteFooter copy={en} />);

    expect(screen.getByRole('link', { name: new RegExp(en.footer.backToTop) })).toHaveAttribute(
      'href',
      '#top'
    );
  });
});
