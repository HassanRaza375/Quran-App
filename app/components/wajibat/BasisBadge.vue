<template>
  <v-tooltip :text="meta.hint" location="top">
    <template #activator="{ props: tip }">
      <v-chip
        v-bind="tip"
        size="small"
        variant="outlined"
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
