<template>
  <div>
    <v-radio-group v-model="choice" :aria-label="'Choose your marja\''" hide-details>
      <v-card
        v-for="m in maraji"
        :key="m.id"
        variant="outlined"
        rounded="lg"
        class="mb-2 marja-option"
        :class="{ 'is-selected': choice === m.id }"
      >
        <v-card-text class="py-2">
          <v-radio :value="m.id">
            <template #label>
              <div class="py-1">
                <div class="font-weight-medium">{{ m.name.en }}</div>
                <div class="urdu-inline text-medium-emphasis" lang="ur" dir="rtl">{{ m.name.ur }}</div>
                <div v-if="m.status === 'pending-sources'" class="text-caption text-warning">
                  Rulings are still being added — until then, please refer to his official risala.
                </div>
              </div>
            </template>
          </v-radio>
        </v-card-text>
      </v-card>
    </v-radio-group>
    <v-btn color="primary" class="mt-3" :disabled="!choice" prepend-icon="mdi-check" @click="confirm">
      {{ confirmLabel }}
    </v-btn>
  </div>
</template>

<script setup>
import { MARAJI } from "~/data/wajibat";

const props = defineProps({
  initial: { type: String, default: null },
  confirmLabel: { type: String, default: "Continue" },
});
const emit = defineEmits(["chosen"]);

const maraji = MARAJI;
const { setMarja } = useFiqhPrefs();
const choice = ref(props.initial);
watch(
  () => props.initial,
  (v) => {
    if (!choice.value) choice.value = v;
  }
);

const confirm = () => {
  if (!choice.value) return;
  setMarja(choice.value);
  emit("chosen", choice.value);
};
</script>

<style scoped>
.marja-option.is-selected {
  border-color: rgb(var(--v-theme-primary));
}
</style>
