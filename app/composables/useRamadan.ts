export type FastingStatus = "fasted" | "missed" | "planned";

interface RamadanState {
  startOverride: string | null; // "YYYY-MM-DD" local date the user says Ramadan actually started
  fastingLog: Record<string, FastingStatus>;
}

const STORAGE_KEY = "quran:ramadan:v1";

// Local-calendar-day keys, matching the convention already used by
// useReadingGoals (`toISOString()` shifts the date for any timezone ahead
// of UTC, which broke "today" for this app's audience once before — see
// PROJECT_PLAN.md Pass 6/12 for the prior bugs this avoids repeating).
const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const todayKey = () => toDateKey(new Date());

const parseDateKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const addDays = (key: string, days: number) => {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
};

const daysBetween = (fromKey: string, toKey: string) =>
  Math.round((parseDateKey(toKey).getTime() - parseDateKey(fromKey).getTime()) / 86400000);

const formatDay = (key: string) =>
  parseDateKey(key).toLocaleDateString(undefined, { weekday: "short", day: "numeric" });

export const useRamadan = () => {
  const startOverride = useState<string | null>("ramadan-start-override", () => null);
  const fastingLog = useState<Record<string, FastingStatus>>("ramadan-fasting-log", () => ({}));

  const getStorage = () => useNuxtApp().$storage;

  const load = () => {
    if (!import.meta.client) return;
    const $storage = getStorage();
    if (!$storage) return;
    const saved: RamadanState | null = $storage.get(STORAGE_KEY, null);
    startOverride.value = saved?.startOverride ?? null;
    fastingLog.value = saved?.fastingLog ?? {};
  };

  const persist = () => {
    if (!import.meta.client) return;
    const $storage = getStorage();
    if (!$storage) return;
    $storage.set(STORAGE_KEY, { startOverride: startOverride.value, fastingLog: fastingLog.value });
  };

  const setStartOverride = (dateKey: string | null) => {
    startOverride.value = dateKey;
    persist();
  };

  const prayer = usePrayerStore();

  // An override is treated as active for a 30-day window (the longer of the
  // two possible lunar-month lengths) so it doesn't silently expire a day
  // early on a 30-day Ramadan.
  const isOverrideActive = computed(() => {
    if (!startOverride.value) return false;
    const diff = daysBetween(startOverride.value, todayKey());
    return diff >= 0 && diff < 30;
  });

  const isRamadanActive = computed(() => isOverrideActive.value || !!prayer.isRamadan);

  const ramadanDay = computed<number | null>(() => {
    if (isOverrideActive.value) return daysBetween(startOverride.value as string, todayKey()) + 1;
    return prayer.ramadanDay ?? null;
  });

  // Best-effort target date for a Khatmah goal — the real month length (29
  // vs 30 days) isn't knowable in advance, so this assumes 30 and is labeled
  // "estimated" everywhere it's shown.
  const estimatedEndDateKey = computed<string | null>(() => {
    if (isOverrideActive.value) return addDays(startOverride.value as string, 29);
    if (prayer.ramadanDay) return addDays(todayKey(), 30 - prayer.ramadanDay);
    return null;
  });

  const getFastingStatus = (dateKey: string): FastingStatus | null => fastingLog.value[dateKey] ?? null;

  const setFastingStatus = (dateKey: string, status: FastingStatus | null) => {
    const next = { ...fastingLog.value };
    if (status) next[dateKey] = status;
    else delete next[dateKey];
    fastingLog.value = next;
    persist();
  };

  /** Cycles a day's status: unset -> fasted -> missed -> unset. */
  const cycleFastingStatus = (dateKey: string) => {
    const current = getFastingStatus(dateKey);
    const next: FastingStatus | null = current === "fasted" ? "missed" : current === "missed" ? null : "fasted";
    setFastingStatus(dateKey, next);
  };

  const fastingStats = computed(() => {
    const values = Object.values(fastingLog.value);
    return {
      fasted: values.filter((v) => v === "fasted").length,
      missed: values.filter((v) => v === "missed").length,
      planned: values.filter((v) => v === "planned").length,
    };
  });

  const fastingStreak = computed(() => {
    let count = 0;
    let cursor = todayKey();
    if (fastingLog.value[cursor] !== "fasted") cursor = addDays(cursor, -1);
    while (fastingLog.value[cursor] === "fasted") {
      count++;
      cursor = addDays(cursor, -1);
    }
    return count;
  });

  const recentDays = computed(() =>
    Array.from({ length: 7 }, (_, i) => addDays(todayKey(), i - 6))
  );

  /** Creates a Ramadan Khatmah as a plain finish-by-date reading goal, targeting the estimated end of Ramadan. */
  const createRamadanKhatmah = async () => {
    if (!estimatedEndDateKey.value) return null;
    const { createGoal } = useReadingGoals();
    const { progress } = useReadingProgress();
    return createGoal({
      type: "finish-by-date",
      targetDate: estimatedEndDateKey.value,
      label: RAMADAN_GOAL_LABEL,
      currentSurahNo: progress.value?.surahNo,
      currentAyahNo: progress.value?.ayahNo,
    });
  };

  return {
    startOverride,
    fastingLog,
    load,
    setStartOverride,
    isRamadanActive,
    isOverrideActive,
    ramadanDay,
    estimatedEndDateKey,
    getFastingStatus,
    setFastingStatus,
    cycleFastingStatus,
    fastingStats,
    fastingStreak,
    recentDays,
    createRamadanKhatmah,
    todayKey,
    addDays,
    formatDay,
  };
};
