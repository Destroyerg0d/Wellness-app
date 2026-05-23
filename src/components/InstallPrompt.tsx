import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'sw-install-dismissed'
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000 // don't nag again for a week after "Not now"
const DELAY_MS = 15_000

let deferredPrompt: BeforeInstallPromptEvent | null = null
let shownThisSession = false

// Capture the install event as early as possible.
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent
  })
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function recentlyDismissed(): boolean {
  try {
    const v = localStorage.getItem(DISMISS_KEY)
    return v ? Date.now() - Number(v) < COOLDOWN_MS : false
  } catch {
    return false
  }
}

export function InstallPrompt() {
  const [show, setShow] = useState(false)
  const [ios, setIos] = useState(false)

  useEffect(() => {
    if (shownThisSession || isStandalone() || recentlyDismissed()) return
    const id = setTimeout(() => {
      if (isStandalone() || recentlyDismissed()) return
      if (deferredPrompt) {
        shownThisSession = true
        setShow(true)
      } else if (isIOS()) {
        shownThisSession = true
        setIos(true)
        setShow(true)
      }
    }, DELAY_MS)
    return () => clearTimeout(id)
  }, [])

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      /* ignore */
    }
    setShow(false)
  }

  const install = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        await deferredPrompt.userChoice
      } catch {
        /* ignore */
      }
      deferredPrompt = null
    }
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-x-0 bottom-[88px] z-50 mx-auto w-full max-w-[26rem] px-3">
      <div className="rounded-3xl bg-white p-4 shadow-xl shadow-black/15 ring-1 ring-sand-200">
        <div className="flex items-start gap-3">
          <img src="/icon.svg" alt="" className="h-11 w-11 shrink-0 rounded-2xl" />
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold text-ink">Keep it one tap away</p>
            <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">
              {ios
                ? 'Tap the Share button, then "Add to Home Screen" to install.'
                : "Add Shreya's Wellness to your home screen — it opens like a real app, even offline."}
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition active:scale-90"
          >
            <X className="h-5 w-5 text-ink-soft" />
          </button>
        </div>
        {ios ? (
          <button
            type="button"
            onClick={dismiss}
            className="mt-3 w-full rounded-2xl bg-sand py-2.5 font-display font-semibold text-ink"
          >
            Got it
          </button>
        ) : (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={dismiss}
              className="min-h-10 flex-1 rounded-2xl bg-sand font-display font-semibold text-ink"
            >
              Not now
            </button>
            <button
              type="button"
              onClick={install}
              className="min-h-10 flex-1 rounded-2xl bg-coral-500 font-display font-semibold text-white"
            >
              Install
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
