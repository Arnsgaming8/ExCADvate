/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cad: {
          bg: '#1a1a1a',
          panel: '#252525',
          border: '#3a3a3a',
          accent: '#2196F3',
          accentHover: '#1976D2',
          text: '#e0e0e0',
          textMuted: '#888888',
          success: '#4CAF50',
          warning: '#FF9800',
          error: '#f44336'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
