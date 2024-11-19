/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Nunito Sans', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#076EB8',
        lightGrey: '#F5F5F5',
        navyGrey: '#707991',
        // yellow: "#F2AC06",
        placeholder: '#AFBDDE',
        border: '#C0C0C0',
        background: {
          500: '#F1F5F9',
          600: '#D9D9D9',
          700: '#8C8C8C',
        },
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
        red: { 500: '#f00', 600: '#FF4D4F', 700: '#C60808' },
        green: { 300: '#4DD965', 400: '#2CA94F', 500: '#148634' },
        lightText: '#7B87A1',
        title: '#001E33',
        textBody: '#485259',
      },
      fontSize: {
        xs: ['8px', '12px'],
        sm: ['13px', '22px'],
        base: ['14px', '22px'],
      },
      borderRadius: {
        none: '0',
        img: '2px',
        sm: '5px',
        md: '10px',
        lg: '15px',
        large: '20px',
      },
      spacing: {
        xxs: '0.3125rem',
        xs: '0.625rem',
        sm: '0.9375rem',
        md: '1.25rem',
        lg: '1.875rem',
        xl: '3.125rem',
      },
    },
  },
  plugins: [require('daisyui')],
};
