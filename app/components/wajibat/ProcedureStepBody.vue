<template>
  <div class="step-body">
    <div class="d-flex align-center flex-wrap ga-2 mb-2">
      <span class="step-number" aria-hidden="true">{{ step.order }}</span>
      <h3 class="step-title">{{ step.title.en }}</h3>
      <HukmBadge v-if="step.hukm" :hukm="step.hukm" />
      <v-chip v-if="step.isRukn" size="small" color="secondary" variant="flat" prepend-icon="mdi-pillar">Rukn</v-chip>
    </div>
    <blockquote class="step-quote">{{ step.instruction.en }}</blockquote>
    <SourceLine v-if="entry" :source="entry.source" :marja-name="marja.name.en" :verification="entry.verification" />
    <p v-if="step.note" class="text-caption text-medium-emphasis mt-1 mb-0">{{ step.note }}</p>
  </div>
</template>

<script setup>
import HukmBadge from "~/components/wajibat/HukmBadge.vue";
import SourceLine from "~/components/wajibat/SourceLine.vue";

defineProps({
  step: { type: Object, required: true },
  marja: { type: Object, required: true },
  /** The marja's entry of the ruling the step quotes (for its source line). */
  entry: { type: Object, default: null },
});
</script>

<style scoped>
.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}
.step-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
}
.step-quote {
  border-inline-start: 3px solid rgba(var(--v-theme-primary), 0.4);
  padding: 4px 0 4px 12px;
  margin: 0 0 8px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
