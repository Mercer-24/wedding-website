/**
 * Challenge Definitions
 * 
 * Add, remove, or edit challenges here. Each challenge becomes a card
 * on the Fotochallenge page using the ChallengeCard widget.
 * 
 * The "id" must be unique and stable — it's used as the directory name
 * for uploaded photos on disk.
 */

export interface Challenge {
  id: string;
  number: number;
  titleDe: string;
  titleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  icon: string; // Emoji or icon name
}

export const challenges: Challenge[] = [
  {
    id: "funniest-photo",
    number: 1,
    titleDe: "Das lustigste Foto",
    titleEn: "The Funniest Photo",
    descriptionDe:
      "Macht das witzigste Bild des Abends - seid kreativ!",
    descriptionEn:
      "Take the funniest photo of the evening - be creative!",
    icon: "🤣",
  },
  {
    id: "couple-focus",
    number: 2,
    titleDe: "Brautpaar im Fokus",
    titleEn: "Couple in Focus",
    descriptionDe:
      "Fangt das Brautpaar in einem schönen, unerwarteten oder lustigen Moment ein.",
    descriptionEn:
      "Capture the couple in a beautiful, unexpected, or funny moment.",
    icon: "💍",
  },
  {
    id: "not-related",
    number: 3,
    titleDe: "Nicht verwandt!",
    titleEn: "Not Related!",
    descriptionDe:
      "Mach ein Foto mit jemandem, mit dem du selbst nicht verwandt bist - lernt euch kennen!",
    descriptionEn:
      "Take a photo with someone you're not related to - get to know each other!",
    icon: "🤝",
  },
  {
    id: "best-outfit",
    number: 4,
    titleDe: "Das schönste Outfit",
    titleEn: "Best Outfit",
    descriptionDe:
      "Mach ein Foto mit jemandem, der für dich das schönste Outfit des Abends trägt — Brautpaar ausgenommen!",
    descriptionEn:
      "Take a photo with the person wearing the best outfit of the evening — the couple doesn't count!",
    icon: "👗",
  },
  {
    id: "same-age",
    number: 5,
    titleDe: "Gleich alt!",
    titleEn: "Same Age!",
    descriptionDe:
      "Finde jemanden, der genau so alt ist wie du — und macht ein Foto zusammen!",
    descriptionEn:
      "Find someone who is exactly the same age as you — and take a photo together!",
    icon: "🎂",
  },
  {
    id: "longest-married",
    number: 6,
    titleDe: "Am längsten verheiratet",
    titleEn: "Longest Married",
    descriptionDe:
      "Mach ein Foto mit dem Paar, das am längsten miteinander verheiratet ist!",
    descriptionEn:
      "Take a photo with the couple who has been married the longest!",
    icon: "❤️",
  },
  {
    id: "wearing-red",
    number: 7,
    titleDe: "Wer trägt Rot?",
    titleEn: "Who's Wearing Red?",
    descriptionDe:
      "Mach ein Foto mit jemandem, der die Farbe Rot trägt — je auffälliger, desto besser!",
    descriptionEn:
      "Take a photo with someone wearing red — the more striking, the better!",
    icon: "🔴",
  },
  id: "lets-celebrate",
    number: 8,
    titleDe: "Lasst uns feiern!",
    titleEn: "Let's celebrate!",
    descriptionDe:
      "Ladet euer coolstes Party-Foto des Abends hoch! Und danach: Handy in die Tasche und ab zurück auf die Tanzfläche!",
    descriptionEn:
      "Upload your coolest party photo from the evening! And then: pop your mobile in your pocket and head straight back to the dance floor!",
    icon: "🪩",
  
];

/**
 * Add new challenges by appending to this array:
 * 
 * {
 *   id: "my-new-challenge",      // unique, no spaces, used as folder name
 *   number: 3,
 *   titleDe: "Deutscher Titel",
 *   titleEn: "English Title",
 *   descriptionDe: "Beschreibung auf Deutsch.",
 *   descriptionEn: "Description in English.",
 *   icon: "📸",
 * }
 */