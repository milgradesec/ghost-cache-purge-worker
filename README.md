# ghost-cache-purge

[![Deploy to Cloudflare Workers](https://github.com/milgradesec/ghost-cache-purge-worker/actions/workflows/deploy.yml/badge.svg)](https://github.com/milgradesec/ghost-cache-purge-worker/actions/workflows/deploy.yml)

A Cloudflare Worker to purge cached pages when a post is published or updated on Ghost.

## ❓ Why

With this worker you can run your Ghost blog with a `Cache Everything` Page Rule on Cloudflare and serve all content (including HTML pages) from Cloudflare's cache.
When a post is published or updated a webhook will trigger this worker to purge that page from the cache.

## 📙 Usage

### 🚀 Deploy Worker

Go to your Cloudflare account and create an API token with the `Zone.Cache Purge` permission.

Set the `CF_ZONE_ID` secret:

```shell
wrangler secret put CF_ZONE_ID
```

Set the `CF_API_TOKEN` secret:

```shell
wrangler secret put CF_API_TOKEN
```

Set a `SECRET_TOKEN` for the webhook URL:

```shell
wrangler secret put SECRET_TOKEN
```

Set the `GHOST_URL` environment variable at `wrangler.toml`:

```toml
[vars]
GHOST_URL = "https://YOUR-BLOG-DOMAIN/"
```

Publish to Cloudflare:

```shell
wrangler publish
```

### 🪝 Set up Ghost integration

Go to Ghost admin Settings-->Integrations and create a new custom integration named `Cloudflare Cache Purge`.

Now add webhooks for events:

| NAME        | EVENT                  | URL                                                                    | LAST TRIGGERED |
| ----------- | ---------------------- | ---------------------------------------------------------------------- | -------------- |
| Ping Worker | Post published         | <https://YOUR-WORKER-SUBDOMAIN.workers.dev/SECRET_TOKEN/postPublished> | Not triggered  |
| Ping Worker | Published post updated | <https://YOUR-WORKER-SUBDOMAIN.workers.dev/SECRET_TOKEN/postUpdated>   | Not triggered  |

<!-- ### ⚙️ Configure Ghost caching -->

## 📜 License

MIT License
