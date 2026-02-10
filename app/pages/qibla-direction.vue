<template>
  <v-container class="d-flex flex-column align-center justify-center">
    <h1 class="text-h5 font-weight-bold mb-3">Qibla Direction</h1>

    <v-alert color="deep-purple" variant="tonal" class="mb-3 text-center">
      🧭 Rotate your phone until Kaaba is aligned
    </v-alert>

    <!-- Compass -->
    <div class="compass-wrapper">
      <!-- Compass Dial (STATIC) -->
      <div class="compass-dial">
        <span
          v-for="n in 72"
          :key="n"
          class="tick"
          :style="{ transform: `rotate(${n * 5}deg)` }"
        ></span>

        <div class="north">N</div>
        <div class="east">E</div>
        <div class="south">S</div>
        <div class="west">W</div>
      </div>

      <!-- Needle (ONLY THIS MOVES) -->
      <div
        class="qibla-needle"
        :class="{ aligned }"
        :style="{ transform: `rotate(${smoothAngle}deg)` }"
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <!-- North / Qibla tip -->
          <polygon points="60,6 72,60 60,52 48,60" fill="#ef4444" />
          <!-- South tail -->
          <polygon points="60,114 72,60 60,68 48,60" fill="#e5e7eb" />
          <!-- Center dot -->
          <circle cx="60" cy="60" r="5" fill="#111827" />
        </svg>
      </div>
    </div>

    <!-- Info -->
    <div class="mt-4 text-center">
      <div class="text-subtitle-1">Qibla Direction</div>
      <div class="text-h6 font-weight-bold">{{ qiblaAngle.toFixed(1) }}°</div>

      <v-chip v-if="aligned" color="green" class="mt-2" label>
        ✔ Perfectly Aligned
      </v-chip>
    </div>

    <!-- iOS Permission -->
    <v-btn
      v-if="needsPermission"
      color="primary"
      class="mt-4"
      @click="requestPermission"
    >
      Enable Compass
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

/* ---------------- STATE ---------------- */

const latitude = ref(null);
const longitude = ref(null);

const qiblaAngle = ref(0);
const deviceHeading = ref(0);
const smoothAngle = ref(0);

const aligned = ref(false);
const needsPermission = ref(false);

let rafId = null;
let lastVibrate = 0;

/* ---------------- UTIL ---------------- */

function normalize(angle) {
  return (angle + 360) % 360;
}

function shortestAngle(target, current) {
  let diff = target - current;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

/* ---------------- LOCATION ---------------- */

function loadCachedLocation() {
  const cached = localStorage.getItem("last_location");
  if (cached) {
    const loc = JSON.parse(cached);
    latitude.value = loc.lat;
    longitude.value = loc.lng;
    calculateQibla(latitude.value, longitude.value);
  }
}

function getLocation() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition((pos) => {
    latitude.value = pos.coords.latitude;
    longitude.value = pos.coords.longitude;

    localStorage.setItem(
      "last_location",
      JSON.stringify({
        lat: latitude.value,
        lng: longitude.value,
      }),
    );

    calculateQibla(latitude.value, longitude.value);
  });
}

/* ---------------- QIBLA ---------------- */

function calculateQibla(lat, lng) {
  const kaabaLat = (21.4225 * Math.PI) / 180;
  const kaabaLng = (39.8262 * Math.PI) / 180;

  lat = (lat * Math.PI) / 180;
  lng = (lng * Math.PI) / 180;

  const y = Math.sin(kaabaLng - lng);
  const x =
    Math.cos(lat) * Math.tan(kaabaLat) -
    Math.sin(lat) * Math.cos(kaabaLng - lng);

  const angle = (Math.atan2(y, x) * 180) / Math.PI;
  qiblaAngle.value = normalize(angle);
}

/* ---------------- COMPASS ---------------- */

function handleOrientation(event) {
  let heading = event.alpha;

  if (event.webkitCompassHeading !== undefined) {
    heading = event.webkitCompassHeading;
  }

  if (heading != null) {
    deviceHeading.value = normalize(heading);
  }
}

function initCompass() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    needsPermission.value = true;
  } else {
    window.addEventListener("deviceorientation", handleOrientation, true);
  }
}

function requestPermission() {
  DeviceOrientationEvent.requestPermission().then((res) => {
    if (res === "granted") {
      needsPermission.value = false;
      window.addEventListener("deviceorientation", handleOrientation, true);
    }
  });
}

/* ---------------- ANIMATION LOOP ---------------- */

function animateNeedle() {
  const target = normalize(qiblaAngle.value - deviceHeading.value);
  const diff = shortestAngle(target, smoothAngle.value);

  smoothAngle.value += diff * 0.15;

  aligned.value = Math.abs(diff) < 2;

  if (aligned.value) triggerHaptic();

  rafId = requestAnimationFrame(animateNeedle);
}

/* ---------------- HAPTIC ---------------- */

function triggerHaptic() {
  if (!navigator.vibrate) return;

  const now = Date.now();
  if (now - lastVibrate > 2000) {
    navigator.vibrate([60, 40, 60]);
    lastVibrate = now;
  }
}

/* ---------------- LIFECYCLE ---------------- */

onMounted(() => {
  loadCachedLocation();
  getLocation();
  initCompass();
  animateNeedle();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener("deviceorientation", handleOrientation);
});
</script>

<style scoped>
.compass-wrapper {
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, #0f172a, #000);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.7);
}

/* Compass Dial (STATIC) */
.compass-dial {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 4px solid #7c3aed;
}

/* Tick Marks */
.tick {
  position: absolute;
  width: 2px;
  height: 10px;
  background: rgba(255, 255, 255, 0.4);
  left: 50%;
  top: 4px;
  transform-origin: 50% 136px;
}

/* Cardinal Directions */
.north,
.east,
.south,
.west {
  position: absolute;
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.north {
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}
.east {
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.south {
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}
.west {
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

/* Kaaba Needle */
.kaaba-arrow {
  position: absolute;
  font-size: 54px;
  transform-origin: center center;
  will-change: transform;
  filter: drop-shadow(0 0 10px rgba(255, 200, 0, 0.7));
}

.kaaba-arrow.aligned {
  filter: drop-shadow(0 0 18px #00ff99);
  transform: scale(1.15) rotate(var(--angle));
}
.qibla-needle {
  position: absolute;
  width: 120px;
  height: 120px;
  transform-origin: 50% 50%;
  will-change: transform;
  transition: filter 0.3s ease;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.6));
}

.qibla-needle.aligned {
  filter: drop-shadow(0 0 20px #00ff99);
  transform: scale(1.1) rotate(var(--angle));
}
</style>
