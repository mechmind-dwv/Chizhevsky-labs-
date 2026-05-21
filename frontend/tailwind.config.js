/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          bg: '#1a1a2e',
          panel: '#16213e',
          accent: '#0f3460',
          gold: '#FFD700',
          solarRed: '#e94560'
        }
      },
      fontFamily: {
        mono: ['Space Mono', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
