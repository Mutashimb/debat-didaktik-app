// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { 
    extend: {
      colors: {
          'primary': '#1a1a1a',      // Hitam pekat untuk background
          'secondary': '#d1d1d1ff',    // Putih keabuan untuk teks
          'accent': '#ffc700',      // Kuning cerah sebagai aksen
        },
  } },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}