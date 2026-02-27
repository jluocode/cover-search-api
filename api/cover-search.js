import searchWikipedia from './sources/wikipedia.js'
import searchBaiduBaike from './sources/baiduBaike.js'
import dummyCover from './sources/dummy.js'

export default async function handler(req, res) {
  // ===== CORS（Figma Make 必须）=====
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // ===== 1. 统一、正确地处理 title =====
  const rawTitle = req.query.title || ''
  const title = decodeURIComponent(rawTitle).trim()
  const debug = req.query.debug === 'true'

  if (!title) {
    res.status(400).json({ ok: false, error: 'Missing title' })
    return
  }

  // ===== 2. 生成搜索变体（关键优化）=====
  const variants = Array.from(
    new Set([
      title,
      `${title}（电影）`,
      `${title} 电影`,
      `${title} 第一季`,
      `${title} 电影版`
    ])
  )

  const tried = []
  const failed = []
  const debugLogs = []

  // 小工具：跑一个 source + 多个变体
  async function trySource(sourceName, fn) {
    tried.push(sourceName)

    for (const v of variants) {
      try {
        const image = await fn(v)
        if (debug) {
          debugLogs.push({
            source: sourceName,
            query: v,
            ok: !!image
          })
        }

        if (image) {
          return { image, query: v }
        }
      } catch (e) {
        if (debug) {
          debugLogs.push({
            source: sourceName,
            query: v,
            error: e.message
          })
        }
      }
    }

    failed.push(sourceName)
    return null
  }

  // ===== 3. Wikipedia =====
  const wikiResult = await trySource('wikipedia', searchWikipedia)
  if (wikiResult) {
    res.json({
      ok: true,
      title,
      image: wikiResult.image,
      source: 'wikipedia',
      matchedQuery: wikiResult.query,
      ...(debug ? { tried, failed, debugLogs } : {})
    })
    return
  }

  // ===== 4. 百度百科 =====
  const baiduResult = await trySource('baidu', searchBaiduBaike)
  if (baiduResult) {
    res.json({
      ok: true,
      title,
      image: baiduResult.image,
      source: 'baidu',
      matchedQuery: baiduResult.query,
      ...(debug ? { tried, failed, debugLogs } : {})
    })
    return
  }

  // ===== 5. dummy 兜底 =====
  res.json({
    ok: true,
    title,
    image: dummyCover(title),
    source: 'fallback',
    ...(debug ? { tried, failed, debugLogs } : {})
  })
}
