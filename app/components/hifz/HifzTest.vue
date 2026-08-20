<template>
  <div class="hifz-test">
    <v-chip size="small" :color="typeColor" variant="tonal" class="mb-3">{{ typeLabel }}</v-chip>

    <div class="test-prompt mb-4">
      <template v-if="item.testMode === 'transition'">
        <div class="text-caption text-medium-emphasis mb-1">Recall the transition</div>
        <div class="hifz-arabic context-line">{{ fromEndingWords }}</div>
        <div class="text-h6 my-2">↓</div>
        <div v-if="revealed" class="hifz-arabic">{{ toAyahText }}</div>
        <div v-else class="hidden-placeholder">{{ hintText || "Ayah " + item.toAyah + " hidden" }}</div>
      </template>

      <template v-else-if="item.testMode === 'previous'">
        <div class="text-caption text-medium-emphasis mb-1">What comes before this ayah?</div>
        <div class="hifz-arabic context-line">{{ contextAyahText }}</div>
        <div v-if="revealed" class="hifz-arabic mt-2">{{ targetAyahText }}</div>
        <div v-else class="hidden-placeholder">{{ hintText || "Ayah " + item.ayahNo + " hidden" }}</div>
      </template>

      <template v-else-if="item.testMode === 'next'">
        <div class="text-caption text-medium-emphasis mb-1">What comes next?</div>
        <div class="hifz-arabic context-line">{{ contextAyahText }}</div>
        <div v-if="revealed" class="hifz-arabic mt-2">{{ targetAyahText }}</div>
        <div v-else class="hidden-placeholder">{{ hintText || "Ayah " + item.ayahNo + " hidden" }}</div>
      </template>

      <template v-else-if="item.testMode === 'continue'">
        <div class="text-caption text-medium-emphasis mb-1">Continue the ayah</div>
        <div class="hifz-arabic">{{ beginningWords }} …</div>
        <div v-if="revealed" class="hifz-arabic mt-2">{{ targetAyahText }}</div>
        <div v-else class="hidden-placeholder">{{ hintText }}</div>
      </template>

      <template v-else>
        <div class="text-caption text-medium-emphasis mb-1">
          {{ surahName }} — Ayah {{ item.ayahNo }}
        </div>
        <div v-if="revealed" class="hifz-arabic">{{ targetAyahText }}</div>
        <div v-else class="hidden-placeholder">{{ hintText || "Recall this ayah, then reveal" }}</div>
      </template>
    </div>

    <div v-if="!revealed" class="d-flex ga-2 flex-wrap mb-4">
      <v-btn variant="tonal" prepend-icon="mdi-lightbulb-outline" :disabled="hintLevel >= 4" @click="useHint">
        Hint ({{ hintLevel }}/4)
      </v-btn>
      <v-btn variant="tonal" prepend-icon="mdi-volume-high" @click="$emit('listen')">Listen</v-btn>
      <v-btn color="primary" variant="flat" @click="reveal">Reveal</v-btn>
    </div>

    <template v-else>
      <div v-if="!mistakeReplay" class="d-flex ga-2 flex-wrap">
        <v-btn color="error" variant="tonal" @click="onAgain">Again</v-btn>
        <v-btn color="primary" variant="tonal" @click="grade('good')">Good</v-btn>
        <v-btn color="success" variant="tonal" @click="grade('easy')">Easy</v-btn>
      </div>

      <div v-else class="mistake-recovery pa-3">
        <div class="text-caption text-medium-emphasis mb-2">
          Listen again, retry the recall, then continue when ready.
        </div>
        <div class="d-flex ga-2 flex-wrap">
          <v-btn variant="tonal" prepend-icon="mdi-volume-high" @click="$emit('listen')">Replay</v-btn>
          <v-btn color="primary" variant="flat" @click="confirmMistake">Continue</v-btn>
        </div>
      </div>
    </template>

    <v-btn v-if="!mistakeReplay" variant="text" size="small" class="mt-3" @click="$emit('skip')">Skip for now</v-btn>
  </div>
</template>

<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  chapter: { type: Object, default: null },
  surahName: { type: String, default: "" },
});
const emit = defineEmits(["grade", "skip", "listen"]);

const hintLevel = ref(0);
const revealed = ref(false);
const mistakeReplay = ref(false);

watch(
  () => props.item?.id,
  () => {
    hintLevel.value = 0;
    revealed.value = false;
    mistakeReplay.value = false;
  }
);

const typeLabels = {
  warmup: "Warm-up",
  "weak-ayah": "Weak Ayah",
  "weak-transition": "Weak Transition",
  revision: "Revision",
  new: "New — Test",
  "final-mixed": "Mixed Test",
  assessment: "Assessment",
};
const typeColors = {
  warmup: "success",
  "weak-ayah": "error",
  "weak-transition": "error",
  revision: "primary",
  new: "info",
  "final-mixed": "secondary",
  assessment: "warning",
};
const typeLabel = computed(() => typeLabels[props.item.type] ?? props.item.type);
const typeColor = computed(() => typeColors[props.item.type] ?? "primary");

const words = (text) => (text ?? "").split(/\s+/).filter(Boolean);

const targetAyahText = computed(() => props.chapter?.arabic1?.[(props.item.ayahNo ?? 1) - 1] ?? "");
const contextAyahText = computed(() => {
  const neighborNo = props.item.testMode === "previous" ? props.item.ayahNo + 1 : props.item.ayahNo - 1;
  return props.chapter?.arabic1?.[neighborNo - 1] ?? "";
});
const toAyahText = computed(() => props.chapter?.arabic1?.[(props.item.toAyah ?? 1) - 1] ?? "");
const fromEndingWords = computed(() => {
  const w = words(props.chapter?.arabic1?.[(props.item.fromAyah ?? 1) - 1]);
  return w.slice(-4).join(" ") + " …";
});
const beginningWords = computed(() => words(targetAyahText.value).slice(0, Math.ceil(words(targetAyahText.value).length * 0.4)).join(" "));

// Progressive hint text — level 1: first word, 2: first 2-3 words, 3: beginning portion, 4: full (auto-reveals).
const hintText = computed(() => {
  if (hintLevel.value === 0) return "";
  const full = props.item.testMode === "transition" ? toAyahText.value : targetAyahText.value;
  const w = words(full);
  if (hintLevel.value === 1) return w.slice(0, 1).join(" ") + " …";
  if (hintLevel.value === 2) return w.slice(0, 3).join(" ") + " …";
  if (hintLevel.value === 3) return w.slice(0, Math.ceil(w.length * 0.5)).join(" ") + " …";
  return full;
});

const useHint = () => {
  hintLevel.value = Math.min(4, hintLevel.value + 1);
  if (hintLevel.value >= 4) revealed.value = true;
};

const reveal = () => {
  revealed.value = true;
};

const grade = (g) => {
  emit("grade", g, hintLevel.value);
};

const onAgain = () => {
  mistakeReplay.value = true;
};

const confirmMistake = () => {
  grade("again");
};
</script>

<style scoped>
.hifz-arabic {
  font-family: "Amiri Quran", serif;
  font-size: 1.7rem;
  line-height: 2.3;
  direction: rtl;
  text-align: right;
}

.context-line {
  opacity: 0.65;
  font-size: 1.4rem;
}

.hidden-placeholder {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.25);
  border-radius: 10px;
  padding: 18px;
  text-align: center;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-family: "Amiri Quran", serif;
  font-size: 1.3rem;
  direction: rtl;
}

.mistake-recovery {
  background: rgba(var(--v-theme-error), 0.08);
  border-radius: 12px;
}
</style>
