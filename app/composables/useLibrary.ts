export interface LibraryCollection {
  id: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface LibraryItemMeta {
  note: string;
  tags: string[];
  collectionIds: string[];
  updatedAt: number;
}

const STORAGE_KEY = "quran:library:v1";

const emptyMeta = (): LibraryItemMeta => ({ note: "", tags: [], collectionIds: [], updatedAt: 0 });

/**
 * Upgrades bookmarks (a flat set of stable keys, see useBookmarks) into a
 * personal study library: collections/folders, per-item notes and tags.
 * Keyed by the *same* bookmark key strings so this is purely an additive
 * metadata layer — deleting a bookmark elsewhere doesn't automatically
 * clean this up, callers should call `removeItemMeta` alongside it.
 */
export const useLibrary = () => {
  const collections = useState<LibraryCollection[]>("library-collections", () => []);
  const itemMeta = useState<Record<string, LibraryItemMeta>>("library-item-meta", () => ({}));

  const getStorage = () => useNuxtApp().$storage;

  const load = () => {
    if (!import.meta.client) return;
    const $storage = getStorage();
    if (!$storage) return;
    const saved = $storage.get(STORAGE_KEY, null);
    collections.value = saved?.collections ?? [];
    itemMeta.value = saved?.itemMeta ?? {};
  };

  const persist = () => {
    if (!import.meta.client) return;
    const $storage = getStorage();
    if (!$storage) return;
    $storage.set(STORAGE_KEY, { collections: collections.value, itemMeta: itemMeta.value });
  };

  const getMeta = (key: string): LibraryItemMeta => itemMeta.value[key] ?? emptyMeta();

  const setNote = (key: string, note: string) => {
    itemMeta.value = { ...itemMeta.value, [key]: { ...getMeta(key), note, updatedAt: Date.now() } };
    persist();
  };

  const setTags = (key: string, tags: string[]) => {
    const clean = tags.map((t) => t.trim()).filter(Boolean);
    itemMeta.value = { ...itemMeta.value, [key]: { ...getMeta(key), tags: clean, updatedAt: Date.now() } };
    persist();
  };

  const toggleCollectionForItem = (key: string, collectionId: string) => {
    const meta = getMeta(key);
    const collectionIds = meta.collectionIds.includes(collectionId)
      ? meta.collectionIds.filter((id) => id !== collectionId)
      : [...meta.collectionIds, collectionId];
    itemMeta.value = { ...itemMeta.value, [key]: { ...meta, collectionIds, updatedAt: Date.now() } };
    persist();
  };

  const removeItemMeta = (key: string) => {
    if (!(key in itemMeta.value)) return;
    const { [key]: _removed, ...rest } = itemMeta.value;
    itemMeta.value = rest;
    persist();
  };

  const createCollection = (name: string, description = "") => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const collection: LibraryCollection = {
      id: crypto.randomUUID(),
      name: trimmed,
      description,
      createdAt: Date.now(),
    };
    collections.value = [...collections.value, collection];
    persist();
    return collection;
  };

  const deleteCollection = (id: string) => {
    collections.value = collections.value.filter((c) => c.id !== id);
    const updated: Record<string, LibraryItemMeta> = {};
    for (const [key, meta] of Object.entries(itemMeta.value)) {
      updated[key] = { ...meta, collectionIds: meta.collectionIds.filter((cid) => cid !== id) };
    }
    itemMeta.value = updated;
    persist();
  };

  return {
    collections,
    itemMeta,
    load,
    getMeta,
    setNote,
    setTags,
    toggleCollectionForItem,
    removeItemMeta,
    createCollection,
    deleteCollection,
  };
};
