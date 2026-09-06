'use client';

import type { ReactNode } from 'react';
import { SectionHeading } from './SectionHeading';
import { ContactForm } from './ContactForm';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextLink } from '@/components/ui/TextLink';
import { site } from '@/lib/site';
import type { Copy } from '@/lib/types';

/** One labelled row of the contact list, on the same label column as the page. */
function Channel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[76px_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1">
      <dt className="text-body-14 text-ink-3">{label}</dt>
      <dd className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1">{children}</dd>
    </div>
  );
}

export function ContactSection({ copy, onCopyEmail }: { copy: Copy; onCopyEmail: () => void }) {
  const { channels } = copy.contact;

  return (
    <section id="contact" className="scroll-mt-6 pt-section">
      <SectionHeading>{copy.sections.contact}</SectionHeading>

      <div className="flex flex-wrap items-start gap-x-8 gap-y-2 pt-6">
        <span aria-hidden="true" className="hidden flex-none sm:block sm:w-label" />
        <div className="grid min-w-0 flex-1 basis-[420px] items-start gap-x-gutter gap-y-10 md:grid-cols-2">
          <div className="min-w-0">
            <p className="m-0 max-w-measure text-body-lg">{copy.contact.lead}</p>
            <dl className="m-0 mt-6 grid gap-2.5 p-0 text-body-15">
              <Channel label={channels.email}>
                <TextLink href={'mailto:' + site.email}>{site.email}</TextLink>
                <Button
                  variant="quiet"
                  size="sm"
                  icon={<Icon name="copy" size={14} />}
                  onClick={onCopyEmail}
                >
                  {copy.contact.copy}
                </Button>
              </Channel>
              <Channel label={channels.linkedin}>
                <TextLink href={site.linkedin} external>
                  linkedin.com/in/rainzhang05
                </TextLink>
              </Channel>
              <Channel label={channels.github}>
                <TextLink href={site.github} external>
                  github.com/rainzhang05
                </TextLink>
              </Channel>
            </dl>
          </div>

          <div className="min-w-0">
            <ContactForm copy={copy.contact.form} />
          </div>
        </div>
      </div>
    </section>
  );
}
