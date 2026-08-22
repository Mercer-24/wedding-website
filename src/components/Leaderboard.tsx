"use client";

import { useI18n } from "@/lib/i18n-context";
import { theme } from "@/config/theme";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
  rank: number;
  guest_name: string;
  completed_challenges: number;
}

export default function Leaderboard({ totalChallenges }: { totalChallenges: number }) {
  const { t } = useI18n();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/photos/leaderboard");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) setEntries(data.leaderboard || []);
      } catch {
        // Silently fail — leaderboard is non-critical
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchLeaderboard();
    return () => { cancelled = true; };
  }, []);

  // Don't render anything if loading or no entries
  if (loading) return null;
  if (entries.length === 0) return null;

  // Medal emojis for top 3
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8 pb-4">
      <h2
        className="text-2xl font-bold mb-4 text-center"
        style={{ color: theme.colors.textPrimary, fontFamily: theme.fonts.heading }}
      >
        🏆 {t("photoChallenge.leaderboardTitle")}
      </h2>
      <div
        className="rounded-xl overflow-hidden shadow-sm border"
        style={{ borderColor: theme.colors.borderLight }}
      >
        <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: theme.colors.primary }}>
              <th
                className="py-3 px-4 text-sm font-semibold"
                style={{ color: theme.colors.textOnPrimary }}
              >
                {t("photoChallenge.leaderboardRank")}
              </th>
              <th
                className="py-3 px-4 text-sm font-semibold"
                style={{ color: theme.colors.textOnPrimary }}
              >
                {t("photoChallenge.leaderboardName")}
              </th>
              <th
                className="py-3 px-4 text-sm font-semibold text-right"
                style={{ color: theme.colors.textOnPrimary }}
              >
                {t("photoChallenge.leaderboardChallenges")}
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const isTop3 = index < 3;
              return (
                <tr
                  key={entry.rank}
                  className="transition-colors"
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? theme.colors.bgPrimary
                        : theme.colors.bgSecondary,
                  }}
                >
                  <td className="py-2.5 px-4 font-medium" style={{ color: theme.colors.textPrimary }}>
                    {isTop3 ? medals[index] : `${entry.rank}.`}
                  </td>
                  <td className="py-2.5 px-4" style={{ color: theme.colors.textPrimary }}>
                    {entry.guest_name}
                  </td>
                  <td
                    className="py-2.5 px-4 text-right"
                    style={{ color: theme.colors.accent, fontWeight: 600 }}
                  >
                    {entry.completed_challenges}/{totalChallenges}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}