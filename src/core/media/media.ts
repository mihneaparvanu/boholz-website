export function getMediaURL(path: string): string {
  const fromRuntime =
    typeof process !== "undefined" ? process.env.PUBLIC_ASSETS_URL : undefined;
  const baseUrl =
    fromRuntime || import.meta.env.PUBLIC_ASSETS_URL || "";
  const sanitizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}/${sanitizedPath}`;
}
