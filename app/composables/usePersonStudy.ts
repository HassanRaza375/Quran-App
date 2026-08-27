// Persisted "resume study" state for the Prophets & Qur'anic Persons feature —
// prophets-quran-feature.md §17. Follows the same useState+$storage shape as
// every other stateful composable in this app (see MODULE_BLUEPRINT.md's
// cross-module conventions checklist).
import {
  clearStudyState,
  getStudyState,
  updatePassageView,
  updateReference,
  updateSection,
  type PassageView,
  type PersonStudyRecord,
  type SectionId,
} from "~/utils/personStudy";

const STORAGE_KEY = "quran:persons-study:v1";

export const usePersonStudy = () => {
  const record = useState<PersonStudyRecord>("persons-study", () => ({}));

  const getStorage = () => useNuxtApp().$storage;

  const load = () => {
    if (!import.meta.client) return;
    record.value = getStorage()?.get(STORAGE_KEY, {}) ?? {};
  };

  const persist = () => {
    if (!import.meta.client) return;
    getStorage()?.set(STORAGE_KEY, record.value);
  };

  const getFor = (personId: string) => getStudyState(record.value, personId);

  const recordSection = (personId: string, section: SectionId) => {
    record.value = updateSection(record.value, personId, section, Date.now());
    persist();
  };

  const recordPassageView = (personId: string, view: PassageView) => {
    record.value = updatePassageView(record.value, personId, view, Date.now());
    persist();
  };

  const recordReference = (personId: string, surahNo: number, ayahNo: number) => {
    record.value = updateReference(record.value, personId, surahNo, ayahNo, Date.now());
    persist();
  };

  const clearFor = (personId: string) => {
    record.value = clearStudyState(record.value, personId);
    persist();
  };

  return { record, load, getFor, recordSection, recordPassageView, recordReference, clearFor };
};
