<template>
  <v-app class="bg-background">
    <LayoutAppBar @toggle-drawer="drawer = !drawer" />
    <LayoutNavigationDrawer v-model="drawer" />

    <v-main class="bg-background">
      <slot />
    </v-main>

    <AudioMiniPlayer />

    <v-footer border class="bg-surface">
      <v-container>
        <v-row dense>
          <v-col class="text-end" cols="12">
            &copy; {{ new Date().getFullYear() }} Quran App
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>


<script setup>
const prayer = usePrayerStore();
const drawer = ref(false);
const { load } = useBookmarks();
const { loadSaved } = useReciter();
const { load: loadAccessibilityPrefs } = useAccessibilityPrefs();

// load favorites once on client
onMounted(() => {
  prayer.init();
  load();
  loadSaved();
  loadAccessibilityPrefs();
});
</script>
