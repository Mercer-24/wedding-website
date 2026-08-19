/**
 * Wedding Website Theme Configuration
 * 
 * Change colors, fonts, and spacing here to customize the entire site.
 * Colors are also exported as CSS custom properties in globals.css.
 */

export const theme = {
  colors: {
    // Primary — main brand color (used for headings, buttons, links)
    primary: "#8B5E3C",        // Warm brown — change to bride/groom colors
    primaryLight: "#A67B5B",   // Lighter variant for hovers
    primaryDark: "#6B4226",    // Darker variant for active states

    // Accent — secondary highlight color
    accent: "#D4A373",         // Gold/tan accent
    accentLight: "#E6C9A0",    // Lighter accent for backgrounds

    // Background
    bgPrimary: "#FFFBF5",      // Main background (warm white)
    bgSecondary: "#F5EDE3",    // Card/section backgrounds
    bgDark: "#2C1810",         // Dark sections / footer

    // Text
    textPrimary: "#2C1810",     // Main text color
    textSecondary: "#6B4226",   // Subtle text / descriptions
    textOnPrimary: "#FFFFFF",   // Text on primary-colored backgrounds
    textOnDark: "#F5EDE3",      // Text on dark backgrounds

    // Borders and dividers
    border: "#D4A373",
    borderLight: "#E6C9A0",
  },

  fonts: {
    heading: "var(--font-geist-sans)",   // Change to a decorative font if desired
    body: "var(--font-geist-sans)",
  },

  spacing: {
    sectionY: "py-16 md:py-24",     // Vertical spacing between sections
    sectionX: "px-4 md:px-8",       // Horizontal padding
    containerMax: "max-w-4xl",       // Max content width
  },

  // Image paths — change these to your own photos
  images: {
    heroBackground: "/images/hero-background.jpg",
    logo: "/images/logo.png",
    favicon: "/favicon.ico",
  },

  // Wedding details (used across pages)
  wedding: {
    couple: "Maria & Thomas",   // Change to your names!
    date: "20. September 2025",
    venue: "Schlossgarten",
  },
} as const;

export type Theme = typeof theme;