// Pulls demonstration photos from the public-domain free-exercise-db
// (yuhonas/free-exercise-db) and bundles them into public/exercises/<id>.jpg.
// Broad search terms per move; first name-substring match with an image wins.
// Anything not matched keeps the on-brand SVG placeholder at runtime.
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('public/exercises')
const DB = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
const IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'

const MAP = {
  // Warm-up
  'wu-march': ['high knee', 'jogging', 'run'],
  'wu-arm-circles': ['arm circles', 'circles'],
  'wu-cat-cow': ['cat stretch', 'cat-cow', 'cat cow'],
  'wu-shallow-squat': ['bodyweight squat', 'squats - bodyweight', 'squat'],
  'wu-side-bends': ['standing lateral stretch', 'side bend', 'oblique'],
  'wu-hip-circles': ['hip circle', 'pelvic tilt', 'world greatest stretch'],
  'wu-shoulder-rolls': ['shoulder circles', 'arm circles'],
  'wu-knee-hugs': ['knee to chest', 'iron cross', 'knee tuck'],
  // Day 1 strength
  'chair-squats': ['bodyweight squat', 'squats - bodyweight', 'squat'],
  'wall-pushups': ['pushups (wall)', 'incline push-up', 'pushups', 'push-up'],
  'glute-bridges': ['butt lift (bridge)', 'glute bridge', 'bridge'],
  'standing-marches': ['high knee', 'marching'],
  'bird-dog': ['bird dog', 'kneeling'],
  'dead-bug': ['dead bug', 'lying leg raise'],
  // Day 2 strength
  'incline-pushups': ['incline push-up', 'pushups (close and wide hand positions)', 'pushups', 'push-up'],
  'sit-to-stand': ['bodyweight squat', 'squats - bodyweight', 'squat'],
  'hip-hinge': ['good morning'],
  'reverse-lunges': ['bodyweight walking lunge', 'reverse lunge', 'bodyweight lunge', 'lunge'],
  'knee-plank': ['plank', 'kneeling plank'],
  'wall-angels': ['scapular wall slide', 'wall slide', 'wall'],
  // Yoga + mobility
  'yoga-sukhasana': ['seated meditation', 'easy pose'],
  'yoga-cat-cow': ['cat stretch', 'cat-cow'],
  'yoga-childs-pose': ['child', 'childs pose'],
  'yoga-cobra': ['cobra', 'sphinx', 'press up back extension'],
  'yoga-downward-dog': ['downward', 'down dog'],
  'yoga-low-lunge': ['kneeling hip flexor', 'hip flexor', 'lunge stretch'],
  'yoga-malasana': ['deep squat', 'garland', 'yogi squat', 'third world squat'],
  'yoga-bridge': ['butt lift (bridge)', 'glute bridge', 'bridge'],
  'yoga-reclining-butterfly': ['groin and back stretch', 'butterfly', 'frog'],
  'yoga-spinal-twist': ['spine stretch', 'lying spinal', 'seated spinal', 'spinal stretch', 'cross body'],
  'yoga-shavasana': ['lying', 'corpse'],
  // Cardio
  'cardio-walk': ['walking, treadmill', 'walking'],
  // Cool-down
  'cd-forward-fold': ['standing toe touches', 'toe touch', 'forward fold', 'standing hamstring'],
  'cd-quad-stretch': ['quadriceps stretch', 'standing quad', 'quad stretch'],
  'cd-childs-pose': ['child', 'childs pose'],
  'cd-butterfly': ['groin and back stretch', 'butterfly', 'seated floor'],
  'cd-knee-to-chest': ['knee to chest', 'iron cross', 'lying'],
  'cd-shavasana': ['corpse', 'lying'],
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

  let ok = 0
  let miss = 0
  for (const [id, terms] of Object.entries(MAP)) {
    const found = findImage(terms)
    if (!found) {
      report.push(`MISS ${id}`)
      miss++
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
      ok++
    } catch (e) {
      report.push(`ERR  ${id} ${e.message}`)
    }
  }
  report.push(`\nDONE: ${ok} photos, ${miss} misses (of ${Object.keys(MAP).length})`)
} catch (e) {
  report.push(`FATAL ${e.message}`)
}
console.log(report.join('\n'))
