"use client";

import { useI18n } from "@/lib/i18n-context";
import { theme } from "@/config/theme";
import { images } from "@/config/images";
import { challenges } from "@/config/challenges";
import PageHero from "@/components/PageHero";
import ChallengeCard from "@/components/ChallengeCard";
import Leaderboard from "@/components/Leaderboard";

export default function PhotoChallengePage() {
  const { t } = useI18n();

  return (
    <div>
      {/* Hero Banner */}
      <PageHero
        imageSrc={images.pages["photo-challenge"]}
        title={t("photoChallenge.title")}
        subtitle={t("photoChallenge.subtitle")}
      />

      {/* Leaderboard — top 10 by completed challenges */}
      <Leaderboard totalChallenges={challenges.length} />

      {/* Challenge Cards Grid */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>
    </div>
  );
}