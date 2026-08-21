"use client";

import { useI18n } from "@/lib/i18n-context";
import { theme } from "@/config/theme";

export default function LocationPage() {
  const { t } = useI18n();

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }}
        >
          {t("location.title")}
        </h1>
        <p className="text-lg" style={{ color: theme.colors.textSecondary }}>
          {t("location.subtitle")}
        </p>
        <div
          className="w-16 h-0.5 mx-auto mt-6"
          style={{ backgroundColor: theme.colors.accent }}
        />
      </div>

      {/* Venue Info Card */}
      <div
        className="rounded-xl p-8 shadow-sm border text-center"
        style={{
          backgroundColor: theme.colors.bgSecondary,
          borderColor: theme.colors.borderLight,
        }}
      >
        <div className="text-4xl mb-4">🏰</div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: theme.colors.primary }}
        >
          {t("location.venueName")}
        </h2>
        <p className="text-lg mb-6" style={{ color: theme.colors.textSecondary }}>
          {t("location.address")}
        </p>

        {/* Map placeholder — add your image to /public/images/location/map.jpg and uncomment in images.ts */}
        <div
          className="rounded-lg p-12 text-center"
          style={{ backgroundColor: theme.colors.bgPrimary, borderColor: theme.colors.borderLight }}
        >
          <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
            📍 {t("location.directions")}
          </p>
        </div>
      </div>
    </div>
  );
}