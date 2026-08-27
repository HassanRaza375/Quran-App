<template>
  <v-expansion-panels variant="accordion" class="surah-groups">
    <v-expansion-panel v-for="group in groups" :key="group.surahNumber">
      <v-expansion-panel-title>
        <span class="surah-group-title">{{ surahLabel(group.surahNumber) }}</span>
        <v-chip size="x-small" variant="tonal" class="ml-2">{{ group.references.length }}</v-chip>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="d-flex flex-column ga-3">
          <AyahReferenceCard
            v-for="ref in group.references"
            :key="`${ref.surahNumber}:${ref.ayahNumber}`"
            :surah-no="ref.surahNumber"
            :ayah-no="ref.ayahNumber"
            @open="$emit('open', $event)"
          />
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import AyahReferenceCard from "~/components/persons/AyahReferenceCard.vue";

defineProps({
  groups: { type: Array, required: true },
});
defineEmits(["open"]);
</script>

<style scoped>
.surah-group-title {
  font-weight: 600;
}
</style>
