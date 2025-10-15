/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aws-navy': '#232F3E',
        'aws-orange': '#FF9900',
        'aws-blue': '#0073BB',
        'aws-light-blue': '#E7F4FF',
        'aws-gray': '#F2F3F3',
        'aws-dark-gray': '#16191F',
      },
      fontFamily: {
        'aws': ['Amazon Ember', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slideIn': 'slideIn 0.8s ease-out',
        'fadeIn': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
