"use client";

import { useI18n } from "@/lib/i18n-context";
import { theme } from "@/config/theme";
import { useState, useRef, useEffect } from "react";

interface WeddingPhoto {
  id: string;
  filename: string;
  original_name: string;
  created_at: string;
}

export default function WeddingPhotosPage() {
  const { t } = useI18n();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage,] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [photos, setPhotos] = useState<WeddingPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load gallery on mount
  useEffect(() => {
    fetch("/api/wedding-photos/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.photos) setPhotos(data.photos);
      })
      .catch(() => {});
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage(null);

    // Upload all selected files sequentially
    const results: { success: boolean; name: string }[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        results.push({ success: false, name: file.name });
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        results.push({ success: false, name: file.name });
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);

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

    // Refresh gallery
    try {
      const res = await fetch("/api/wedding-photos/list");
      const data = await res.json();
      if (data.photos) setPhotos(data.photos);
    } catch {}

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
    // Reset file input
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
          accept="image/jpeg,image/png,image/heic,image/heif,image/webp"
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

      {/* Gallery */}
      {photos.length > 0 ? (
        <div>
          <h2
            className="text-xl font-semibold mb-4 text-center"
            style={{ color: theme.colors.textPrimary }}
          >
            {t("weddingPhotos.gallery")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square rounded-lg overflow-hidden border"
                style={{ borderColor: theme.colors.borderLight }}
              >
                <img
                  src={`/api/photos/file?path=${encodeURIComponent(photo.filename)}`}
                  alt={photo.original_name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-sm" style={{ color: theme.colors.textSecondary }}>
          {t("weddingPhotos.noPhotos")}
        </p>
      )}
    </div>
  );
}