const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBMPlexSans', ...defaultTheme.fontFamily.sans],
        gin: ['Gin']
      },
      colors: {
        primary: '#0d181c',
        secondary: '#e8b428'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        blink: {
          '0%': { opacity: 0.2 },
          '20%': { opacity: 1 },
          '100% ': { opacity: 0.2 }
        }
      },
      animation: {
        fadeIn: 'fadeIn .3s ease-in-out',
        carousel: 'marquee 60s linear infinite',
        blink: 'blink 1.4s both infinite'
      }
    }
  },
  future: {
    hoverOnlyWhenSupported: true
  },
  daisyui: {
    themes: [
      {
        light: {
          primary: '#0d181c',
          'primary-content': '#ffffff',
          secondary: '#e8b428',
          'secondary-content': '#ffffff',
          accent: '#98C3EA',
          neutral: '#2a323c',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#d1d5db',
          'base-content': '#1f2937'
        },
        dark: {
          primary: '#0d181c',
          'primary-content': '#ffffff',
          secondary: '#e8b428',
          'secondary-content': '#ffffff',
          accent: '#98C3EA',
          neutral: '#191e24',
          'base-100': '#2a323c',
          'base-200': '#232a34',
          'base-300': '#1d242d',
          'base-content': '#ffffff'
        }
      }
    ]
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value
            };
          }
        },
        {
          values: theme('transitionDelay')
        }
      );
    }),
    require('daisyui')
  ]
};
