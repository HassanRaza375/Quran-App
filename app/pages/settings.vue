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

    <!-- Reading Preferences -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4" rounded="xl">
          <div class="text-subtitle-1 font-weight-bold mb-3">Reading Preferences</div>

          <v-select
            label="Default verse display"
            :items="verseDisplayOptions"
            v-model="preferredVerseDisplay"
            item-title="title"
            item-value="value"
            class="mb-2"
          />
          <v-select
            label="Default tafsir source"
            :items="tafsirAuthorOptions"
            v-model="preferredTafsirAuthor"
            clearable
            hint="Used the first time you open a tafsir panel on a fresh ayah"
            persistent-hint
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Audio Defaults -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4" rounded="xl">
          <div class="text-subtitle-1 font-weight-bold mb-3">Audio Defaults</div>

          <v-select
            label="Preferred reciter"
            :items="reciters"
            v-model="preferredReciter"
            item-title="reciter"
            item-value="id"
            class="mb-2"
            return-object
          />

          <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-2">
            <span class="text-body-2">Playback speed</span>
            <v-btn-toggle v-model="playbackRate" mandatory density="comfortable" color="primary">
              <v-btn v-for="r in [0.75, 1, 1.25, 1.5, 2]" :key="r" :value="r" size="small">{{ r }}x</v-btn>
            </v-btn-toggle>
          </div>

          <v-switch
            v-model="autoAdvance"
            label="Auto-play the next surah when one finishes"
            inset
            color="primary"
            hide-details
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Accessibility -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4" rounded="xl">
          <div class="text-subtitle-1 font-weight-bold mb-3">Accessibility</div>

          <v-switch v-model="reducedMotion" label="Reduce motion" inset color="primary" hide-details class="mb-2" />
          <v-switch v-model="highContrast" label="High contrast text & borders" inset color="primary" hide-details class="mb-2" />
          <v-switch v-model="largeTouchTargets" label="Larger touch targets" inset color="primary" hide-details class="mb-4" />

          <div class="text-body-2 mb-1">Arabic text size (Surah reader)</div>
          <v-slider
            v-model="arabicFontScale"
            :min="0.8"
            :max="1.5"
            :step="0.1"
            thumb-label
            color="primary"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Data & Privacy -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4" rounded="xl">
          <div class="text-subtitle-1 font-weight-bold mb-1">Data & Privacy</div>
          <div class="text-caption text-medium-emphasis mb-3">
            Everything in this app is stored locally on this device — nothing is uploaded anywhere.
          </div>

          <div class="d-flex flex-wrap ga-2">
            <v-btn variant="tonal" prepend-icon="mdi-download-outline" @click="exportData">
              Export my data
            </v-btn>
            <v-btn variant="tonal" color="error" prepend-icon="mdi-delete-outline" @click="clearDataDialog = true">
              Clear all local data
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="clearDataDialog" max-width="400">
      <v-card rounded="lg">
        <v-card-title>Clear all local data?</v-card-title>
        <v-card-text>
          This removes bookmarks, notes, reading goals, downloads, Ramadan tracking, and every other
          preference stored by this app on this device. This can't be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="clearDataDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="clearAllData">Clear everything</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { useTheme } from "vuetify";

const theme = useTheme();
// Same cookie key as app/plugins/vuetify.js — keeping it in sync here too
// means picking a theme and immediately refreshing already has the right
// theme available at SSR time, not just after the next full app mount.
const themeCookie = useCookie("theme-resolved", { default: () => "light", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
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
  applyTheme(val);
});

function applyTheme(mode) {
  const resolved = mode === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : mode;
  theme.global.name.value = resolved;
  themeCookie.value = resolved;
}

/* ---------------- Reading preferences ---------------- */
const verseDisplayOptions = [
  { title: "Arabic (primary)", value: "arabic1" },
  { title: "Arabic (alternate script)", value: "arabic2" },
  { title: "English", value: "english" },
  { title: "Urdu", value: "urdu" },
  { title: "Bengali", value: "bengali" },
];
const tafsirAuthorOptions = ["Ibn Kathir", "Maarif Ul Quran", "Tazkirul Quran"];

const preferredVerseDisplay = ref("arabic1");
const preferredTafsirAuthor = ref(null);

watch(preferredVerseDisplay, (v) => localStorage.setItem("preferredVerseDisplay", v));
watch(preferredTafsirAuthor, (v) => {
  if (v) localStorage.setItem("tafsirDefaultAuthor", v);
  else localStorage.removeItem("tafsirDefaultAuthor");
});

/* ---------------- Audio defaults ---------------- */
const { reciters } = useReciters();
const { selected: selectedReciter, setReciter, loadSaved: loadSavedReciter } = useReciter();
const { playbackRate: playerPlaybackRate, setPlaybackRate, autoAdvance: playerAutoAdvance, toggleAutoAdvance } =
  useAudioPlayer();

// Only the name is meaningful as a stored "preference" — actual playback
// URLs are per-surah and get re-resolved by name wherever audio is played
// (see the matching comment in surah/[id].vue's reciter watcher).
const preferredReciter = computed({
  get: () => reciters.find((r) => r.reciter === selectedReciter.value?.reciter) ?? null,
  set: (val) => setReciter({ reciter: val.reciter }),
});
const playbackRate = computed({
  get: () => playerPlaybackRate.value,
  set: (val) => setPlaybackRate(val),
});
const autoAdvance = computed({
  get: () => playerAutoAdvance.value,
  set: (val) => {
    if (val !== playerAutoAdvance.value) toggleAutoAdvance();
  },
});

/* ---------------- Accessibility ---------------- */
const { prefs: accessibilityPrefs, load: loadAccessibilityPrefs, setPref: setAccessibilityPref } =
  useAccessibilityPrefs();

const reducedMotion = computed({
  get: () => accessibilityPrefs.value.reducedMotion,
  set: (v) => setAccessibilityPref("reducedMotion", v),
});
const highContrast = computed({
  get: () => accessibilityPrefs.value.highContrast,
  set: (v) => setAccessibilityPref("highContrast", v),
});
const largeTouchTargets = computed({
  get: () => accessibilityPrefs.value.largeTouchTargets,
  set: (v) => setAccessibilityPref("largeTouchTargets", v),
});
const arabicFontScale = computed({
  get: () => accessibilityPrefs.value.arabicFontScale,
  set: (v) => setAccessibilityPref("arabicFontScale", v),
});

/* ---------------- Data & privacy ---------------- */
const clearDataDialog = ref(false);

function exportData() {
  const dump = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      dump[key] = JSON.parse(localStorage.getItem(key));
    } catch {
      dump[key] = localStorage.getItem(key);
    }
  }
  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quran-app-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function clearAllData() {
  localStorage.clear();
  clearDataDialog.value = false;
  location.reload();
}

onMounted(() => {
  preferredVerseDisplay.value = localStorage.getItem("preferredVerseDisplay") || "arabic1";
  preferredTafsirAuthor.value = localStorage.getItem("tafsirDefaultAuthor") || null;
  loadSavedReciter();
  loadAccessibilityPrefs();
});
</script>
