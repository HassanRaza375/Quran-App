<template>
  <v-chip size="small" variant="tonal" :color="meta.color" :prepend-icon="meta.icon" class="font-weight-medium">
    {{ meta.label }}
  </v-chip>
</template>

<script setup>
import { HUKM_META } from "~/utils/wajibatLabels";

const props = defineProps({
  hukm: { type: String, required: true },
});

const meta = computed(() => HUKM_META[props.hukm] ?? { label: props.hukm, icon: "mdi-help-circle-outline" });
</script>
