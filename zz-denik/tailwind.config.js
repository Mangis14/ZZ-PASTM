/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fl-bg': 'var(--fl-bg)',
        'fl-surface': 'var(--fl-surface)',
        'fl-surface-hover': 'var(--fl-surface-hover)',
        'fl-text-muted': 'var(--fl-text-muted)',
        'fl-primary': 'var(--fl-primary)',
        'fl-primary-hover': 'var(--fl-primary-hover)',
        'fl-border': 'var(--fl-border)',
        'fl-paper': 'var(--fl-paper)',
        'fl-paper-light': 'var(--fl-paper-light)',
        'fl-paper-bright': 'var(--fl-paper-bright)',
      },
      fontFamily: {
        serif: ['"Crimson Text"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}