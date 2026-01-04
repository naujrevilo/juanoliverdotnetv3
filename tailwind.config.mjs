/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        // Mapeo de colores terciarios para compatibilidad con dependencias
        tertiary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        // Mapeo de colores personalizados del sitio
        security: {
            blue: {
                DEFAULT: '#001A5A',
                light: '#4A72B2',
            },
            red: '#981628',
            yellow: '#D19219',
            gray: {
                bg: '#d8d8d8',
                text: '#656565',
            }
        }
      },
    },
  },
  plugins: [],
};
