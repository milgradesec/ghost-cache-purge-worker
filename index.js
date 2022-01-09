addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { headers } = request
  const contentType = headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    const body = JSON.stringify(await request.json())
    const obj = JSON.parse(body)

    const postURL = "https://blog.paesa.es/" + obj.post.current.slug + "/"
    console.log(postURL)
  }

  return new Response("OK", {
    status: 200,
    headers: {
      'Cache-Control': 'no-store'
    }
  })
}