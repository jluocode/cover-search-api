export default async function handler(req, res) {
  const url = req.query.url
  if (!url) {
    res.status(400).end('Missing url')
    return
  }

  try {
    const r = await fetch(url, {
      headers: {
        // 🔑 关键：模拟正常浏览器
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        Referer: 'https://baike.baidu.com/'
      }
    })

    if (!r.ok) {
      res.status(404).end('Image fetch failed')
      return
    }

    res.setHeader(
      'Content-Type',
      r.headers.get('content-type') || 'image/jpeg'
    )
    res.setHeader('Cache-Control', 'public, max-age=86400')

    r.body.pipe(res)
  } catch (e) {
    res.status(500).end('Proxy error')
  }
}
