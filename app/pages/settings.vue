<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4">Settings</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="pa-4 bg-primary">
          <v-select label="App Theme" class="mb-4" :items="themeOptions" v-model="themeMode" item-title="title"
            item-value="value" />
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <div class="text-subtitle-1 font-weight-bold mb-1">
            Prayer Calculation Method (Fiqh)
          </div>
          <div class="text-caption text-medium-emphasis mb-3">
            Changes how Fajr, Dhuhr, Asr, Maghrib and Isha are calculated. Applied instantly and
            used everywhere prayer times appear — Home, Prayer Times and the Islamic Calendar.
          </div>

          <v-btn-toggle v-model="fiqhModel" mandatory divided color="primary" class="d-flex w-100 mb-2">
            <v-btn v-for="opt in fiqhOptions" :key="opt.value" :value="opt.value" class="flex-grow-1">
              {{ opt.title }}
            </v-btn>
          </v-btn-toggle>

          <div class="text-caption text-medium-emphasis">
            {{ selectedFiqhOption?.subtitle }}
          </div>

          <v-divider class="my-4" />

          <div class="d-flex align-center justify-space-between flex-wrap ga-2">
            <div class="text-caption text-medium-emphasis">
              <template v-if="prayer.locationSource === 'gps'">
                Using your device location.
              </template>
              <template v-else-if="prayer.locationSource === 'fallback'">
                Using default location (Lahore, Pakistan) — device location wasn't available.
              </template>
              <template v-else> Detecting location… </template>
              <span v-if="prayer.latitude">
                ({{ prayer.latitude.toFixed(3) }}, {{ prayer.longitude.toFixed(3) }})
              </span>
            </div>

            <v-btn size="small" variant="text" prepend-icon="mdi-crosshairs-gps" @click="prayer.refreshLocation">
              Use My Location
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-switch v-model="notificationsEnabled" label="Enable Prayer Notifications" inset color="warning" />

          <v-divider class="my-4" />

          <v-switch v-for="p in prayerOrder" :key="p" v-model="enabledPrayers[p]" :label="p"
            :disabled="!notificationsEnabled" inset color="info" />

          <v-select class="mt-4" label="Reminder Time" :items="reminderOptions" v-model="reminderOffset"
            item-title="title" item-value="value" />

          <v-alert v-if="notificationsEnabled" type="info" variant="tonal" density="compact" class="mt-4">
            Notifications fire while the app is open (foreground or a background tab) — they won't
            arrive if the app or browser is fully closed.
          </v-alert>

          <v-btn class="mt-4" variant="tonal" prepend-icon="mdi-bell-ring-outline"
            :disabled="!notificationsEnabled" :loading="sendingTest" @click="sendTestNotification">
            Send Test Notification
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useTheme } from "vuetify";

const theme = useTheme();
const themeMode = ref("system");
const prayer = usePrayerStore();
const sendingTest = ref(false);

const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

/* ---------------- Fiqh (calculation method) ---------------- */
const fiqhOptions = FIQH_OPTIONS;
const fiqhModel = computed({
  get: () => prayer.fiqh,
  set: (val) => prayer.setFiqh(val),
});
const selectedFiqhOption = computed(() =>
  fiqhOptions.find((o) => o.value === fiqhModel.value)
);

const notificationsEnabled = ref(false);
const reminderOffset = ref(0);

const enabledPrayers = ref({
  Fajr: true,
  Dhuhr: true,
  Asr: true,
  Maghrib: true,
  Isha: true,
});

const reminderOptions = [
  { title: "At prayer time", value: 0 },
  { title: "5 minutes before", value: 5 },
  { title: "10 minutes before", value: 10 },
];

const themeOptions = [
  { title: "System", value: "system" },
  { title: "Light", value: "light" },
  { title: "Dark", value: "dark" },
];

async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;

  if (Notification.permission === "granted") return true;

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

watch(notificationsEnabled, async (val) => {
  if (val) {
    const granted = await requestNotificationPermission();

    if (!granted) {
      notificationsEnabled.value = false;
      alert("Please allow notifications to receive prayer alerts.");
    }
  }

  prayer.refreshNotificationSchedule();
});

async function sendTestNotification() {
  if (!("Notification" in window)) {
    alert("This browser doesn't support notifications.");
    return;
  }

  if (Notification.permission !== "granted") {
    const granted = await requestNotificationPermission();
    if (!granted) return;
  }

  sendingTest.value = true;
  try {
    const options = {
      body: "Prayer notifications are working correctly.",
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
      vibrate: [200, 100, 200],
      tag: "test-notification",
    };

    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification("🕌 Test Notification", options);
    } else {
      new Notification("🕌 Test Notification", options);
    }
  } finally {
    sendingTest.value = false;
  }
}

onMounted(() => {
  const saved = localStorage.getItem("prayerSettings");
  if (saved) {
    const s = JSON.parse(saved);
    notificationsEnabled.value = s.notificationsEnabled;
    enabledPrayers.value = s.enabledPrayers;
    reminderOffset.value = s.reminderOffset;
  }

  themeMode.value = localStorage.getItem("themeMode") || "system";
  applyTheme(themeMode.value);
});

watch(
  [notificationsEnabled, enabledPrayers, reminderOffset],
  () => {
    localStorage.setItem(
      "prayerSettings",
      JSON.stringify({
        notificationsEnabled: notificationsEnabled.value,
        enabledPrayers: enabledPrayers.value,
        reminderOffset: reminderOffset.value,
      })
    );
    prayer.refreshNotificationSchedule();
  },
  { deep: true }
);

watch(themeMode, (val) => {
  localStorage.setItem("themeMode", val);
  theme.global.name.value = val === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : val;
});


function applyTheme(mode) {
  if (mode === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme.global.name.value = isDark ? "dark" : "light";
  } else {
    theme.global.name.value = mode;
  }
}
</script>
