<template>
  <v-container class="counter-container">
    <!-- Header -->
    <v-row justify="center">
      <v-col cols="12" class="text-center mb-2">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="router.push('/tasbeeh')">
          All Dhikr
        </v-btn>

        <div v-if="preset.arabic" class="preset-arabic mt-2">{{ preset.arabic }}</div>
        <div class="text-h5 font-weight-bold">{{ preset.transliteration }}</div>
        <div class="text-medium-emphasis">{{ preset.meaning }}</div>
      </v-col>
    </v-row>

    <!-- Counter Ring -->
    <v-row justify="center" class="my-4">
      <v-col cols="12" class="d-flex justify-center">
        <button
          class="tap-circle"
          type="button"
          aria-label="Tap to count"
          @click="onTap"
        >
          <v-progress-circular
            :model-value="progressPercent"
            :size="240"
            :width="14"
            :color="preset.color"
            bg-color="rgba(128,128,128,0.15)"
          >
            <div class="tap-circle-inner">
              <div class="count-value">{{ entry.count }}</div>
              <div class="count-target">/ {{ entry.target }}</div>
            </div>
          </v-progress-circular>
        </button>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-2">
      <v-col cols="12" class="text-center text-caption text-medium-emphasis">
        Tap the circle or press the button below to count
      </v-col>
    </v-row>

    <!-- Big tap button -->
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-btn block size="x-large" rounded="xl" :color="preset.color" class="tap-btn" @click="onTap">
          <v-icon start>mdi-hand-back-right-outline</v-icon>
          Count
        </v-btn>
      </v-col>
    </v-row>

    <!-- Target selector -->
    <v-row justify="center" class="mt-6">
      <v-col cols="12" class="d-flex justify-center flex-wrap ga-2">
        <v-chip
          v-for="t in targetOptions"
          :key="t"
          :color="entry.target === t ? preset.color : undefined"
          :variant="entry.target === t ? 'flat' : 'outlined'"
          @click="tasbeeh.setTarget(id, t)"
        >
          {{ t }}
        </v-chip>
      </v-col>
    </v-row>

    <!-- Stats -->
    <v-row justify="center" class="mt-6">
      <v-col cols="6" sm="4">
        <v-card class="glass pa-3 text-center" rounded="lg">
          <div class="text-caption">Cycles Completed</div>
          <div class="text-h6 font-weight-bold">{{ entry.cycles }}</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="4">
        <v-card class="glass pa-3 text-center" rounded="lg">
          <div class="text-caption">Lifetime Count</div>
          <div class="text-h6 font-weight-bold">{{ entry.lifetime }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reset -->
    <v-row justify="center" class="mt-6">
      <v-col cols="12" sm="6" md="4" class="text-center">
        <v-btn variant="text" color="error" prepend-icon="mdi-restart" @click="confirmReset = true">
          Reset current count
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="confirmReset" max-width="360">
      <v-card rounded="lg">
        <v-card-title>Reset count?</v-card-title>
        <v-card-text>This will reset the current count for {{ preset.transliteration }} back to 0. Lifetime and cycle totals are kept.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmReset = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="doReset">Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
useHead({ title: "Tasbeeh Counter — Quran App" });
useSeoMeta({ robots: "noindex, follow" });

const route = useRoute();
const router = useRouter();
const tasbeeh = useTasbeeh();

const id = computed(() => String(route.params.id));
const preset = computed(() => getTasbeehPreset(id.value));
const entry = computed(() => tasbeeh.getEntry(id.value));

const targetOptions = [33, 99, 100];
const confirmReset = ref(false);

const progressPercent = computed(() => {
  if (!entry.value.target) return 0;
  return Math.min(100, (entry.value.count / entry.value.target) * 100);
});

onMounted(() => {
  tasbeeh.load();
});

const onTap = () => {
  tasbeeh.increment(id.value);
};

const doReset = () => {
  tasbeeh.reset(id.value);
  confirmReset.value = false;
};
</script>

<style scoped>
.counter-container {
  padding-bottom: 80px;
  max-width: 600px;
  margin: auto;
}

.preset-arabic {
  font-family: "Amiri Quran", serif;
  font-size: 2rem;
}

.tap-circle {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.tap-circle:active {
  transform: scale(0.97);
}

.tap-circle-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.count-value {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
}

.count-target {
  font-size: 1rem;
  opacity: 0.6;
}

.tap-btn {
  font-weight: 600;
  letter-spacing: 0.4px;
}

.glass {
  background: rgba(var(--v-theme-surface), 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(128, 128, 128, 0.15);
}
</style>
