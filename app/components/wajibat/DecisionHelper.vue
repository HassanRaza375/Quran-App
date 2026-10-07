<!-- A step-by-step helper (Phase 4b): one question per screen about the user's situation, ending in
     the marja's own wording or a pointer to his risala. Nothing here is a ruling written by the app
     (decision P17). Every question offers "I'm not sure", which leads to the risala pointer and never
     to a guessed answer (R12). -->
<template>
  <v-card variant="outlined" rounded="lg" class="decision-helper pa-4" :aria-labelledby="`dh-title-${tree.id}`">
    <div class="d-flex flex-wrap align-center ga-2 mb-2">
      <h3 :id="`dh-title-${tree.id}`" class="dh-title">{{ tree.title.en }}</h3>
      <v-chip size="small" variant="tonal" color="primary" prepend-icon="mdi-account-school-outline">{{ marja.name.en }}</v-chip>
      <v-chip size="small" variant="outlined" color="warning" prepend-icon="mdi-account-alert-outline">Not scholar-reviewed</v-chip>
    </div>

    <template v-if="!started">
      <p class="text-body-2 mb-3">{{ tree.intro.text.en }}</p>
      <v-btn color="primary" prepend-icon="mdi-play" @click="started = true">Start</v-btn>
    </template>

    <template v-else>
      <!-- answers so far -->
      <ol v-if="trail.length" class="trail text-caption mb-3" aria-label="Your answers so far">
        <li v-for="(t, i) in trail" :key="i"><span class="text-medium-emphasis">{{ t.question }}</span> <strong>{{ t.answer }}</strong></li>
      </ol>

      <!-- question screen -->
      <div v-if="node.question" :key="node.id">
        <v-radio-group v-model="choice" :aria-label="node.question.text.en" hide-details class="mb-3">
          <template #label>
            <span class="dh-question">{{ node.question.text.en }}</span>
          </template>
          <v-radio v-for="o in node.options" :key="o.id" :value="o.id" :label="o.label.en" />
          <v-radio value="__notsure" label="I'm not sure" />
        </v-radio-group>
        <div class="d-flex flex-wrap ga-2">
          <v-btn color="primary" :disabled="!choice" append-icon="mdi-arrow-right" @click="next">Next</v-btn>
          <v-btn variant="text" :disabled="!trail.length" prepend-icon="mdi-arrow-left" @click="back">Back</v-btn>
          <v-btn variant="text" prepend-icon="mdi-restart" @click="restart">Start over</v-btn>
        </div>
      </div>

      <!-- result screen -->
      <div v-else aria-live="polite" class="result">
        <template v-if="node.outcome?.kind === 'ruling'">
          <p class="text-caption text-medium-emphasis mb-2">
            According to {{ marja.name.en }}, in his own words (shown exactly as published; the app does not paraphrase or translate it):
          </p>
          <div v-for="(q, i) in node.outcome.quotes" :key="i" class="quote mb-3">
            <p v-if="firstOf(i) && quoteMeta(q).urduOnly" class="withheld-notice text-body-2 mb-2" role="note">
              <v-icon size="16" aria-hidden="true">mdi-translate</v-icon>
              No official English translation exists for this text, so it is shown in Urdu, exactly as published. English readers can check it in
              {{ marja.name.en }}'s own risala ({{ quoteMeta(q).source.title }}) or ask his office through
              <a :href="marja.officialSite" target="_blank" rel="noopener noreferrer">his official website</a>.
            </p>
            <p v-else-if="firstOf(i) && quoteMeta(q).englishWithheld" class="withheld-notice text-body-2 mb-2" role="note">
              <v-icon size="16" aria-hidden="true">mdi-translate</v-icon>
              The official English of this ruling differs from the Persian original, so the official Urdu (which matches the Persian) is shown.
            </p>
            <blockquote class="quote-text" :class="{ 'urdu-inline': q.lang === 'ur' }" :lang="q.lang" :dir="q.lang === 'ur' ? 'rtl' : 'ltr'">
              <template v-for="(seg, j) in segments(q.text)" :key="j"><mark v-if="seg.hit">{{ seg.text }}</mark><template v-else>{{ seg.text }}</template></template>
            </blockquote>
            <SourceLine :source="quoteMeta(q).source" :marja-name="marja.name.en" :verification="quoteMeta(q).verification" :urdu="q.lang === 'ur'" />
            <p v-if="lastOf(i) && quoteMeta(q).note" class="text-caption text-medium-emphasis mb-1">
              <v-icon size="14" aria-hidden="true">mdi-information-outline</v-icon> {{ quoteMeta(q).note }}
            </p>
            <a v-if="lastOf(i)" :href="`#${q.rulingId}`" class="text-caption" @click="openRuling(q.rulingId, $event)">Open the full ruling on this page</a>
          </div>
          <p v-if="seeTitles.length" class="text-body-2 mb-2">
            Related:
            <template v-for="(s, i) in seeTitles" :key="s.id"><a :href="`#${s.id}`" @click="openRuling(s.id, $event)">{{ s.title }}</a><span v-if="i < seeTitles.length - 1">, </span></template>
          </p>
        </template>

        <template v-else-if="node.outcome?.kind === 'refer'">
          <v-alert type="info" variant="tonal" icon="mdi-book-open-variant" class="mb-3">
            <p class="mb-2">{{ node.outcome.reason.text.en }}</p>
            <p class="mb-0">
              Where to look: {{ tree.risala.book }}, {{ tree.risala.location }}.
              <a :href="tree.risala.url" target="_blank" rel="noopener noreferrer">Open it on the official website</a>
              or ask {{ marja.name.en }}'s office through
              <a :href="marja.officialSite" target="_blank" rel="noopener noreferrer">his official website</a>.
            </p>
          </v-alert>
        </template>

        <p class="text-caption text-medium-emphasis mt-2 mb-3">
          {{ marja.name.en }} · Not scholar-reviewed. This helper only points to his published text; if your situation is unusual, ask him or his office.
        </p>
        <div class="d-flex flex-wrap ga-2">
          <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="back">Back</v-btn>
          <v-btn color="primary" variant="tonal" prepend-icon="mdi-restart" @click="restart">Start over</v-btn>
        </div>
      </div>
    </template>
  </v-card>
