'use client';

import { SectionHeading } from './SectionHeading';
import { ContactForm } from './ContactForm';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextLink } from '@/components/ui/TextLink';
import { site } from '@/lib/site';
import type { Copy } from '@/lib/types';

export function ContactSection({ copy, onCopyEmail }: { copy: Copy; onCopyEmail: () => void }) {
  return (
    <section id="contact" className="scroll-mt-6 pt-section">
      <SectionHeading>{copy.sections.contact}</SectionHeading>

      <div className="flex flex-wrap items-start gap-x-8 gap-y-2 pt-6">
        <span aria-hidden="true" className="hidden flex-none sm:block sm:w-label" />
        <div className="flex min-w-0 flex-1 basis-[420px] flex-wrap items-start gap-x-gutter gap-y-8">
          <div className="min-w-0 max-w-[40ch] flex-1 basis-[240px]">
            <p className="m-0 text-body-lg">{copy.contact.lead}</p>
            <ul className="m-0 mt-5 grid list-none gap-2.5 p-0 text-body-15">
              <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <TextLink href={'mailto:' + site.email}>{site.email}</TextLink>
                <Button
                  variant="quiet"
                  size="sm"
                  icon={<Icon name="copy" size={14} />}
                  onClick={onCopyEmail}
                >
                  {copy.contact.copy}
                </Button>
              </li>
              <li>
                <TextLink href={site.linkedin} external>
                  linkedin.com/in/rainzhang05
                </TextLink>
              </li>
              <li>
                <TextLink href={site.github} external>
                  github.com/rainzhang05
                </TextLink>
              </li>
            </ul>
          </div>

          <div className="min-w-0 flex-1 basis-[320px]">
            <ContactForm copy={copy.contact.form} />
          </div>
        </div>
      </div>
    </section>
  );
}
