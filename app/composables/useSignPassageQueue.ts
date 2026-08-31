// Sequential "play this passage" queue for Signs & Miracles (Phase 8).
// Same rationale as useEventPassageQueue (Phase 7): a small parallel
// composable on the same shared global player, not a second audio system.
import { surahLabel } from "~/composables/usePersons";

export const useSignPassageQueue = () => {
  const { play, pause, playing, currentUrl, endedAt, nowPlaying } = useAudioPlayer();
  const { getVerse } = useVerse();

  const queue = useState("signs-passage-queue", () => []);
  const queueIndex = useState("signs-passage-queue-index", () => -1);
  const queueLabel = useState("signs-passage-queue-label", () => "");

  const isQueueActive = computed(() => queueIndex.value >= 0 && queueIndex.value < queue.value.length);
  const isQueuePlaying = computed(() => isQueueActive.value && playing.value);

  const stopQueue = () => {
    queue.value = [];
    queueIndex.value = -1;
  };

  const playQueueItem = async (i) => {
    const item = queue.value[i];
    if (!item) {
      stopQueue();
      return;
    }
    queueIndex.value = i;
    try {
      const verse = await getVerse(item.surahNo, item.ayahNo);
      const url = verse?.audio?.["1"]?.url;
      if (!url) {
        await playQueueItem(i + 1);
        return;
      }
      await play(url, {
        type: "ayah",
        surahNo: item.surahNo,
        title: `${queueLabel.value} — ${surahLabel(item.surahNo)} ${item.ayahNo}`,
        subtitle: "Sign / Miracle passage",
      });
    } catch {
      await playQueueItem(i + 1);
    }
  };

  const playPassages = (label, passages) => {
    const items = [];
    for (const p of passages) {
      for (let ayahNo = p.ayahStart; ayahNo <= p.ayahEnd; ayahNo++) {
        items.push({ surahNo: p.surahNumber, ayahNo });
      }
    }
    queueLabel.value = label;
    queue.value = items;
    playQueueItem(0);
  };

  const toggleQueuePlayback = () => {
    if (!isQueueActive.value) return;
    if (playing.value) pause();
    else play(currentUrl.value ?? "", nowPlaying.value ?? undefined);
  };

  watch(endedAt, () => {
    if (!isQueueActive.value) return;
    playQueueItem(queueIndex.value + 1);
  });

  return { queue, queueIndex, isQueueActive, isQueuePlaying, playPassages, toggleQueuePlayback, stopQueue };
};
