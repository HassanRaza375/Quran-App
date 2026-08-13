export default defineNuxtPlugin(() => {
  // Ask the browser not to evict this origin's cache/IndexedDB under
  // storage pressure without the user explicitly clearing site data —
  // otherwise a browser low on disk space can silently wipe the offline
  // Quran text/audio cache with no warning. Best-effort: not supported
  // everywhere, and the browser can still decline.
  if ("storage" in navigator && "persist" in navigator.storage) {
    navigator.storage.persist().catch(() => {})
  }

  const storage = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
      } catch {
        return fallback
      }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value))
    },
    remove(key) {
      localStorage.removeItem(key)
    },
  }

  return { provide: { storage } }
})
