/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Couleurs principales
        beige: '#E8DCCB',       // fonds, aplats doux
        creme: '#FAF8F5',       // fond principal du site
        taupe: '#6B6257',       // titres et textes importants
        // Accent (parcimonie — max 10–15%)
        sauge: '#A8BFA3',       // boutons, pictos, surlignage
      },
    },
  },
  plugins: [],
};
