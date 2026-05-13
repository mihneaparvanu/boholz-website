// Empty stub for the `geojson` package.
// vue-maplibre-gl ships a bundled MapboxDraw control that has a bare
// `import "geojson"` statement — a types-only import that was never stripped
// from its dist. The `geojson` npm package has no runtime code we need, so we
// alias it here to this empty module so Vite has something to resolve.
export default {};
