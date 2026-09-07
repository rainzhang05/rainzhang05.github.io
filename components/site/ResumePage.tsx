import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from './SectionHeading';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { MetaLine, ResumeEntry } from './ResumeEntry';
import { localeHome, resumeFile, resumePage, site, type Locale } from '@/lib/site';
import type { Copy, ResumeCopy } from '@/lib/types';

/**
 * The resume, as a page rather than a download.
 *
 * Everything on it is the PDF's own text (see lib/content/resume.en.ts). It is
 * a server component all the way down: no state, no handlers, nothing to
 * hydrate — which is also why it does not reuse PortfolioPage.
 *
 * The header and footer are the site's, but every in-page link on them points
 * at a section of the *home* page, so they are given that page's address to
 * hang their hashes off. There is no section dock: it needs the five home
 * sections to watch and would be a dead rail here.
 */
export function ResumePage({
  copy,
  resume,
  locale,
}: {
  copy: Copy;
  resume: ResumeCopy;
  locale: Locale;
}) {
  const home = localeHome[locale];

  return (
    <div
      id="top"
      className="mx-auto box-border w-full max-w-container px-gutter-mobile sm:px-gutter"
    >
      <a
        href="#main"
        className="resume-chrome sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-sheet focus:px-4 focus:py-2 focus:text-body-14 focus:text-ink focus:no-underline focus:shadow-toast"
      >
        {copy.labels.skipToContent}
      </a>

      <div className="resume-chrome">
        <SiteHeader
          name={site.name}
          links={copy.nav}
          locale={locale}
          homeHref={home}
          localeHrefs={resumePage}
          currentId="resume"
        />
      </div>

      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-resume pb-4 pt-hero">
        <header className="enter enter-1 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-rule pb-6">
          <div className="min-w-0 flex-1 basis-[420px]">
            <h1 className="m-0 text-display-2 font-normal">{site.name}</h1>
            <p className="mt-1.5 text-body-lg text-ink-2">{resume.tagline}</p>
          </div>

          <div className="grid flex-none gap-0.5 text-caption text-ink-2 sm:justify-items-end sm:text-right">
            {resume.contact.map((line) => (
              <MetaLine key={line[0].text} parts={line} className="text-caption text-ink-2" />
            ))}
          </div>
        </header>

        <div className="enter enter-2 mt-6">
          <ButtonLink href={resumeFile[locale]} download icon={<Icon name="download" size={16} />}>
            {resume.download}
          </ButtonLink>
        </div>

        <div className="resume-columns enter enter-3 mt-12 grid gap-y-12 md:grid-cols-[minmax(0,1fr)_var(--resume-aside)] md:gap-x-8 md:gap-y-0">
          <div className="min-w-0">
            <section aria-labelledby="resume-experience">
              <SectionHeading id="resume-experience">{resume.headings.experience}</SectionHeading>
              <ul className="m-0 list-none p-0">
                {resume.experience.map((entry) => (
                  <ResumeEntry key={entry.id} entry={entry} meta="org" />
                ))}
              </ul>
            </section>

            <section aria-labelledby="resume-projects" className="pt-section">
              <SectionHeading id="resume-projects">{resume.headings.projects}</SectionHeading>
              <ul className="m-0 list-none p-0">
                {resume.projects.map((entry) => (
                  <ResumeEntry key={entry.id} entry={entry} meta="stack" />
                ))}
              </ul>
            </section>
          </div>

          <aside className="resume-aside min-w-0 md:border-l md:border-rule md:pl-8">
            <section aria-labelledby="resume-skills">
              <SectionHeading id="resume-skills">{resume.headings.skills}</SectionHeading>
              <dl className="m-0 mt-5 grid gap-4">
                {resume.skills.map((group) => (
                  <div key={group.id}>
                    <dt className="text-body-14 font-medium text-ink">{group.label}</dt>
                    <dd className="m-0 mt-0.5 text-body-14 text-ink-2">{group.items}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="resume-education" className="pt-section">
              <SectionHeading id="resume-education">{resume.headings.education}</SectionHeading>
              <div className="mt-5 grid gap-0.5">
                <p className="m-0 text-body-15 font-medium text-ink">{resume.education.school}</p>
                {resume.education.lines.map((line) => (
                  <p key={line} className="m-0 text-body-14 text-ink-2">
                    {line}
                  </p>
                ))}
                <div className="mt-2 grid gap-0.5">
                  {resume.education.notes.map((note) => (
                    <p key={note} className="m-0 text-caption text-ink-3">
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <div className="resume-chrome">
        <SiteFooter copy={copy} sectionBase={home} />
      </div>
    </div>
  );
}
