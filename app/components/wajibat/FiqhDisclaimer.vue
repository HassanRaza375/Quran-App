<template>
  <v-alert variant="tonal" type="warning" density="compact" icon="mdi-scale-balance" class="fiqh-disclaimer">
    This is a study aid based on the published rulings of
    {{ marja ? marja.name.en : "the maraji'" }}. For your own situation, consult your marja's official
    risala or office.
    <template v-if="marja">
      <a :href="marja.officialSite" target="_blank" rel="noopener noreferrer" class="ms-1">
        {{ marja.officialSite.replace(/^https?:\/\//, "") }} <v-icon size="14" aria-hidden="true">mdi-open-in-new</v-icon>
      </a>
    </template>
  </v-alert>
</template>

<script setup>
defineProps({
  marja: { type: Object, default: null },
});
</script>
