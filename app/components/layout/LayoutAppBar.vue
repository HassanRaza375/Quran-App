<template>
  <v-app-bar color="teal-darken-4" :image="images[Math.floor(Math.random() * images.length)]">
    <template #image>
      <v-img gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)" />
    </template>

    <template #prepend>
      <v-app-bar-nav-icon @click="emit('toggle-drawer')" />
    </template>

    <v-app-bar-title>Quran Pak</v-app-bar-title>

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
const images = ref([
  'https://plus.unsplash.com/premium_photo-1677231559663-b9f6a7c33c77',
  'https://images.unsplash.com/photo-1542816417-0983c9c9ad53',
  'https://images.unsplash.com/photo-1660946303183-b45f2e418712',
])

const emit = defineEmits(['toggle-drawer'])
const goto = (path) => {
  useRouter().push(path)
}
</script>
<style scoped>
@media (max-width: 600px) {
  .hide-mobile {
    display: none !important;
  }
}
</style>
