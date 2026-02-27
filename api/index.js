// api/index.js

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

async function isImageValid(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', timeout: 3000 })
    return res.ok
  } catch {
    return false
  }
}

async function searchWikipediaImage(title) {
  const api = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title
  )}`

  const res = await fetch(api)
  if (!res.ok) return null

  const data = await res.json()
  return data?.thumbnail?.source || null
}

async function searchDuckDuckGoImage(title) {
  const api = `https://duckduckgo.com/?q=${encodeURIComponent(
    title + ' film poster'
  )}&iax=images&ia=images`

  const res = await fetch(api)
  const html = await res.text()

  const match = html.match(/"image":"(https:\\/\\/[^"]+)"/)
  if (!match) return null

  return match[1].replace(/\\\//g, '/')
}

module.exports = async (req, res) => {
  const { title, cover } = req.query || {}

  if (!title) {
    return res.status(400).json({ error: 'title is required' })
  }

  // 1️⃣ 如果传了封面，先校验
  if (cover && (await isImageValid(cover))) {
    return res.json({
      source: 'original',
      cover
    })
  }

  // 2️⃣ Wikipedia
  const wikiCover = await searchWikipediaImage(title)
  if (wikiCover) {
    return res.json({
      source: 'wikipedia',
      cover: wikiCover
    })
  }

  // 3️⃣ DuckDuckGo
  const ddgCover = await searchDuckDuckGoImage(title)
  if (ddgCover) {
    return res.json({
      source: 'duckduckgo',
      cover: ddgCover
    })
  }

  // 4️⃣ 兜底
  return res.json({
    source: 'fallback',
    cover: `https://dummyimage.com/300x450/ccc/000&text=${encodeURIComponent(
      title
    )}`
  })
}
