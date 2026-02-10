<template>
  <v-container class="home-container">
    <!-- Prayer Summary -->
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

    <!-- 🌙 Ramadan Timings -->
    <v-row v-if="prayer.isRamadan && !prayer.pending" class="mb-6">
      <v-col cols="12">
        <v-card rounded="xl" elevation="10" class="ramadan-card pa-5">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <div class="text-overline">Ramadan</div>
              <div class="text-h6 font-weight-bold">
                🌙 Day {{ prayer.ramadanDay }}
              </div>
            </div>

            <v-chip color="deep-purple" variant="tonal"> Blessed Month </v-chip>
          </div>

          <v-row dense>
            <!-- Suhoor -->
            <v-col cols="6">
              <v-card class="glass pa-3 text-center" rounded="lg">
                <v-icon size="26" color="teal">mdi-weather-night</v-icon>
                <div class="text-caption mt-1">Suhoor Ends</div>
                <div class="text-h6 font-weight-bold">
                  {{ format12h(prayer.suhoorTime) }}
                </div>
              </v-card>
            </v-col>

            <!-- Iftar -->
            <v-col cols="6">
              <v-card class="glass pa-3 text-center" rounded="lg">
                <v-icon size="26" color="orange"
                  >mdi-weather-sunset-down</v-icon
                >
                <div class="text-caption mt-1">Iftar</div>
                <div class="text-h6 font-weight-bold">
                  {{ format12h(prayer.iftarTime) }}
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Countdown -->
          <div class="text-center mt-4">
            <div class="text-caption">Iftar In</div>
            <div class="text-h5 font-weight-bold gradient-text">
              {{ prayer.iftarCountdown }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Prayer Times -->
    <v-row class="mb-3">
      <v-col cols="12">
        <v-card
          rounded="xl"
          elevation="8"
          class="prayer-times-card-modern pa-4"
        >
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <div class="text-overline text-grey-lighten-1">Today</div>
              <div class="text-h6 font-weight-bold">Prayer Schedule</div>
            </div>

            <v-chip
              class="text-white"
              color="primary"
              variant="tonal"
              size="small"
            >
              Next: {{ prayer.nextPrayer }}
            </v-chip>
          </div>

          <div class="prayer-scroll-modern">
            <!-- Loaded -->
            <template v-if="!prayer.pending">
              <div
                v-for="p in prayer.prayerOrder"
                :key="p"
                class="prayer-card"
                :class="{ active: p === prayer.nextPrayer }"
              >
                <v-icon size="26" class="mb-1">
                  {{ prayer.icons[p] }}
                </v-icon>

                <div class="prayer-name">
                  {{ p }}
                </div>

                <div class="prayer-time">
                  {{ format12h(prayer.data.data.timings[p]) }}
                </div>
              </div>
            </template>

            <!-- Skeleton -->
            <template v-else>
              <v-skeleton-loader
                v-for="n in 5"
                :key="n"
                type="card"
                width="110"
                height="90"
                class="mr-3 rounded-lg"
              />
            </template>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <lazy-services-ayah-of-day />

    <!-- Resume Reading -->
    <v-row>
      <v-col cols="12">
        <v-card rounded="xl" elevation="10" class="resume-card-modern pa-5">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <div class="text-overline text-grey-lighten-1">
                Continue Reading
              </div>
              <div class="text-h6 font-weight-bold">Surah Al-Baqarah</div>
            </div>

            <v-icon size="36" color="teal"> mdi-book-open-page-variant </v-icon>
          </div>

          <div class="ayah-info-modern mb-3">
            Last Read: Ayah <strong>153</strong>
          </div>

          <v-progress-linear
            height="8"
            model-value="45"
            rounded
            color="teal"
            class="mb-2"
          />

          <div class="progress-text mb-4">45% completed</div>

          <v-btn
            block
            rounded="xl"
            size="large"
            color="teal"
            class="resume-btn"
          >
            Continue Reading
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <!-- <v-row class="quick-actions" dense>
      <v-col cols="6" v-for="i in 4" :key="i">
        <v-card class="action-card" rounded="lg">
          <v-icon size="32">mdi-book-open-page-variant</v-icon>
          <div class="action-label">Surahs</div>
        </v-card>
      </v-col>
    </v-row> -->

    <!-- Mini Audio Player -->
    <!-- <v-card class="audio-card" rounded="lg">
      <div class="audio-content">
        <v-btn icon="mdi-play" />
        <div class="audio-info">
          <div class="reciter">Mishary Al-Afasy</div>
          <v-progress-linear height="4" model-value="30" />
        </div>
        <v-btn icon="mdi-chevron-up" />
      </div>
    </v-card> -->
  </v-container>
</template>

<script setup>
const prayer = usePrayerStore();
onMounted(() => {
  prayer.init();
});
</script>
<style scoped>
.v-skeleton-loader {
  border-radius: 14px;
}

.home-container {
  padding-bottom: 80px;
}

/* Resume Card */
.resume-card {
  margin-bottom: 20px;
}

.surah-name {
  font-size: 1.1rem;
  font-weight: 600;
}

.ayah-info {
  font-size: 0.85rem;
  opacity: 0.7;
  margin-bottom: 8px;
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 20px;
}

.action-card {
  text-align: center;
  padding: 20px 0;
  cursor: pointer;
}

.action-label {
  margin-top: 6px;
  font-size: 0.9rem;
}

/* Ayah Card */
.ayah-card-modern {
  background: linear-gradient(145deg, #0f2027, #203a43, #2c5364);
  color: white;
}

.ayah-arabic-modern {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  line-height: 1.9;
  letter-spacing: 1px;
  font-family: "Scheherazade New", "Amiri", serif;
}

.ayah-translation-modern {
  text-align: center;
  font-size: 15px;
  opacity: 0.9;
  font-style: italic;
}

.ayah-meta {
  font-size: 12px;
  opacity: 0.7;
}

.ayah-card-modern::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at top right,
      rgba(255, 255, 255, 0.08),
      transparent 40%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(0, 255, 200, 0.08),
      transparent 45%
    );
  border-radius: inherit;
  pointer-events: none;
}

