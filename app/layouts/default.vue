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
        <v-row dense align="center">
          <v-col cols="12" sm="6" class="footer-links">
            <NuxtLink to="/about">About</NuxtLink>
            <span class="mx-2">·</span>
            <NuxtLink to="/sitemap">Sitemap</NuxtLink>
          </v-col>
          <v-col class="text-sm-end" cols="12" sm="6">
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

<style scoped>
.footer-links a {
  color: rgba(var(--v-theme-on-surface), 0.7);
  text-decoration: none;
  font-size: 0.875rem;
}

.footer-links a:hover {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}
</style>
