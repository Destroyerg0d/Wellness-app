// Pulls demonstration photos for the strength moves from the public-domain
// free-exercise-db (yuhonas/free-exercise-db) and bundles them locally into
// public/exercises/<id>.jpg. Anything not matched here falls back to an on-brand
// SVG placeholder at runtime — so a miss is fine, never a broken image.
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('public/exercises')
const DB = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
const IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'

// myExerciseId -> ordered search terms (first name-substring match with an image wins)
const MAP = {
  'chair-squats': ['bodyweight squat', 'squats - bodyweight', 'squat'],
  'sit-to-stand': ['bodyweight squat', 'squats - bodyweight', 'squat'],
  'wall-pushups': ['pushups (wall)', 'incline push-up', 'pushups', 'push-up'],
  'incline-pushups': ['incline push-up', 'pushups (close and wide hand positions)', 'pushups', 'push-up'],
  'glute-bridges': ['glute bridge', 'butt lift (bridge)', 'bridge'],
  'bird-dog': ['bird dog'],
  'dead-bug': ['dead bug', 'lying leg raise'],
  'hip-hinge': ['good morning'],
  'reverse-lunges': ['bodyweight walking lunge', 'reverse lunge', 'bodyweight lunge', 'lunge'],
  'knee-plank': ['plank', 'kneeling plank'],
  'standing-marches': ['high knee', 'mountain climber'],
  'wall-angels': ['scapular wall slide', 'wall slide'],
  'cardio-walk': ['walking, treadmill', 'walking'],
}

const report = []

try {
  const res = await fetch(DB)
  if (!res.ok) throw new Error(`db fetch ${res.status}`)
  const all = await res.json()
  await mkdir(OUT, { recursive: true })

  const findImage = (terms) => {
    for (const t of terms) {
      const hit = all.find((e) => e?.name?.toLowerCase().includes(t) && e?.images?.length)
      if (hit) return { img: hit.images[0], name: hit.name }
    }
    return null
  }

  for (const [id, terms] of Object.entries(MAP)) {
    const found = findImage(terms)
    if (!found) {
      report.push(`MISS ${id} (will use SVG)`)
      continue
    }
    try {
      const r = await fetch(IMG_BASE + found.img)
      if (!r.ok) {
        report.push(`FAIL ${id} ${r.status}`)
        continue
      }
      const buf = Buffer.from(await r.arrayBuffer())
      await writeFile(path.join(OUT, `${id}.jpg`), buf)
      report.push(`OK   ${id} <- "${found.name}" (${Math.round(buf.length / 1024)}KB)`)
    } catch (e) {
      report.push(`ERR  ${id} ${e.message}`)
    }
  }
} catch (e) {
  report.push(`FATAL ${e.message}`)
}

console.log(report.join('\n'))
