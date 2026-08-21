"use client";

import { useI18n } from "@/lib/i18n-context";
import { theme } from "@/config/theme";
import { images } from "@/config/images";
import PageHero from "@/components/PageHero";

export default function SchedulePage() {
  const { t } = useI18n();

  const events = [
    {
      time: t("schedule.ceremonyTime"),
      title: t("schedule.ceremony"),
      emoji: "💒",
    },
    {
      time: t("schedule.receptionTime"),
      title: t("schedule.reception"),
      emoji: "🥂",
    },
    {
      time: t("schedule.dinnerTime"),
      title: t("schedule.dinner"),
      emoji: "🍽️",
    },
    {
      time: t("schedule.partyTime"),
      title: t("schedule.party"),
      emoji: "💃",
    },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <PageHero
        imageSrc={images.pages.schedule}
        title={t("schedule.title")}
        subtitle={t("schedule.subtitle")}
      />

      {/* Timeline */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="space-y-0">
          {events.map((event, index) => (
            <div key={index} className="flex items-start gap-6 relative">
              {/* Vertical line */}
              {index < events.length - 1 && (
                <div
                  className="absolute left-5 top-14 w-0.5 h-full"
                  style={{ backgroundColor: theme.colors.borderLight }}
                />
              )}
              {/* Circle */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg z-10"
                style={{ backgroundColor: theme.colors.primary, color: theme.colors.textOnPrimary }}
              >
                {event.emoji}
              </div>
              {/* Content */}
              <div className="pb-10">
                <p className="text-sm font-medium" style={{ color: theme.colors.accent }}>
                  {event.time}
                </p>
                <p className="text-xl font-semibold" style={{ color: theme.colors.textPrimary }}>
                  {event.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}