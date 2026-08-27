<script setup>
// Home-dashboard "Continue Studying" card for the Prophets & Qur'anic Persons
// feature — the sibling of the "Continue Reading" card. Three states, in
// priority order: resume active study history, else a bookmarked person,
// else a deterministic featured person. See MODULE_BLUEPRINT.md Module 17
// for the Persons feature this reads from; this component does not modify
// any of it.
import { CATEGORY_FILTERS } from "~/utils/personsSearch";
import { getMostRecentlyStudied, SECTION_LABELS } from "~/utils/personStudy";

const { persons, getPersonById } = usePersons();
const { record, load: loadPersonStudy } = usePersonStudy();
const { list: bookmarkKeys, addedAt: bookmarkAddedAt, load: loadBookmarks } = useBookmarks();

// Stable pre-mount value (index 0) so SSR and the initial client render
// agree regardless of server/client timezone — matches this app's own
// documented pattern of applying anything date/clock-dependent only after
// mount (see README "Theme/accessibility prefs apply after mount, not
// during SSR"). The real day-rotated index is set once mounted.
const featuredIndex = ref(0);

onMounted(() => {
  loadPersonStudy();
  loadBookmarks();

  const now = new Date();
  const localDayNumber = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  featuredIndex.value = persons.length ? localDayNumber % persons.length : 0;
});

// ---------- State 1: resume active study history ----------
const studyState = computed(() => getMostRecentlyStudied(record.value));
const studiedPerson = computed(() => {
  const state = studyState.value;
  if (!state) return null;
  // The person the state points to may since have been removed from the
  // dataset — fall through to the next state rather than link to nothing.
  return getPersonById(state.personId) ?? null;
});
const sectionLabel = computed(() => {
  const section = studyState.value?.lastSection;
  return section && section in SECTION_LABELS ? SECTION_LABELS[section] : null;
});

// ---------- State 2: a bookmarked person, no study history ----------
const bookmarkedPerson = computed(() => {
  const ids = bookmarkKeys.value
    .filter((k) => k.startsWith("person:"))
    .map((k) => k.slice("person:".length))
    .sort((a, b) => (bookmarkAddedAt.value[`person:${b}`] ?? 0) - (bookmarkAddedAt.value[`person:${a}`] ?? 0));
  for (const id of ids) {
    const person = getPersonById(id);
    if (person) return person; // skip any bookmarked id no longer in the dataset
  }
  return null;
});

// ---------- State 3: a deterministic, non-network featured person ----------
const featuredPerson = computed(() => persons[featuredIndex.value] ?? null);

const mode = computed(() => {
  if (studiedPerson.value) return "resume";
  if (bookmarkedPerson.value) return "bookmarked";
  return "featured";
});

const activePerson = computed(() => studiedPerson.value ?? bookmarkedPerson.value ?? featuredPerson.value);

const categoryLabel = computed(() => {
  const person = activePerson.value;
  if (!person) return "";
  return CATEGORY_FILTERS.find((c) => c.value === person.primaryCategory)?.label ?? person.primaryCategory;
});

const displayName = computed(() => {
  const person = activePerson.value;
  if (!person) return "";
  return person.honorific?.short ? `${person.name} (${person.honorific.short})` : person.name;
});

const stateChip = computed(() => {
  switch (mode.value) {
    case "resume": return "In Progress";
    case "bookmarked": return "Saved";
    default: return "Featured Today";
  }
});

const title = computed(() => {
  const person = activePerson.value;
  if (!person) return "";
  switch (mode.value) {
    case "resume": return `Continue studying ${displayName.value}`;
    case "bookmarked": return `Return to ${displayName.value}`;
    default: return displayName.value;
  }
});

const ctaLabel = computed(() => {
  switch (mode.value) {
    case "resume": return "Continue Studying";
    case "bookmarked": return "Continue Exploring";
    default: return "Discover Their Story";
  }
});

const targetHref = computed(() => {
  const person = activePerson.value;
  if (!person) return null;
  if (mode.value === "resume" && sectionLabel.value) {
    return `/persons/${person.id}#section-${studyState.value.lastSection}`;
  }
  return `/persons/${person.id}`;
});

const ariaLabel = computed(() => {
  const person = activePerson.value;
  if (!person) return "";
  return `${title.value}. ${ctaLabel.value}.`;
});
</script>

<template>
  <v-row v-if="activePerson">
    <v-col cols="12">
      <v-card
        rounded="xl"
        elevation="10"
        class="pa-5 persons-study-card"
        :to="targetHref"
        :aria-label="ariaLabel"
      >
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="text-overline text-grey-lighten-1">Prophets &amp; People</div>
          <v-chip size="small" variant="tonal" color="teal">{{ stateChip }}</v-chip>
        </div>

        <div class="d-flex align-center ga-3">
          <v-icon size="32" color="teal">mdi-account-group-outline</v-icon>
          <div class="flex-grow-1 min-width-0">
            <div class="arabic-name-modern">{{ activePerson.arabicName }}</div>
            <div class="text-h6 font-weight-bold">{{ title }}</div>
          </div>
        </div>

        <v-chip size="x-small" variant="tonal" color="primary" class="mt-3">{{ categoryLabel }}</v-chip>

        <div class="context-line mt-3">
          <template v-if="mode === 'resume' && sectionLabel">
            You were reading: <strong>{{ sectionLabel }}</strong>
          </template>
          <template v-else>{{ activePerson.shortDescription }}</template>
        </div>

        <!-- Visual only, not a second interactive target — the whole card
             above is the one link (aria-label already states this action). -->
        <div class="study-btn" aria-hidden="true">{{ ctaLabel }}</div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.persons-study-card {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  display: block;
}

.persons-study-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, rgba(0, 255, 200, 0.12), transparent 40%),
    radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.08), transparent 45%);
  border-radius: inherit;
  pointer-events: none;
}

.min-width-0 {
  min-width: 0;
}

.arabic-name-modern {
  font-family: "Amiri Quran", "Amiri", serif;
  font-size: 1.15rem;
  line-height: 1.3;
  opacity: 0.9;
}

.context-line {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.study-btn {
  font-weight: 600;
  letter-spacing: 0.4px;
  text-align: center;
  background: #009688;
  color: white;
  border-radius: 24px;
  padding: 12px 16px;
  font-size: 15px;
}
</style>
