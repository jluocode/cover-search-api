export default async function handler(req, res) {
  const url = req.query.url

  if (!url) {
    res.status(400).end('Missing url')
    return
  }

  try {
    const response = await fetch(url, {
      headers: {
        // 🔑 模拟正常浏览器，绕过防盗链
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        Referer: 'https://baike.baidu.com/'
      }
    })

    if (!response.ok) {
      res.status(404).end('Image fetch failed')
      return
    }

    // ✅ 关键修复：完整读成 buffer
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    res.setHeader(
      'Content-Type',
      response.headers.get('content-type') || 'image/jpeg'
    )
    res.setHeader('Content-Length', buffer.length)
    res.setHeader('Cache-Control', 'public, max-age=86400')

    res.status(200).send(buffer)
  } catch (err) {
    console.error('Image proxy error:', err)
    res.status(500).end('Proxy error')
  }
}
