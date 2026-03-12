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
        // Couleurs principales — overridées par la page d'options WP via CSS custom properties
        beige: 'var(--color-beige, #E8DCCB)',
        creme: 'var(--color-creme, #FAF8F5)',
        taupe: 'var(--color-taupe, #6B6257)',
        sauge: 'var(--color-sauge, #A8BFA3)',
        mousse: 'var(--color-mousse, #7A9575)',

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