/* Audio Player */
.audio-card {
  position: sticky;
  bottom: 70px;
}

.audio-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.audio-info {
  flex: 1;
}

.reciter {
  font-size: 0.85rem;
  margin-bottom: 4px;
}

/* Summary Card */
.prayer-summary {
  padding: 12px;
}

.hijri-date {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 6px;
}

.current-prayer {
  font-size: 1rem;
  margin-bottom: 4px;
}

.countdown {
  font-size: 1.1rem;
  font-weight: 600;
}

/* Prayer Times */
.prayer-times-card-modern {
  background: linear-gradient(135deg, #0f2027, #203a43d6, #2c5364b0);
  color: white;
}

.prayer-scroll-modern {
  display: flex;
  gap: 14px;
  scrollbar-width: none;
  overflow-x: auto;
  padding-inline: 14px;
}

.prayer-card {
  min-width: 110px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  text-align: center;
  transition: 0.3s ease;
  cursor: pointer;
}

.prayer-card:hover {
  transform: translateY(-3px) scale(1.03);
}

.prayer-card.active {
  background: linear-gradient(135deg, #00f5a0, #00d9f5);
  color: black;
}

.prayer-name {
  font-weight: 600;
  font-size: 14px;
  margin-top: 6px;
}

.prayer-time {
  font-size: 16px;
  font-weight: 700;
  margin-top: 2px;
}

.v-theme--dark .prayer-pill {
  background: rgba(255, 255, 255, 0.08);
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
.resume-card-modern {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  position: relative;
  overflow: hidden;
}

.resume-card-modern::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at top right,
      rgba(0, 255, 200, 0.12),
      transparent 40%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(255, 255, 255, 0.08),
      transparent 45%
    );
  border-radius: inherit;
  pointer-events: none;
}

.ayah-info-modern {
  font-size: 14px;
  opacity: 0.9;
}

.progress-text {
  font-size: 12px;
  opacity: 0.7;
  text-align: right;
}

.resume-btn {
  font-weight: 600;
  letter-spacing: 0.4px;
}
.ramadan-card {
  background: linear-gradient(135deg, #1a2a3a, #203a43, #2c5364);
  color: white;
  position: relative;
  overflow: hidden;
}

.ramadan-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at top right,
      rgba(255, 215, 0, 0.15),
      transparent 40%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(0, 255, 200, 0.1),
      transparent 45%
    );
  pointer-events: none;
}
</style>
