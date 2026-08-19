"use client";

import { useI18n } from "@/lib/i18n-context";
import { theme } from "@/config/theme";
import { challenges } from "@/config/challenges";
import ChallengeCard from "@/components/ChallengeCard";

export default function PhotoChallengePage() {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }}
        >
          {t("photoChallenge.title")}
        </h1>
        <p className="text-lg" style={{ color: theme.colors.textSecondary }}>
          {t("photoChallenge.subtitle")}
        </p>
        <div
          className="w-16 h-0.5 mx-auto mt-6"
          style={{ backgroundColor: theme.colors.accent }}
        />
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}