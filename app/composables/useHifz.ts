export type HifzStatus = "learning" | "memorized";

export interface HifzPlan {
  id: string;
  title: string;
  surahNo: number;
  startAyah: number;
  endAyah: number;
  status: HifzStatus;
  planStatus: "active" | "paused";
  interval: number; // days until next review
  ease: number; // SM-2-lite ease factor
  nextReviewAt: string; // local date key, "YYYY-MM-DD"
  lastReviewedAt: string | null;
  reviewCount: number;
  mistakeNotes: string;
  createdAt: number;
}

const STORAGE_KEY = "quran:hifz:v1";
const MEMORIZED_INTERVAL_THRESHOLD = 21; // days — matches a typical "graduated" SRS interval

// Local-calendar-day keys — same convention as useReadingGoals/useRamadan,
// avoiding the UTC-shift bug fixed in Pass 6/12.
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

export const useHifz = () => {
  const plans = useState<HifzPlan[]>("hifz-plans", () => []);

  const getStorage = () => useNuxtApp().$storage;

  const load = () => {
    if (!import.meta.client) return;
    const $storage = getStorage();
    if (!$storage) return;
    plans.value = $storage.get(STORAGE_KEY, []) ?? [];
  };

  const persist = () => {
    if (!import.meta.client) return;
    getStorage()?.set(STORAGE_KEY, plans.value);
  };

  const createPlan = (opts: { surahNo: number; startAyah: number; endAyah: number; title?: string }) => {
    const plan: HifzPlan = {
      id: crypto.randomUUID(),
      title: opts.title?.trim() || `Surah ${opts.surahNo}: ${opts.startAyah}-${opts.endAyah}`,
      surahNo: opts.surahNo,
      startAyah: opts.startAyah,
      endAyah: opts.endAyah,
      status: "learning",
      planStatus: "active",
      interval: 1,
      ease: 2.0,
      nextReviewAt: todayKey(),
      lastReviewedAt: null,
      reviewCount: 0,
      mistakeNotes: "",
      createdAt: Date.now(),
    };
    plans.value = [...plans.value, plan];
    persist();
    return plan;
  };

  const updatePlan = (id: string, patch: Partial<HifzPlan>) => {
    plans.value = plans.value.map((p) => (p.id === id ? { ...p, ...patch } : p));
    persist();
  };

  const deletePlan = (id: string) => {
    plans.value = plans.value.filter((p) => p.id !== id);
    persist();
  };

  const setPlanStatus = (id: string, planStatus: "active" | "paused") => updatePlan(id, { planStatus });

  const setMistakeNotes = (id: string, notes: string) => updatePlan(id, { mistakeNotes: notes });

  const markMemorized = (id: string) =>
    updatePlan(id, { status: "memorized", interval: Math.max(MEMORIZED_INTERVAL_THRESHOLD, 21) });

  /** Puts an item back into active learning from scratch — the explicit "needs review" reset. */
  const resetToLearning = (id: string) =>
    updatePlan(id, { status: "learning", interval: 1, ease: 2.0, nextReviewAt: todayKey() });

  /**
   * SM-2-lite grading. "again" always drops back to a 1-day interval (and
   * lowers ease, capped so a rough patch doesn't spiral); "good"/"easy" grow
   * the interval, graduating to `memorized` once it crosses the threshold.
   */
  const reviewPlan = (id: string, grade: "again" | "good" | "easy") => {
    const plan = plans.value.find((p) => p.id === id);
    if (!plan) return;

    let interval = plan.interval;
    let ease = plan.ease;

    if (grade === "again") {
      interval = 1;
      ease = Math.max(1.3, ease - 0.2);
    } else if (grade === "good") {
      interval = Math.max(1, Math.round(interval * ease));
      ease = ease;
    } else {
      interval = Math.max(1, Math.round(interval * ease * 1.3));
      ease = Math.min(2.8, ease + 0.1);
    }
    interval = Math.min(interval, 180); // cap so a well-known range doesn't vanish for months

    updatePlan(id, {
      interval,
      ease,
      nextReviewAt: addDays(todayKey(), interval),
      lastReviewedAt: todayKey(),
      reviewCount: plan.reviewCount + 1,
      status: interval >= MEMORIZED_INTERVAL_THRESHOLD ? "memorized" : "learning",
    });
  };

  const activePlans = computed(() => plans.value.filter((p) => p.planStatus === "active"));

  const dueQueue = computed(() =>
    activePlans.value
      .filter((p) => p.nextReviewAt <= todayKey())
      .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt))
  );

  const nextUpcoming = computed(() =>
    activePlans.value
      .filter((p) => p.nextReviewAt > todayKey())
      .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt))[0] ?? null
  );

  const overdueDays = (plan: HifzPlan) => Math.max(0, daysBetween(plan.nextReviewAt, todayKey()));

  const stats = computed(() => ({
    total: plans.value.length,
    memorized: plans.value.filter((p) => p.status === "memorized").length,
    dueToday: dueQueue.value.length,
  }));

  return {
    plans,
    activePlans,
    dueQueue,
    nextUpcoming,
    stats,
    load,
    createPlan,
    updatePlan,
    deletePlan,
    setPlanStatus,
    setMistakeNotes,
    markMemorized,
    resetToLearning,
    reviewPlan,
    overdueDays,
    todayKey,
  };
};
