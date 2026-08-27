<template>
  <div class="prophetic-timeline">
    <div class="legend">
      <span class="legend-item"><span class="legend-dot legend-dot--strong" /> Established chronology</span>
      <span class="legend-item"><span class="legend-dot legend-dot--traditional" /> Traditional / uncertain chronology</span>
    </div>

    <v-alert v-if="!timeline.mainline.length" type="info" variant="tonal">
      No prophets with a known chronological order are in the dataset yet, so a main sequence can't
      be shown. See <NuxtLink to="/persons">Browse People</NuxtLink> instead.
    </v-alert>

    <ol v-else class="mainline">
      <li v-for="(node, i) in timeline.mainline" :key="node.person.id" class="mainline-node">
        <NuxtLink :to="`/persons/${node.person.id}`" class="node-card">
          <span class="node-arabic">{{ node.person.arabicName }}</span>
          <span class="node-name">
            {{ node.person.name }}
            <span v-if="node.person.honorific?.short">({{ node.person.honorific.short }})</span>
          </span>
          <span
            class="node-chronology"
            :class="{ 'node-chronology--traditional': node.person.chronology?.status !== 'strong' }"
          >
            {{ chronologyText(node.person.chronology) || "Chronology unknown" }}
          </span>
        </NuxtLink>

        <button
          v-if="node.branches.length"
          type="button"
          class="branch-toggle"
          :aria-expanded="expanded[node.person.id] ? 'true' : 'false'"
          :aria-controls="`branches-${node.person.id}`"
          @click="toggleExpanded(node.person.id)"
        >
          <v-icon size="16" aria-hidden="true">{{ expanded[node.person.id] ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
          {{ node.branches.length }} related {{ node.branches.length === 1 ? "person" : "people" }}
        </button>

        <ul v-if="node.branches.length" v-show="expanded[node.person.id]" :id="`branches-${node.person.id}`" class="branches">
          <li v-for="rel in node.branches" :key="rel.personId" class="branch-item">
            <v-icon size="14" class="branch-icon" aria-hidden="true">mdi-source-branch</v-icon>
            <NuxtLink v-if="resolveRelated(rel.personId).href" :to="resolveRelated(rel.personId).href" class="branch-name">
              {{ resolveRelated(rel.personId).name }}
            </NuxtLink>
            <span v-else class="branch-name">{{ resolveRelated(rel.personId).name }}</span>
            <v-chip size="x-small" variant="tonal" class="ml-1">{{ relationshipLabel(rel.relationshipType) }}</v-chip>
            <v-chip
              size="x-small"
              :variant="rel.verificationStatus === 'verified' ? 'flat' : 'outlined'"
              :color="rel.verificationStatus === 'verified' ? 'primary' : 'warning'"
            >
              {{ sourceLabel(rel.sourceType) }}
            </v-chip>
          </li>
        </ul>

        <div v-if="i < timeline.mainline.length - 1" class="connector"><v-icon size="20" aria-hidden="true">mdi-arrow-down</v-icon></div>
      </li>
    </ol>

    <div v-if="timeline.unlinked.length" class="unlinked-section">
      <h3 class="unlinked-title">Other Qur'anic Persons</h3>
      <p class="unlinked-hint">
        Not yet placed in the chronological sequence above — no established relationship to a mainline prophet is
        recorded for them in this dataset.
      </p>
      <div class="unlinked-chips">
        <v-chip v-for="person in timeline.unlinked" :key="person.id" :to="`/persons/${person.id}`" variant="outlined">
          {{ person.name }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { chronologyText } from "~/utils/personsChronology";
import { buildTimeline } from "~/utils/personsTimeline";

const { persons, resolveRelated } = usePersons();
const timeline = computed(() => buildTimeline(persons));

const expanded = reactive({});
const toggleExpanded = (id) => {
  expanded[id] = !expanded[id];
};

const relationshipLabels = {
  father: "Father",
  mother: "Mother",
  son: "Son",
  daughter: "Daughter",
  brother: "Brother",
  sister: "Sister",
  spouse: "Spouse",
  descendant: "Descendant",
  ancestor: "Ancestor",
  contemporary: "Contemporary",
  supporter: "Supporter",
  opponent: "Opponent",
  teacher_student: "Teacher/Student",
  other: "Related person",
};
const relationshipLabel = (type) => relationshipLabels[type] ?? "Related person";

const sourceLabels = { quran: "Qur'an", authentic_hadith: "Authentic Hadith", traditional_account: "Traditional account" };
const sourceLabel = (type) => sourceLabels[type] ?? type;
</script>

<style scoped>
.prophetic-timeline {
  max-width: 620px;
  margin: 0 auto;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  font-size: 0.78rem;
  color: rgba(var(--v-theme-on-surface), 0.65);
  margin-bottom: 24px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}

.legend-dot--strong {
  background: rgb(var(--v-theme-primary));
}

.legend-dot--traditional {
  background: transparent;
  border: 2px solid rgb(var(--v-theme-warning));
}

.mainline {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mainline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.node-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
  background: rgba(var(--v-theme-primary), 0.04);
  transition: background 0.15s ease;
}

.node-card:hover {
  background: rgba(var(--v-theme-primary), 0.09);
}

.node-arabic {
  font-family: "Amiri Quran", serif;
  font-size: 1.4rem;
}

.node-name {
  font-weight: 700;
  font-size: 1rem;
}

.node-chronology {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.node-chronology--traditional {
  color: rgb(var(--v-theme-warning));
  font-weight: 400;
}

.branch-toggle {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.78rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 8px;
}

.branch-toggle:hover {
  color: rgb(var(--v-theme-primary));
}

.branches {
  list-style: none;
  margin: 8px 0 0;
  padding: 8px 0 0;
  width: 100%;
  max-width: 420px;
}

.branch-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  padding: 6px 10px;
  margin-bottom: 4px;
  border-radius: 10px;
  background: rgba(var(--v-theme-on-surface), 0.035);
}

.branch-icon {
  color: rgb(var(--v-theme-primary));
  opacity: 0.7;
}

.branch-name {
  font-weight: 600;
  text-decoration: none;
  color: inherit;
}

a.branch-name:hover {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

.connector {
  color: rgba(var(--v-theme-primary), 0.5);
  padding: 4px 0;
}

.unlinked-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px dashed rgba(var(--v-theme-on-surface), 0.15);
  text-align: center;
}

.unlinked-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.unlinked-hint {
  font-size: 0.78rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 12px;
}

.unlinked-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
</style>
