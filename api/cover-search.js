// /api/cover-search.js

/**
 * 从 Wikipedia 获取封面图
 * @param {string} lang - 'en' | 'zh'
 * @param {string} title - 词条标题
 * @returns {string|null} 图片 URL 或 null
 */

const VERSION = 'debug-2026-02-27-1'

async function fetchWikiThumbnail(lang, title) {
  try {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    console.log('[wiki]', lang, url)

    const res = await fetch(url)
    console.log('[wiki]', lang, 'status:', res.status)

    if (!res.ok) return null

    const data = await res.json()
    console.log('[wiki]', lang, 'thumbnail:', data?.thumbnail)

    return data?.thumbnail?.source || null
  } catch (e) {
    console.log('[wiki]', lang, 'error:', e)
    return null
  }
}

export default async function handler(req, res) {
  // 添加 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有域名
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const { title } = req.query

  // 基础校验
  if (!title) {
    return res.status(400).json({
      ok: false,
      error: 'missing title'
    })
  }

  let cover = null

  // 英文
cover = await fetchWikiThumbnail('en', title)

  // 中文
  if (!cover) {
    cover = await fetchWikiThumbnail('zh', title)
  }
  
  // 中文电影兜底
  if (!cover) {
    cover = await fetchWikiThumbnail('zh', `${title} (电影)`)
  }

  // 3️⃣ 还是没有 → 占位图
  if (!cover) {
    cover = `https://dummyimage.com/300x450/ccc/000&text=${encodeURIComponent(title)}`
  }

  return res.status(200).json({
    ok: true,
    title,
    cover,
    version: VERSION
  })
}
