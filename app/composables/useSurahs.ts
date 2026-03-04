import { ref, computed } from "vue";
import { SurahsService } from "~/services/surahs.service";
import surahsJson from "../assets/data/surah.json";

export const useSurahs = () => {
  const selectedSort = ref("");

  const surahs = ref(surahsJson);
  const rawSurahs = ref(surahsJson);
  const sortedSurahs = computed(() => {
    const list = [...surahs.value];

    switch (selectedSort.value) {
      case "Surah No":
        return list.sort((a, b) => a.surahNo - b.surahNo);

      case "Name":
        return list.sort((a, b) => a.surahName.localeCompare(b.surahName));

      case "Revelation Place":
        return list.sort((a, b) =>
          a.revelationPlace.localeCompare(b.revelationPlace),
        );

      case "Favourites": {
        const saved = localStorage.getItem("quran:bookmarks:v1");

        if (!saved) return [];

        const bookmarks = JSON.parse(saved); // ["surah:110"]

        return list.filter((s) => bookmarks.includes(`surah:${s.surahNo}`));
      }

      case "Acending":
        return list.sort((a, b) => a.totalAyah - b.totalAyah);

      case "Descending":
        return list.sort((a, b) => b.totalAyah - a.totalAyah);

      default:
        return list;
    }
  });

  const setSort = (sort) => {
    selectedSort.value = sort;
  };

  const search = (query) => {
    const q = query.toLowerCase();

    return sortedSurahs.value.filter(
      (s) =>
        s.surahName.toLowerCase().includes(q) ||
        s.surahNameTranslation.toLowerCase().includes(q) ||
        s.surahNameArabicLong.includes(query) ||
        s.revelationPlace.toLowerCase().includes(q),
    );
  };

  return {
    surahs: sortedSurahs,
    rawSurahs,
    search,
    setSort,
    selectedSort,
  };
};
