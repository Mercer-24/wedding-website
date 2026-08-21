"use client";

import { useI18n } from "@/lib/i18n-context";
import { theme } from "@/config/theme";
import { images } from "@/config/images";
import Image from "next/image";

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
        className="rounded-xl overflow-hidden shadow-sm border"
        style={{
          borderColor: theme.colors.borderLight,
        }}
      >
        {/* Venue Image */}
        <div className="relative w-full h-64">
          <Image
            src={images.location.venue}
            alt={t("location.venueName")}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-8 text-center" style={{ backgroundColor: theme.colors.bgSecondary }}>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: theme.colors.primary }}
          >
            {t("location.venueName")}
          </h2>
          <p className="text-lg mb-6" style={{ color: theme.colors.textSecondary }}>
            {t("location.address")}
          </p>

          {/* Map */}
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: theme.colors.borderLight }}>
            <div className="relative w-full h-64">
              <Image
                src={images.location.map}
                alt="Map"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}