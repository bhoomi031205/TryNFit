/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF0F5',
          100: '#FDE8EF',
          200: '#F8BBD0',
          300: '#F48FB1',
          400: '#FF6B97',
          500: '#FF407D',
          600: '#E8316B',
          700: '#C2185B',
          800: '#880E4F',
          900: '#4A082C',
        },
        blush: {
          50: '#FFF5F8',
          100: '#FDE8EF',
          200: '#F8BBD0',
          300: '#F48FB1',
          400: '#FF6B97',
          500: '#FF407D',
          600: '#E8316B',
          border: '#F3DCE4',
        },
        pearl: {
          white: '#FFFFFF',
          warm: '#FAF8F5',
          soft: '#F5F0EB',
          border: '#EFE9E2',
        },
        ink: {
          900: '#1E1B1D',
          800: '#2E272C',
          700: '#4A4147',
          600: '#6F626A',
          500: '#8E8088',
          400: '#B0A3AA',
          300: '#D5CCD1',
          200: '#EAE4E8',
          100: '#F7F3F5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'pink-glow': '0 8px 25px rgba(255, 64, 125, 0.28)',
        'pink-glow-lg': '0 12px 35px rgba(255, 64, 125, 0.35)',
        'card-pearl': '0 10px 35px rgba(80, 40, 55, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backgroundImage: {
        'gradient-pink-primary': 'linear-gradient(135deg, #FF6B97 0%, #FF407D 100%)',
        'gradient-pink-soft': 'linear-gradient(135deg, #FFF0F5 0%, #FDE8EF 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
