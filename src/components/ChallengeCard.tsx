"use client";

import { useI18n } from "@/lib/i18n-context";
import { challenges } from "@/config/challenges";
import { theme } from "@/config/theme";
import type { Challenge } from "@/config/challenges";
import { useState, useRef } from "react";

/**
 * ChallengeCard — reusable widget for a single challenge.
 * 
 * Displays: number, icon, title, description, and an upload button.
 * When the guest enters their name and clicks upload, this component
 * sends the photo to the API.
 */
export default function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const { locale, t } = useI18n();
  const [guestName, setGuestName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [alreadyUploaded, setAlreadyUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const title = locale === "de" ? challenge.titleDe : challenge.titleEn;
  const description = locale === "de" ? challenge.descriptionDe : challenge.descriptionEn;

  // Check if guest has already uploaded for this challenge
  const checkExistingUpload = async (name: string) => {
    if (!name.trim()) return;
    try {
      const res = await fetch(
        `/api/photos/check?challengeId=${challenge.id}&guestName=${encodeURIComponent(name.trim())}`
      );
      const data = await res.json();
      setAlreadyUploaded(data.exists);
    } catch {
      // Ignore check errors
    }
  };

  const handleUpload = async (file: File) => {
    if (!guestName.trim()) {
      setMessage({ type: "error", text: locale === "de" ? "Bitte gib deinen Namen ein." : "Please enter your name." });
      return;
    }

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("guestName", guestName.trim());
    formData.append("challengeId", challenge.id);

    try {
      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      setMessage({ type: "success", text: t("photoChallenge.success") });
      setAlreadyUploaded(true);
    } catch {
      setMessage({ type: "error", text: t("photoChallenge.error") });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div
      className="rounded-xl p-6 shadow-sm border transition-shadow hover:shadow-md"
      style={{
        backgroundColor: theme.colors.bgSecondary,
        borderColor: theme.colors.borderLight,
      }}
    >
      {/* Number + Icon + Title */}
      <div className="flex items-start gap-3 mb-3">
        <span
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.textOnPrimary,
          }}
        >
          {challenge.number}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{challenge.icon}</span>
            <h3
              className="text-lg font-semibold"
              style={{ color: theme.colors.textPrimary, fontFamily: theme.fonts.heading }}
            >
              {title}
            </h3>
          </div>
          <p className="mt-1 text-sm" style={{ color: theme.colors.textSecondary }}>
            {description}
          </p>
        </div>
      </div>

      {/* Name Input */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.textSecondary }}>
          {t("photoChallenge.nameLabel")}
        </label>
        <input
          type="text"
          value={guestName}
          onChange={(e) => {
            setGuestName(e.target.value);
            setAlreadyUploaded(false);
            setMessage(null);
          }}
          onBlur={() => checkExistingUpload(guestName)}
          placeholder={t("photoChallenge.namePlaceholder")}
          className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.bgPrimary,
            color: theme.colors.textPrimary,
          }}
        />
      </div>

      {/* Already uploaded notice */}
      {alreadyUploaded && (
        <p className="mt-2 text-xs" style={{ color: theme.colors.accent }}>
          {t("photoChallenge.replaceInfo")}
        </p>
      )}

      {/* Upload Button (hidden file input + visible button) */}
      <div className="mt-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !guestName.trim()}
          className="w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
          style={{
            backgroundColor: uploading ? theme.colors.primaryLight : theme.colors.primary,
            color: theme.colors.textOnPrimary,
          }}
        >
          {uploading
            ? t("photoChallenge.uploading")
            : alreadyUploaded
            ? `🔄 ${t("photoChallenge.uploadButton")}`
            : t("photoChallenge.uploadButton")}
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <p
          className="mt-2 text-sm font-medium"
          style={{
            color: message.type === "success" ? "#16a34a" : "#dc2626",
          }}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}