import type { NextConfig } from "next";

// GitHub Pages serves plain static files with no Node.js server behind
// them — no image-optimization endpoint, no custom headers() at request
// time, no server-rendering on demand. `output: "export"` makes `next
// build` emit a fully static `out/` directory instead of relying on any of
// that, which is the only thing GitHub Pages can actually serve.
const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const repoName = "Elegencia-Web";

const basePath = isGithubPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // The `/_next/image` optimizer is a server route — it doesn't exist in
    // a static export, so images are served as-is instead.
    unoptimized: true,
  },
  // A GitHub Pages project site (not a custom domain or a `<user>.github.io`
  // repo) is served under /<repo-name>/, so every absolute path needs that
  // prefix. Scoped to CI only so local `next dev`/`next build` are unaffected.
  basePath: basePath || undefined,
  assetPrefix: isGithubPages ? `${basePath}/` : undefined,
  // next/image and next/link pick up `basePath` automatically, but plain
  // hardcoded `/products/...`-style src strings (used for the canvas-based
  // background-removal pipeline, which needs a real <img> to draw from, not
  // a Next-managed one) don't — this exposes the same value to that code via
  // `src/lib/basePath.ts` so those can prefix themselves manually.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
