addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { headers } = request
  const contentType = headers.get("content-type") || ""
  const url = new URL(request.url);

  if (request.method !== "POST") {
    return new Response(`Method ${request.method} not allowed.`, { status: 405 })
  }

  if (url.pathname.startsWith("/postPublished")) {
    const resp = await purgeURL(GHOST_URL)
    if (!resp.ok) {
      return new Response(resp.statusText, { status: resp.status })
    }

    console.log("Purged: " + GHOST_URL)
    return new Response("OK", { status: 200 })
  }

  if (url.pathname.startsWith("/postUpdated")) {
    if (!contentType.includes("application/json")) {
      return new Response("Bad Request", { status: 400 })
    }

    const json = await parseJsonBody(request)
    const postURL = GHOST_URL + json.post.current.slug + "/"

    const resp = await purgeURL(postURL)
    if (!resp.ok) {
      return new Response(resp.statusText, { status: resp.status })
    }

    console.log("Purged: " + postURL)
    return new Response("OK", { status: 200 })
  }

  return new Response("Bad Request", { status: 400 })
}

/**
 * Uses the Cloudflare API to purge a URL from the cache, can't use the Worker Cache API
 * because it only works per datacenter. Using the Cloudflare API ensures global purge.
 * 
 * @param {String} url Url to purge from the cache
 * @returns {Promise<Response>} response from Cloudflare API
 */
async function purgeURL(url) {
  const requestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${CF_API_TOKEN}`
    },
    body: `{"files":["${url}"]}`
  }
  return await fetch(`https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache`, requestInit)
}


async function parseJsonBody(request) {
  const body = JSON.stringify(await request.json())
  console.log(body)

  return JSON.parse(body)
}