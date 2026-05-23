import { VAPID_PUBLIC_KEY, isCloudEnabled } from './supabase'
import { savePushSubscription } from './sync'

export const pushSupported =
  typeof navigator !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window

/** Push needs both a backend to store the subscription and a VAPID public key. */
export const pushConfigured = isCloudEnabled && VAPID_PUBLIC_KEY.length > 0

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

export async function isPushEnabled(): Promise<boolean> {
  if (!pushSupported) return false
  const reg = await navigator.serviceWorker.getRegistration()
  const sub = await reg?.pushManager.getSubscription()
  return !!sub && Notification.permission === 'granted'
}

/** Requests permission, subscribes, and stores the subscription. Returns true on success. */
export async function enablePush(): Promise<boolean> {
  if (!pushSupported || !pushConfigured) return false
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return false
  const reg = await navigator.serviceWorker.ready
  const existing = await reg.pushManager.getSubscription()
  const sub =
    existing ??
    (await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
    }))
  await savePushSubscription(sub.toJSON())
  return true
}

export async function disablePush(): Promise<void> {
  if (!pushSupported) return
  const reg = await navigator.serviceWorker.getRegistration()
  const sub = await reg?.pushManager.getSubscription()
  await sub?.unsubscribe()
}
