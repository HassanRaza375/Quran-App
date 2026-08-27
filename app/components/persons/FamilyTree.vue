<template>
  <div class="family-tree">
    <div class="tree-root">
      <span class="tree-root-arabic">{{ person.arabicName }}</span>
      <span class="tree-root-name">{{ person.name }}<span v-if="person.honorific?.short"> ({{ person.honorific.short }})</span></span>
    </div>

    <ul class="tree-branches">
      <li v-for="rel in person.relationships" :key="`${rel.relationshipType}-${rel.personId}`" class="tree-branch">
        <v-icon size="16" class="branch-icon" aria-hidden="true">{{ relationshipIcon(rel.relationshipType) }}</v-icon>

        <NuxtLink v-if="resolveRelated(rel.personId).href" :to="resolveRelated(rel.personId).href" class="branch-name">
          {{ resolveRelated(rel.personId).name }}
        </NuxtLink>
        <span v-else class="branch-name">{{ resolveRelated(rel.personId).name }}</span>

        <v-chip size="x-small" variant="tonal" class="branch-type">{{ relationshipLabel(rel.relationshipType) }}</v-chip>
        <v-chip size="x-small" :variant="statusVariant(rel.verificationStatus)" :color="statusColor(rel.verificationStatus)">
          {{ sourceLabel(rel.sourceType) }}
        </v-chip>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  person: { type: Object, required: true },
});

const { resolveRelated } = usePersons();

const relationshipIcons = {
  father: "mdi-account-tie",
  mother: "mdi-account-heart",
  son: "mdi-account-child",
  daughter: "mdi-account-child",
  brother: "mdi-account-multiple",
  sister: "mdi-account-multiple",
  spouse: "mdi-heart-outline",
  descendant: "mdi-source-branch",
  ancestor: "mdi-source-branch",
  contemporary: "mdi-account-clock-outline",
  supporter: "mdi-account-check-outline",
  opponent: "mdi-account-cancel-outline",
  teacher_student: "mdi-school-outline",
  other: "mdi-account-question-outline",
};
const relationshipIcon = (type) => relationshipIcons[type] ?? "mdi-account-question-outline";
const relationshipLabel = (type) => type.replace(/_/g, "/").replace(/\b\w/g, (c) => c.toUpperCase());

const sourceLabels = { quran: "Qur'an", authentic_hadith: "Authentic Hadith", traditional_account: "Traditional account" };
const sourceLabel = (type) => sourceLabels[type] ?? type;

const statusVariant = (status) => (status === "verified" ? "flat" : "outlined");
const statusColor = (status) => (status === "verified" ? "primary" : status === "traditional" ? "warning" : undefined);
</script>

<style scoped>
.family-tree {
  font-size: 0.9rem;
}

.tree-root {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-weight: 700;
  padding-bottom: 10px;
  margin-bottom: 6px;
  border-bottom: 1px dashed rgba(var(--v-theme-on-surface), 0.15);
}

.tree-root-arabic {
  font-family: "Amiri Quran", serif;
  font-size: 1.15rem;
}

.tree-branches {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tree-branch {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 7px 0 7px 18px;
  margin-inline-start: 8px;
  border-inline-start: 2px solid rgba(var(--v-theme-primary), 0.25);
}

.tree-branch:last-child {
  border-inline-start-color: transparent;
}

.branch-icon {
  color: rgb(var(--v-theme-primary));
  opacity: 0.8;
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
</style>
