<template>
  <v-chip :color="meta.color" size="small" variant="flat">
    {{ meta.label }}
  </v-chip>
</template>

<script setup>
// Renders the A–E source-verification levels used across literary/poet
// modules (see mir_anis_module_research_extraction_plan.md §3). Levels A/B
// read as "verified" (green/blue); C/D/E read as research-only (amber/red)
// so a viewer never mistakes an attributed-but-unconfirmed line for a
// checked one.
const LEVELS = {
  A: { label: "A — Primary verified", color: "success" },
  B: { label: "B — Strong secondary", color: "light-blue-darken-1" },
  C: { label: "C — Attribution", color: "warning" },
  D: { label: "D — Disputed", color: "deep-orange" },
  E: { label: "E — Unverified", color: "error" },
};

const props = defineProps({
  level: { type: String, default: "E" },
});

const meta = computed(() => LEVELS[props.level] ?? { label: props.level || "Unverified", color: "grey" });
</script>
