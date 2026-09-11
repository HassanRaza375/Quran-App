<template>
  <v-container v-if="data">
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-4">
      <div class="d-flex align-center justify-space-between flex-wrap ga-2">
        <div>
          <h1 class="text-h4">{{ data.poet.name }}</h1>
          <div class="text-subtitle-1 text-medium-emphasis">{{ data.poet.name_urdu }}</div>
        </div>
        <v-chip color="warning" variant="tonal">{{ data.poet.module_status === "seed" ? "Seed data — not yet fully verified" : data.poet.module_status }}</v-chip>
      </div>
      <p class="text-body-2 mt-2">{{ data.poet.tagline }}</p>
      <v-alert v-if="data.poet.module_status_note" type="info" variant="tonal" density="compact" class="mt-3">
        {{ data.poet.module_status_note }}
      </v-alert>
    </v-sheet>

    <v-tabs v-model="tab" density="comfortable" show-arrows class="mb-4">
      <v-tab value="overview">Overview</v-tab>
      <v-tab value="biography">Biography</v-tab>
      <v-tab value="works">Works & Collections</v-tab>
      <v-tab value="karbala">Karbala & Characters</v-tab>
      <v-tab value="themes">Themes</v-tab>
      <v-tab value="poetry">Poetry Library</v-tab>
      <v-tab value="notes">Sources & Research Notes</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- Overview -->
      <v-window-item value="overview">
        <v-card rounded="xl" class="pa-4 mb-4">
          <div class="text-subtitle-1 font-weight-bold mb-2">Historical & Literary Context</div>
          <p class="text-body-2">{{ data.historical_context.summary }}</p>
          <p class="text-caption text-medium-emphasis mt-2">{{ data.historical_context.caveat }}</p>
        </v-card>
        <v-card rounded="xl" class="pa-4">
          <div class="text-subtitle-1 font-weight-bold mb-2">Genres</div>
          <v-row dense>
            <v-col v-for="g in data.genres" :key="g.genre" cols="12" sm="6">
              <div class="d-flex align-center justify-space-between">
                <span class="font-weight-medium">{{ g.genre }} <span class="text-medium-emphasis">({{ g.genre_urdu }})</span></span>
                <v-chip size="x-small" :color="attestationColor(g.attestation)" variant="tonal">{{ g.attestation }}</v-chip>
              </div>
              <p class="text-caption text-medium-emphasis mb-3">{{ g.description }}</p>
            </v-col>
          </v-row>
        </v-card>
      </v-window-item>

      <!-- Biography -->
      <v-window-item value="biography">
        <v-card rounded="xl" class="pa-4">
          <v-table density="comfortable">
            <tbody>
              <tr v-for="row in biographyRows" :key="row.label">
                <td class="text-medium-emphasis" style="white-space:nowrap">{{ row.label }}</td>
                <td>
                  {{ row.value }}
                  <VerificationBadge v-if="row.status" :level="row.status" class="ml-2" />
                  <div v-if="row.note" class="text-caption text-medium-emphasis mt-1">{{ row.note }}</div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-window-item>

      <!-- Works & Collections -->
      <v-window-item value="works">
        <v-card rounded="xl" class="pa-4 mb-4">
          <div class="text-subtitle-1 font-weight-bold mb-2">Collections</div>
          <div v-for="c in data.collections" :key="c.name" class="mb-3">
            <div class="d-flex align-center justify-space-between flex-wrap ga-2">
              <div class="font-weight-medium">{{ c.name }} <span class="text-medium-emphasis">({{ c.name_urdu }})</span></div>
              <VerificationBadge v-if="c.source_status" :level="c.source_status" />
            </div>
            <p v-if="editionLine(c)" class="text-caption">{{ editionLine(c) }}</p>
            <p class="text-caption text-medium-emphasis">{{ c.note || c.status }}</p>
          </div>
        </v-card>
        <v-card rounded="xl" class="pa-4">
          <div class="text-subtitle-1 font-weight-bold mb-2">Works</div>
          <v-list lines="two">
            <v-list-item v-for="w in data.works" :key="w.work_id">
              <template #title>
                <span class="urdu-text">{{ w.title_urdu }}</span>
              </template>
              <template #subtitle>{{ w.subject }}</template>
              <template #append>
                <VerificationBadge :level="w.source_status" />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-window-item>

      <!-- Karbala & Characters -->
      <v-window-item value="karbala">
        <v-row>
          <v-col v-for="c in data.characters" :key="c.character" cols="12" md="6">
            <v-card rounded="xl" class="pa-4 h-100">
              <div class="d-flex align-center justify-space-between mb-1">
                <span class="font-weight-medium">{{ c.character }} <span class="text-medium-emphasis">({{ c.character_urdu }})</span></span>
                <VerificationBadge :level="c.source_status" />
              </div>
              <p class="text-body-2">{{ c.poetic_role }}</p>
              <p v-if="c.attributes?.length" class="text-caption mt-2 mb-0">
                <span class="font-weight-medium">Attributes:</span> {{ c.attributes.join("; ") }}
              </p>
              <p v-if="c.recurring_imagery?.length" class="text-caption mt-1 mb-0">
                <span class="font-weight-medium">Recurring imagery:</span> {{ c.recurring_imagery.join("; ") }}
              </p>
              <p v-if="c.emotional_register" class="text-caption mt-1 mb-0">
                <span class="font-weight-medium">Emotional register:</span> {{ c.emotional_register }}
              </p>
              <p v-if="c.note" class="text-caption text-medium-emphasis mt-2">{{ c.note }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Themes -->
      <v-window-item value="themes">
        <v-row>
          <v-col v-for="t in data.themes" :key="t.theme" cols="12" sm="6" md="4">
            <v-card rounded="xl" class="pa-4 h-100">
              <div class="font-weight-medium">{{ t.theme }}</div>
              <div class="text-caption urdu-text text-medium-emphasis mb-2">{{ t.theme_urdu }}</div>
              <p v-if="t.explanation" class="text-body-2 mb-2">{{ t.explanation }}</p>
              <div class="text-caption text-medium-emphasis">{{ t.source_status }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Poetry Library -->
      <v-window-item value="poetry">
        <v-alert v-if="!data.verses.length" type="info" variant="tonal" class="mb-4">
          No verses meet this module's verification bar yet.
        </v-alert>
        <template v-else>
          <div class="d-flex flex-wrap ga-2 align-center mb-2">
            <v-chip
              v-for="lvl in verseLevels"
              :key="lvl"
              role="button"
              :aria-pressed="levelFilter === lvl ? 'true' : 'false'"
              :color="levelFilter === lvl ? 'primary' : undefined"
              :variant="levelFilter === lvl ? 'flat' : 'outlined'"
              size="small"
              @click="levelFilter = levelFilter === lvl ? null : lvl"
            >
              {{ lvl === "A" ? "A — Primary verified" : "B — Strong secondary" }}
            </v-chip>
          </div>
          <div v-if="verseCharacters.length" class="d-flex flex-wrap ga-2 align-center mb-2">
            <span class="text-caption text-medium-emphasis">Character:</span>
            <v-chip
              v-for="ch in verseCharacters"
              :key="ch"
              role="button"
              :aria-pressed="characterFilter === ch ? 'true' : 'false'"
              :color="characterFilter === ch ? 'primary' : undefined"
              :variant="characterFilter === ch ? 'flat' : 'outlined'"
              size="small"
              @click="characterFilter = characterFilter === ch ? null : ch"
            >
              {{ ch }}
            </v-chip>
          </div>
          <div v-if="verseThemes.length" class="d-flex flex-wrap ga-2 align-center mb-4">
            <span class="text-caption text-medium-emphasis">Theme:</span>
            <v-chip
              v-for="th in verseThemes"
              :key="th"
              role="button"
              :aria-pressed="themeFilter === th ? 'true' : 'false'"
              :color="themeFilter === th ? 'primary' : undefined"
              :variant="themeFilter === th ? 'flat' : 'outlined'"
              size="small"
              @click="themeFilter = themeFilter === th ? null : th"
            >
              {{ th }}
            </v-chip>
            <v-btn v-if="levelFilter || characterFilter || themeFilter" size="small" variant="text" @click="levelFilter = null; characterFilter = null; themeFilter = null">
              Clear filters
            </v-btn>
          </div>

          <v-alert v-if="!filteredVerses.length" type="info" variant="tonal" class="mb-4">
            No verses match the selected filters.
          </v-alert>
          <v-card v-for="v in filteredVerses" :key="v.verse_id" rounded="xl" class="pa-4 mb-4">
            <div class="d-flex justify-space-between align-start">
              <p class="urdu-text text-h6" style="white-space:pre-line">{{ v.text_urdu }}</p>
              <VerificationBadge :level="v.source_status" />
            </div>
            <p v-if="v.text_roman" class="text-caption text-medium-emphasis">{{ v.text_roman }}</p>
            <div v-if="v.character?.length || v.theme?.length" class="d-flex flex-wrap ga-1 my-2">
              <v-chip v-for="ch in v.character" :key="ch" size="x-small" variant="tonal">{{ ch }}</v-chip>
              <v-chip v-for="th in v.theme" :key="th" size="x-small" variant="outlined">{{ th }}</v-chip>
            </div>
            <v-divider class="my-2" />
            <p class="text-caption">{{ v.verification_notes }}</p>
            <a :href="v.source_url" target="_blank" rel="noopener" class="text-caption">Source</a>
          </v-card>
        </template>
      </v-window-item>

      <!-- Sources & Research Notes -->
      <v-window-item value="notes">
        <v-card rounded="xl" class="pa-4 mb-4">
          <div class="text-subtitle-1 font-weight-bold mb-2">Sources Consulted</div>
          <ul class="ps-4">
            <li v-for="s in data.sources" :key="s.url">
              <a :href="s.url" target="_blank" rel="noopener">{{ s.title }}</a> — {{ s.publisher }}
            </li>
          </ul>
        </v-card>
        <v-card rounded="xl" class="pa-4">
          <div class="text-subtitle-1 font-weight-bold mb-2">Open Research Notes</div>
          <ul>
            <li v-for="(n, i) in data.research_notes" :key="i" class="text-body-2 mb-2">{{ n }}</li>
          </ul>
        </v-card>
      </v-window-item>
    </v-window>
  </v-container>

  <v-container v-else>
    <v-alert type="warning" variant="tonal">Module "{{ route.params.slug }}" not found.</v-alert>
  </v-container>
</template>

<script setup>
import VerificationBadge from "~/components/literary/VerificationBadge.vue";
import mirAnisData from "~/assets/data/poets/mir-anis.json";

// One entry per registered module (see usePoetModules.ts) — add a line here
// alongside the JSON file when a new poet module is added.
const MODULE_DATA = {
  "mir-anis": mirAnisData,
};

const route = useRoute();
const tab = ref("overview");

const data = computed(() => MODULE_DATA[route.params.slug]);

useHead({ title: () => (data.value ? `${data.value.poet.name} — Quran App` : "Module not found") });
useSeoMeta({ robots: "noindex, follow" });

// Renders "Editor · Publisher, Year (N vols)" from whichever of these Phase-2
// bibliographic fields a collection actually has — most Phase-1 entries have
// none of them yet, so this returns "" (and the <p> for it doesn't render).
const editionLine = (c) => {
  const parts = [];
  if (c.editor) parts.push(c.editor);
  const pub = [c.publisher, c.publication_year].filter(Boolean).join(", ");
  if (pub) parts.push(pub);
  if (c.volume_count) parts.push(`${c.volume_count} vol.`);
  return parts.join(" · ");
};

const attestationColor = (a) =>
  ({ "well-attested": "success", attributed: "warning", disputed: "error" })[a] ?? "grey";

// --- Poetry Library filters ---
// Only ever show a filter chip for a value that actually occurs on some verse —
// per Phase 10's rule against filters with zero/near-zero data behind them (e.g.
// no "genre" filter: every verse in this dataset is currently genre "Marsiya").
const levelFilter = ref(null);
const characterFilter = ref(null);
const themeFilter = ref(null);

const verseLevels = computed(() => {
  if (!data.value) return [];
  return [...new Set(data.value.verses.map((v) => v.source_status))].sort();
});
const verseCharacters = computed(() => {
  if (!data.value) return [];
  return [...new Set(data.value.verses.flatMap((v) => v.character || []))].sort();
});
const verseThemes = computed(() => {
  if (!data.value) return [];
  return [...new Set(data.value.verses.flatMap((v) => v.theme || []))].sort();
});
const filteredVerses = computed(() => {
  if (!data.value) return [];
  return data.value.verses.filter((v) => {
    if (levelFilter.value && v.source_status !== levelFilter.value) return false;
    if (characterFilter.value && !(v.character || []).includes(characterFilter.value)) return false;
    if (themeFilter.value && !(v.theme || []).includes(themeFilter.value)) return false;
    return true;
  });
});

const biographyRows = computed(() => {
  if (!data.value) return [];
  const b = data.value.biography;
  const rows = [
    { label: "Father", value: b.father?.value, status: null, note: b.father?.note },
    { label: "Date of birth", value: b.date_of_birth?.commonly_cited, status: b.date_of_birth?.source_status, note: b.date_of_birth?.note },
    { label: "Place of birth", value: b.place_of_birth?.value, status: b.place_of_birth?.source_status },
    { label: "Date of death", value: b.date_of_death?.commonly_cited, status: b.date_of_death?.source_status, note: b.date_of_death?.day_conflict },
    { label: "Place of death", value: b.place_of_death?.value, status: b.place_of_death?.source_status },
    { label: "Education", value: b.education?.value, status: b.education?.source_status, note: b.education?.note },
    { label: "Teachers", value: b.teachers?.value, status: b.teachers?.source_status },
    { label: "Contemporary poets", value: b.contemporary_poets?.value, status: b.contemporary_poets?.source_status },
    { label: "Lineage / grandfather", value: b.grandfather_lineage?.note, status: b.grandfather_lineage?.source_status },
  ];
  return rows.filter((r) => r.value);
});
</script>

<style scoped>
/* Same RTL convention as the app's .ar helper (main.css) — no dedicated
   Nastaliq font is bundled, so this relies on the system Urdu font stack. */
.urdu-text {
  direction: rtl;
  unicode-bidi: isolate;
  line-height: 2;
}
</style>
