/** @type {import('next').NextConfig} */

// Set by the GitHub Actions workflow (.github/workflows/deploy.yml) to
// "/<repo-name>" for a project page (https://<user>.github.io/<repo-name>/).
// Leave empty for local dev, or if you deploy to a "<user>.github.io" user
// page, which is served from the root and needs no base path.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  // Static export: no Node server needed at runtime, so this can be hosted
  // on GitHub Pages (or any static host) as plain files. Everything in this
  // app is client-rendered against localStorage, so nothing is lost by
  // exporting — there's no server-only code to leave behind.
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
