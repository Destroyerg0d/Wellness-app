// Rotating daily motivation lines (PRD 11.13)
export const motivationLines: string[] = [
  'A 10-minute session done beats a 30-minute one skipped.',
  "Missed a day? That's okay — just don't miss two in a row.",
  "You don't need motivation today. You just need to start the warm-up.",
  "Put on your workout clothes. That's the hardest part — and you're past it.",
  'Small and consistent beats big and rare. Every single time.',
  'After-meal walks are tiny but powerful. Even 10 minutes counts.',
  'Drink your water, Shreya. Future-you will be grateful.',
  "You're not behind. You're exactly at the start, and that's a great place to be.",
]

// Pick a stable line for a given date (so it stays the same all day, rotates daily).
export function motivationForDate(dateKey: string): string {
  let hash = 0
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0
  }
  return motivationLines[hash % motivationLines.length]
}
