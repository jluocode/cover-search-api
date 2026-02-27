async function fetchSummary(title) {
  const url =
    'https://zh.wikipedia.org/api/rest_v1/page/summary/' +
    encodeURIComponent(title)

  const res = await fetch(url, {
    headers: { 'User-Agent': 'CoverSearch/1.0' }
  })

  if (!res.ok) return null

  const data = await res.json()

  return (
    data?.originalimage?.source ||
    data?.thumbnail?.source ||
    null
  )
}

export default async function searchWikipedia(title) {
  // 第 1 轮：原始标题
  let image = await fetchSummary(title)
  if (image) return image

  // 第 2 轮：标题 +（电影）
  image = await fetchSummary(`${title}（电影）`)
  if (image) return image

  // 第 3 轮（可选）：标题 + 电影
  image = await fetchSummary(`${title} 电影`)
  if (image) return image

  return null
}
