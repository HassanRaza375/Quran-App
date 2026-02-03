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
          <v-select
            label="App Theme"
            class="mb-4"
            :items="[
              { title: 'System', value: 'system' },
              { title: 'Light', value: 'light' },
              { title: 'Dark', value: 'dark' },
            ]"
            item-title="title"
            item-value="value"
            v-model="themeMode"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-divider class="my-4" />
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-switch
            v-model="notificationsEnabled"
            label="Enable Prayer Notifications"
            inset
            color="warning"
          />

          <v-divider class="my-4" />

          <v-switch
            v-for="p in prayerOrder"
            :key="p"
            v-model="enabledPrayers[p]"
            :label="p"
            :disabled="!notificationsEnabled"
            inset
            color="info"
          />

          <v-select
            class="mt-4"
            label="Reminder Time"
            :items="reminderOptions"
            v-model="reminderOffset"
            item-title="title"
            item-value="value"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { useTheme } from "vuetify";
const theme = useTheme();
const themeMode = ref("system");

const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const notificationsEnabled = ref(true);
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

function applyTheme(mode) {
  if (mode === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme.global.name.value = isDark ? "dark" : "light";
  } else {
    theme.global.name.value = mode;
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
      }),
    );
  },
  { deep: true },
);
watch(themeMode, (val) => {
  localStorage.setItem("themeMode", val);

  if (val === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme.global.name.value = isDark ? "dark" : "light";
  } else {
    theme.global.name.value = val;
  }
});
</script>
