import type { NextConfig } from "next";

// GitHub Pages serves plain static files with no Node.js server behind
// them — no image-optimization endpoint, no custom headers() at request
// time, no server-rendering on demand. `output: "export"` makes `next
// build` emit a fully static `out/` directory instead of relying on any of
// that, which is the only thing GitHub Pages can actually serve.
//
// No basePath/assetPrefix here: that was only needed while this served
// from a GitHub Pages *project* URL (hamidkhan1001.github.io/Elegencia-Web/),
// which puts the site under a /<repo-name>/ subpath. A custom domain
// (see public/CNAME) serves from the domain's own root, exactly like local
// dev, so every path resolves correctly with no prefix at all.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    // The `/_next/image` optimizer is a server route — it doesn't exist in
    // a static export, so images are served as-is instead.
    unoptimized: true,
  },
};

export default nextConfig;
