import { site, type Locale } from '@/lib/site';

/**
 * What the error page says, in both languages.
 *
 * It is kept apart from `Copy` on purpose. The page that shows it is an error
 * boundary — a client component Next hands an error and nothing else — so it
 * cannot be passed the page's copy the way every other component is, and
 * importing the content files into it would put all of the site's text in the
 * browser bundle to draw five strings.
 *
 * An error message says what happened and what to do next, and does not
 * apologise for it.
 */
export interface ErrorCopy {
  label: string;
  heading: string;
  body: string;
  retry: string;
  home: string;
}

export const errorCopy: Record<Locale, ErrorCopy> = {
  en: {
    label: 'Error',
    heading: 'This page failed to load.',
    body: 'An error stopped it part-way. Try again, or go back to the home page.',
    retry: 'Try again',
    home: 'Back to ' + site.name,
  },
  ja: {
    label: 'エラー',
    heading: 'ページを表示できませんでした。',
    body: '読み込みの途中でエラーが発生しました。もう一度お試しいただくか、トップページへお戻りください。',
    retry: 'もう一度試す',
    home: 'トップページへ戻る',
  },
};
