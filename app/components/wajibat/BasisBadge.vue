<template>
  <v-tooltip :text="meta.hint" location="top">
    <template #activator="{ props: tip }">
      <v-chip
        v-bind="tip"
        size="small"
        variant="outlined"
        class="basis-chip"
        :prepend-icon="meta.icon"
        tabindex="0"
        :aria-label="`${meta.label}: ${meta.hint}`"
      >
        {{ meta.label }}
      </v-chip>
    </template>
  </v-tooltip>
</template>

<script setup>
import { BASIS_META } from "~/utils/wajibatLabels";

const props = defineProps({
  basis: { type: String, required: true },
});

const meta = computed(() => BASIS_META[props.basis] ?? { label: props.basis, icon: "mdi-help-circle-outline", hint: "" });
</script>

<style scoped>
/* Some labels are long ("Precaution (type not specified in the source)") — wrap on narrow screens. */
.basis-chip {
  white-space: normal;
  height: auto !important;
  min-height: 24px;
  max-width: 100%;
}
</style>
