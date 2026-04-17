export function getMediaURL(path: string): string {
  const baseUrl = import.meta.env.PUBLIC_ASSETS_URL || "";
  const sanitizedPath = path.startsWith("/") ? path.slice(1) : path;

  return `${baseUrl}/${sanitizedPath}`;
}
