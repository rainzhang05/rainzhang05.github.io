import { Button, ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Eyebrow } from '@/components/ui/Eyebrow';
import type { Copy } from '@/lib/types';

export function Intro({
  copy,
  resumeHref,
  onCopyEmail,
}: {
  copy: Copy['intro'];
  /** The resume page for this language. The PDF is downloaded from there. */
  resumeHref: string;
  onCopyEmail: () => void;
}) {
  return (
    <section tabIndex={-1} id="intro" className="pb-20 pt-hero">
      <div className="max-w-[62ch]">
        <div className="enter enter-1">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
        </div>
        <h1 className="enter enter-2 mt-5 max-w-[21ch] text-hero font-normal">{copy.heading}</h1>
        <p className="enter enter-3 mt-6 max-w-[58ch] text-body-lg text-ink-2">{copy.body}</p>
        <div className="enter enter-5 mt-8 flex flex-wrap gap-3">
          <ButtonLink href={resumeHref} icon={<Icon name="file-text" size={16} />}>
            {copy.resume}
          </ButtonLink>
          <Button variant="secondary" icon={<Icon name="copy" size={16} />} onClick={onCopyEmail}>
            {copy.copyEmail}
          </Button>
        </div>
      </div>
    </section>
  );
}
