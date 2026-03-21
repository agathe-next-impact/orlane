/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-body, Montserrat)', 'sans-serif'],
      heading: ['var(--font-heading, "Libre Baskerville")', 'serif'],
    },
    extend: {
      colors: {
        // Couleurs fonctionnelles — overridées par la page d'options WP via CSS custom properties
        // Fallbacks monochromes (gris neutres) si WordPress non configuré
        surface: 'var(--color-surface, #E5E7EB)',
        canvas: 'var(--color-canvas, #F9FAFB)',
        ink: 'var(--color-ink, #374151)',
        primary: 'var(--color-primary, #6B7280)',
        secondary: 'var(--color-secondary, #4B5563)',

        // Flowbite semantic — expose les CSS variables comme utilities Tailwind
        // Permet d'écrire text-brand, bg-brand-soft, border-default, etc.
        body: 'var(--color-body)',
        heading: 'var(--color-heading)',
        brand: {
          DEFAULT: 'var(--color-brand)',
          softer: 'var(--color-brand-softer)',
          soft: 'var(--color-brand-soft)',
          medium: 'var(--color-brand-medium)',
          strong: 'var(--color-brand-strong)',
          subtle: 'var(--color-brand-subtle)',
          light: 'var(--color-brand-light)',
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
