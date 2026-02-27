import cheerio from 'cheerio'

export default async function searchBaiduBaike(title) {
  const url =
    'https://baike.baidu.com/item/' +
    encodeURIComponent(title)

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; CoverSearch/1.0)',
      'Accept-Language': 'zh-CN,zh;q=0.9'
    }
  })

  if (!res.ok) return null

  const html = await res.text()
  const $ = cheerio.load(html)

  // 百度百科封面通常在 summary-pic 或 lemma-summary
  const img =
    $('.summary-pic img').attr('src') ||
    $('.lemma-summary img').attr('src')

  if (!img) return null

  // 处理 // 开头的 URL
  if (img.startsWith('//')) {
    return 'https:' + img
  }

  return img
}
