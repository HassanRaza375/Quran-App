<template>
  <v-navigation-drawer :model-value="modelValue" app @update:model-value="emit('update:modelValue', $event)">
    <v-list nav density="comfortable">

      <v-list-item title="Home" prepend-icon="mdi-home" @click="goto('/')" />

      <v-list-item title="Search" prepend-icon="mdi-magnify" @click="goto('/search')" />

      <v-list-item title="Bookmarks" prepend-icon="mdi-bookmark" @click="goto('/bookmarks')" />

      <!-- JUZ COLLAPSIBLE -->
      <v-list-group value="juz">
        <!-- Activator -->
        <template #activator="{ props }">
          <v-list-item v-bind="props" title="Juz" prepend-icon="mdi-book" />
        </template>

        <!-- Children -->
        <v-list-item v-for="juz in 30" :key="juz" :title="`Juz ${juz}`" prepend-icon="mdi-chevron-right"
          @click="goto(`/juz/${juz}`)" />
      </v-list-group>

      <v-list-item title="Sajda" prepend-icon="mdi-airbag" @click="goto('/sajda')" />

      <v-list-item title="Settings" prepend-icon="mdi-cog" @click="goto('/settings')" />

      <v-list-item title="About" prepend-icon="mdi-information" @click="goto('/about')" />

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
<style scoped></style>