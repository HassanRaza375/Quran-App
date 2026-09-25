<template>
  <v-card variant="outlined" rounded="lg" class="procedure-card">
    <v-card-item>
      <v-card-title class="procedure-title">{{ procedure.title.en }}</v-card-title>
      <v-card-subtitle>According to {{ marja.name.en }} · {{ procedure.steps.length }} steps</v-card-subtitle>
    </v-card-item>

    <v-card-text class="pt-0">
      <p class="text-caption text-medium-emphasis mb-3">
        Step labels are written by the app. The text under each label is quoted from the ruling it
        cites.
      </p>

      <!-- One step at a time (mobile-first), or all steps -->
      <template v-if="!showAll">
        <div class="d-flex align-center justify-space-between mb-2">
          <span class="step-counter" aria-live="polite">Step {{ index + 1 }} of {{ procedure.steps.length }}</span>
          <v-btn variant="text" size="small" prepend-icon="mdi-format-list-numbered" @click="showAll = true">Show all steps</v-btn>
        </div>
        <v-progress-linear :model-value="((index + 1) / procedure.steps.length) * 100" color="primary" rounded class="mb-3" aria-hidden="true" />
        <ProcedureStepBody :step="current" :marja="marja" :entry="entryFor(current)" />
        <div class="d-flex justify-space-between mt-4 ga-2">
          <v-btn variant="tonal" prepend-icon="mdi-chevron-left" :disabled="index === 0" @click="index--">Previous</v-btn>
          <v-btn
            v-if="index < procedure.steps.length - 1"
            color="primary"
            append-icon="mdi-chevron-right"
            @click="index++"
          >
            Next
          </v-btn>
          <v-btn v-else variant="tonal" prepend-icon="mdi-restart" @click="index = 0">Start over</v-btn>
        </div>
      </template>

      <template v-else>
        <div class="d-flex justify-end mb-2">
          <v-btn variant="text" size="small" prepend-icon="mdi-card-outline" @click="showAll = false">One step at a time</v-btn>
        </div>
        <ol class="all-steps">
          <li v-for="s in procedure.steps" :key="s.id" class="mb-4">
            <ProcedureStepBody :step="s" :marja="marja" :entry="entryFor(s)" />
          </li>
        </ol>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import ProcedureStepBody from "~/components/wajibat/ProcedureStepBody.vue";
import { getMarjaRuling, getRulingById } from "~/data/wajibat";

const props = defineProps({
  procedure: { type: Object, required: true },
  marja: { type: Object, required: true },
});

const index = ref(0);
const showAll = ref(false);
const current = computed(() => props.procedure.steps[index.value]);
const entryFor = (step) => {
  const ruling = getRulingById(step.rulingId);
  return ruling ? getMarjaRuling(ruling, props.marja.id) : undefined;
};
</script>

<style scoped>
.procedure-card {
  border-color: rgba(var(--v-theme-primary), 0.35);
}
.procedure-title {
  white-space: normal;
}
.step-counter {
  font-weight: 600;
  font-size: 0.9rem;
}
.all-steps {
  padding-inline-start: 0;
  list-style: none;
}
</style>
