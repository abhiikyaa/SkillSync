/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e8eef6",
          100: "#c5d4e8",
          500: "#2E75B6",
          700: "#1E3A5F",
          900: "#0f1e33",
        },
        // Design system colors used via raw hex in components
        // but also available as Tailwind classes
        primary: {
          DEFAULT: "#FF4D21",
          light: "#ff6b47",
          dark: "#e03a10",
        },
        purple: {
          brand: "#7F56D9",
        },
        surface: {
          DEFAULT: "#0d0d0d",
          dark: "#050505",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    }
  },
  plugins: []
}
