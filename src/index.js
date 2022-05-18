export default {
  async fetch(request, env) {
    return handleRequest(request, env)
  },
};

async function handleRequest(request, env) {
  const { headers } = request
  const contentType = headers.get("content-type") || ""
  const url = new URL(request.url);

  if (request.method !== "POST") {
    return new Response(`Method ${request.method} not allowed.`, { status: 405 })
  }

  if (!url.pathname.startsWith("/" + env.SECRET_TOKEN)) {
    return new Response(`Invalid Webhook Token.`, { status: 401 })
  }

  if (url.pathname.endsWith("/postPublished")) {
    const resp = await purgeURL(env.GHOST_URL, env)
    if (!resp.ok) {
      return new Response(resp.statusText, { status: resp.status })
    }

    console.log(`🧹 Purged: ${env.GHOST_URL}`)
    return new Response("OK", { status: 200 })
  }

  if (url.pathname.endsWith("/postUpdated")) {
    if (!contentType.includes("application/json")) {
      return new Response("Bad Request", { status: 400 })
    }

    const body = await parseWebhookBody(request)
    const postURL = env.GHOST_URL + body.post.current.slug + "/"

    const resp = await purgeURL(postURL, env)
    if (!resp.ok) {
      return new Response(resp.statusText, { status: resp.status })
    }

    console.log(`🧹 Purged: ${postURL}`)
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
async function purgeURL(url, env) {
  const requestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.CF_API_TOKEN}`
    },
    body: `{"files":["${url}"]}`
  }
  return await fetch(`https://api.cloudflare.com/client/v4/zones/${env.CF_ZONE_ID}/purge_cache`, requestInit)
}


async function parseWebhookBody(request) {
  const body = JSON.stringify(await request.json())

  return JSON.parse(body)
}
