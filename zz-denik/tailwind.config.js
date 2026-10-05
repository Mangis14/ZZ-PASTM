import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  future: {
    // hover: štýly len na zariadeniach s kurzorom — žiadny „sticky hover" na dotyku
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      // RGB kanály umožňují průhlednost (bg-fl-primary/10); samotný var(--fl-x) ji neumí.
      colors: {
        'fl-bg': 'rgb(var(--fl-bg-rgb) / <alpha-value>)',
        'fl-surface': 'rgb(var(--fl-surface-rgb) / <alpha-value>)',
        'fl-surface-hover': 'rgb(var(--fl-surface-hover-rgb) / <alpha-value>)',
        'fl-text-muted': 'rgb(var(--fl-text-muted-rgb) / <alpha-value>)',
        'fl-primary': 'rgb(var(--fl-primary-rgb) / <alpha-value>)',
        'fl-primary-hover': 'rgb(var(--fl-primary-hover-rgb) / <alpha-value>)',
        'fl-border': 'rgb(var(--fl-border-rgb) / <alpha-value>)',
        'fl-paper': 'rgb(var(--fl-paper-rgb) / <alpha-value>)',
        'fl-paper-light': 'rgb(var(--fl-paper-light-rgb) / <alpha-value>)',
        'fl-paper-bright': 'rgb(var(--fl-paper-bright-rgb) / <alpha-value>)',
        'fl-card': 'rgb(var(--fl-card-rgb) / <alpha-value>)',
        'fl-nav': 'rgb(var(--fl-nav-rgb) / <alpha-value>)',
        'fl-nav-hover': 'rgb(var(--fl-nav-hover-rgb) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['"Crimson Text"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      }
    },
  },
  plugins: [
    animate,
    // Skrytie scrollbarov pri horizontálnych pill-filtroch (trieda sa už používa)
    function scrollbarHide({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      });
    },
  ],
}
