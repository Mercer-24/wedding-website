"use client";

import { theme } from "@/config/theme";
import { images } from "@/config/images";
import { useI18n } from "@/lib/i18n-context";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={images.heroBackground}
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for readability */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `${theme.colors.bgPrimary}cc` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Logo */}
        <Image
          src={images.logo}
          alt={theme.wedding.couple}
          width={120}
          height={120}
          className="rounded-full mx-auto mb-6 object-cover"
        />
        <h1
          className="text-5xl md:text-7xl font-bold mb-4"
          style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }}
        >
          {theme.wedding.couple}
        </h1>
        <p
          className="text-xl md:text-2xl mb-2"
          style={{ color: theme.colors.textSecondary }}
        >
          {theme.wedding.date}
        </p>
        <div
          className="w-24 h-0.5 mx-auto my-8"
          style={{ backgroundColor: theme.colors.accent }}
        />
        <p
          className="text-lg md:text-xl mb-10"
          style={{ color: theme.colors.textSecondary }}
        >
          {t("welcome.subtitle")}
        </p>

        {/* CTA Button */}
        <Link
          href="/photo-challenge"
          className="inline-block px-8 py-3 rounded-full text-lg font-medium transition-all hover:scale-105 shadow-md"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.textOnPrimary,
          }}
        >
          {t("welcome.cta")} →
        </Link>
      </div>

      {/* Decorative bottom section */}
      <div className="relative z-10 mt-16 text-sm" style={{ color: theme.colors.textSecondary }}>
        <p>{theme.wedding.venue}</p>
      </div>
    </div>
  );
}