</template>

<script setup>
import SourceLine from "~/components/wajibat/SourceLine.vue";
import { getRulingById, getMarjaRuling } from "~/data/wajibat";

const props = defineProps({
  tree: { type: Object, required: true },
  marja: { type: Object, required: true },
});

const started = ref(false);
const history = ref([]); // [{ nodeId, optionId, answer }]
const choice = ref(null);
const nodes = computed(() => new Map(props.tree.nodes.map((n) => [n.id, n])));
const node = computed(() => {
  const last = history.value[history.value.length - 1];
  return nodes.value.get(last ? last.nextId : props.tree.rootId);
});
const trail = computed(() => history.value.map((h) => ({ question: nodes.value.get(h.nodeId).question.text.en, answer: h.answer })));

const next = () => {
  const n = node.value;
  if (choice.value === "__notsure") history.value.push({ nodeId: n.id, nextId: n.notSureId, answer: "I'm not sure" });
  else {
    const o = n.options.find((x) => x.id === choice.value);
    if (!o) return;
    history.value.push({ nodeId: n.id, nextId: o.nextId, answer: o.label.en });
  }
  choice.value = null;
};
const back = () => {
  history.value.pop();
  choice.value = null;
};
const restart = () => {
  history.value = [];
  choice.value = null;
};

// A ruling quoted in several parts shows its notice once (before the first part) and its link once (after the last).
const firstOf = (i) => node.value.outcome.quotes.findIndex((x) => x.rulingId === node.value.outcome.quotes[i].rulingId) === i;
const lastOf = (i) => node.value.outcome.quotes.findLastIndex((x) => x.rulingId === node.value.outcome.quotes[i].rulingId) === i;

const quoteMeta = (q) => {
  const e = getMarjaRuling(getRulingById(q.rulingId), props.marja.id);
  const urdu = q.lang === "ur";
  return {
    source: urdu && e.urSource ? e.urSource : e.source,
    verification: e.verification,
    urduOnly: !!e.urduOnly,
    englishWithheld: e.englishWithheld !== undefined,
    note: e.urduOnly ? undefined : e.note, // the Urdu-only label is already shown above
  };
};

// Highlight the phrases that state the answer (they are verbatim parts of the quotes).
const segments = (text) => {
  const phrases = node.value.outcome?.verdictPhrases ?? [];
  const marks = [];
  for (const p of phrases) {
    const i = text.indexOf(p);
    if (i >= 0) marks.push([i, i + p.length]);
  }
  marks.sort((a, b) => a[0] - b[0]);
  const out = [];
  let pos = 0;
  for (const [a, b] of marks) {
    if (a < pos) continue;
    if (a > pos) out.push({ text: text.slice(pos, a), hit: false });
    out.push({ text: text.slice(a, b), hit: true });
    pos = b;
  }
  if (pos < text.length) out.push({ text: text.slice(pos), hit: false });
  return out;
};

const seeTitles = computed(() =>
  (node.value.outcome?.seeRulingIds ?? [])
    .map((id) => ({ id, title: getRulingById(id)?.title?.en }))
    .filter((s) => s.title)
);

const openRuling = (id, ev) => {
  const el = document.getElementById(id);
  if (!el) return;
  ev.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>

<style scoped>
.dh-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
}
.dh-question {
  font-weight: 600;
  font-size: 1rem;
  color: rgb(var(--v-theme-on-surface));
  white-space: normal;
}
.trail {
  padding-inline-start: 18px;
  margin: 0;
}
.quote-text {
  margin: 0 0 6px;
  padding: 8px 12px;
  border-inline-start: 3px solid rgba(var(--v-theme-primary), 0.5);
  background: rgba(var(--v-theme-on-surface), 0.03);
  white-space: pre-line;
  font-size: 0.98rem;
  line-height: 1.7;
}
.quote-text.urdu-inline {
  font-size: 1.15rem;
  line-height: 2.1;
}
.quote-text mark {
  background: rgba(var(--v-theme-warning), 0.3);
  color: inherit;
  padding: 0 2px;
  border-radius: 3px;
}
.withheld-notice {
  border-inline-start: 3px solid rgba(var(--v-theme-warning), 0.6);
  padding-inline-start: 10px;
}
</style>
