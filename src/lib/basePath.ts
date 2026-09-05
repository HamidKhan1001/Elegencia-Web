// next/image and next/link auto-prefix their `src`/`href` with `basePath`
// (see next.config.ts) — but a handful of places load images through a
// plain `new Image()` / raw <img> instead (the canvas-based background-
// removal pipeline needs a real element to draw from, not a Next-managed
// one), and those need to prefix themselves manually. Empty string locally
// and on any host serving from the domain root; `/Elegencia-Web` only in
// the GitHub Pages build.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
