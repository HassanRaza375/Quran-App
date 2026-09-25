<template>
  <v-container v-if="topic && category" class="fiqh-container">
    <div class="d-flex justify-space-between align-center flex-wrap ga-2 mb-2">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="`/fiqh/${category.id}`">{{ category.title.en }}</v-btn>
      <v-btn
        variant="tonal"
        :color="isBookmarked ? 'amber' : undefined"
        :prepend-icon="isBookmarked ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
        @click="toggleBookmark"
      >
        {{ isBookmarked ? "Saved" : "Save" }}
      </v-btn>
    </div>

    <!-- Header -->
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-4">
      <div v-if="topic.arabicTerm" class="arabic-term" lang="ar" dir="rtl">{{ topic.arabicTerm }}</div>
      <h1 class="hero-title">
        {{ topic.title.en }}
        <span v-if="topic.title.ur" class="urdu-inline ms-2 text-medium-emphasis" lang="ur" dir="rtl">{{ topic.title.ur }}</span>
      </h1>
    </v-sheet>

    <FiqhNotices show-review-label class="mb-3" />

    <div v-if="loaded && marja" class="d-flex flex-wrap align-center justify-space-between ga-3 mb-5">
      <MarjaChip />
      <LangToggle />
    </div>

    <!-- 1. Summary (app-written) -->
    <section class="mb-6" aria-labelledby="sec-summary">
      <h2 id="sec-summary" class="section-title">Overview</h2>
      <ExplanationBlock :explanation="topic.summary" />
      <ExplanationBlock
        v-for="(e, i) in topic.explanations ?? []"
        :key="i"
        :explanation="e.body"
        :heading="e.heading.en"
        class="mt-3"
      />
    </section>

    <!-- 2. Qur'anic basis (decision R2: only ayahs whose own text names the act) -->
    <section v-if="topic.quranicBasis?.length" class="mb-6" aria-labelledby="sec-quran">
      <h2 id="sec-quran" class="section-title">Qur'anic basis</h2>
      <p class="text-body-2 text-medium-emphasis mb-3">
        Ayahs whose own words name this act. They are shown for study alongside the rulings; how
        the act is performed is set out in your marja's rulings below.
      </p>
      <div class="d-flex flex-column ga-3">
        <AyahReferenceCard
          v-for="ref in quranicAyahs"
          :key="`${ref.surahNo}:${ref.ayahNo}`"
          :surah-no="ref.surahNo"
          :ayah-no="ref.ayahNo"
        />
      </div>
    </section>

    <!-- 3. Rulings -->
    <section class="mb-6" aria-labelledby="sec-rulings">
      <h2 id="sec-rulings" class="section-title">Rulings</h2>

      <div v-if="!loaded" class="py-6 text-center">
        <v-progress-circular indeterminate color="primary" aria-label="Loading your marja' preference" />
      </div>

      <v-card v-else-if="!marja" variant="outlined" rounded="lg" class="pa-4">
        <p class="mb-3">Choose your marja' to see the rulings on this topic. You'll only see his rulings.</p>
        <MarjaPicker />
      </v-card>

      <template v-else>
        <p v-if="!rulings.length" class="text-medium-emphasis">
          This topic is an overview and has no rulings of its own. The rulings are in the related topics below.
        </p>
        <div class="d-flex flex-column ga-4">
          <RulingCard v-for="r in mainRulings" :id="r.id" :key="r.id" :ruling="r" :marja="marja" :lang="lang" />
        </div>

        <!-- Women-specific / sensitive rulings: full detail, collapsed by default (Q8) -->
        <v-expansion-panels v-if="sensitiveRulings.length" class="mt-4" variant="accordion">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="me-2" aria-hidden="true">mdi-human-female</v-icon>
              Rulings specific to women ({{ sensitiveRulings.length }})
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="d-flex flex-column ga-4 pt-2">
                <RulingCard v-for="r in sensitiveRulings" :id="r.id" :key="r.id" :ruling="r" :marja="marja" :lang="lang" />
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </section>

    <!-- 4. Step-by-step (the chosen marja's procedures only) -->
    <section v-if="marja && topic.procedureIds?.length" class="mb-6" aria-labelledby="sec-steps">
      <h2 id="sec-steps" class="section-title">Step by step</h2>
      <div v-if="procedures.length" class="d-flex flex-column ga-4">
        <ProcedureStepper v-for="p in procedures" :key="p.id" :procedure="p" :marja="marja" />
      </div>
      <v-alert v-else type="info" variant="tonal" density="compact">
        A step-by-step guide according to {{ marja.name.en }} has not been added for this topic yet.
        The rulings above still apply.
      </v-alert>
    </section>

    <!-- 5. Related topics -->
    <section v-if="relatedTopics.length" class="mb-6" aria-labelledby="sec-related">
      <h2 id="sec-related" class="section-title">Related topics</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip
          v-for="t in relatedTopics"
          :key="t.id"
          :to="`/fiqh/${t.categoryId}/${t.id}`"
          variant="outlined"
          prepend-icon="mdi-link-variant"
        >
          {{ t.title.en }}
        </v-chip>
      </div>
    </section>

    <!-- 6. Terms -->
    <section v-if="terms.length" class="mb-6" aria-labelledby="sec-terms">
      <h2 id="sec-terms" class="section-title">Terms used</h2>
      <v-table density="compact" class="terms-table">
        <tbody>
          <tr v-for="g in terms" :key="g.id">
            <th scope="row" class="term-cell">
              <NuxtLink :to="{ path: '/fiqh/glossary', hash: `#${g.id}` }">{{ g.term }}</NuxtLink>
            </th>
            <td>{{ g.definition.en }}</td>
          </tr>
        </tbody>
      </v-table>
    </section>

    <!-- 7. Sources -->
    <section v-if="marja && sourcesUsed.length" class="mb-6" aria-labelledby="sec-sources">
      <h2 id="sec-sources" class="section-title">Sources on this page</h2>
      <ul class="sources-list">
        <li v-for="s in sourcesUsed" :key="s.url + s.title">
          <a :href="s.url" target="_blank" rel="noopener noreferrer">
            <span :class="{ 'urdu-inline': s.urdu }" :lang="s.urdu ? 'ur' : undefined">{{ s.title }}</span>
          </a>
          — {{ s.refs.join(", ") }}
        </li>
      </ul>
      <p class="text-caption text-medium-emphasis">Texts last checked against the official websites on {{ topic.lastSourceCheck }}.</p>
    </section>

    <FiqhDisclaimer :marja="marja" />
  </v-container>

  <v-container v-else class="fiqh-container">
    <v-alert type="warning" variant="tonal">This topic doesn't exist.</v-alert>
    <v-btn class="mt-4" variant="tonal" to="/fiqh" prepend-icon="mdi-arrow-left">Back to Daily Fiqh</v-btn>
  </v-container>
</template>

<script setup>
import AyahReferenceCard from "~/components/persons/AyahReferenceCard.vue";
import FiqhNotices from "~/components/wajibat/FiqhNotices.vue";
import MarjaChip from "~/components/wajibat/MarjaChip.vue";
import MarjaPicker from "~/components/wajibat/MarjaPicker.vue";
import LangToggle from "~/components/wajibat/LangToggle.vue";
import ExplanationBlock from "~/components/wajibat/ExplanationBlock.vue";
import RulingCard from "~/components/wajibat/RulingCard.vue";
import FiqhDisclaimer from "~/components/wajibat/FiqhDisclaimer.vue";
import ProcedureStepper from "~/components/wajibat/ProcedureStepper.vue";
import { getProcedureById } from "~/data/wajibat";

const route = useRoute();
useUrduFont();
const { getCategoryById, getTopicById, getGlossaryTermById, getMarjaById, getMarjaRuling, rulingsFor } = useWajibat();
const { marjaId, lang, loaded, load } = useFiqhPrefs();
const { load: loadBookmarks, has, toggle } = useBookmarks();
onMounted(() => {
  load();
  loadBookmarks();
});

const topic = computed(() => {
  const t = getTopicById(String(route.params.topic));
  return t && t.categoryId === String(route.params.category) ? t : undefined;
});
const category = computed(() => (topic.value ? getCategoryById(topic.value.categoryId) : undefined));
const marja = computed(() => getMarjaById(marjaId.value));

useHead(() => ({ title: topic.value ? `${topic.value.title.en} — Daily Fiqh` : "Not found" }));
useSeoMeta({ description: () => topic.value?.summary.text.en });

const rulings = computed(() => (topic.value ? rulingsFor(topic.value) : []));
const mainRulings = computed(() => rulings.value.filter((r) => !r.sensitive));
const sensitiveRulings = computed(() => rulings.value.filter((r) => r.sensitive));

// Only the chosen marja's procedures — never another marja's (decision P1).
const procedures = computed(() =>
  (topic.value?.procedureIds ?? [])
    .map(getProcedureById)
    .filter((p) => p && marja.value && p.marjaId === marja.value.id)
);

const relatedTopics = computed(() => (topic.value?.relatedTopicIds ?? []).map(getTopicById).filter(Boolean));
const terms = computed(() => (topic.value?.glossaryIds ?? []).map(getGlossaryTermById).filter(Boolean));

const quranicAyahs = computed(() =>
  (topic.value?.quranicBasis ?? []).flatMap((q) => {
    if (q.ayahNumber) return [{ surahNo: q.surahNumber, ayahNo: q.ayahNumber }];
    const out = [];
    for (let a = q.ayahStart ?? 1; a <= (q.ayahEnd ?? q.ayahStart ?? 1); a++) out.push({ surahNo: q.surahNumber, ayahNo: a });
    return out;
  })
);

// Books actually cited on this page for the chosen marja', with the issue/Q numbers.
const sourcesUsed = computed(() => {
  if (!marja.value) return [];
  const map = new Map();
  const add = (src, urdu) => {
    if (!src) return;
    const key = src.title;
    if (!map.has(key)) map.set(key, { title: src.title, url: src.url, urdu, refs: [] });
    const row = map.get(key);
    if (!row.refs.includes(src.reference)) row.refs.push(src.reference);
  };
  for (const r of rulings.value) {
    const e = getMarjaRuling(r, marja.value.id);
    if (!e) continue;
    add(e.source, false);
    if (lang.value !== "en") add(e.urSource, true);
  }
  return [...map.values()];
});

const bookmarkKey = computed(() => (topic.value ? `fiqh:${topic.value.id}` : null));
const isBookmarked = computed(() => (bookmarkKey.value ? has(bookmarkKey.value) : false));
const toggleBookmark = () => {
  if (bookmarkKey.value) toggle(bookmarkKey.value);
};

// Deep links from search (#rulingId) — scroll once the rulings have rendered.
watch(
  () => [loaded.value, marja.value],
  async ([isLoaded, m]) => {
    if (!isLoaded || !m || !route.hash) return;
    await nextTick();
    document.querySelector(route.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
);
</script>

<style scoped>
.fiqh-container {
  max-width: 900px;
  margin: auto;
  padding-bottom: 60px;
}
.hero {
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.06), rgba(var(--v-theme-secondary), 0.06));
}
.hero-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
}
.arabic-term {
  font-family: "Amiri Quran", serif;
  font-size: 1.5rem;
}
.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
}
.term-cell {
  white-space: nowrap;
  vertical-align: top;
  font-weight: 600;
  width: 1%;
}
.terms-table :deep(td),
.terms-table :deep(th) {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}
.sources-list {
  padding-inline-start: 20px;
  line-height: 1.8;
}
</style>
