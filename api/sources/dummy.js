export default function dummyCover(title) {
  return (
    'https://dummyimage.com/300x450/ccc/000&text=' +
    encodeURIComponent(title)
  )
}
