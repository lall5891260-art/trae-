/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      colors: {
        night: '#070A12',
        panel: '#0E1424',
        line: '#1E2A44',
        acid: '#87F7D4',
        violet: '#A78BFA',
      },
      boxShadow: {
        glow: '0 0 50px rgba(135, 247, 212, 0.12)',
      },
    },
  },
  plugins: [],
};
