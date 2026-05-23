// Tiny, gentle Web Audio cues — kept deliberately soft and short.
let audioCtx: AudioContext | null = null

function getCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioCtx = new Ctor()
    }
    if (audioCtx.state === 'suspended') void audioCtx.resume()
    return audioCtx
  } catch {
    return null
  }
}

function blip(freq: number, startOffset: number, duration: number, peak: number, type: OscillatorType = 'sine') {
  const ctx = getCtx()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  osc.connect(gain)
  gain.connect(ctx.destination)
  const t = ctx.currentTime + startOffset
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.start(t)
  osc.stop(t + duration + 0.03)
}

/** Soft click when advancing a step manually. */
export function playTick() {
  blip(520, 0, 0.05, 0.04)
}

/** Gentle bell at the end of a timed move or a rest. */
export function playChime() {
  blip(700, 0, 0.35, 0.13)
}

/** Short two-note flourish on finishing the whole session. */
export function playFinish() {
  blip(660, 0, 0.22, 0.13)
  blip(880, 0.16, 0.4, 0.15)
}
