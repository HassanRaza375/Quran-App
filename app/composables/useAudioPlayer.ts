export const useAudioPlayer = () => {
  const audio = useState<HTMLAudioElement | null>("audio", () => null);
  const currentUrl = useState<string | null>("currentUrl", () => null);
  const loading = useState<boolean>("loading", () => false);
  const playing = useState<boolean>("playing", () => false);
  const progress = useState<number>("progress", () => 0);
  const duration = useState<number>("duration", () => 0);

  /* ------------------ create audio once (client only) ------------------ */
  if (process.client && !audio.value) {
    audio.value = new Audio();

    audio.value.addEventListener("timeupdate", () => {
      progress.value = audio.value!.currentTime;
    });

    audio.value.addEventListener("loadedmetadata", () => {
      duration.value = audio.value!.duration;
      loading.value = false;
    });

    audio.value.addEventListener("ended", () => {
      playing.value = false;
    });
  }

  /* ------------------ time formatter ------------------ */
  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "00:00";

    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = Math.floor(sec % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  /* ------------------ computed timers ------------------ */
  const currentTimeLabel = computed(() => formatTime(progress.value));
  const durationLabel = computed(() => formatTime(duration.value));
  const remainingLabel = computed(() =>
    formatTime(duration.value - progress.value),
  );

  /* ------------------ controls ------------------ */
  const play = async (url: string) => {
    if (!audio.value) return;

    if (currentUrl.value !== url) {
      loading.value = true;
      audio.value.src = url;
      currentUrl.value = url;
    }

    await audio.value.play();
    playing.value = true;
  };

  const pause = () => {
    audio.value?.pause();
    playing.value = false;
  };

  const seek = (time: number) => {
    if (audio.value) audio.value.currentTime = time;
  };

  return {
    play,
    pause,
    seek,
    playing,
    loading,
    progress,
    duration,
    currentUrl,
    // timers
    currentTimeLabel,
    durationLabel,
    remainingLabel,
  };
};
