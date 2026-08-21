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

interface WeddingPhotoEntry {
  id: string;
  filename: string;
  original_name: string;
  created_at: string;
  guest_name: string | null;
}

export default function AdminPage() {
  const { locale, t } = useI18n();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [weddingPhotos, setWeddingPhotos] = useState<WeddingPhotoEntry[]>([]);
  const [filterChallenge, setFilterChallenge] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"challenge" | "wedding">("challenge");

  useEffect(() => {
    if (authenticated) loadPhotos();
  }, [authenticated]);

  useEffect(() => {
    if (authenticated) loadPhotos();
  }, [filterChallenge]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthenticated(true);
        setLoginError("");
      } else {
        setLoginError(t("admin.wrongPassword"));
      }
    } catch {
      setLoginError(t("admin.loginFailed"));
    }
  };

  const loadPhotos = async () => {
    setLoading(true);
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

  const loadWeddingPhotos = async () => {
    try {
      const res = await fetch("/api/wedding-photos/list");
      const data = await res.json();
      setWeddingPhotos(data.photos || []);
    } catch (err) {
      console.error("Failed to load wedding photos:", err);
    }
  };

  useEffect(() => {
    if (authenticated && activeTab === "wedding") {
      loadWeddingPhotos();
    }
  }, [activeTab, authenticated]);

  const handleDeletePhoto = async (id: string, type: "challenge" | "wedding") => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    try {
      const endpoint = type === "challenge"
        ? `/api/photos/delete?id=${id}`
        : `/api/wedding-photos/delete?id=${id}`;
      await fetch(endpoint, { method: "DELETE" });
      if (type === "challenge") loadPhotos();
      else loadWeddingPhotos();
    } catch (err) {
      console.error("Failed to delete photo:", err);
    }
  };

  // --- Login Screen ---
  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }}
        >
          {t("admin.title")}
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("admin.passwordPlaceholder")}
            className="w-full px-4 py-2 rounded-lg border text-center"
            style={{
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.bgPrimary,
              color: theme.colors.textPrimary,
            }}
            autoFocus
          />
          <button
            type="submit"
            className="w-full px-6 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.textOnPrimary,
            }}
          >
            {t("admin.loginButton")}
          </button>
        </form>
        {loginError && (
          <p className="mt-4 text-sm" style={{ color: "#dc2626" }}>{loginError}</p>
        )}
      </div>
    );
  }

  // --- Authenticated Admin View ---
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: theme.colors.textPrimary }}
        >
          {t("admin.title")}
        </h1>
        <button
          onClick={() => setAuthenticated(false)}
          className="text-sm underline"
          style={{ color: theme.colors.textSecondary }}
        >
          {t("admin.logout")}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b" style={{ borderColor: theme.colors.borderLight }}>
        <button
          onClick={() => setActiveTab("challenge")}
          className="pb-2 text-sm font-medium border-b-2 transition-colors"
          style={{
            borderColor: activeTab === "challenge" ? theme.colors.primary : "transparent",
            color: activeTab === "challenge" ? theme.colors.primary : theme.colors.textSecondary,
          }}
        >
          {t("admin.challengeTab")}
        </button>
        <button
          onClick={() => setActiveTab("wedding")}
          className="pb-2 text-sm font-medium border-b-2 transition-colors"
          style={{
            borderColor: activeTab === "wedding" ? theme.colors.primary : "transparent",
            color: activeTab === "wedding" ? theme.colors.primary : theme.colors.textSecondary,
          }}
        >
          {t("admin.weddingTab")}
        </button>
      </div>

      {/* Challenge Photos Tab */}
      {activeTab === "challenge" && (
        <>
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
                    <th className="text-left p-3 border" style={{ borderColor: theme.colors.borderLight }}></th>
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
                            {t("admin.download")}
                          </a>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDeletePhoto(photo.id, "challenge")}
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{ backgroundColor: "#dc2626", color: "white" }}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Wedding Photos Tab */}
      {activeTab === "wedding" && (
        <>
          {weddingPhotos.length === 0 ? (
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
                      Original
                    </th>
                    <th className="text-left p-3 border" style={{ borderColor: theme.colors.borderLight }}>
                      {t("admin.date")}
                    </th>
                    <th className="text-left p-3 border" style={{ borderColor: theme.colors.borderLight }}>
                      {t("admin.download")}
                    </th>
                    <th className="text-left p-3 border" style={{ borderColor: theme.colors.borderLight }}></th>
                  </tr>
                </thead>
                <tbody>
                  {weddingPhotos.map((photo) => (
                    <tr key={photo.id} className="border-b" style={{ borderColor: theme.colors.borderLight }}>
                      <td className="p-3">{photo.guest_name || "—"}</td>
                      <td className="p-3">{photo.original_name}</td>
                      <td className="p-3">{new Date(photo.created_at).toLocaleString()}</td>
                      <td className="p-3">
                        <a
                          href={`/api/photos/file?path=${encodeURIComponent(photo.filename)}`}
                          download
                          className="underline"
                          style={{ color: theme.colors.primary }}
                        >
                          {t("admin.download")}
                        </a>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeletePhoto(photo.id, "wedding")}
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{ backgroundColor: "#dc2626", color: "white" }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}