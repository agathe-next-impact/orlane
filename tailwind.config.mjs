/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
      heading: ['"Libre Baskerville"', 'serif'],
    },
    extend: {
      colors: {
        // Couleurs principales
        beige: '#E8DCCB',       // fonds, aplats doux
        creme: '#FAF8F5',       // fond principal du site
        taupe: '#6B6257',       // titres et textes importants
        // Accent (parcimonie — max 10–15%)
        sauge: '#A8BFA3',       // boutons, pictos, surlignage
        mousse: '#7A9575',      // titres accentués, accent secondaire
      },
    },
  },
  plugins: [],
};
