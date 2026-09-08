import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { sectionLinks } from '@/lib/sectionLinks';
import { site } from '@/lib/site';
import type { Copy } from '@/lib/types';

/**
 * Three columns behind a hairline, 96px below the content.
 *
 * `sectionBase` is what the in-page hashes hang off — empty on the home page,
 * and the home page's address on any other route, where "#work" would
 * otherwise point at a section this page does not have. It applies to "Back to
 * top" as well as the Navigate column.
 *
 * It also decides the element, for the reason SiteHeader gives: on the home
 * page these are plain anchors that work before hydration, and anywhere else
 * they cross a route, where a plain anchor is a whole document load.
 */
export function SiteFooter({ copy, sectionBase = '' }: { copy: Copy; sectionBase?: string }) {
  const year = new Date().getFullYear();
  const linkClass =
    'no-copy inline-flex items-center gap-2 text-body-14 text-ink-2 no-underline transition-colors duration-fast ease-out hover:text-ink hover:no-underline';
  const backToTopClass =
    'no-copy inline-flex items-center gap-1.5 text-caption text-ink-2 no-underline transition-colors duration-fast ease-out hover:text-ink hover:no-underline';
  const backToTop = (
    <>
      {copy.footer.backToTop}
      <Icon name="arrow-up" size={14} />
    </>
  );

  return (
    <footer className="mt-24 border-t border-rule pt-10">
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        <div>
          <div className="text-body-14 font-medium text-ink">{site.name}</div>
          <p className="mt-3 max-w-[34ch] text-body-15 text-ink-2">{copy.footer.tagline}</p>
          <div className="mt-4">
            <a href={'mailto:' + site.email} className={linkClass}>
              <Icon name="mail" size={14} />
              {site.email}
            </a>
          </div>
        </div>

        <div>
          <div className="text-label font-medium uppercase text-ink-3">{copy.footer.navigate}</div>
          <nav
            aria-label="Footer"
            className="mt-3.5 grid grid-cols-[repeat(2,max-content)] gap-x-8 gap-y-2.5"
          >
            {sectionLinks(copy).map((link) =>
              sectionBase ? (
                <Link key={link.id} href={sectionBase + link.href} className={linkClass}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.id} href={sectionBase + link.href} className={linkClass}>
                  {link.label}
                </a>
              )
            )}
          </nav>
        </div>

        <div>
          <div className="text-label font-medium uppercase text-ink-3">{copy.footer.elsewhere}</div>
          <div className="mt-3.5 grid justify-items-start gap-2.5">
            {copy.footer.links.map((link) => {
              const body = (
                <>
                  {link.id === 'resume' ? <Icon name="file-text" size={14} /> : null}
                  {link.label}
                  {link.external ? <Icon name="arrow-up-right" size={13} /> : null}
                </>
              );

              return link.external ? (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  {body}
                </a>
              ) : (
                <Link key={link.id} href={link.href} className={linkClass}>
                  {body}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pb-10 pt-5 text-caption text-ink-3">
        <span>
          {copy.footer.credit} · © {year}
        </span>
        {sectionBase ? (
          <Link href={sectionBase + '#top'} className={backToTopClass}>
            {backToTop}
          </Link>
        ) : (
          <a href={sectionBase + '#top'} className={backToTopClass}>
            {backToTop}
          </a>
        )}
      </div>
    </footer>
  );
}
