"use client";

import { useI18n } from "@/lib/i18n-context";
import { challenges } from "@/config/challenges";
import { theme } from "@/config/theme";
import { useEffect, useState } from "react";

interface PhotoEntry {
  id: string;
  challenge_id: string;
  filename: string;
  original_name: string;
  created_at: string;
  guest_name: string;
}

export default function AdminPage() {
  const { locale, t } = useI18n();
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [filterChallenge, setFilterChallenge] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const url =
        filterChallenge === "all"
          ? "/api/photos/admin"
          : `/api/photos/admin?challengeId=${filterChallenge}`;
      const res = await fetch(url);
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (err) {
      console.error("Failed to load photos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [filterChallenge]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: theme.colors.textPrimary }}
      >
        {t("admin.title")}
      </h1>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>
          {t("admin.filterByChallenge")}:
        </label>
        <select
          value={filterChallenge}
          onChange={(e) => setFilterChallenge(e.target.value)}
          className="px-3 py-1.5 rounded border text-sm"
          style={{
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.bgPrimary,
            color: theme.colors.textPrimary,
          }}
        >
          <option value="all">{t("admin.allChallenges")}</option>
          {challenges.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === "de" ? c.titleDe : c.titleEn}
            </option>
          ))}
        </select>
      </div>

      {/* Photos Table */}
      {loading ? (
        <p>Loading...</p>
      ) : photos.length === 0 ? (
        <p style={{ color: theme.colors.textSecondary }}>{t("admin.noPhotos")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: theme.colors.bgSecondary }}>
                <th className="text-left p-3 border" style={{ borderColor: theme.colors.borderLight }}>
                  {t("admin.guest")}
                </th>
                <th className="text-left p-3 border" style={{ borderColor: theme.colors.borderLight }}>
                  {t("admin.challenge")}
                </th>
                <th className="text-left p-3 border" style={{ borderColor: theme.colors.borderLight }}>
                  Original
                </th>
                <th className="text-left p-3 border" style={{ borderColor: theme.colors.borderLight }}>
                  {t("admin.date")}
                </th>
                <th className="text-left p-3 border" style={{ borderColor: theme.colors.borderLight }}>
                  {t("admin.download")}
                </th>
              </tr>
            </thead>
            <tbody>
              {photos.map((photo) => {
                const challenge = challenges.find((c) => c.id === photo.challenge_id);
                return (
                  <tr key={photo.id} className="border-b" style={{ borderColor: theme.colors.borderLight }}>
                    <td className="p-3">{photo.guest_name}</td>
                    <td className="p-3">
                      {challenge
                        ? locale === "de"
                          ? challenge.titleDe
                          : challenge.titleEn
                        : photo.challenge_id}
                    </td>
                    <td className="p-3">{photo.original_name}</td>
                    <td className="p-3">{new Date(photo.created_at).toLocaleString()}</td>
                    <td className="p-3">
                      <a
                        href={`/api/photos/file?path=${encodeURIComponent(photo.filename)}`}
                        download
                        className="underline"
                        style={{ color: theme.colors.primary }}
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}