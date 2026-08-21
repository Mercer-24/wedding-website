/**
 * Internationalization (i18n) Configuration
 * 
 * All user-facing text lives here. Change strings in one place
 * to update the entire site.
 * 
 * Usage: useT("welcome.title")  →  "Willkommen" (de) | "Welcome" (en)
 */

export type Locale = "de" | "en";

export const defaultLocale: Locale = "de";

export const locales: Locale[] = ["de", "en"];

export const localeLabels: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
};

// Deeply nested translation object — use Record<string, unknown> internally
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Translations = Record<string, any>;

export const t: Record<Locale, Translations> = {
  de: {
    nav: {
      home: "Willkommen",
      photoChallenge: "Fotochallenge",
      schedule: "Ablauf",
      weddingPhotos: "Hochzeitsfotos",
      admin: "Admin",
    },
    welcome: {
      title: "Willkommen",
      subtitle: "Wir feiern unsere Liebe - und ihr seid dabei!",
      cta: "Zur Fotochallenge",
    },
    photoChallenge: {
      title: "Fotochallenge",
      subtitle: "Lade ein Foto zu jeder Challenge hoch und teilt eure besten Momente!",
      nameLabel: "Dein Name",
      namePlaceholder: "Max Mustermann",
      uploadButton: "Foto hochladen",
      uploading: "Hochladen...",
      success: "Foto erfolgreich hochgeladen!",
      error: "Fehler beim Hochladen. Bitte versuche es erneut.",
      replaceInfo: "Du hast bereits ein Foto für diese Challenge hochgeladen. Ein neues Foto ersetzt das alte.",
      challengeAlreadyDone: "Bereits hochgeladen ✓",
      nameTitle: "Wie heißt du?",
      nameSubtitle: "Damit wir deine Fotos zuordnen können, brauchen wir deinen Namen. Du musst ihn nur einmal eingeben!",
      nameRequired: "Bitte gib deinen Namen ein.",
      nameTaken: "Dieser Name wird bereits verwendet. Bitte wähle einen anderen Namen.",
      nameError: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
      saving: "Speichern...",
      letsGo: "Los geht's!",
    },
    schedule: {
      title: "Ablauf",
      subtitle: "So läuft der Tag ab",
      ceremony: "Trauung",
      ceremonyTime: "14:00 Uhr",
      reception: "Sektempfang",
      receptionTime: "15:00 Uhr",
      dinner: "Dinner",
      dinnerTime: "18:00 Uhr",
      party: "Party",
      partyTime: "21:00 Uhr",
    },
    weddingPhotos: {
      title: "Hochzeitsfotos",
      subtitle: "Teilt eure schönsten Momente mit uns!",
      uploadButton: "Foto hochladen",
      uploading: "Hochladen...",
      success: "Foto erfolgreich hochgeladen!",
      error: "Fehler beim Hochladen. Bitte versuche es erneut.",
      gallery: "Galerie",
      noPhotos: "Noch keine Fotos — seid die Ersten!",
    },
    admin: {
      title: "Admin - Fotos",
      download: "Herunterladen",
      noPhotos: "Noch keine Fotos hochgeladen.",
      filterByChallenge: "Filter nach Challenge",
      allChallenges: "Alle Challenges",
      guest: "Gast",
      challenge: "Challenge",
      date: "Datum",
      challengeTab: "Fotochallenge",
      weddingTab: "Hochzeitsfotos",
      logout: "Abmelden",
      passwordPlaceholder: "Passwort",
      loginButton: "Anmelden",
      wrongPassword: "Falsches Passwort",
      loginFailed: "Fehler beim Anmelden",
      deleteConfirm: "Foto wirklich löschen?",
    },
    common: {
      languageSwitch: "Sprache wechseln",
    },
  },
  en: {
    nav: {
      home: "Welcome",
      photoChallenge: "Photo Challenge",
      schedule: "Schedule",
      weddingPhotos: "Wedding Photos",
      admin: "Admin",
    },
    welcome: {
      title: "Welcome",
      subtitle: "We're celebrating our love - and you're part of it!",
      cta: "Go to Photo Challenge",
    },
    photoChallenge: {
      title: "Photo Challenge",
      subtitle: "Upload a photo for each challenge and share your best moments!",
      nameLabel: "Your Name",
      namePlaceholder: "John Doe",
      uploadButton: "Upload Photo",
      uploading: "Uploading...",
      success: "Photo uploaded successfully!",
      error: "Error uploading photo. Please try again.",
      replaceInfo: "You've already uploaded a photo for this challenge. A new photo will replace the old one.",
      challengeAlreadyDone: "Already uploaded ✓",
      nameTitle: "What's your name?",
      nameSubtitle: "So we can assign your photos, we need your name. You only need to enter it once!",
      nameRequired: "Please enter your name.",
      nameTaken: "This name is already taken. Please choose a different name.",
      nameError: "Something went wrong. Please try again.",
      saving: "Saving...",
      letsGo: "Let's go!",
    },
    schedule: {
      title: "Schedule",
      subtitle: "Here's how the day unfolds",
      ceremony: "Ceremony",
      ceremonyTime: "2:00 PM",
      reception: "Champagne Reception",
      receptionTime: "3:00 PM",
      dinner: "Dinner",
      dinnerTime: "6:00 PM",
      party: "Party",
      partyTime: "9:00 PM",
    },
    weddingPhotos: {
      title: "Wedding Photos",
      subtitle: "Share your most beautiful moments with us!",
      uploadButton: "Upload Photo",
      uploading: "Uploading...",
      success: "Photo uploaded successfully!",
      error: "Error uploading photo. Please try again.",
      gallery: "Gallery",
      noPhotos: "No photos yet — be the first!",
    },
    admin: {
      title: "Admin - Photos",
      download: "Download",
      noPhotos: "No photos uploaded yet.",
      filterByChallenge: "Filter by Challenge",
      allChallenges: "All Challenges",
      guest: "Guest",
      challenge: "Challenge",
      date: "Date",
      challengeTab: "Photo Challenge",
      weddingTab: "Wedding Photos",
      logout: "Logout",
      passwordPlaceholder: "Password",
      loginButton: "Login",
      wrongPassword: "Invalid password",
      loginFailed: "Login failed",
      deleteConfirm: "Delete this photo?",
    },
    common: {
      languageSwitch: "Switch language",
    },
  },
};