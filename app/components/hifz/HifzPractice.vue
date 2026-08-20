<template>
  <div class="hifz-practice">
    <v-chip size="small" color="info" variant="tonal" class="mb-3">
      {{ item.isNew ? "New Memorization" : "Free Practice" }}
    </v-chip>

    <div class="d-flex ga-2 flex-wrap mb-3">
      <v-chip size="small" :color="showArabic ? 'primary' : undefined" @click="showArabic = !showArabic">
        {{ showArabic ? "Hide" : "Show" }} Arabic
      </v-chip>
      <v-chip size="small" :color="showTranslation ? 'primary' : undefined" @click="showTranslation = !showTranslation">
        {{ showTranslation ? "Hide" : "Show" }} Translation
      </v-chip>
      <v-chip size="small" :color="showMushaf ? 'primary' : undefined" @click="showMushaf = !showMushaf">
        <v-icon start size="16">mdi-book-open-page-variant-outline</v-icon> Context
      </v-chip>
    </div>

    <div v-if="showMushaf" class="mushaf-strip mb-3">
      <v-chip
        v-for="n in contextRange"
        :key="n"
        size="small"
        class="mr-1"
        :variant="n === item.ayahNo ? 'flat' : 'outlined'"
        :color="n === item.ayahNo ? 'primary' : undefined"
        @click="previewAyah(n)"
      >
        {{ n }}
      </v-chip>
    </div>

    <div v-for="ayahNo in practiceRange" :key="ayahNo" class="practice-ayah mb-3">
      <div class="d-flex align-start ga-2">
        <v-btn
          icon="mdi-volume-high"
          size="small"
          variant="text"
          :loading="playingAyah === ayahNo"
          @click="listenTo(ayahNo)"
        />
        <div class="flex-grow-1">
          <div v-if="showArabic" class="hifz-arabic">{{ chapter?.arabic1?.[ayahNo - 1] }}</div>
          <div v-if="showTranslation" class="text-caption text-medium-emphasis mt-1">
            {{ chapter?.english?.[ayahNo - 1] }}
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-3">
      <div class="d-flex ga-1 flex-wrap">
        <v-chip
          v-for="n in [1, 3, 5, 10]"
          :key="n"
          size="small"
          :color="repeatCount === n && !untilConfident ? 'primary' : undefined"
          @click="untilConfident = false; repeatCount = n"
        >
          {{ n }}×
        </v-chip>
        <v-chip size="small" :color="untilConfident ? 'primary' : undefined" @click="untilConfident = !untilConfident">
          Until confident
        </v-chip>
      </div>
      <v-btn variant="tonal" prepend-icon="mdi-repeat" :loading="repeating" @click="practiceRepeat">
        Listen → Repeat
      </v-btn>
    </div>

    <v-btn block rounded="xl" color="primary" size="large" @click="$emit('ready')">I'm Ready</v-btn>
  </div>
</template>

<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  chapter: { type: Object, default: null },
  target: { type: Object, required: true },
});
defineEmits(["ready"]);

const showArabic = ref(true);
const showTranslation = ref(true);
const showMushaf = ref(false);
const repeatCount = ref(3);
const untilConfident = ref(false);
const repeating = ref(false);
const playingAyah = ref(null);
let stopRequested = false;

const practiceRange = computed(() => {
  if (!props.item.isNew) return [props.item.ayahNo];
  const arr = [];
  for (let n = props.target.startAyah; n <= props.item.ayahNo; n++) arr.push(n);
  return arr;
});

const contextRange = computed(() => {
  const center = props.item.ayahNo;
  const arr = [];
  for (let n = Math.max(props.target.startAyah, center - 3); n <= Math.min(props.target.endAyah, center + 3); n++) {
    arr.push(n);
  }
  return arr;
});

const { getVerse } = useVerse();
const { play } = useAudioPlayer();

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const listenTo = async (ayahNo) => {
  playingAyah.value = ayahNo;
  try {
    const verse = await getVerse(props.target.surahNo, ayahNo);
    const url = verse.audio?.["1"]?.url;
    if (url) {
      await play(url, {
        type: "ayah",
        surahNo: props.target.surahNo,
        title: `Hifz practice — Ayah ${ayahNo}`,
        subtitle: "Practice",
      });
    }
  } finally {
    playingAyah.value = null;
  }
};

const previewAyah = (ayahNo) => listenTo(ayahNo);

/** Plays through the practice range `repeatCount` times (or until the user
 * stops, for "until confident") — Listen → Recite → Listen per the spec. */
const practiceRepeat = async () => {
  if (repeating.value) {
    stopRequested = true;
    repeating.value = false;
    return;
  }
  repeating.value = true;
  stopRequested = false;
  let round = 0;
  while (!stopRequested && (untilConfident.value || round < repeatCount.value)) {
    for (const ayahNo of practiceRange.value) {
      if (stopRequested) break;
      await listenTo(ayahNo);
      await wait(500); // brief pause for the user to recite before the next ayah
    }
    round++;
  }
  repeating.value = false;
};
</script>

<style scoped>
.hifz-arabic {
  font-family: "Amiri Quran", serif;
  font-size: 1.6rem;
  line-height: 2.2;
  direction: rtl;
  text-align: right;
}

.practice-ayah {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  padding-bottom: 8px;
}

.mushaf-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
