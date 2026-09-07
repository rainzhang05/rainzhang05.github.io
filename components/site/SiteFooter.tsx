import { Icon } from '@/components/ui/Icon';
import { site } from '@/lib/site';
import type { Copy } from '@/lib/types';

/** Three columns behind a hairline, 96px below the content. */
export function SiteFooter({ copy }: { copy: Copy }) {
  const year = new Date().getFullYear();
  const linkClass =
    'no-copy inline-flex items-center gap-2 text-body-14 text-ink-2 no-underline transition-colors duration-fast ease-out hover:text-ink hover:no-underline';

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
            {[
              { id: 'experience', label: copy.sections.experience, href: '#experience' },
              { id: 'work', label: copy.sections.work, href: '#work' },
              { id: 'background', label: copy.sections.background, href: '#background' },
              { id: 'contact', label: copy.sections.contact, href: '#contact' },
            ].map((link) => (
              <a key={link.id} href={link.href} className={linkClass}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <div className="text-label font-medium uppercase text-ink-3">{copy.footer.elsewhere}</div>
          <div className="mt-3.5 grid justify-items-start gap-2.5">
            {copy.footer.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className={linkClass}
              >
                {link.id === 'email' ? <Icon name="mail" size={14} /> : null}
                {link.id === 'resume' ? <Icon name="file-text" size={14} /> : null}
                {link.label}
                {link.external && link.id !== 'resume' ? (
                  <Icon name="arrow-up-right" size={13} />
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pb-10 pt-5 text-caption text-ink-3">
        <span>
          © {year} {site.name} · {copy.footer.credit}
        </span>
        <a
          href="#top"
          className="no-copy inline-flex items-center gap-1.5 text-caption text-ink-2 no-underline transition-colors duration-fast ease-out hover:text-ink hover:no-underline"
        >
          {copy.footer.backToTop}
          <Icon name="arrow-up" size={14} />
        </a>
      </div>
    </footer>
  );
}
