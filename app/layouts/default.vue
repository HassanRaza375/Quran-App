<template>
  <v-app>
    <LayoutAppBar @toggle-drawer="drawer = !drawer" />
    <LayoutNavigationDrawer v-model="drawer" />

    <v-main>
      <slot />
    </v-main>
    <v-footer border>
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
const prayer = usePrayerStore()
const drawer = ref(false)

onMounted(() => {
  prayer.init()
})
</script>
