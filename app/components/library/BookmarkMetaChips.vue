<template>
  <div class="bm-meta">
    <div v-if="meta.note || meta.tags.length || meta.collectionIds.length" class="d-flex flex-wrap ga-1 mb-2">
      <v-chip v-if="meta.note" size="x-small" variant="tonal" prepend-icon="mdi-note-text-outline">
        Note
      </v-chip>
      <v-chip v-for="t in meta.tags" :key="t" size="x-small" variant="outlined">
        {{ t }}
      </v-chip>
      <v-chip
        v-for="cid in meta.collectionIds"
        :key="cid"
        size="x-small"
        color="primary"
        variant="tonal"
        prepend-icon="mdi-folder-outline"
      >
        {{ collectionName(cid) }}
      </v-chip>
    </div>

    <v-btn size="small" variant="text" prepend-icon="mdi-pencil-outline" @click="dialog = true">
      {{ hasAnyMeta ? "Edit note / tags" : "Add note / tags" }}
    </v-btn>

    <v-dialog v-model="dialog" max-width="420">
      <v-card rounded="lg">
        <v-card-title>Personal notes</v-card-title>
        <v-card-text>
          <v-textarea
            label="Note"
            v-model="noteDraft"
            rows="3"
            auto-grow
            @update:model-value="onNoteInput"
          />
          <div class="text-caption text-medium-emphasis mb-3">{{ saveState }}</div>

          <v-combobox
            label="Tags"
            v-model="tagsDraft"
            multiple
            chips
            closable-chips
            @update:model-value="onTagsInput"
          />

          <div class="text-caption text-medium-emphasis mt-3 mb-1">Collections</div>
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-for="c in collections"
              :key="c.id"
              size="small"
              :color="meta.collectionIds.includes(c.id) ? 'primary' : undefined"
              :variant="meta.collectionIds.includes(c.id) ? 'flat' : 'outlined'"
              @click="toggleCollectionForItem(itemKey, c.id)"
            >
              {{ c.name }}
            </v-chip>
            <span v-if="!collections.length" class="text-caption text-medium-emphasis">
              No collections yet — create one from the Bookmarks page.
            </span>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="flat" color="primary" @click="dialog = false">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  itemKey: { type: String, required: true },
});

const { collections, getMeta, setNote, setTags, toggleCollectionForItem } = useLibrary();

const meta = computed(() => getMeta(props.itemKey));
const hasAnyMeta = computed(() => !!(meta.value.note || meta.value.tags.length || meta.value.collectionIds.length));
const collectionName = (id) => collections.value.find((c) => c.id === id)?.name || "";

const dialog = ref(false);
const noteDraft = ref("");
const tagsDraft = ref([]);
const saveState = ref("");

watch(dialog, (open) => {
  if (open) {
    noteDraft.value = meta.value.note;
    tagsDraft.value = [...meta.value.tags];
    saveState.value = "";
  }
});

let noteSaveTimeout;
const onNoteInput = (val) => {
  saveState.value = "Saving…";
  clearTimeout(noteSaveTimeout);
  noteSaveTimeout = setTimeout(() => {
    setNote(props.itemKey, val);
    saveState.value = "Saved";
  }, 500);
};

const onTagsInput = (val) => {
  setTags(props.itemKey, val);
};
</script>

<style scoped>
.bm-meta {
  margin-top: 4px;
}
</style>
