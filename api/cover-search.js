import searchWikipedia from './sources/wikipedia.js'
import searchBaiduBaike from './sources/baiduBaike.js'
import dummyCover from './sources/dummy.js'

export default async function handler(req, res) {
  // ===== CORS（Figma Make 必须）=====
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const title = (req.query.title || '').trim()
  const debug = req.query.debug === 'true'

  if (!title) {
    res.status(400).json({ ok: false, error: 'Missing title' })
    return
  }

  const tried = []
  const failed = []

  // ===== 1. Wikipedia =====
  tried.push('wikipedia')
  try {
    const image = await searchWikipedia(title)
    if (image) {
      res.json({
        ok: true,
        title,
        image,
        source: 'wikipedia',
        ...(debug ? { tried, failed } : {})
      })
      return
    }
    failed.push('wikipedia')
  } catch (e) {
    failed.push('wikipedia')
  }

  // ===== 2. 百度百科 =====
  tried.push('baidu')
  try {
    const image = await searchBaiduBaike(title)
    if (image) {
      res.json({
        ok: true,
        title,
        image,
        source: 'baidu',
        ...(debug ? { tried, failed } : {})
      })
      return
    }
    failed.push('baidu')
  } catch (e) {
    failed.push('baidu')
  }

  // ===== 3. dummy 兜底 =====
  res.json({
    ok: true,
    title,
    image: dummyCover(title),
    source: 'fallback',
    ...(debug ? { tried, failed } : {})
  })
}
