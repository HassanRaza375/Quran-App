<template>
  <v-container class="tasbeeh-container">
    <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <v-card elevation="8" rounded="xl" class="pa-6 tasbeeh-header">
          <div class="text-overline text-grey-lighten-1 mb-1">Dhikr</div>
          <div class="text-h4 font-weight-bold gradient-text mb-1">
            📿 Tasbeeh Counter
          </div>
          <div class="text-subtitle-2 text-grey-lighten-1">
            Tap a dhikr to start counting
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="preset in tasbeehPresets" :key="preset.id" cols="6" sm="4" md="3">
        <v-card
          rounded="xl"
          elevation="6"
          class="preset-card pa-4 text-center h-100"
          @click="goto(preset.id)"
        >
          <v-avatar :color="preset.color" size="48" class="mb-3">
            <v-icon color="white">
              {{ preset.id === "custom" ? "mdi-plus" : "mdi-hand-back-right-outline" }}
            </v-icon>
          </v-avatar>

          <div v-if="preset.arabic" class="preset-arabic mb-1">
            {{ preset.arabic }}
          </div>
          <div class="preset-title font-weight-bold">
            {{ preset.transliteration }}
          </div>
          <div class="preset-meaning text-medium-emphasis">
            {{ preset.meaning }}
          </div>

          <v-chip size="small" class="mt-3" variant="tonal" :color="preset.color">
            {{ peekEntry(preset.id).count }} / {{ peekEntry(preset.id).target }}
          </v-chip>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { load, peekEntry } = useTasbeeh();
const router = useRouter();

onMounted(() => {
  load();
});

const goto = (id) => {
  router.push(`/tasbeeh/${id}`);
};
</script>

<style scoped>
.tasbeeh-container {
  padding-bottom: 80px;
}

.tasbeeh-header {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
}

.gradient-text {
  background: linear-gradient(45deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.preset-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.preset-card:hover {
  transform: translateY(-3px);
}

.preset-arabic {
  font-family: "Amiri Quran", serif;
  font-size: 1.4rem;
}

.preset-title {
  font-size: 0.95rem;
}

.preset-meaning {
  font-size: 0.75rem;
  min-height: 2.2em;
}
</style>
