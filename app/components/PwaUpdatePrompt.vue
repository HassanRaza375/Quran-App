<template>
  <v-snackbar
    v-model="show"
    location="bottom"
    :timeout="-1"
    color="secondary"
    elevation="6"
    class="pwa-update-snackbar"
  >
    <div class="d-flex align-center ga-2">
      <v-icon size="20">mdi-cloud-refresh-outline</v-icon>
      <span>A new version of Quran App is available.</span>
    </div>
    <template #actions>
      <v-btn variant="text" @click="reload">Reload</v-btn>
      <v-btn icon="mdi-close" size="small" variant="text" :aria-label="'Dismiss update notice'" @click="dismiss" />
    </template>
  </v-snackbar>
</template>

<script setup>
// registerType is "prompt" (nuxt.config.ts) specifically so `needRefresh`
// stays true — and this banner stays up — until the user opts in, instead
// of the SW silently activating/reloading mid-read.
const pwa = usePWA();

const show = computed({
  get: () => !!pwa?.needRefresh,
  set: (v) => {
    if (!v) pwa?.cancelPrompt();
  },
});

const reload = () => pwa?.updateServiceWorker(true);
const dismiss = () => pwa?.cancelPrompt();
</script>

<style scoped>
.pwa-update-snackbar :deep(.v-snackbar__content) {
  padding-right: 4px;
}
</style>
