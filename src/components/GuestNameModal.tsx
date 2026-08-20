"use client";

import { useI18n } from "@/lib/i18n-context";
import { useGuest } from "@/lib/guest-context";
import { GuestRegistrationError } from "@/lib/guest-context";
import { theme } from "@/config/theme";
import { useState } from "react";

/**
 * GuestNameModal — shown when a user first visits the photo challenge.
 * Asks for their name, registers them, and stores the ID in localStorage.
 */
export default function GuestNameModal() {
  const { locale, t } = useI18n();
  const { isModalOpen, submitName } = useGuest();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(locale === "de" ? "Bitte gib deinen Namen ein." : "Please enter your name.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitName(name.trim());
      // On success, submitName closes the modal — no further action needed.
      // If we get here and modal is still open, something went wrong silently.
    } catch (err) {
      if (err instanceof GuestRegistrationError) {
        setError(err.message);
      } else {
        setError(
          locale === "de"
            ? "Etwas ist schiefgelaufen. Bitte versuche es erneut."
            : "Something went wrong. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-xl"
        style={{ backgroundColor: theme.colors.bgPrimary }}
      >
        <h2
          className="text-xl font-bold mb-2"
          style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }}
        >
          {locale === "de" ? "Wie heißt du?" : "What's your name?"}
        </h2>
        <p className="text-sm mb-4" style={{ color: theme.colors.textSecondary }}>
          {locale === "de"
            ? "Damit wir deine Fotos zuordnen können, brauchen wir deinen Namen. Du musst ihn nur einmal eingeben!"
            : "So we can assign your photos, we need your name. You only need to enter it once!"}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(null); }}
            placeholder={t("photoChallenge.namePlaceholder")}
            autoFocus
            className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.bgPrimary,
              color: theme.colors.textPrimary,
            }}
            disabled={submitting}
          />

          {error && (
            <p className="mt-2 text-sm" style={{ color: "#dc2626" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="w-full mt-4 py-3 px-4 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.textOnPrimary,
            }}
          >
            {submitting
              ? (locale === "de" ? "Speichern..." : "Saving...")
              : (locale === "de" ? "Los geht's!" : "Let's go!")}
          </button>
        </form>
      </div>
    </div>
  );
}