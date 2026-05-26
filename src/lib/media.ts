/**
 * Resolve a stored `media.path` (e.g. "/images/showhouses/.../hero.webp")
 * to its public URL on R2 (or whatever PUBLIC_ASSETS_URL points at).
 *
 * Reads `process.env` first (Node SSR runtime) so the host's `.env` —
 * loaded via `--env-file` at container start — always wins. This matters
 * because Astro/Vite statically inline `import.meta.env.PUBLIC_*` at
 * BUILD time, and CI builds the image without PUBLIC_ASSETS_URL in scope.
 * Falling back to `import.meta.env` keeps `bun run dev` working (no
 * `process.env` injection in the Vite client transform).
 */
export function getMediaURL(path: string): string {
  const fromRuntime =
    typeof process !== "undefined" ? process.env.PUBLIC_ASSETS_URL : undefined;
  const baseUrl =
    fromRuntime || import.meta.env.PUBLIC_ASSETS_URL || "";
  const sanitizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}/${sanitizedPath}`;
}
