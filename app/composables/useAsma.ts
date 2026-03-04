import { ref, computed } from "vue";
import names from "@/assets/data/names.json";

export const useAsma = () => {
  const selectedSort = ref("Number");

  const rawNames = ref(names);

  const sortedNames = computed(() => {
    const list = [...rawNames.value];

    switch (selectedSort.value) {
      case "Number":
        return list.sort((a, b) => a.id - b.id);

      case "Arabic":
        return list.sort((a, b) => a.arabic.localeCompare(b.arabic));

      case "English":
        return list.sort((a, b) => a.english.localeCompare(b.english));

      case "Favourites": {
        if (!process.client) return [];

        const saved = localStorage.getItem("quran:bookmarks:v1");
        if (!saved) return [];

        const bookmarks: string[] = JSON.parse(saved);

        return list.filter((n) => bookmarks.includes(`name:${n.id}`));
      }

      default:
        return list;
    }
  });

  const setSort = (sort: string) => {
    selectedSort.value = sort;
  };

  const search = (query: string) => {
    const q = query.toLowerCase();

    return sortedNames.value.filter(
      (n) =>
        n.arabic.includes(query) ||
        n.transliteration.toLowerCase().includes(q) ||
        n.english.toLowerCase().includes(q) ||
        n.urdu.includes(query),
    );
  };

  return {
    names: sortedNames,
    rawNames,
    search,
    setSort,
    selectedSort,
  };
};
