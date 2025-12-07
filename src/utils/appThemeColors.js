/**
 * App Pages Theme Colors - Matching Home Page Saree/Phulkari Theme
 * Centralized color configuration for UniversalMarketplacePage and related components
 */

export const appThemeColors = {
  // Primary Brand Colors
  primary: 'saree-teal',
  primaryDark: 'saree-teal-dark',
  primaryLight: 'saree-teal-light',
  
  secondary: 'saree-amber',
  secondaryDark: 'saree-amber-dark',
  secondaryLight: 'saree-amber-light',
  
  // Accent Colors
  accent1: 'saree-lime',
  accent1Dark: 'saree-lime-dark',
  accent1Light: 'saree-lime-light',
  
  accent2: 'saree-coral',
  accent2Dark: 'saree-coral-dark',
  accent2Light: 'saree-coral-light',
  
  accent3: 'saree-rose',
  accent3Dark: 'saree-rose-dark',
  accent3Light: 'saree-rose-light',

  // Hero Section Gradient (Matching Home Page)
  heroGradient: {
    from: 'phulkari-turquoise',
    via: 'phulkari-gold',
    to: 'phulkari-lime',
    className: 'bg-gradient-to-br from-phulkari-turquoise via-phulkari-gold to-phulkari-lime'
  },

  // CTA Section Gradient (Can use dark or match hero)
  ctaGradient: {
    from: 'phulkari-turquoise',
    via: 'phulkari-gold',
    to: 'phulkari-lime',
    className: 'bg-gradient-to-br from-phulkari-turquoise via-phulkari-gold to-phulkari-lime'
  },

  // Card Hover Border Colors (Cycling Pattern)
  hoverBorders: [
    'hover:border-saree-teal',
    'hover:border-saree-amber',
    'hover:border-saree-lime'
  ],

  // Gradient Classes for Icon Backgrounds & Cards
  gradients: [
    'from-saree-teal to-saree-teal-dark',
    'from-saree-amber to-saree-amber-dark',
    'from-saree-lime to-saree-lime-dark',
    'from-saree-coral to-saree-coral-dark'
  ],

  // Text Colors (for links, headings, labels)
  textColors: [
    'text-saree-teal',
    'text-saree-amber',
    'text-saree-lime',
    'text-saree-coral'
  ],

  // Background Colors (light shades for cards)
  backgroundColors: [
    'bg-saree-teal-light',
    'bg-saree-amber-light',
    'bg-saree-lime-light',
    'bg-saree-coral-light'
  ],

  // Border Colors (for cards and sections)
  borderColors: [
    'border-saree-teal',
    'border-saree-amber',
    'border-saree-lime',
    'border-saree-coral'
  ],

  // Full gradient combinations for colorful cards
  fullGradients: [
    'from-saree-teal to-saree-teal-dark',
    'from-saree-amber to-saree-amber-dark',
    'from-saree-lime to-saree-lime-dark',
    'from-saree-coral to-saree-coral-dark'
  ],

  // Light gradient backgrounds (for subtle sections)
  lightGradients: [
    'from-saree-teal-light to-emerald-100',
    'from-saree-amber-light to-amber-100',
    'from-saree-lime-light to-lime-100',
    'from-saree-coral-light to-orange-100'
  ],

  // Button Primary (Main CTA)
  buttonPrimary: {
    bg: 'bg-saree-teal',
    bgHover: 'hover:bg-saree-teal-dark',
    text: 'text-white',
    className: 'bg-saree-teal hover:bg-saree-teal-dark text-white'
  },

  // Button Secondary (Outline)
  buttonSecondary: {
    border: 'border-saree-teal',
    borderHover: 'hover:bg-saree-teal',
    text: 'text-saree-teal',
    textHover: 'hover:text-white',
    className: 'border-2 border-saree-teal text-saree-teal hover:bg-saree-teal hover:text-white'
  },

  // Loading Spinner
  spinner: {
    border: 'border-saree-teal',
    className: 'border-saree-teal'
  },

  // Links
  link: {
    text: 'text-saree-teal',
    textHover: 'hover:text-saree-teal-dark',
    className: 'text-saree-teal hover:text-saree-teal-dark'
  }
};

/**
 * Helper function to get color by index (for cycling through arrays)
 */
export const getColorByIndex = (index, colorArray) => {
  return colorArray[index % colorArray.length];
};

/**
 * Get gradient class by index
 */
export const getGradient = (index) => {
  return getColorByIndex(index, appThemeColors.gradients);
};

/**
 * Get text color by index
 */
export const getTextColor = (index) => {
  return getColorByIndex(index, appThemeColors.textColors);
};

/**
 * Get hover border by index
 */
export const getHoverBorder = (index) => {
  return getColorByIndex(index, appThemeColors.hoverBorders);
};

/**
 * Get background color by index
 */
export const getBackgroundColor = (index) => {
  return getColorByIndex(index, appThemeColors.backgroundColors);
};

/**
 * Get border color by index
 */
export const getBorderColor = (index) => {
  return getColorByIndex(index, appThemeColors.borderColors);
};

export default appThemeColors;













