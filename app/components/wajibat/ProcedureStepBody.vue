<template>
  <div class="step-body">
    <div class="d-flex align-center flex-wrap ga-2 mb-2">
      <span class="step-number" aria-hidden="true">{{ step.order }}</span>
      <h3 class="step-title">{{ step.title.en }}</h3>
      <HukmBadge v-if="step.hukm" :hukm="step.hukm" />
      <v-chip v-if="step.isRukn" size="small" color="secondary" variant="flat" prepend-icon="mdi-pillar">Rukn</v-chip>
    </div>
    <!-- Decision B1: where the official English is held back (or withheld, R11), the step shows the official Urdu of the same ruling. -->
    <template v-if="showUrdu">
      <p class="withheld-notice text-body-2 mb-2" role="note">
        <v-icon size="16" aria-hidden="true">mdi-translate</v-icon>
        <template v-if="held">An automated comparison found a difference between the official English of this ruling and the Persian original, so the official Urdu (which matches the Persian) is shown until a person has checked it. The app does not translate rulings itself.</template>
        <template v-else>The official English of this ruling differs from the Persian original, so the official Urdu (which matches the Persian) is shown. The app does not translate rulings itself.</template>
      </p>
      <blockquote class="step-quote urdu-quote" lang="ur" dir="rtl">{{ step.instruction.ur }}</blockquote>
    </template>
    <blockquote v-else class="step-quote">{{ step.instruction.en }}</blockquote>
    <!-- Recitation shown separately from the quoted instruction (decision P12) —
         may be sourced from a different official book than the step's ruling. -->
    <div v-for="r in recitations" :key="r.id" class="recitation-block mb-2">
      <p class="recitation-arabic" lang="ar" dir="rtl">{{ r.arabic }}</p>
      <p v-if="r.transliteration" class="text-body-2 text-medium-emphasis mb-1">{{ r.transliteration }}</p>
      <SourceLine :source="r.source" :marja-name="marja.name.en" verification="A" urdu />
    </div>
    <SourceLine v-if="entry" :source="entry.source" :marja-name="marja.name.en" :verification="entry.verification" />
    <p v-if="step.note" class="text-caption text-medium-emphasis mt-1 mb-0">{{ step.note }}</p>
  </div>
</template>

<script setup>
import HukmBadge from "~/components/wajibat/HukmBadge.vue";
import SourceLine from "~/components/wajibat/SourceLine.vue";
import { getRecitationById } from "~/data/wajibat";

const props = defineProps({
  step: { type: Object, required: true },
  marja: { type: Object, required: true },
  /** The marja's entry of the ruling the step quotes (for its source line). */
  entry: { type: Object, default: null },
});

const held = computed(() => /^Held for review/.test(props.entry?.englishWithheld ?? ""));
const showUrdu = computed(() => props.entry?.englishWithheld !== undefined && !!props.step.instruction.ur);

const recitations = computed(() =>
  (props.step.recitationIds ?? [])
    .map((id) => getRecitationById(id))
    .filter((r) => r && r.marjaId === props.marja.id)
);
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
.withheld-notice {
  border-inline-start: 3px solid rgba(var(--v-theme-warning), 0.6);
  padding-inline-start: 10px;
}
.urdu-quote {
  font-family: "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif;
  font-size: 1.15rem;
  line-height: 2.1;
  text-align: right;
}
.recitation-block {
  border-inline-start: 3px solid rgba(var(--v-theme-secondary), 0.35);
  padding-inline-start: 10px;
}
.recitation-arabic {
  font-family: "Amiri Quran", serif;
  font-size: 1.25rem;
  line-height: 1.8;
  margin-bottom: 4px;
}
</style>
