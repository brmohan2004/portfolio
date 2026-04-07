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
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
          light: '#3b82f6',
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#0a0a0a',
          sidebar: '#f8fafc',
          'sidebar-dark': '#0f172a',
        },
        foreground: {
          DEFAULT: '#171717',
          dark: '#f5f5f5',
        },
        muted: {
          DEFAULT: '#737373',
          dark: '#a3a3a3',
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#171717',
        },
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#1e293b',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
