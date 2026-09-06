import Image from 'next/image';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { site } from '@/lib/site';
import type { Copy } from '@/lib/types';

export function Intro({ copy, onCopyEmail }: { copy: Copy['intro']; onCopyEmail: () => void }) {
  return (
    <section className="flex flex-wrap items-start justify-between gap-x-gutter gap-y-8 pb-20 pt-hero">
      <div className="min-w-0 max-w-[62ch] flex-1 basis-[480px]">
        <div className="enter enter-1">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
        </div>
        <h1 className="enter enter-2 mt-5 max-w-[21ch] text-hero font-normal">{copy.heading}</h1>
        <p className="enter enter-3 mt-6 max-w-[58ch] text-body-lg text-ink-2">{copy.body}</p>
        <p className="enter enter-4 mt-4 flex items-center gap-2.5 text-body-15 text-ink-2">
          <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-pill bg-sage" />
          {copy.availability}
        </p>
        <div className="enter enter-5 mt-8 flex flex-wrap gap-3">
          <ButtonLink href={site.resumeHref} icon={<Icon name="download" size={16} />}>
            {copy.resume}
          </ButtonLink>
          <Button variant="secondary" icon={<Icon name="copy" size={16} />} onClick={onCopyEmail}>
            {copy.copyEmail}
          </Button>
        </div>
      </div>

      <Image
        src="/portrait.png"
        alt={copy.portraitAlt}
        width={128}
        height={128}
        priority
        sizes="128px"
        className="enter enter-3 rounded-md bg-surface object-cover"
      />
    </section>
  );
}
