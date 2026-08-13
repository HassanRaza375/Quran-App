<template>
  <v-app-bar color="teal-darken-4" class="app-bar-gradient">
    <template #prepend>
      <v-app-bar-nav-icon @click="emit('toggle-drawer')" />
    </template>

    <v-app-bar-title>Quran Pak</v-app-bar-title>

    <v-chip v-if="!isOnline" class="mr-2" size="small" color="warning" prepend-icon="mdi-cloud-off-outline">
      Offline
    </v-chip>

    <v-chip class="mr-2 text-white" size="small" outlined style="min-width: 145px;">
      🕌 {{ prayer.nextPrayer }} in {{ prayer.countdown }}
    </v-chip>
    <v-btn class="hide-mobile" icon @click="goto('/search')"><v-icon>mdi-magnify</v-icon></v-btn>
    <v-btn class="hide-mobile" icon @click="goto('/bookmarks')"><v-icon>mdi-heart</v-icon></v-btn>
    <v-btn class="hide-mobile" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
  </v-app-bar>
</template>

<script setup>
const prayer = usePrayerStore()
const { isOnline, init: initOnlineStatus } = useOnlineStatus()

onMounted(() => {
  initOnlineStatus()
})

const emit = defineEmits(['toggle-drawer'])
const goto = (path) => {
  useRouter().push(path)
}
</script>
<style scoped>
.app-bar-gradient {
  background: linear-gradient(120deg, #0f2027, #13547a, #2c5364) !important;
}

@media (max-width: 600px) {
  .hide-mobile {
    display: none !important;
  }
}
</style>
