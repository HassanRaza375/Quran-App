<template>
  <v-navigation-drawer :model-value="modelValue" app @update:model-value="emit('update:modelValue', $event)">
    <v-list>
      <v-list-item @click="goto('/')" title="Home" prepend-icon="mdi-home" />
      <v-list-item @click="goto('/search')" title="Search" prepend-icon="mdi-magnify" />
      <v-list-item @click="goto('/bookmarks')" title="Bookmarks" prepend-icon="mdi-bookmark" />
      <v-list-item @click="goto('/juz')" title="Juz" prepend-icon="mdi-book" />
      <v-list-item @click="goto('/settings')" title="Settings" prepend-icon="mdi-cog" />
      <v-list-item @click="goto('/about')" title="About" prepend-icon="mdi-information" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useRouter } from 'vue-router'

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
