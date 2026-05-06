/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: '#0f172a',
        brand: {
          blue: '#2563eb',
          green: '#059669',
          amber: '#d97706',
          red: '#dc2626',
          purple: '#7c3aed',
          teal: '#0d9488',
          rose: '#e11d48',
        },
      },
    },
  },
  plugins: [],
};
