export default async function handler(req, res) {
  const { title } = req.query

  if (!title) {
    return res.status(400).json({ error: "title is required" })
  }

  // MVP：先 mock，下一步再接搜索
  res.status(200).json({
    title,
    cover: `https://dummyimage.com/300x450/ccc/000&text=${encodeURIComponent(title)}`
  })
}export default async function handler(req, res) {
  const { title } = req.query

  if (!title) {
    return res.status(400).json({ error: "title is required" })
  }

  // MVP：先 mock，下一步再接搜索
  res.status(200).json({
    title,
    cover: `https://dummyimage.com/300x450/ccc/000&text=${encodeURIComponent(title)}`
  })
}Xexport default function handler(req, res) {
  const { title, year } = req.query;

  res.status(200).json({
    source: "mock",
    title,
    year,
    image: "https://via.placeholder.com/300x450?text=Movie+Poster"
  });
}
