/** Human duration: 30 -> "30 sec", 60 -> "1 min", 900 -> "15 min". */
export function formatDuration(sec: number): string {
  if (sec < 60) return `${sec} sec`
  const m = Math.round(sec / 60)
  return `${m} min`
}

/** Countdown clock: 65 -> "1:05". */
export function clock(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Best label for an exercise: reps if present, else a friendly duration. */
export function prescription(reps?: string, durationSeconds?: number): string {
  if (reps) return reps
  if (durationSeconds != null) return formatDuration(durationSeconds)
  return ''
}
