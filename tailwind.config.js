/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Phulkari Color Palette - Extracted from Traditional Fabric
        // Based on vibrant rainbow stripe pattern
        'phulkari-red': '#DC2626',           // Vivid fiery red
        'phulkari-red-dark': '#B91C1C',      // Darker red
        'phulkari-red-light': '#FEE2E2',     // Light red
        'phulkari-fuchsia': '#D946EF',       // Rich fuchsia/magenta pink
        'phulkari-fuchsia-dark': '#A21CAF',  // Darker fuchsia
        'phulkari-fuchsia-light': '#FAE8FF', // Light fuchsia
        'phulkari-peach': '#FED7AA',         // Soft warm beige/light peach
        'phulkari-peach-dark': '#FB923C',    // Darker peach
        'phulkari-peach-light': '#FFF7ED',   // Very light peach
        'phulkari-gold': '#FBBF24',          // Sunny golden yellow
        'phulkari-gold-dark': '#F59E0B',    // Darker gold
        'phulkari-gold-light': '#FEF3C7',   // Light gold
        'phulkari-lime': '#84CC16',          // Lively bright lime green
        'phulkari-lime-dark': '#65A30D',     // Darker lime
        'phulkari-lime-light': '#ECFCCB',   // Light lime
        'phulkari-turquoise': '#06B6D4',     // Clear vibrant turquoise
        'phulkari-turquoise-dark': '#0891B2', // Darker turquoise
        'phulkari-turquoise-light': '#CFFAFE', // Light turquoise
        'phulkari-blue-light': '#E0F2FE',    // Pale blue-green
        'phulkari-blue-light-dark': '#0EA5E9', // Darker version
        // Saree-inspired palette from provided image (teal/amber/green)
        'saree-teal': '#12A7A7',
        'saree-teal-dark': '#0E7E7E',
        'saree-teal-light': '#D5F3F3',
        'saree-amber': '#F59E0B',
        'saree-amber-dark': '#B45309',
        'saree-amber-light': '#FEF3C7',
        'saree-lime': '#64C936',
        'saree-lime-dark': '#4A9A29',
        'saree-lime-light': '#E9F8E9',
        'saree-rose': '#E64B5D',
        'saree-rose-dark': '#B73747',
        'saree-rose-light': '#FCE5E8',
        'saree-coral': '#FF6A3D',
        'saree-coral-dark': '#CC5531',
        'saree-coral-light': '#FFE7DE',
        // Original AWS colors (unchanged)
        'aws-navy': '#232F3E',
        'aws-orange': '#FF9900',
        'aws-blue': '#0073BB',
        'aws-light-blue': '#E7F4FF',
        'aws-gray': '#F2F3F3',
        'aws-dark-gray': '#16191F',
        'emerald': {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        'teal': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
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
