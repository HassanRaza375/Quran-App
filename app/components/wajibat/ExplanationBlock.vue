<template>
  <div class="explanation-block">
    <div class="explanation-label">
      <v-icon size="14" aria-hidden="true">mdi-lightbulb-outline</v-icon>
      {{ heading || "Explanation" }}
      <span class="explanation-kind">· written by the app, not a ruling</span>
    </div>
    <p class="explanation-text">{{ explanation.text.en }}</p>
    <p v-if="explanation.text.ur" class="explanation-text urdu-text" lang="ur">{{ explanation.text.ur }}</p>
  </div>
</template>

<script setup>
defineProps({
  explanation: { type: Object, required: true },
  heading: { type: String, default: "" },
});
</script>

<style scoped>
.explanation-block {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.25);
  border-radius: 10px;
  padding: 12px 14px;
  background: rgba(var(--v-theme-on-surface), 0.025);
}
.explanation-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-bottom: 6px;
}
.explanation-kind {
  font-weight: 400;
}
.explanation-text {
  white-space: pre-line;
  line-height: 1.7;
  margin: 0;
  font-style: italic;
}
</style>
