<template>
  <v-card variant="outlined" rounded="lg" class="ruling-card">
    <v-card-item>
      <v-card-title class="ruling-subject">{{ ruling.subject.en }}</v-card-title>
    </v-card-item>

    <v-card-text class="pt-0">
      <!-- No entry here, but his own book states this point inside another ruling on this page. -->
      <v-alert v-if="!entry && seeAlsoTarget" type="info" variant="tonal" density="compact" class="mb-1">
        {{ marja.name.en }}'s ruling on this point is part of
        <a :href="`#${seeAlsoTarget.id}`">“{{ seeAlsoTarget.subject.en }}”</a> on this page.
      </v-alert>
      <!-- No entry for this marja': never fall back to another marja's ruling (decision P1). -->
      <v-alert v-else-if="!entry" type="info" variant="tonal" density="compact" class="mb-1">
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

        <!-- Recitation shown separately from the ruling text (decision P12) — the
             Arabic may come from a different official book than the ruling itself
             (e.g. the marja's Urdu edition, when his English book shows it only as
             an image). Never spliced into `entry.text`. -->
        <div v-for="r in recitations" :key="r.id" class="recitation-block mt-3">
          <p class="recitation-arabic" lang="ar" dir="rtl">{{ r.arabic }}</p>
          <p v-if="r.transliteration" class="text-body-2 text-medium-emphasis mb-1">{{ r.transliteration }}</p>
          <SourceLine :source="r.source" :marja-name="marja.name.en" verification="A" urdu />
          <p v-if="r.note" class="text-caption text-medium-emphasis mt-1 mb-0">
            <v-icon size="14" aria-hidden="true">mdi-information-outline</v-icon> {{ r.note }}
          </p>
        </div>

        <!-- Decision P19: the marja's only official text is Urdu. -->
        <p v-if="urduOnly" class="withheld-notice text-body-2 mb-2" role="note">
          <v-icon size="16" aria-hidden="true">mdi-translate</v-icon>
          The official text of this ruling is in Urdu only: there is no official English translation, and the app does
          not translate rulings itself. To check it, see {{ marja.name.en }}'s own book ({{ entry.source.title }}) or
          ask his office through
          <a :href="marja.officialSite" target="_blank" rel="noopener noreferrer">his official website</a>.
        </p>
        <!-- Decision R11: the official English differs from the Persian original, so only the Urdu is shown. -->
        <p v-if="entry.englishWithheld !== undefined && !englishHeld" class="withheld-notice text-body-2 mb-2" role="note">
          <v-icon size="16" aria-hidden="true">mdi-translate</v-icon>
          The official English edition of this ruling differs from the Persian original, so only the official Urdu
          text (which matches the Persian) is shown. The app does not translate rulings itself.
        </p>
        <!-- Decision B1: an automated comparison found a difference; the version that matches the Persian is shown until a person checks. -->
        <p v-if="englishHeld" class="withheld-notice text-body-2 mb-2" role="note">
          <v-icon size="16" aria-hidden="true">mdi-translate</v-icon>
          An automated comparison found a difference in numbers or negation between the official English of this
          ruling and the Persian original, so only the official Urdu (which matches the Persian) is shown until a
          person has checked it. The app does not translate rulings itself.
        </p>

        <!-- Urdu — only from the marja's official Urdu book (decision R1) -->
        <div v-if="showUrdu" class="lang-block" :class="{ 'mt-4': showEnglish }">
          <div v-if="entry.question?.ur" class="qa-question">
            <span class="qa-label urdu-inline" lang="ur" dir="rtl">سوال</span>
            <p class="ruling-text urdu-text" lang="ur">{{ entry.question.ur }}</p>
          </div>
          <span v-if="entry.question?.ur" class="qa-label urdu-inline" lang="ur" dir="rtl">جواب</span>
          <p class="ruling-text urdu-text" lang="ur">{{ entry.text.ur }}</p>
          <SourceLine :source="entry.urSource" :marja-name="marja.name.en" urdu />
          <p v-if="entry.persianSource" class="text-caption text-medium-emphasis mt-1 mb-0">
            <v-icon size="14" aria-hidden="true">mdi-check-decagram-outline</v-icon>
            Compared with the Persian original:
            <a :href="entry.persianSource.url" target="_blank" rel="noopener noreferrer">{{ entry.persianSource.reference }}</a>
          </p>
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
import { getMarjaRuling, getRecitationById, getRulingById } from "~/data/wajibat";
import { URDU_EDITION_LAG_NOTICE } from "~/utils/wajibatLabels";

const props = defineProps({
  ruling: { type: Object, required: true },
  marja: { type: Object, required: true },
  /** "en" | "ur" | "both" */
  lang: { type: String, default: "en" },
});

const entry = computed(() => getMarjaRuling(props.ruling, props.marja.id));
const seeAlsoTarget = computed(() => {
  const s = (props.ruling.seeAlso ?? []).find((x) => x.marjaId === props.marja.id);
  return s ? getRulingById(s.rulingId) : undefined;
});
// Only the chosen marja's own recitations — never another marja's (same rule as rulings, P1).
const recitations = computed(() =>
  (props.ruling.recitationIds ?? [])
    .map((id) => getRecitationById(id))
    .filter((r) => r && r.marjaId === props.marja.id)
);
const hasUrdu = computed(() => !!entry.value?.text.ur);
const englishHeld = computed(() => /^Held for review/.test(entry.value?.englishWithheld ?? ""));
const urduOnly = computed(() => !!entry.value?.urduOnly);
const englishWithheld = computed(() => entry.value?.englishWithheld !== undefined);
// Withheld English (R11) or no official English (P19): the Urdu is the only text shown, in every language mode.
const urduIsOnlyText = computed(() => englishWithheld.value || urduOnly.value);
const showUrdu = computed(() => hasUrdu.value && (props.lang !== "en" || urduIsOnlyText.value));
const showEnglish = computed(() => !urduIsOnlyText.value && (props.lang !== "ur" || !hasUrdu.value));
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
.withheld-notice {
  border-inline-start: 3px solid rgba(var(--v-theme-warning), 0.6);
  padding-inline-start: 10px;
}
.lag-notice {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.25);
  border-radius: 8px;
  padding: 6px 10px;
  background: rgba(var(--v-theme-on-surface), 0.025);
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
.qa-label.urdu-inline {
  text-transform: none;
  letter-spacing: 0;
  font-size: 0.85rem;
  text-align: right;
}
</style>
