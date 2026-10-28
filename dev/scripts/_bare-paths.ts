/**
 * Side-effect import that must come first in every export script.
 *
 * Generated domain files store the bare `/images/...` path and wrap it in
 * `getMediaURL()`, so the CDN host is resolved at module load rather than
 * baked into the file. But the loaders resolve paths themselves, through
 * `resolveMediaPaths()`, using `PUBLIC_ASSETS_URL`. With that variable in
 * scope — and a local `.env` is enough — the path arrives already absolute and
 * ends up resolved twice.
 *
 * `getMediaURL()` reads the variable at call time, so clearing it here makes
 * the loader's resolution an identity function. In Bun `import.meta.env` is
 * backed by `process.env`, so one delete covers both.
 *
 * `exportEntity` throws if any path is not bare, which is the backstop.
 */
delete process.env.PUBLIC_ASSETS_URL;
