// Install-size follow-up (decisions R5/R8): the Wajibat data chunks (`wajibat-data-*`: a small core
// plus one chunk per category, see nuxt.config.ts and app/data/wajibat/runtime.ts) are deliberately
// excluded from the PWA's install-time precache and cached at runtime instead.
//
// This does NOT rely on the service worker passively intercepting a chunk's own fetch: verified in a
// real browser (Playwright) that Nuxt's SSR-injected <link rel="modulepreload"> is NOT caught by the
// SW's fetch event in Chromium, so that approach silently never cached anything. Instead every /fiqh
// page explicitly writes the chunks it has loaded into Cache Storage itself, and "Save all for
// offline" on the hub loads every category first and then does the same, so a reader who opens one
// category offline finds that category (and the core) there, and one who pressed the button finds all.
import { loadedChunkUrls } from "~/data/wajibat/runtime";

const CACHE_NAME = "wajibat-data-cache";
const MARKER = "/__wajibat-offline-saved__";
const NAME_RE = /\/(wajibat-data-[a-z]+)-[^/]+\.js$/;

/** Chunk files of this build that have been loaded in this tab. */
const currentUrls = (): string[] => {
  const fromRuntime = loadedChunkUrls().filter((u) => NAME_RE.test(u));
  if (fromRuntime.length || typeof performance === "undefined") return fromRuntime;
  return [...new Set(performance.getEntriesByType("resource").map((e) => e.name))].filter((u) => NAME_RE.test(u));
};

const markerRequest = () => new Request(new URL(MARKER, location.origin).href);

/** True only when every chunk of *this build* was saved by "Save all for offline" (a copy from an
 * earlier build does not count: the marker records the build id and the exact chunk URLs). */
export const isWajibatDataCached = async (buildId: string): Promise<boolean> => {
  if (typeof caches === "undefined") return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    const res = await cache.match(markerRequest());
    if (!res) return false;
    const saved = (await res.json()) as { buildId: string; urls: string[] };
    if (saved.buildId !== buildId || !saved.urls.length) return false;
    for (const url of saved.urls) if (!(await cache.match(url))) return false;
    return true;
  } catch {
    return false;
  }
};

/** Best-effort, idempotent: caches the chunks loaded so far, then drops older builds' copies of the
 * same chunks. A chunk's filename carries a content hash, so a corrected ruling ships under a new URL;
 * pruning keeps the old text from lingering. Chunks not loaded in this tab are left alone. */
export const ensureWajibatDataCached = async (): Promise<boolean> => {
  if (typeof caches === "undefined") return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    const urls = currentUrls();
    let ok = true;
    for (const url of urls) {
      if (await cache.match(url)) continue;
      const res = await fetch(url);
      if (res.ok) await cache.put(url, res.clone());
      else ok = false;
    }
    if (ok) {
      const nameOf = (u: string) => NAME_RE.exec(u)?.[1];
      const live = new Map(urls.map((u) => [nameOf(u), u]));
      for (const req of await cache.keys()) {
        const n = nameOf(req.url);
        if (n && live.has(n) && live.get(n) !== req.url) await cache.delete(req);
      }
    }
    return ok;
  } catch {
    return false;
  }
};

/** "Save all for offline": loads every category's chunk, caches them all, and records what was saved. */
export const saveAllWajibatOffline = async (loadAll: () => Promise<void>, buildId: string): Promise<boolean> => {
  try {
    await loadAll();
    if (!(await ensureWajibatDataCached())) return false;
    const cache = await caches.open(CACHE_NAME);
    await cache.put(markerRequest(), new Response(JSON.stringify({ buildId, urls: currentUrls() }), { headers: { "content-type": "application/json" } }));
    return true;
  } catch {
    return false;
  }
};
