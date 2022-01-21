# ghost-cache-purge

[![Deploy to Cloudflare Workers](https://github.com/milgradesec/ghost-cache-purge-worker/actions/workflows/deploy.yml/badge.svg)](https://github.com/milgradesec/ghost-cache-purge-worker/actions/workflows/deploy.yml)

A Cloudflare Worker to purge cached pages when a post is published or updated on Ghost.

## 📙 Usage

### 🚀 Deploy Worker
<!-- [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/milgradesec/ghost-cache-purge) -->

Go to your Cloudflare account and create an API token with the `Zone.Cache Purge` permission.

Set the `CF_ZONE_ID` secret:

```shell
wrangler secret put CF_ZONE_ID
```

Set the `CF_API_TOKEN` secret:

```shell
wrangler secret put CF_API_TOKEN
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

| NAME        | EVENT                  | URL                                                       | LAST TRIGGERED |
| ----------- | ---------------------- | ----------------------------------------------------------| -------------- |
| Ping Worker | Post published         | <https://YOUR-WORKER-SUBDOMAIN.workers.dev/postPublished> | Not triggered  |
| Ping Worker | Published post updated | <https://YOUR-WORKER-SUBDOMAIN.workers.dev/postUpdated>   | Not triggered  |

## 📜 License

MIT License
