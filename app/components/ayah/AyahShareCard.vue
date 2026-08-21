<template>
  <v-dialog v-model="open" max-width="720" scrollable>
    <v-card rounded="lg">
      <v-card-title>Share Ayah</v-card-title>

      <v-card-text class="pt-0">
        <v-row>
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <div class="canvas-wrap">
              <canvas ref="canvasEl" class="preview-canvas" />
            </div>
          </v-col>

          <v-col cols="12" sm="6">
            <v-tabs v-model="activeTab" density="compact" class="mb-3">
              <v-tab value="theme">Theme</v-tab>
              <v-tab value="background">Background</v-tab>
              <v-tab value="text">Text</v-tab>
            </v-tabs>

            <v-window v-model="activeTab">
              <!-- THEME -->
              <v-window-item value="theme">
                <div class="text-caption text-medium-emphasis mb-2">Pick a default, or choose Custom to set your own colors</div>
                <div class="d-flex ga-2 flex-wrap mb-3">
                  <v-chip
                    v-for="t in themes"
                    :key="t.id"
                    size="small"
                    :color="selectedThemeId === t.id ? 'primary' : undefined"
                    :variant="selectedThemeId === t.id ? 'flat' : 'outlined'"
                    @click="selectTheme(t.id)"
                  >
                    {{ t.label }}
                  </v-chip>
                  <v-chip
                    size="small"
                    :color="isCustom ? 'primary' : undefined"
                    :variant="isCustom ? 'flat' : 'outlined'"
                    @click="selectedThemeId = CUSTOM_THEME_ID"
                  >
                    Custom
                  </v-chip>
                </div>

                <template v-if="isCustom">
                  <div class="d-flex align-center ga-3 flex-wrap mb-2">
                    <label class="text-caption">Gradient start<input type="color" v-model="customColor1" class="ml-2" /></label>
                    <label class="text-caption">Gradient end<input type="color" v-model="customColor2" class="ml-2" /></label>
                    <label class="text-caption">Accent<input type="color" v-model="customAccent" class="ml-2" /></label>
                  </div>
                  <div class="text-caption text-medium-emphasis mb-1">Decorative pattern</div>
                  <div class="d-flex ga-2 flex-wrap">
                    <v-chip
                      v-for="p in patternOptions"
                      :key="p.value"
                      size="small"
                      :color="customPattern === p.value ? 'primary' : undefined"
                      :variant="customPattern === p.value ? 'flat' : 'outlined'"
                      @click="customPattern = p.value"
                    >
                      {{ p.label }}
                    </v-chip>
                  </div>
                </template>
              </v-window-item>

              <!-- BACKGROUND -->
              <v-window-item value="background">
                <div class="d-flex ga-2 mb-3">
                  <v-chip size="small" :color="backgroundMode === 'gradient' ? 'primary' : undefined" @click="backgroundMode = 'gradient'">
                    Gradient / Pattern
                  </v-chip>
                  <v-chip size="small" :color="backgroundMode === 'photo' ? 'primary' : undefined" @click="backgroundMode = 'photo'">
                    Your Photo
                  </v-chip>
                </div>

                <template v-if="backgroundMode === 'photo'">
                  <v-file-input
                    label="Upload background photo"
                    accept="image/*"
                    density="compact"
                    prepend-icon="mdi-image-outline"
                    @change="onFileChange"
                  />
                  <div v-if="uploadedImage" class="text-caption text-medium-emphasis">
                    A dark overlay is applied automatically so the text stays readable over any photo.
                  </div>
                </template>
                <div v-else class="text-caption text-medium-emphasis">
                  Using the {{ isCustom ? "custom" : selectedThemeLabel }} gradient
                  <span v-if="effectivePattern !== 'none'">with a {{ effectivePattern }} pattern</span>.
                </div>
              </v-window-item>

              <!-- TEXT -->
              <v-window-item value="text">
                <div class="text-caption text-medium-emphasis mb-1">Arabic size</div>
                <v-slider v-model="arabicFontScale" :min="0.8" :max="1.3" :step="0.05" thumb-label density="compact" />

                <div class="text-caption text-medium-emphasis mb-1">Translation size</div>
                <v-slider v-model="translationFontScale" :min="0.8" :max="1.3" :step="0.05" thumb-label density="compact" />

                <div class="text-caption text-medium-emphasis mb-1">Translation alignment</div>
                <div class="d-flex ga-2 mb-3">
                  <v-chip size="small" :color="textAlign === 'center' ? 'primary' : undefined" @click="textAlign = 'center'">Center</v-chip>
                  <v-chip size="small" :color="textAlign === 'right' ? 'primary' : undefined" @click="textAlign = 'right'">Right</v-chip>
                </div>

                <div class="text-caption text-medium-emphasis mb-1">Text color</div>
                <div class="d-flex ga-2">
                  <v-chip size="small" :color="textColorOverride === 'auto' ? 'primary' : undefined" @click="textColorOverride = 'auto'">Theme default</v-chip>
                  <v-chip size="small" :color="textColorOverride === 'light' ? 'primary' : undefined" @click="textColorOverride = 'light'">Light</v-chip>
                  <v-chip size="small" :color="textColorOverride === 'dark' ? 'primary' : undefined" @click="textColorOverride = 'dark'">Dark</v-chip>
                </div>
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>

        <v-divider class="my-3" />

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
const { renderCard, canvasToBlob, loadImage } = useAyahCardImage();

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const themes = AYAH_CARD_THEMES;
const activeTab = ref("theme");
const selectedThemeId = ref(AYAH_CARD_THEMES[0].id);
const isCustom = computed(() => selectedThemeId.value === CUSTOM_THEME_ID);
const selectedThemeLabel = computed(() => themes.find((t) => t.id === selectedThemeId.value)?.label ?? "");

