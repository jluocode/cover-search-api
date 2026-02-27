export default async function searchBaiduBaike(title) {
  const url =
    'https://baike.baidu.com/api/openapi/BaikeLemmaCardApi?' +
    `scope=103&format=json&appid=379020&bk_key=${encodeURIComponent(
      title
    )}&bk_length=600`

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      Accept: 'application/json'
    }
  })

  if (!res.ok) return null

  const data = await res.json()

  // 🔑 关键：百科的主图在这里
  if (data?.image) {
    return data.image
  }

  return null
}
