<template>
  <v-card variant="outlined" rounded="lg" class="ruling-card">
    <v-card-item>
      <v-card-title class="ruling-subject">{{ ruling.subject.en }}</v-card-title>
    </v-card-item>

    <v-card-text class="pt-0">
      <!-- No entry for this marja': never fall back to another marja's ruling (decision P1). -->
      <v-alert v-if="!entry" type="info" variant="tonal" density="compact" class="mb-1">
        {{ missingMessage }}
        <a :href="marja.officialSite" target="_blank" rel="noopener noreferrer" class="ms-1">
          Official website <v-icon size="14" aria-hidden="true">mdi-open-in-new</v-icon>
        </a>
      </v-alert>

      <template v-else>
        <div class="d-flex flex-wrap ga-2 mb-3">
          <HukmBadge v-if="entry.hukm" :hukm="entry.hukm" />
          <BasisBadge :basis="entry.basis" />
          <v-chip v-if="entry.format === 'qa'" size="small" variant="outlined" prepend-icon="mdi-forum-outline">Q&amp;A</v-chip>
          <v-chip v-if="entry.excerpt" size="small" variant="outlined" prepend-icon="mdi-format-quote-open">Excerpt</v-chip>
        </div>

        <!-- English -->
        <div v-if="showEnglish" class="lang-block">
          <div v-if="entry.question?.en" class="qa-question">
            <span class="qa-label">Question</span>
            <p class="ruling-text">{{ entry.question.en }}</p>
          </div>
          <span v-if="entry.question?.en" class="qa-label">Answer</span>
          <p class="ruling-text">{{ entry.text.en }}</p>
          <SourceLine :source="entry.source" :marja-name="marja.name.en" :verification="entry.verification" />
        </div>

        <!-- Urdu — only from the marja's official Urdu book (decision R1) -->
        <div v-if="showUrdu" class="lang-block" :class="{ 'mt-4': showEnglish }">
          <div v-if="entry.question?.ur" class="qa-question">
            <span class="qa-label urdu-inline" lang="ur" dir="rtl">سوال</span>
            <p class="ruling-text urdu-text" lang="ur">{{ entry.question.ur }}</p>
          </div>
          <span v-if="entry.question?.ur" class="qa-label urdu-inline" lang="ur" dir="rtl">جواب</span>
          <p class="ruling-text urdu-text" lang="ur">{{ entry.text.ur }}</p>
          <SourceLine :source="entry.urSource" :marja-name="marja.name.en" urdu />
        </div>

        <!-- Decision P6a: app-written Urdu notice when the Urdu edition lags the revised ruling -->
        <div v-if="urduUnavailable && entry.urduEditionLag" class="lag-notice mt-2" role="note">
          <p class="urdu-text mb-0" lang="ur">{{ URDU_EDITION_LAG_NOTICE.text.ur }}</p>
          <p class="text-caption text-medium-emphasis mb-0">
            <v-icon size="14" aria-hidden="true">mdi-lightbulb-outline</v-icon>
            Explanation written by the app, not a ruling: {{ URDU_EDITION_LAG_NOTICE.text.en }}
          </p>
        </div>
        <p v-if="urduUnavailable" class="text-caption text-medium-emphasis mt-2 mb-0">
          <v-icon size="14" aria-hidden="true">mdi-translate-off</v-icon>
          No official Urdu text for this ruling yet, so the English is shown.
          <span v-if="entry.urduNote">{{ entry.urduNote }}</span>
        </p>
        <p v-if="entry.note" class="text-caption text-medium-emphasis mt-2 mb-0">
          <v-icon size="14" aria-hidden="true">mdi-information-outline</v-icon> {{ entry.note }}
        </p>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import HukmBadge from "~/components/wajibat/HukmBadge.vue";
import BasisBadge from "~/components/wajibat/BasisBadge.vue";
import SourceLine from "~/components/wajibat/SourceLine.vue";
import { getMarjaRuling } from "~/data/wajibat";
import { URDU_EDITION_LAG_NOTICE } from "~/utils/wajibatLabels";

const props = defineProps({
  ruling: { type: Object, required: true },
  marja: { type: Object, required: true },
  /** "en" | "ur" | "both" */
  lang: { type: String, default: "en" },
});

const entry = computed(() => getMarjaRuling(props.ruling, props.marja.id));
const hasUrdu = computed(() => !!entry.value?.text.ur);
const showUrdu = computed(() => props.lang !== "en" && hasUrdu.value);
const showEnglish = computed(() => props.lang !== "ur" || !hasUrdu.value);
const urduUnavailable = computed(() => props.lang !== "en" && !hasUrdu.value);

const missingMessage = computed(() =>
  props.marja.status === "pending-sources"
    ? `Rulings for ${props.marja.name.en} are being added — please refer to his official risala.`
    : `This ruling for ${props.marja.name.en} has not been added yet — please refer to his official risala.`
);
</script>

<style scoped>
.ruling-card {
  border-color: rgba(var(--v-theme-primary), 0.25);
}
.ruling-subject {
  white-space: normal;
  font-size: 1.05rem;
  line-height: 1.4;
}
.ruling-text {
  white-space: pre-line;
  line-height: 1.7;
  margin-bottom: 8px;
}
.qa-question {
  border-inline-start: 3px solid rgba(var(--v-theme-primary), 0.35);
  padding-inline-start: 10px;
  margin-bottom: 8px;
}
.qa-label {
  display: block;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 2px;
}
.lag-notice {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.25);
  border-radius: 8px;
  padding: 6px 10px;
  background: rgba(var(--v-theme-on-surface), 0.025);
}
.qa-label.urdu-inline {
  text-transform: none;
  letter-spacing: 0;
  font-size: 0.85rem;
  text-align: right;
}
</style>
