// Supabase Edge Function: send daily push reminders to all stored subscriptions.
// Deploy:  supabase functions deploy send-reminders
// Secrets (supabase secrets set ...): VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.)
import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

webpush.setVapidDetails(
  'mailto:hello@shreyas-wellness.app',
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!,
)

// India Standard Time (UTC+5:30) to pick the right calendar day for the message.
function istNow(): Date {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000)
}

function buildMessage(): { title: string; body: string; tag: string } {
  const ist = istNow()
  const isBirthday = ist.getUTCMonth() === 9 && ist.getUTCDate() === 22
  if (isBirthday) {
    return { title: 'Happy Birthday, Shreya!', body: "Wishing you a strong, happy year. Here's to you.", tag: 'birthday' }
  }
  return {
    title: "Shreya's Wellness",
    body: 'A little movement today goes a long way. Open your space and just start the warm-up.',
    tag: 'daily',
  }
}

Deno.serve(async () => {
  const { data: subs, error } = await supabase.from('push_subscriptions').select('endpoint, subscription')
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  const payload = JSON.stringify(buildMessage())
  let sent = 0
  await Promise.allSettled(
    (subs ?? []).map(async (row: { endpoint: string; subscription: unknown }) => {
      try {
        await webpush.sendNotification(row.subscription as webpush.PushSubscription, payload)
        sent++
      } catch (e) {
        // 404/410 means the subscription is dead — clean it up.
        const status = (e as { statusCode?: number }).statusCode
        if (status === 404 || status === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', row.endpoint)
        }
      }
    }),
  )

  return new Response(JSON.stringify({ sent }), { headers: { 'Content-Type': 'application/json' } })
})
