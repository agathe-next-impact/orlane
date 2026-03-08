/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
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
      },
    },
  },
  plugins: [],
};
