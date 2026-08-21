"use client";

import Image from "next/image";
import { theme } from "@/config/theme";

interface PageHeroProps {
  /** Path to the hero background image (from images config) */
  imageSrc: string;
  /** Page heading text */
  title: string;
  /** Optional subtitle below the heading */
  subtitle?: string;
}

/**
 * Full-width hero banner with background image, dark overlay, and centered heading.
 * Used as the first visible element on schedule and photo-challenge pages.
 */
export default function PageHero({ imageSrc, title, subtitle }: PageHeroProps) {
  return (
    <div className="relative w-full min-h-[40vh] md:min-h-[50vh] flex items-center justify-center text-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `${theme.colors.bgDark}aa` }}
        />
      </div>

      {/* Text content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        <h1
          className="text-3xl md:text-5xl font-bold mb-3"
          style={{
            color: theme.colors.textOnDark,
            fontFamily: theme.fonts.heading,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <>
            <p
              className="text-lg md:text-xl"
              style={{ color: theme.colors.accentLight }}
            >
              {subtitle}
            </p>
            <div
              className="w-16 h-0.5 mx-auto mt-6"
              style={{ backgroundColor: theme.colors.accent }}
            />
          </>
        )}
      </div>
    </div>
  );
}