// Knowledge Graph — thin reactive composable wrapper (Phase 10). Mirrors
// use{Module}.ts's existing shape, but this one wraps the graph index
// (app/utils/graphIndex.ts) rather than a single dataset — it resolves
// entities across all 9 modules generically instead of one at a time.
import {
  getEntity,
  getRelatedEntities,
  getNeighborsByType,
  type EntityRef,
  type EntityModule,
  type GraphEdge,
} from "~/utils/graphIndex";

const MODULE_ROUTES: Record<EntityModule, string> = {
  persons: "/persons",
  peoples: "/peoples",
  places: "/places",
  stories: "/stories",
  themes: "/themes",
  duas: "/duas",
  events: "/events",
  signs: "/signs",
  commands: "/commands",
};

const MODULE_LABELS: Record<EntityModule, string> = {
  persons: "People",
  peoples: "Peoples & Nations",
  places: "Places",
  stories: "Stories",
  themes: "Themes",
  duas: "Duas",
  events: "Events",
  signs: "Signs & Miracles",
  commands: "Commands & Prohibitions",
};

/** Best-effort human-readable name for any entity, regardless of module —
 * each dataset names its own "display name" field slightly differently
 * (name / title), so this tries both rather than requiring the caller to
 * know which one applies. */
const displayName = (entity: unknown, fallbackId: string): string => {
  const e = entity as Record<string, unknown> | undefined;
  if (!e) return fallbackId;
  if (typeof e.name === "string") return e.name;
  if (typeof e.title === "string") return e.title;
  return fallbackId;
};

export type ResolvedRelatedEntity = {
  ref: EntityRef;
  name: string;
  href: string | null;
  relationship: GraphEdge["relationship"];
  direction: GraphEdge["direction"];
  basis?: string;
};

export type RelatedEntityGroup = {
  module: EntityModule;
  label: string;
  entities: ResolvedRelatedEntity[];
};

export const useKnowledgeGraph = () => {
  const resolveRef = (ref: EntityRef): { name: string; href: string | null } => {
    const entity = getEntity(ref);
    if (!entity) return { name: `${ref.module}:${ref.id}`, href: null };
    return { name: displayName(entity, ref.id), href: `${MODULE_ROUTES[ref.module]}/${ref.id}` };
  };

  /** All neighbors of `ref`, grouped by target module, each entity
   * resolved to a display name + href via the target module's own
   * existing route pattern — never exposing raw "module:id" graph keys
   * to the UI. Empty groups are omitted. */
  const getRelatedGroups = (ref: EntityRef, excludeModules: EntityModule[] = []): RelatedEntityGroup[] => {
    const edges = getRelatedEntities(ref);
    const byModule = new Map<EntityModule, GraphEdge[]>();
    for (const edge of edges) {
      if (excludeModules.includes(edge.to.module)) continue;
      const list = byModule.get(edge.to.module) ?? [];
      list.push(edge);
      byModule.set(edge.to.module, list);
    }

    const groups: RelatedEntityGroup[] = [];
    for (const [module, moduleEdges] of byModule) {
      const seen = new Set<string>();
      const entities: ResolvedRelatedEntity[] = [];
      for (const edge of moduleEdges) {
        const k = `${edge.to.module}:${edge.to.id}`;
        if (seen.has(k)) continue;
        seen.add(k);
        const resolved = resolveRef(edge.to);
        entities.push({
          ref: edge.to,
          name: resolved.name,
          href: resolved.href,
          relationship: edge.relationship,
          direction: edge.direction,
          basis: edge.basis,
        });
      }
      if (entities.length) groups.push({ module, label: MODULE_LABELS[module], entities });
    }

    // Stable, predictable ordering for the UI — matches this module's own
    // nav-drawer/roadmap ordering rather than insertion order.
    const order: EntityModule[] = ["persons", "peoples", "places", "stories", "themes", "duas", "events", "signs", "commands"];
    groups.sort((a, b) => order.indexOf(a.module) - order.indexOf(b.module));
    return groups;
  };

  return {
    getEntity,
    getRelatedEntities,
    getNeighborsByType,
    getRelatedGroups,
    resolveRef,
    moduleLabels: MODULE_LABELS,
  };
};
