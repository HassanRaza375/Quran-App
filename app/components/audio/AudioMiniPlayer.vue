<template>
  <v-slide-y-transition>
    <v-sheet v-if="currentUrl && nowPlaying" class="mini-player" elevation="10">
      <v-slider
        :model-value="progress"
        :max="duration || 0"
        step="1"
        hide-details
        density="compact"
        class="mini-player-slider"
        @update:model-value="seek"
      />
      <div class="d-flex align-center px-3 pb-2 pt-1 ga-2">
        <div class="flex-grow-1 min-w-0">
          <div class="text-caption text-truncate">
            {{ nowPlaying.title }} <span v-if="nowPlaying.subtitle">· {{ nowPlaying.subtitle }}</span>
          </div>
          <div class="text-caption text-medium-emphasis">{{ currentTimeLabel }} / {{ durationLabel }}</div>
        </div>

        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" size="small" variant="text" density="comfortable">{{ playbackRate }}x</v-btn>
          </template>
          <v-list density="compact">
            <v-list-item v-for="r in rates" :key="r" @click="setPlaybackRate(r)">
              <v-list-item-title>{{ r }}x</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          icon="mdi-repeat-once"
          size="small"
          variant="text"
          :color="repeatOne ? 'primary' : undefined"
          @click="toggleRepeatOne"
        />
        <v-btn
          v-if="nowPlaying.type === 'surah'"
          icon="mdi-skip-next-outline"
          size="small"
          variant="text"
          :color="autoAdvance ? 'primary' : undefined"
          @click="toggleAutoAdvance"
        />

        <v-btn icon variant="tonal" color="primary" size="small" :loading="loading" @click="toggle">
          <v-icon>{{ playing ? "mdi-pause" : "mdi-play" }}</v-icon>
        </v-btn>

        <v-btn icon="mdi-close" size="small" variant="text" @click="reset" />
      </div>
    </v-sheet>
  </v-slide-y-transition>
</template>

<script setup>
const {
  currentUrl,
  nowPlaying,
  playing,
  loading,
  progress,
  duration,
  currentTimeLabel,
  durationLabel,
  play,
  pause,
  seek,
  reset,
  playbackRate,
  setPlaybackRate,
  repeatOne,
  toggleRepeatOne,
  autoAdvance,
  toggleAutoAdvance,
} = useAudioPlayer();

const rates = [0.75, 1, 1.25, 1.5, 2];

const toggle = () => {
  if (playing.value) pause();
  else if (currentUrl.value) play(currentUrl.value);
};
</script>

<style scoped>
.mini-player {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(15, 32, 39, 0.97);
  color: white;
  backdrop-filter: blur(10px);
}

.mini-player-slider {
  margin-top: -6px;
}

.min-w-0 {
  min-width: 0;
}
</style>
