/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        menta:     '#AEE2C9',
        chocolate: '#4D2614',
        churro:    '#EDB352',
        crema:     '#F9F6F0',
        // Semantic Dark Mode Colors
        'dark-bg': '#1a0b05',
        'dark-card': '#2c150b',
        'dark-input': '#1f0c04',
        'dark-border': '#422212',
        'dark-hover': '#3d1a0a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
