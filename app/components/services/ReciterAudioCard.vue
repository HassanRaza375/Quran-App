<template>
  <v-card
    rounded="lg"
    elevation="1"
    class="pa-4"
  >
    <div class="d-flex align-center justify-space-between">
      <div>
        <div class="text-subtitle-1 font-weight-medium">
          {{ reciter.reciter }}
        </div>
      </div>

      <v-btn icon @click="toggle">
        <v-progress-circular v-if="isLoading" indeterminate size="20" />
        <v-icon v-else>
          {{ isPlaying ? "mdi-pause" : "mdi-play" }}
        </v-icon>
      </v-btn>
    </div>

    <v-slider
      :model-value="isActive ? progress : 0"
      :max="isActive ? duration : 1"
      step="1"
      hide-details
      :disabled="!isActive"
      @update:model-value="onSeek"
    />
  </v-card>
</template>

<script setup>
const props = defineProps({ reciter: Object });

const { play, pause, seek, playing, loading, currentUrl, progress, duration } =
  useAudioPlayer();

const isPlaying = computed(
  () => playing.value && currentUrl.value === props.reciter.url,
);
const isActive = computed(() => currentUrl.value === props.reciter.url);

const isLoading = computed(
  () => loading.value && currentUrl.value === props.reciter.url,
);
const onSeek = (val) => {
  if (!isActive.value) return;
  seek(val);
};

const toggle = () => {
  if (isPlaying.value) pause();
  else play(props.reciter.url);
};
</script>
<style scoped>
.inactive {
  opacity: 0.6;
}
</style>
