/**
 * Serves /m/* from the boholz-media R2 bucket (EU jurisdiction).
 *
 * The route is evaluated at Cloudflare's edge before anything is forwarded
 * through the tunnel, so nginx on sn-c1 never sees these requests.
 *
 * Two lines are load-bearing:
 *   writeHttpMetadata  — copies the content type off the R2 object. Without it
 *                        every response is application/octet-stream and the
 *                        browser downloads instead of rendering.
 *   ctx.waitUntil(cache.put(...))
 *                      — a Response built inside a Worker is NOT put in the
 *                        edge cache on its own, so without this every visitor
 *                        costs an R2 read.
 */
export default {
  async fetch(request, env, ctx): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.replace(/^\/m\//, ""));
    if (!key) return new Response("Bad Request", { status: 400 });

    const cache = caches.default;
    const hit = await cache.match(request);
    if (hit) return hit;

    const object = await env.BUCKET.get(key);
    if (!object) return new Response("Not Found", { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    const response = new Response(object.body, { headers });
    ctx.waitUntil(cache.put(request, response.clone()));
    return response;
  },
} satisfies ExportedHandler<{ BUCKET: R2Bucket }>;
