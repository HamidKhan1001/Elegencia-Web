// The site now serves from a custom domain's root (see public/CNAME and
// next.config.ts), so there's no basePath to prefix with — this resolves
// to an empty string everywhere. Left in place (rather than ripping out
// every withBasePath() call site) so a future move back under a GitHub
// Pages project subpath, or any other prefixed host, only needs a change
// here and in next.config.ts.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
