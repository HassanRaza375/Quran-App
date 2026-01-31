<template>
  <v-navigation-drawer :model-value="modelValue" app @update:model-value="emit('update:modelValue', $event)">
    <v-list nav density="comfortable">
      <template v-for="item in sidebarList" :key="item.title">

        <!-- GROUP -->
        <v-list-group v-if="item.children" :value="item.title">
          <template #activator="{ props }">
            <v-list-item v-bind="props" :title="item.title" :prepend-icon="item.icon" />
          </template>

          <v-list-item v-for="child in item.children" :key="child.title" :title="child.title"
            prepend-icon="mdi-chevron-right" @click="goto(child.path)" />
        </v-list-group>

        <!-- NORMAL ITEM -->
        <v-list-item v-else :title="item.title" :prepend-icon="item.icon" @click="goto(item.path)" />

      </template>
    </v-list>

  </v-navigation-drawer>
</template>

<script setup>
const sidebarList = ref([
  { title: 'Home', icon: 'mdi-home', path: '/' },
  { title: 'Surah Listing', icon: 'mdi-view-list', path: '/surah-listing' },
  { title: 'Search', icon: 'mdi-magnify', path: '/search' },
  { title: 'Bookmarks', icon: 'mdi-bookmark', path: '/bookmarks' },
  { title: 'Sajda', icon: 'mdi-airbag', path: '/sajda' },
  { title: 'Per Page', icon: 'mdi-note-multiple', path: '/per-page-read' },
  { title: 'Prayer Times', icon: 'mdi-clock-outline', path: '/prayerTime' },
  { title: 'Qibla Direction', icon: 'mdi-compass-outline', path: '/qibla-direction' },

  {
    title: 'Juz',
    icon: 'mdi-book',
    children: Array.from({ length: 30 }, (_, i) => ({
      title: `Juz ${i + 1}`,
      path: `/juz/${i + 1}`,
    })),
  },

  { title: 'Settings', icon: 'mdi-cog', path: '/settings' },
  { title: 'About', icon: 'mdi-information', path: '/about' },
])

const router = useRouter()

const goto = (path) => {
  router.push(path)
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
</script>
<style scoped></style>