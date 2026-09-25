<template>
  <div class="d-flex align-center flex-wrap ga-2">
    <v-chip
      v-if="marja"
      class="marja-chip"
      color="primary"
      variant="tonal"
      prepend-icon="mdi-account-tie-outline"
      :to="changeLink"
      :aria-label="`Following ${marja.name.en}. Change marja'`"
    >
      Following: {{ marja.name.en }} · change
    </v-chip>
    <v-chip v-else variant="outlined" prepend-icon="mdi-account-question-outline" :to="changeLink">
      No marja' chosen · choose
    </v-chip>
  </div>
</template>

<script setup>
import { getMarjaById } from "~/data/wajibat";

const route = useRoute();
const { marjaId } = useFiqhPrefs();
const marja = computed(() => getMarjaById(marjaId.value));
const changeLink = computed(() => ({ path: "/fiqh/choose-marja", query: { from: route.fullPath } }));
</script>

<style scoped>
/* Maraji' names are long — let the chip wrap instead of overflowing at 390px. */
.marja-chip {
  white-space: normal;
  height: auto !important;
  min-height: 32px;
  max-width: 100%;
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>
