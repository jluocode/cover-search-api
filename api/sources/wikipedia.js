export default async function searchWikipedia(title) {
  const url =
    'https://zh.wikipedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      format: 'json',
      prop: 'pageimages',
      pithumbsize: '500',   // ⭐ 关键：用缩略图
      titles: title,
      redirects: '1',
      origin: '*'
    })

  const res = await fetch(url)
  if (!res.ok) return null

  const data = await res.json()
  const pages = data?.query?.pages
  if (!pages) return null

  const page = Object.values(pages)[0]

  // ⭐ 关键：thumb 而不是 original
  return page?.thumbnail?.source || null
}
