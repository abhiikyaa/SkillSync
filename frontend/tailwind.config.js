/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // === AETHER DESIGN SYSTEM ===
        // Backgrounds / Surfaces
        aether: {
          bg:          '#0b1326',   // canvas
          'bg-dim':    '#0b1326',
          surface:     '#171f33',   // cards
          'surface-lo':'#131b2e',
          'surface-hi':'#222a3d',
          'surface-hi2':'#2d3449',
          bright:      '#31394d',
        },
        // Primary — Lavender / Electric Purple
        primary: {
          DEFAULT: '#d2bbff',
          dim:     '#d2bbff',
          fixed:   '#eaddff',
          container: '#7c3aed',
          on:        '#3f008e',
          'on-container': '#ede0ff',
          inverse:   '#732ee4',
        },
        // Secondary — Blue
        secondary: {
          DEFAULT:   '#adc6ff',
          container: '#0566d9',
          on:        '#002e6a',
          'on-container': '#e6ecff',
        },
        // Tertiary — Cyan
        tertiary: {
          DEFAULT:   '#4cd7f6',
          container: '#007184',
          on:        '#003640',
          'on-container': '#b7efff',
        },
        // On-surface text
        'on-surface':    '#dae2fd',
        'on-surface-var':'#ccc3d8',
        outline:         '#958da1',
        'outline-var':   '#4a4455',
        // Errors
        error: {
          DEFAULT:   '#ffb4ab',
          container: '#93000a',
          on:        '#690005',
        },
      },

      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'display': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1':      ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h2':      ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'label':   ['12px', { lineHeight: '1.0', letterSpacing: '0.05em', fontWeight: '600' }],
      },

      borderRadius: {
        'sm':  '0.25rem',
        DEFAULT:'0.5rem',
        'md':  '0.75rem',
        'lg':  '1rem',
        'xl':  '1.5rem',
        '2xl': '2rem',
        'full':'9999px',
      },

      boxShadow: {
        // Glow effects from Aether design system
        'glow-primary': '0 0 20px 4px rgba(124, 58, 237, 0.4)',
        'glow-secondary': '0 0 20px 4px rgba(5, 102, 217, 0.3)',
        'glow-tertiary': '0 0 20px 4px rgba(76, 215, 246, 0.3)',
        'glow-sm': '0 0 12px 2px rgba(124, 58, 237, 0.25)',
        // Neumorphic light/dark shadows
        'neu': '-6px -6px 12px rgba(255,255,255,0.04), 6px 6px 12px rgba(0,0,0,0.5)',
        'neu-inset': 'inset -3px -3px 6px rgba(255,255,255,0.03), inset 3px 3px 6px rgba(0,0,0,0.4)',
        // Glass card shadow
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },

      backdropBlur: {
        'xs': '4px',
        'sm': '8px',
        DEFAULT: '12px',
        'lg': '20px',
      },

      animation: {
        'fade-in':     'fadeIn 0.4s ease forwards',
        'slide-up':    'slideUp 0.5s ease forwards',
        'pulse-glow':  'pulseGlow 2.5s ease-in-out infinite',
        'spin-slow':   'spin 3s linear infinite',
        'float':       'float 4s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px 2px rgba(124, 58, 237, 0.25)' },
          '50%':      { boxShadow: '0 0 24px 6px rgba(124, 58, 237, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      backgroundImage: {
        'gradient-radial':     'radial-gradient(var(--tw-gradient-stops))',
        'aether-gradient':     'linear-gradient(135deg, #7c3aed 0%, #0566d9 50%, #4cd7f6 100%)',
        'aether-gradient-sub': 'linear-gradient(135deg, #7c3aed 0%, #0566d9 100%)',
        'shimmer-gradient':    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    }
  },
  plugins: []
}
