<template>
  <v-app class="bg-background">
    <v-theme-provider :theme="theme.global.name.value" with-background>
      <LayoutAppBar @toggle-drawer="drawer = !drawer" />
      <LayoutNavigationDrawer v-model="drawer" />

      <v-main class="bg-background">
        <slot />
      </v-main>

      <v-footer border class="bg-surface">
        <v-container>
          <v-row dense>
            <v-col class="text-end" cols="12">
              &copy; {{ new Date().getFullYear() }} Quran App
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-theme-provider>
  </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()
const prayer = usePrayerStore();
const drawer = ref(false);

onMounted(() => {
  prayer.init();
});
</script>
