/**
 * Wedding Website Theme Configuration
 * 
 * Change colors, fonts, and spacing here to customize the entire site.
 * Colors are also exported as CSS custom properties in layout.tsx.
 * 
 * Primary: #87a08a (Sage green) — elegant, natural, wedding-appropriate
 * Accent:  #d09c8b (Dusty copper/rose) — warm complementary tone
 */

export const theme = {
  colors: {
    // Primary — sage green (main brand color for headings, buttons, links)
    primary: "#87a08a",
    primaryLight: "#a9bcab",     // Lighter sage for hovers
    primaryDark: "#5a725d",      // Darker sage for active states

    // Accent — dusty copper/rose (secondary highlight)
    accent: "#d09c8b",           // Warm copper accent
    accentLight: "#ebdbd6",      // Soft blush for backgrounds

    // Background
    bgPrimary: "#f9fbf9",        // Very light sage-white (main bg)
    bgSecondary: "#edf2ee",      // Light sage (cards/sections)
    bgDark: "#1d301f",           // Deep forest (dark sections/footer)

    // Text
    textPrimary: "#18251a",      // Near-black with green undertone
    textSecondary: "#526f56",    // Muted sage (descriptions)
    textOnPrimary: "#FFFFFF",    // White on primary-colored buttons
    textOnDark: "#e8eee8",       // Light sage on dark backgrounds

    // Borders and dividers
    border: "#abc4ae",            // Medium sage
    borderLight: "#dce5dd",      // Very light sage
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
    couple: "Felicia & Paul",   // Change to your names!
    date: "22. August 2026",
    venue: "Landhotel Gut Wildberg",
  },
} as const;

export type Theme = typeof theme;