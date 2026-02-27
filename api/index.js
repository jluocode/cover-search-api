// api/index.js

async function isImageValid(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
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

module.exports = async (req, res) => {
  const { title } = req.query || {}

  if (!title) {
    return res.status(400).json({ error: 'title is required' })
  }

  const wikiCover = await searchWikipediaImage(title)

  if (wikiCover) {
    return res.json({
      source: 'wikipedia',
      cover: wikiCover
    })
  }

  return res.json({
    source: 'fallback',
    cover: `https://dummyimage.com/300x450/ccc/000&text=${encodeURIComponent(
      title
    )}`
  })
}
