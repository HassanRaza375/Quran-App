// Install-size follow-up (decisions R5/R8): the Wajibat ruling/procedure
// text (`wajibat-data` chunk, see nuxt.config.ts) is deliberately excluded
// from the PWA's install-time precache, and cached at runtime instead.
//
// This does NOT rely on the service worker passively intercepting the
// chunk's own fetch — verified in a real browser (Playwright) that Nuxt's
// SSR-injected <link rel="modulepreload"> for this chunk is NOT caught by
// the SW's fetch event in Chromium, so that passive approach silently never
// cached anything. Instead, any /fiqh page that loads this module (every one
// does, via useWajibat()) explicitly writes it into Cache Storage itself,
// the same way regardless of how the browser originally fetched it.
const CACHE_NAME = "wajibat-data-cache";
const CHUNK_RE = /\/wajibat-data-.*\.js$/;

const findChunkUrls = (): string[] => {
  if (typeof document === "undefined" || typeof performance === "undefined") return [];
  const fromPerf = performance.getEntriesByType("resource").map((e) => e.name);
  const fromScripts = Array.from(document.scripts).map((s) => s.src);
  return [...new Set([...fromPerf, ...fromScripts])].filter((u) => CHUNK_RE.test(u));
};

/** True only when *this build's* chunk is cached — a copy from an earlier build (stale ruling
 * text, different content hash) doesn't count. */
export const isWajibatDataCached = async (): Promise<boolean> => {
  if (typeof caches === "undefined") return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    const urls = findChunkUrls();
    if (!urls.length) return (await cache.keys()).length > 0;
    for (const url of urls) if (!(await cache.match(url))) return false;
    return true;
  } catch {
    return false;
  }
};

/** Best-effort, idempotent: fetches and caches the chunk if it isn't already, then drops copies
 * left by earlier builds. The chunk's filename carries a content hash (nuxt.config.ts), so a
 * corrected ruling ships under a new URL; pruning keeps the old text from lingering in storage. */
export const ensureWajibatDataCached = async (): Promise<boolean> => {
  if (typeof caches === "undefined") return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    const urls = findChunkUrls();
    if (!urls.length) return (await cache.keys()).length > 0;
    let ok = true;
    for (const url of urls) {
      if (await cache.match(url)) continue;
      const res = await fetch(url);
      if (res.ok) await cache.put(url, res.clone());
      else ok = false;
    }
    if (ok) {
      const current = new Set(urls);
      for (const req of await cache.keys()) if (!current.has(req.url)) await cache.delete(req);
    }
    return ok;
  } catch {
    return false;
  }
};
