"use client";

import { useI18n } from "@/lib/i18n-context";
import { useGuest } from "@/lib/guest-context";
import { theme } from "@/config/theme";
import { useState, useRef } from "react";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

export default function WeddingPhotosPage() {
  const { t } = useI18n();
  const { guestId } = useGuest();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage(null);

    const results: { success: boolean; name: string }[] = [];

    for (const file of Array.from(files)) {
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isImage && !isVideo) {
        results.push({ success: false, name: file.name });
        continue;
      }

      const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
      if (file.size > maxSize) {
        results.push({ success: false, name: file.name });
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);
      if (guestId) formData.append("guestId", guestId);

      try {
        const res = await fetch("/api/wedding-photos/upload", {
          method: "POST",
          body: formData,
        });
        results.push({ success: res.ok, name: file.name });
      } catch {
        results.push({ success: false, name: file.name });
      }
    }

    const failed = results.filter((r) => !r.success);
    if (failed.length === 0) {
      setMessage({ type: "success", text: t("weddingPhotos.success") });
    } else if (failed.length === results.length) {
      setMessage({ type: "error", text: t("weddingPhotos.error") });
    } else {
      setMessage({
        type: "error",
        text: `${results.length - failed.length} OK, ${failed.length} ${t("weddingPhotos.error")}`,
      });
    }

    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }}
        >
          {t("weddingPhotos.title")}
        </h1>
        <p className="text-lg" style={{ color: theme.colors.textSecondary }}>
          {t("weddingPhotos.subtitle")}
        </p>
        <p className="text-sm mt-2" style={{ color: theme.colors.textSecondary }}>
          {t("weddingPhotos.uploadHint")}
        </p>
        <div
          className="w-16 h-0.5 mx-auto mt-6"
          style={{ backgroundColor: theme.colors.accent }}
        />
      </div>

      {/* Upload Button */}
      <div className="text-center mb-10">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif,image/webp,video/mp4,video/quicktime,video/webm,video/x-msvideo"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-8 py-3 rounded-full text-lg font-medium transition-all hover:scale-105 shadow-md disabled:opacity-50"
          style={{
            backgroundColor: uploading ? theme.colors.primaryLight : theme.colors.primary,
            color: theme.colors.textOnPrimary,
          }}
        >
          {uploading ? t("weddingPhotos.uploading") : t("weddingPhotos.uploadButton")}
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <p
          className="text-center text-sm font-medium mb-6"
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