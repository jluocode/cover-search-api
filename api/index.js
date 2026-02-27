module.exports = (req, res) => {
  const { title } = req.query || {}

  res.status(200).json({
    ok: true,
    title: title || null
  })
}
