export default async function searchWikipedia(title) {
  const searchUrl =
    'https://zh.wikipedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      format: 'json',
      prop: 'pageimages',
      piprop: 'original',
      titles: title,
      redirects: '1',
      origin: '*'
    })

  const res = await fetch(searchUrl)
  if (!res.ok) return null

  const data = await res.json()
  const pages = data?.query?.pages
  if (!pages) return null

  const page = Object.values(pages)[0]
  return page?.original?.source || null
}
