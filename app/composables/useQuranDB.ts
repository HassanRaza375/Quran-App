import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "quran-app-db";
const DB_VERSION = 1;
const CHAPTERS_STORE = "chapters";
const TAFSIRS_STORE = "tafsirs";

let dbPromise: Promise<IDBPDatabase> | null = null;

// Quran/tafsir text is immutable once published, so this is a genuine
// "fetch once, read forever" cache rather than something needing
// invalidation logic — one object store per data type, keyed by id.
function getDB() {
  if (!import.meta.client) return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(CHAPTERS_STORE)) {
          db.createObjectStore(CHAPTERS_STORE);
        }
        if (!db.objectStoreNames.contains(TAFSIRS_STORE)) {
          db.createObjectStore(TAFSIRS_STORE);
        }
      },
    });
  }
  return dbPromise;
}

export const useQuranDB = () => {
  // Every call is wrapped defensively — IndexedDB can be unavailable
  // (private browsing in some browsers, storage disabled by policy) and
  // this cache must never be load-bearing: callers always have the network
  // as a fallback, so a failure here should just mean "no cache hit."
  const getChapter = async (surahNo: number): Promise<any | null> => {
    const db = getDB();
    if (!db) return null;
    try {
      return (await (await db).get(CHAPTERS_STORE, surahNo)) ?? null;
    } catch {
      return null;
    }
  };

  const setChapter = async (surahNo: number, data: any) => {
    const db = getDB();
    if (!db) return;
    try {
      await (await db).put(CHAPTERS_STORE, data, surahNo);
    } catch {
      // best-effort; ignore (e.g. quota exceeded)
    }
  };

  const getTafsir = async (key: string): Promise<any | null> => {
    const db = getDB();
    if (!db) return null;
    try {
      return (await (await db).get(TAFSIRS_STORE, key)) ?? null;
    } catch {
      return null;
    }
  };

  const setTafsir = async (key: string, data: any) => {
    const db = getDB();
    if (!db) return;
    try {
      await (await db).put(TAFSIRS_STORE, data, key);
    } catch {
      // best-effort; ignore
    }
  };

  const deleteChapter = async (surahNo: number) => {
    const db = getDB();
    if (!db) return;
    try {
      await (await db).delete(CHAPTERS_STORE, surahNo);
    } catch {
      // best-effort; ignore
    }
  };

  const deleteTafsirsForSurah = async (surahNo: number, totalAyah: number) => {
    const db = getDB();
    if (!db) return;
    try {
      const conn = await db;
      const tx = conn.transaction(TAFSIRS_STORE, "readwrite");
      for (let ayah = 1; ayah <= totalAyah; ayah++) {
        tx.store.delete(`${surahNo}_${ayah}`);
      }
      await tx.done;
    } catch {
      // best-effort; ignore
    }
  };

  return {
    getChapter,
    setChapter,
    getTafsir,
    setTafsir,
    deleteChapter,
    deleteTafsirsForSurah,
  };
};
