<template>
  <v-container>
    <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <v-card elevation="8" rounded="xl" class="pa-6 prayer-header">
          <v-row align="center" justify="space-between">
            <!-- LEFT -->
            <v-col cols="12" md="6">
              <div class="text-overline text-grey-lighten-1 mb-1">
                Prayer Times
              </div>

              <div class="text-h4 font-weight-bold mb-2 gradient-text">
                🕌 {{ prayer.data?.data?.date?.hijri?.date }}
                {{ prayer.data?.data?.date?.hijri?.month?.en }}
              </div>

              <div class="text-subtitle-2 text-grey">
                {{ prayer.data?.data?.date?.readable }}
              </div>
            </v-col>

            <!-- RIGHT -->
            <v-col cols="12" md="6">
              <v-row dense>
                <!-- COUNTDOWN -->
                <v-col cols="12" sm="6">
                  <v-card
                    class="glass pa-3 text-center"
                    rounded="lg"
                    elevation="2"
                  >
                    <v-icon size="28" color="success">mdi-timer-outline</v-icon>
                    <div class="text-caption mt-1">Next Prayer In</div>
                    <div class="text-h6 font-weight-bold">
                      {{ prayer.countdown }}
                    </div>
                  </v-card>
                </v-col>

                <!-- QIBLA -->
                <v-col cols="12" sm="6">
                  <v-card
                    class="glass pa-3 text-center"
                    rounded="lg"
                    elevation="2"
                  >
                    <v-icon size="28" color="deep-purple"
                      >mdi-compass-outline</v-icon
                    >
                    <div class="text-caption mt-1">Qibla Direction</div>
                    <div class="text-h6 font-weight-bold">
                      {{ prayer.qibla?.toFixed(1) }}°
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense v-if="prayer.data">
      <v-col v-for="p in prayer.prayerOrder" :key="p" cols="12" sm="6" md="4">
        <v-card
          color="surface"
          :class="{ 'bg-primary text-white': p === prayer.nextPrayer }"
          class="pa-4 d-flex flex-column align-center justify-center"
        >
          <v-icon size="36">
            {{ prayer.icons[p] || "mdi-clock-outline" }}
          </v-icon>

          <div class="text-h6 font-weight-bold">
            {{ p }}
            <!-- <span v-if="p === prayer.nextPrayer">(Next)</span> -->
          </div>

          <div class="text-h5">
            {{ format12h(prayer.data.data.timings[p]) }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" class="text-center">
        <v-btn
          color="teal"
          size="large"
          rounded="xl"
          prepend-icon="mdi-refresh"
          @click="prayer.fetchPrayerTimes"
        >
          Refresh Times
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const prayer = usePrayerStore();
</script>
<style scoped>
.hoverable:hover {
  transform: scale(1.05);
  transition: 0.2s ease-in-out;
}

.prayer-header {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  backdrop-filter: blur(12px);
}

.glass {
  background: rgba(var(--v-theme-surface), 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.gradient-text {
  background: linear-gradient(45deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
