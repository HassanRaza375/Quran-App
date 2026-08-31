<template>
  <v-sheet v-if="groups.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
    <h2 class="section-title">Referenced By</h2>
    <p class="section-hint">
      Other entries in this dataset connected to this one, found through the Knowledge Graph and
      not already shown elsewhere on this page.
    </p>
    <div v-for="group in groups" :key="group.module" class="related-group">
      <h3 class="group-title">{{ group.label }}</h3>
      <div class="d-flex flex-wrap ga-2">
        <v-chip
          v-for="entity in group.entities"
          :key="entity.href ?? entity.name"
          :to="entity.href ?? undefined"
          variant="outlined"
        >
          {{ entity.name }}
        </v-chip>
      </div>
    </div>
  </v-sheet>
</template>

<script setup>
const props = defineProps({
  /** The current page's own entity, e.g. { module: "events", id: "ibrahimfire" }. */
  entityRef: { type: Object, required: true },
  /** Target modules to omit because this page already has its own
   * hand-written section for them (e.g. Events' own "Related Story"
   * section already shows storyIds — showing it again here would be
   * duplicate UI). NOT the same distinction as stored vs. derived_reverse:
   * Events -> Signs is a STORED edge (Events already declares signIds),
   * but the Events detail page has no hand-written "Related Signs"
   * section at all — so it still belongs here. The real rule is "not
   * already shown elsewhere on this page," not "was this edge derived." */
  excludeModules: { type: Array, default: () => [] },
});

const { getRelatedEntities, resolveRef } = useKnowledgeGraph();

const groups = computed(() => {
  const edges = getRelatedEntities(props.entityRef).filter(
    (e) => !props.excludeModules.includes(e.to.module)
  );

  const byModule = new Map();
  for (const edge of edges) {
    const list = byModule.get(edge.to.module) ?? [];
    list.push(edge);
    byModule.set(edge.to.module, list);
  }

  const order = ["persons", "peoples", "places", "stories", "themes", "duas", "events", "signs", "commands"];
  const labels = {
    persons: "People", peoples: "Peoples & Nations", places: "Places", stories: "Stories",
    themes: "Themes", duas: "Duas", events: "Events", signs: "Signs & Miracles", commands: "Commands & Prohibitions",
  };

  const result = [];
  for (const module of order) {
    const moduleEdges = byModule.get(module);
    if (!moduleEdges?.length) continue;
    const seen = new Set();
    const entities = [];
    for (const edge of moduleEdges) {
      const k = `${edge.to.module}:${edge.to.id}`;
      if (seen.has(k)) continue;
      seen.add(k);
      const resolved = resolveRef(edge.to);
      entities.push({ href: resolved.href, name: resolved.name });
    }
    if (entities.length) result.push({ module, label: labels[module], entities });
  }
  return result;
});
</script>

<style scoped>
.section-sheet {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.section-hint {
  font-size: 0.8rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 12px;
}

.related-group {
  margin-bottom: 12px;
}

.related-group:last-child {
  margin-bottom: 0;
}

.group-title {
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: rgba(var(--v-theme-on-surface), 0.7);
}
</style>