const customColor1 = ref(AYAH_CARD_THEMES[0].background[0]);
const customColor2 = ref(AYAH_CARD_THEMES[0].background[1]);
const customAccent = ref(AYAH_CARD_THEMES[0].accentColor);
const customTextColor = ref(AYAH_CARD_THEMES[0].textColor);
const customPattern = ref(AYAH_CARD_THEMES[0].pattern);

const patternOptions = [
  { value: "none", label: "None" },
  { value: "geometric", label: "Geometric" },
  { value: "stars", label: "Stars" },
  { value: "arch", label: "Arch" },
];

// Picking a preset seeds the custom controls with its values, so switching
// to Custom afterward starts from something coherent instead of a jarring default.
const selectTheme = (id) => {
  selectedThemeId.value = id;
  const t = themes.find((x) => x.id === id);
  if (t) {
    customColor1.value = t.background[0];
    customColor2.value = t.background[1];
    customAccent.value = t.accentColor;
    customTextColor.value = t.textColor;
    customPattern.value = t.pattern;
  }
};

const backgroundMode = ref("gradient");
const uploadedImage = ref(null);

const onFileChange = async (e) => {
  const file = e.target.files?.[0] ?? e.target?.files?.item?.(0);
  if (!file) return;
  try {
    uploadedImage.value = await loadImage(file);
  } catch {
    toast("Couldn't load that image", { color: "error" });
  }
};

const arabicFontScale = ref(1);
const translationFontScale = ref(1);
const textAlign = ref("center");
const textColorOverride = ref("auto");

const baseTheme = computed(() => themes.find((t) => t.id === selectedThemeId.value) ?? themes[0]);
const effectiveBackground = computed(() => (isCustom.value ? [customColor1.value, customColor2.value] : baseTheme.value.background));
const effectiveAccent = computed(() => (isCustom.value ? customAccent.value : baseTheme.value.accentColor));
const effectivePattern = computed(() => (isCustom.value ? customPattern.value : baseTheme.value.pattern));
const effectiveTextColor = computed(() => {
  if (textColorOverride.value === "light") return "#ffffff";
  if (textColorOverride.value === "dark") return "#1c2b33";
  return isCustom.value ? customTextColor.value : baseTheme.value.textColor;
});

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
    background: effectiveBackground.value,
    textColor: effectiveTextColor.value,
    accentColor: effectiveAccent.value,
    pattern: backgroundMode.value === "photo" ? "none" : effectivePattern.value,
    backgroundImage: backgroundMode.value === "photo" ? uploadedImage.value : null,
    arabicFontScale: arabicFontScale.value,
    translationFontScale: translationFontScale.value,
    textAlign: textAlign.value,
  });
};

watch(
  [
    open,
    () => props.arabic,
    effectiveBackground,
    effectiveTextColor,
    effectiveAccent,
    effectivePattern,
    backgroundMode,
    uploadedImage,
    arabicFontScale,
    translationFontScale,
    textAlign,
  ],
  async ([isOpen]) => {
    if (isOpen) await nextTick().then(redraw);
  },
  { immediate: true, deep: true }
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
  width: 100%;
}

.preview-canvas {
  width: 100%;
  max-width: 420px;
  aspect-ratio: 1080 / 1350;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
}

input[type="color"] {
  vertical-align: middle;
  width: 28px;
  height: 22px;
  border: none;
  background: none;
  cursor: pointer;
}
</style>
