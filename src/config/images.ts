/**
 * Image Configuration
 * 
 * Place your images in /public/images/ and reference them here.
 * The site imports from this file, so changing paths here updates
 * the entire site.
 * 
 * Image folder structure:
 *   public/images/
 *     hero-background.jpg    — Welcome page hero image
 *     logo.png               — Optional logo
 *     schedule/               — Images for the schedule page
 *     location/               — Images for the location page
 */

export const images = {
  // Hero section background on the welcome page
  heroBackground: "/images/background.png",

  // Optional logo (displayed in navbar)
  logo: "/images/logo.jpg",

  // Favicon
  favicon: "/favicon.ico",

  // Schedule page images
  schedule: {
    ceremony: "/images/schedule/ceremony.jpg",
    reception: "/images/schedule/reception.jpg",
    party: "/images/schedule/party.jpg",
  },

  // Location page images
  location: {
    venue: "/images/location/venue.jpg",
    map: "/images/location/map.jpg",
  },

  // Page hero images (full-width banner behind headings)
  pages: {
    schedule: "/images/pictures/startpage.jpeg",
    "photo-challenge": "/images/pictures/fotochallenge.jpeg",
  },
} as const;

export type Images = typeof images;