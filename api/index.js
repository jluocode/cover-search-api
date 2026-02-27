export default async function handler(req, res) {
  const { title } = req.query

  if (!title) {
    return res.status(400).json({ ok: false, error: 'missing title' })
  }

  // 1️⃣ 英文 Wikipedia
  let cover = await fetchWikiThumbnail('en', title)

  // 2️⃣ 如果英文没有，用中文 Wikipedia
  if (!cover) {
    cover = await fetchWikiThumbnail('zh', title)
  }

  // 3️⃣ 如果还是没有，用占位图
  if (!cover) {
    cover = `https://dummyimage.com/300x450/ccc/000&text=${encodeURIComponent(title)}`
  }

  return res.json({
    ok: true,
    title,
    cover
  })
}
