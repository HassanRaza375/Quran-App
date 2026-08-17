<template>
  <v-dialog v-model="open" max-width="480">
    <v-card rounded="lg">
      <v-card-title>Share Ayah</v-card-title>
      <v-card-text>
        <div class="canvas-wrap mb-3">
          <canvas ref="canvasEl" class="preview-canvas" />
        </div>

        <div class="d-flex ga-2 flex-wrap mb-4">
          <v-chip
            v-for="t in themes"
            :key="t.id"
            size="small"
            :color="theme.id === t.id ? 'primary' : undefined"
            :variant="theme.id === t.id ? 'flat' : 'outlined'"
            @click="theme = t"
          >
            {{ t.label }}
          </v-chip>
        </div>

        <div class="d-flex ga-2 flex-wrap">
          <v-btn variant="tonal" prepend-icon="mdi-content-copy" @click="copyAsText">Copy Text</v-btn>
          <v-btn variant="tonal" prepend-icon="mdi-download-outline" @click="downloadImage">Download Image</v-btn>
          <v-btn variant="tonal" color="primary" prepend-icon="mdi-share-variant-outline" @click="shareImage">
            Share
          </v-btn>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="open = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  arabic: { type: String, default: "" },
  translation: { type: String, default: "" },
  translationLabel: { type: String, default: "Translation" },
  surahName: { type: String, default: "" },
  surahNo: { type: Number, default: null },
  ayahNo: { type: Number, default: null },
});
const emit = defineEmits(["update:modelValue"]);

const { toast } = useToast();
const { renderCard, canvasToBlob } = useAyahCardImage();

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const themes = AYAH_CARD_THEMES;
const theme = ref(AYAH_CARD_THEMES[0]);
const canvasEl = ref(null);

const reference = computed(() =>
  props.surahNo && props.ayahNo ? `Surah ${props.surahName} • ${props.surahNo}:${props.ayahNo}` : props.surahName
);

const deepLink = computed(() =>
  import.meta.client && props.surahNo && props.ayahNo
    ? `${window.location.origin}/surah/${props.surahNo}#ayah-${props.ayahNo}`
    : ""
);

const shareText = computed(
  () => `${props.arabic}\n\n"${props.translation}"\n\n${reference.value}${deepLink.value ? `\n${deepLink.value}` : ""}`
);

const redraw = async () => {
  if (!canvasEl.value || !props.arabic) return;
  await renderCard(canvasEl.value, {
    arabic: props.arabic,
    translation: props.translation,
    translationLabel: props.translationLabel,
    reference: reference.value,
    theme: theme.value,
  });
};

// `immediate: true` matters here: this component is mounted fresh (v-if)
// each time it's opened, with `open` already true from the start — a
// non-immediate watcher never "changes" in that case, so the canvas would
// never actually get drawn on first open.
watch(
  [open, theme, () => props.arabic],
  async ([isOpen]) => {
    if (isOpen) await nextTick().then(redraw);
  },
  { immediate: true }
);

const copyAsText = async () => {
  try {
    await navigator.clipboard.writeText(shareText.value);
    toast("Copied to clipboard!", { color: "success" });
  } catch {
    toast("Failed to copy", { color: "error" });
  }
};

const downloadImage = async () => {
  await redraw();
  const blob = await canvasToBlob(canvasEl.value);
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ayah-${props.surahNo}-${props.ayahNo}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const shareImage = async () => {
  await redraw();
  const blob = await canvasToBlob(canvasEl.value);
  const file = blob ? new File([blob], `ayah-${props.surahNo}-${props.ayahNo}.png`, { type: "image/png" }) : null;

  if (file && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: reference.value, text: shareText.value });
      return;
    } catch {
      // user cancelled or share failed — fall through to text share/copy below
    }
  }

  if (navigator.share) {
    try {
      await navigator.share({ title: reference.value, text: shareText.value, url: deepLink.value || undefined });
      return;
    } catch {
      /* fall through to copy */
    }
  }

  await copyAsText();
};
</script>

<style scoped>
.canvas-wrap {
  display: flex;
  justify-content: center;
}

.preview-canvas {
  width: 100%;
  max-width: 320px;
  aspect-ratio: 1080 / 1350;
  border-radius: 12px;
}
</style>
