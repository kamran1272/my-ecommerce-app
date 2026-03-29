/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4f8cff',
          DEFAULT: '#2563eb',
          dark: '#1e40af',
        },
        accent: {
          light: '#fbbf24',
          DEFAULT: '#f59e42',
          dark: '#b45309',
        },
        neutral: {
          light: '#f3f4f6',
          DEFAULT: '#64748b',
          dark: '#1e293b',
        },
        brand: {
          blue: '#2563eb',
          pink: '#ec4899',
          yellow: '#fbbf24',
          dark: '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

