"use client";

import { theme } from "@/config/theme";
import { useI18n } from "@/lib/i18n-context";
import Link from "next/link";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      {/* Hero Section */}
      <div className="max-w-2xl mx-auto">
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
      <div className="mt-16 text-sm" style={{ color: theme.colors.textSecondary }}>
        <p>{theme.wedding.venue}</p>
      </div>
    </div>
  );
}