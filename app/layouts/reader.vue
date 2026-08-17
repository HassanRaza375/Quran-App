<template>
  <v-app>
    <LayoutReaderBar />

    <v-main>
      <slot />
    </v-main>

    <AudioMiniPlayer />
  </v-app>
</template>

<script setup>
const { loadSaved } = useReciter();
const { load: loadAccessibilityPrefs } = useAccessibilityPrefs();

onMounted(() => {
  loadSaved();
  loadAccessibilityPrefs();
});
</script>
<style scoped></style>
