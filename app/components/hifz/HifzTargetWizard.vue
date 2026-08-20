<template>
  <v-card rounded="xl" elevation="6" class="pa-5">
    <div class="text-h6 font-weight-bold mb-1">New Memorization Target</div>
    <div class="text-caption text-medium-emphasis mb-4">Step {{ step }} of 5</div>

    <template v-if="step === 1">
      <div class="text-subtitle-2 mb-2">Choose a Surah</div>
      <v-select label="Surah" :items="surahOptions" item-title="label" item-value="surahNo" v-model="surahNo" />
    </template>

    <template v-else-if="step === 2">
      <div class="text-subtitle-2 mb-2">Choose the ayah range</div>
      <v-row dense>
        <v-col cols="6">
          <v-text-field type="number" label="Start ayah" v-model.number="startAyah" :min="1" :max="maxAyah" />
        </v-col>
        <v-col cols="6">
          <v-text-field type="number" label="End ayah" v-model.number="endAyah" :min="1" :max="maxAyah" />
        </v-col>
      </v-row>
      <v-alert v-if="rangeError" type="warning" variant="tonal" density="compact">{{ rangeError }}</v-alert>
    </template>

    <template v-else-if="step === 3">
      <div class="text-subtitle-2 mb-2">Daily new-ayah target</div>
      <div class="d-flex ga-2 flex-wrap">
        <v-chip v-for="n in [1, 3, 5, 10]" :key="n" :color="dailyNewTarget === n ? 'primary' : undefined" @click="dailyNewTarget = n">
          {{ n }}
        </v-chip>
        <v-text-field
          type="number"
          label="Custom"
          density="compact"
          style="max-width: 100px"
          v-model.number="dailyNewTarget"
        />
      </div>
    </template>

    <template v-else-if="step === 4">
      <div class="text-subtitle-2 mb-2">Daily time goal</div>
      <div class="d-flex ga-2 flex-wrap">
        <v-chip
          v-for="n in [10, 20, 30]"
          :key="n"
          :color="dailyTimeGoalMinutes === n ? 'primary' : undefined"
          @click="dailyTimeGoalMinutes = n"
        >
          {{ n }} min
        </v-chip>
        <v-text-field
          type="number"
          label="Custom (min)"
          density="compact"
          style="max-width: 120px"
          v-model.number="dailyTimeGoalMinutes"
        />
      </div>
    </template>

    <template v-else>
      <div class="text-subtitle-2 mb-2">Confirm</div>
      <div class="text-body-2 mb-1">{{ surahLabel }}, ayahs {{ startAyah }}–{{ endAyah }}</div>
      <div class="text-body-2 mb-1">{{ dailyNewTarget }} new ayahs/day</div>
      <div class="text-body-2">{{ dailyTimeGoalMinutes }} minutes/day</div>
    </template>

    <div class="d-flex justify-space-between mt-5">
      <v-btn variant="text" :disabled="step === 1" @click="step--">Back</v-btn>
      <v-btn v-if="step < 5" color="primary" variant="flat" :disabled="!canAdvance" @click="step++">Next</v-btn>
      <v-btn v-else color="primary" variant="flat" @click="submit">Start Hifz</v-btn>
    </div>
  </v-card>
</template>

<script setup>
import surahList from "~/assets/data/surah.json";

const emit = defineEmits(["created"]);
const { createTarget } = useHifz();

const step = ref(1);
const surahOptions = surahList.map((s) => ({
  surahNo: s.surahNo,
  label: `${s.surahNo}. ${s.surahNameTranslation} (${s.totalAyah} ayahs)`,
  totalAyah: s.totalAyah,
  name: s.surahNameTranslation,
}));

const surahNo = ref(1);
const startAyah = ref(1);
const endAyah = ref(10);
const dailyNewTarget = ref(3);
const dailyTimeGoalMinutes = ref(15);

const currentSurah = computed(() => surahOptions.find((s) => s.surahNo === surahNo.value));
const maxAyah = computed(() => currentSurah.value?.totalAyah ?? 286);
const surahLabel = computed(() => currentSurah.value?.label ?? "");

const rangeError = computed(() => {
  if (!startAyah.value || !endAyah.value) return "";
  if (startAyah.value > endAyah.value) return "Start ayah must come before end ayah.";
  if (endAyah.value > maxAyah.value) return `This Surah only has ${maxAyah.value} ayahs.`;
  return "";
});

const canAdvance = computed(() => {
  if (step.value === 2) return startAyah.value > 0 && endAyah.value >= startAyah.value && !rangeError.value;
  if (step.value === 3) return dailyNewTarget.value > 0;
  if (step.value === 4) return dailyTimeGoalMinutes.value > 0;
  return true;
});

const submit = () => {
  const target = createTarget({
    surahNo: surahNo.value,
    surahName: currentSurah.value?.name ?? `Surah ${surahNo.value}`,
    startAyah: startAyah.value,
    endAyah: endAyah.value,
    dailyNewTarget: dailyNewTarget.value,
    dailyTimeGoalMinutes: dailyTimeGoalMinutes.value,
  });
  emit("created", target);
};
</script>
