/**
 * Pulls the CMS payload into the repo at build time.
 *
 * The site stays static. Vite bakes this JSON into the bundle, so a visitor
 * never talks to Django and the page has no loading state, no layout shift and
 * no risk to the scroll reveals. It also means the site keeps working when the
 * backend is asleep, which on a hobby-tier host it will be.
 *
 * Images are downloaded too, not linked. Linking them would leave every page
 * view depending on the backend being awake -- exactly the thing this design
 * avoids -- so the build copies them in and rewrites the paths to local ones.
 *
 * **A failed fetch is not a failed build.** `content.generated.json` is
 * committed, so if the API is unreachable the build uses the last good copy
 * and says so. Losing a deploy because a backend was restarting would be worse
 * than shipping content that is one edit stale.
 *
 *   CONTENT_API=https://api.example.com/api/content/ npm run build
 */

import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import { dirname, join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_JSON = join(ROOT, 'src/lib/content.generated.json')
const IMAGE_DIR = join(ROOT, 'public/media/cms')
const PUBLIC_PREFIX = '/media/cms'

const API = process.env.CONTENT_API || 'http://127.0.0.1:8000/api/content/'
const TIMEOUT_MS = 15000

const log = (msg) => console.log(`[content] ${msg}`)

/** Every place the payload carries an image URL. */
function* imageFields(data) {
  if (data.about?.figure) yield [data.about, 'figure']
  for (const list of [data.services, data.service_strip]) {
    for (const item of list || []) if (item.image) yield [item, 'image']
  }
  for (const tile of data.disciplines || []) {
    if (tile.img) yield [tile, 'img']
    for (const item of tile.media || []) if (item.src) yield [item, 'src']
  }
  for (const person of data.team?.people || []) {
    if (person.photo) yield [person, 'photo']
  }
  for (const quote of data.testimonials || []) {
    if (quote.photo) yield [quote, 'photo']
  }
  for (const client of data.clients?.items || []) {
    if (client.logo) yield [client, 'logo']
  }
}

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

/**
 * The local name for a remote image: the server's own path under its media
 * root, folders and all.
 *
 * Not the bare filename. Django keeps each model's uploads in its own folder,
 * so two unrelated images can share a basename -- `about/INTERVIEW.webp` and
 * `disciplines/INTERVIEW.webp` are both live right now. Flattening them to
 * `INTERVIEW.webp` would let one silently overwrite the other, or rather let
 * the second be skipped as already present, and replacing one in the admin
 * would quietly change the other.
 */
function localPath(url) {
  const path = decodeURIComponent(new URL(url).pathname)
  const rel = path.replace(/^\/+/, '').replace(/^media\//, '')
  // Refuse anything that would climb out of the image directory.
  return rel.split('/').filter((seg) => seg && seg !== '..' && seg !== '.').join('/')
}

async function download(url, dir) {
  const name = localPath(url)
  const target = join(dir, name)
  if (await exists(target)) return { name, skipped: true }

  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`${res.status} for ${url}`)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, Buffer.from(await res.arrayBuffer()))
  return { name, skipped: false }
}

async function main() {
  let payload
  try {
    const res = await fetch(API, { signal: AbortSignal.timeout(TIMEOUT_MS) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    payload = await res.json()
  } catch (err) {
    const have = await exists(OUT_JSON)
    log(`could not reach ${API} (${err.message})`)
    log(have ? 'using the committed snapshot instead' : 'and there is no snapshot to fall back on')
    // Only fail the build if there is genuinely nothing to build with.
    process.exit(have ? 0 : 1)
  }

  await mkdir(IMAGE_DIR, { recursive: true })
  await mkdir(dirname(OUT_JSON), { recursive: true })

  let fetched = 0
  let reused = 0
  for (const [obj, key] of imageFields(payload)) {
    const url = obj[key]
    if (!/^https?:\/\//.test(url)) continue
    try {
      const { name, skipped } = await download(url, IMAGE_DIR)
      obj[key] = `${PUBLIC_PREFIX}/${name}`
      skipped ? (reused += 1) : (fetched += 1)
    } catch (err) {
      // Keep the remote URL rather than shipping a broken path. The image
      // will load slowly instead of not at all.
      log(`image failed, keeping the remote URL: ${err.message}`)
    }
  }

  payload.generated_at = new Date().toISOString()
  await writeFile(OUT_JSON, JSON.stringify(payload, null, 2) + '\n')

  const counts = [
    `${payload.services?.length ?? 0} services`,
    `${payload.service_strip?.length ?? 0} in the strip`,
    `${payload.about?.pillars?.length ?? 0} pillars`,
    `${payload.disciplines?.length ?? 0} tiles`,
    `${payload.why_choose?.reasons?.length ?? 0} reasons`,
    `${payload.team?.people?.length ?? 0} partners`,
    `${payload.testimonials?.length ?? 0} quotes`,
    `${payload.clients?.items?.length ?? 0} clients`,
  ].join(', ')
  log(`${counts} · images ${fetched} new, ${reused} already present`)
}

main()
