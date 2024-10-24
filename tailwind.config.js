/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: 'true',
      padding: '2rem',
      screens: {
        sm: '500px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '2560px',
      },
    },
    extend: {
      fontFamily: {
        inter: 'Inter", sans-serif',
        firaSans: 'Fira Sans", sans-serif',
      },
      fontSize: {
        h1: ['65px', '62px'],
        h2: ['46px', '42px'],
        h3: ['24px', '20px'],
        h4: ['24px', '16px'],
        h5: ['24px', '18px'],
        h6: ['22px', '16px'],
        'body-large': ['24px', '16px'],
        body: ['22px', '16px'],
      },
      colors: {
        espresso: '#261F19',
        chestnut: '#594431',
        goldenBrown: '#8B7040',
        sandstone: '#D0C3AB',
        ivory: '#EFECDF',
        white: '#FFFFFF',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        navbackground: 'hsl(var(--nav-background))',
        navforeground: 'hsl(var(--nav-foregraound))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'caret-blink': {
          '0%,70%,100%': {
            opacity: '1',
          },
          '20%,50%': {
            opacity: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};