import type { Config } from 'tailwindcss';

/**
 * Every value here points at a CSS custom property declared in app/globals.css,
 * which is the single copy of the Rain Zhang design system tokens.
 * Components reference these Tailwind names, never raw hex or ms values.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        sheet: 'var(--sheet)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        'ink-hover': 'var(--ink-hover)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        rule: 'var(--rule)',
        'rule-strong': 'var(--rule-strong)',
        sage: 'var(--sage)',
        'sage-strong': 'var(--sage-strong)',
        'sage-tint': 'var(--sage-tint)',
        clay: 'var(--clay)',
        ochre: 'var(--ochre)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        label: [
          'var(--text-label)',
          { lineHeight: 'var(--leading-label)', letterSpacing: 'var(--tracking-label)' },
        ],
        caption: ['var(--text-caption)', { lineHeight: 'var(--leading-caption)' }],
        'body-14': ['var(--text-body-14)', { lineHeight: 'var(--leading-body-sm)' }],
        'body-sm': ['var(--text-body-sm)', { lineHeight: 'var(--leading-body-sm)' }],
        'body-15': ['var(--text-body-15)', { lineHeight: 'var(--leading-body-sm)' }],
        body: ['var(--text-body)', { lineHeight: 'var(--leading-body)' }],
        'body-lg': ['var(--text-body-lg)', { lineHeight: 'var(--leading-body-lg)' }],
        heading: [
          'var(--text-heading)',
          { lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--tracking-heading)' },
        ],
        title: [
          'var(--text-title)',
          { lineHeight: 'var(--leading-title)', letterSpacing: 'var(--tracking-title)' },
        ],
        'display-2': [
          'var(--text-display-2)',
          { lineHeight: 'var(--leading-display-2)', letterSpacing: 'var(--tracking-display-2)' },
        ],
        'display-1': [
          'var(--text-display-1)',
          { lineHeight: 'var(--leading-display-1)', letterSpacing: 'var(--tracking-display-1)' },
        ],
        hero: [
          'var(--text-hero)',
          { lineHeight: 'var(--leading-display-1)', letterSpacing: 'var(--tracking-display-1)' },
        ],
      },
      fontWeight: {
        light: 'var(--weight-light)',
        normal: 'var(--weight-regular)',
        medium: 'var(--weight-medium)',
        semibold: 'var(--weight-semibold)',
      },
      spacing: {
        label: 'var(--label-col)',
        gutter: 'var(--gutter)',
        'gutter-mobile': 'var(--gutter-mobile)',
        section: 'var(--section-gap)',
        hero: 'var(--hero-pad)',
      },
      maxWidth: {
        container: 'var(--container)',
        measure: 'var(--measure)',
        reading: 'var(--reading-col)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
        card: 'var(--radius-card)',
        control: 'var(--radius-control)',
        button: 'var(--radius-button)',
      },
      boxShadow: {
        toast: 'var(--shadow-toast)',
        none: 'none',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
        enter: 'var(--duration-enter)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        enter: 'var(--ease-enter)',
      },
    },
  },
  plugins: [],
};

export default config;
