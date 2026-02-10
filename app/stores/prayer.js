import { defineStore } from "pinia";

export const usePrayerStore = defineStore("prayer", () => {
  const latitude = ref(null);
  const longitude = ref(null);

  const data = ref(null);
  const pending = ref(true);
  const error = ref(null);
  const countdown = ref("");
  const qibla = ref(null);
  let lastNotified = null;

  const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
  const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const icons = {
    Fajr: "mdi-weather-sunset-up",
    Dhuhr: "mdi-weather-sunny",
    Asr: "mdi-weather-partly-cloudy",
    Maghrib: "mdi-weather-sunset-down",
    Isha: "mdi-weather-night",
  };

  let countdownTimer;
  let autoRefreshTimer;

  /* ---------------- SETTINGS ---------------- */

  function getSettings() {
    return JSON.parse(localStorage.getItem("prayerSettings") || "{}");
  }

  function canNotify(prayer) {
    const s = getSettings();

    if (!s.notificationsEnabled) return false;
    if (!s.enabledPrayers?.[prayer]) return false;

    return Notification.permission === "granted";
  }

  function getOffset() {
    const s = getSettings();
    return s.reminderOffset || 0;
  }

  /* ---------------- LOCATION ---------------- */

  function getLocation() {
    if (!navigator.geolocation) {
      fallbackLocation();
      fetchPrayerTimes();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        latitude.value = pos.coords.latitude;
        longitude.value = pos.coords.longitude;
        calculateQibla(latitude.value, longitude.value);
        fetchPrayerTimes();
      },
      () => {
        fallbackLocation();
        fetchPrayerTimes();
      },
    );
  }

  function fallbackLocation() {
    latitude.value = 21.4225;
    longitude.value = 39.8262;
  }

  /* ---------------- FETCH ---------------- */

  const cacheKey = computed(
    () => `prayer_${latitude.value}_${longitude.value}_${today}`,
  );

  async function fetchPrayerTimes() {
    try {
      pending.value = true;
      error.value = null;

      const cached = localStorage.getItem(cacheKey.value);
      if (cached) {
        data.value = JSON.parse(cached);
        scheduleAutoRefresh();
        return;
      }

      data.value = await $fetch(`https://api.aladhan.com/v1/timings/${today}`, {
        params: {
          latitude: latitude.value,
          longitude: longitude.value,
          method: 2,
        },
      });

      localStorage.setItem(cacheKey.value, JSON.stringify(data.value));
      scheduleAutoRefresh();
    } catch (err) {
      error.value = "Failed to load prayer times";
      console.error(err);
    } finally {
      pending.value = false;
    }
  }

  /* ---------------- NEXT PRAYER ---------------- */

  const nextPrayer = computed(() => {
    if (!data.value) return null;

    const now = new Date();

    const upcoming = prayerOrder
      .map((prayer) => {
        const [h, m] = data.value.data.timings[prayer].split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return { prayer, time: d };
      })
      .filter((p) => p.time > now)
      .sort((a, b) => a.time - b.time);

    return upcoming[0]?.prayer || "Fajr";
  });

  watch(nextPrayer, () => (lastNotified = null));

  /* ---------------- COUNTDOWN ---------------- */

  function updateCountdown() {
    if (!data.value || !nextPrayer.value) return;

    const now = new Date();
    const offset = getOffset();

    const [h, m] = data.value.data.timings[nextPrayer.value]
      .split(":")
      .map(Number);

    const target = new Date();
    target.setHours(h, m - offset, 0, 0);

    if (target < now) target.setDate(target.getDate() + 1);

    const diff = target - now;

    if (diff <= 1000 && lastNotified !== nextPrayer.value) {
      if (!canNotify(nextPrayer.value)) return;

      showPrayerNotification(nextPrayer.value);
      lastNotified = nextPrayer.value;
    }

    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    countdown.value = `${hrs}h ${mins}m ${secs}s`;
  }

  /* ---------------- AUTO REFRESH ---------------- */

  function scheduleAutoRefresh() {
    if (!data.value || !nextPrayer.value) return;

    const now = new Date();
    const [h, m] = data.value.data.timings[nextPrayer.value]
      .split(":")
      .map(Number);

    const nextTime = new Date();
    nextTime.setHours(h, m, 5, 0);

    if (nextTime < now) nextTime.setDate(nextTime.getDate() + 1);

    clearTimeout(autoRefreshTimer);
    autoRefreshTimer = setTimeout(fetchPrayerTimes, nextTime - now);
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

    let angle = (Math.atan2(y, x) * 180) / Math.PI;
    qibla.value = (angle + 360) % 360;
  }

  /* ---------------- NOTIFICATION ---------------- */

  function showPrayerNotification(prayer) {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(`🕌 ${prayer} time`, {
        body: `It’s time for ${prayer} prayer.`,
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
        vibrate: [200, 100, 200],
        tag: prayer,
        renotify: true,
      });
    });
  }

  /* ---------------- RAMADAN ---------------- */

  const isRamadan = computed(() => {
    const hijriMonth = data.value?.data?.date?.hijri?.month?.number;
    return hijriMonth === 9;
  });

  const ramadanDay = computed(() => {
    return data.value?.data?.date?.hijri?.day;
  });

  const suhoorTime = computed(() => {
    return data.value?.data?.timings?.Fajr;
  });

  const iftarTime = computed(() => {
    return data.value?.data?.timings?.Maghrib;
  });

  const iftarCountdown = ref("");

  function updateIftarCountdown() {
    if (!isRamadan.value || !iftarTime.value) return;

    const now = new Date();
    const [h, m] = iftarTime.value.split(":").map(Number);

    const iftar = new Date();
    iftar.setHours(h, m, 0, 0);

    if (iftar < now) {
      iftarCountdown.value = "Iftar time passed 🌙";
      return;
    }

    const diff = iftar - now;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    iftarCountdown.value = `${hrs}h ${mins}m ${secs}s`;
  }

  function init() {
    if (process.client && !data.value) {
      getLocation();
      countdownTimer = setInterval(() => {
        updateCountdown();
        updateIftarCountdown();
      }, 1000);
    }
  }

  return {
    /* core */
    data,
    pending,
    error,

    /* location */
    latitude,
    longitude,

    /* prayer */
    countdown,
    nextPrayer,
    prayerOrder,
    icons,

    /* qibla */
    qibla,

    /* ramadan */
    isRamadan,
    ramadanDay,
    suhoorTime,
    iftarTime,
    iftarCountdown,

    /* actions */
    fetchPrayerTimes,
    init,
  };
});
