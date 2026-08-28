<template>
  <v-navigation-drawer
    :model-value="modelValue"
    app
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-list nav density="comfortable">
      <template v-for="item in sidebarList" :key="item.title">
        <!-- GROUP -->
        <v-list-group v-if="item.children" :value="item.title">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="item.title"
              :prepend-icon="item.icon"
            />
          </template>

          <v-list-item
            v-for="child in item.children"
            :key="child.title"
            :title="child.title"
            prepend-icon="mdi-chevron-right"
            @click="goto(child.path)"
          />
        </v-list-group>

        <!-- NORMAL ITEM -->
        <v-list-item
          v-else
          :title="item.title"
          :prepend-icon="item.icon"
          @click="goto(item.path)"
        />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
// Loaded lazily (not at layout-bundle scope) so the ~170KB surah list only
// downloads once the drawer actually needs it, instead of on every page load.
const audioChildren = ref([]);
onMounted(async () => {
  const { default: surahsJson } = await import("~/assets/data/surah.json");
  audioChildren.value = surahsJson.map((surah, i) => ({
    title: surah.surahNameArabicLong,
    path: `/surah-audios/${i + 1}`,
  }));
});

const sidebarList = computed(() => [
  { title: "Home", icon: "mdi-home", path: "/" },
  { title: "Asma-ul-Husna", icon: "mdi-book", path: "/asma-ul-husna" },
  { title: "Surah Listing", icon: "mdi-view-list", path: "/surah-listing" },
  { title: "Search", icon: "mdi-magnify", path: "/search" },
  { title: "Prophets & People", icon: "mdi-account-group-outline", path: "/persons" },
  { title: "Peoples & Nations", icon: "mdi-map-marker-radius-outline", path: "/peoples" },
  { title: "Places", icon: "mdi-map-outline", path: "/places" },
  { title: "Stories", icon: "mdi-book-open-page-variant-outline", path: "/stories" },
  { title: "Themes", icon: "mdi-lightbulb-on-outline", path: "/themes" },
  { title: "Duas", icon: "mdi-hands-pray", path: "/duas" },
  { title: "Events", icon: "mdi-timeline-clock-outline", path: "/events" },
  { title: "Bookmarks", icon: "mdi-bookmark", path: "/bookmarks" },
  { title: "Reading Goals", icon: "mdi-target", path: "/goals" },
  { title: "Ramadan Mode", icon: "mdi-moon-waning-crescent", path: "/ramadan" },
  { title: "Hifz Mode", icon: "mdi-brain", path: "/hifz" },
  { title: "Downloads", icon: "mdi-download-outline", path: "/downloads" },
  { title: "Tasbeeh", icon: "mdi-counter", path: "/tasbeeh" },
  { title: "Sajda", icon: "mdi-airbag", path: "/sajda" },
  { title: "Per Page", icon: "mdi-note-multiple", path: "/per-page-read" },
  { title: "Prayer Times", icon: "mdi-clock-outline", path: "/prayerTime" },
  {
    title: "Qibla Direction",
    icon: "mdi-compass-outline",
    path: "/qibla-direction",
  },
  { title: "Calender", icon: "mdi-calendar", path: "/calender" },
  {
    title: "Audio",
    icon: "mdi-book",
    children: audioChildren.value,
  },
  {
    title: "Juz",
    icon: "mdi-book",
    children: Array.from({ length: 30 }, (_, i) => ({
      title: `Juz ${i + 1}`,
      path: `/juz/${i + 1}`,
    })),
  },

  { title: "Settings", icon: "mdi-cog", path: "/settings" },
  { title: "About", icon: "mdi-information", path: "/about" },
]);

const router = useRouter();

const goto = (path) => {
  router.push(path);
};

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>
<style scoped></style>
