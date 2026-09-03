/**
 * Mirrors next.config.js's basePath so client code (service worker
 * registration, the manifest link) can prefix URLs the same way. Must be
 * NEXT_PUBLIC_-prefixed to be inlined into the client bundle at build time.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
