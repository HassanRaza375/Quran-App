import { defineStore } from "pinia";

export const usePrayerStore = defineStore("prayer", () => {
  const latitude = ref(null);
  const longitude = ref(null);

  const data = ref(null);
  const pending = ref(true);
  const error = ref(null);
  const countdown = ref("");
  const qibla = ref(null);
  const locationSource = ref(null); // "gps" | "fallback"
  const fiqh = ref("sunni"); // "sunni" | "jafari"

  const getTodayKey = () =>
    new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
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
  let notificationTimers = [];

  /* ---------------- SETTINGS ---------------- */

  function getSettings() {
    return JSON.parse(localStorage.getItem("prayerSettings") || "{}");
  }

  function getOffset() {
    const s = getSettings();
    return s.reminderOffset || 0;
  }

  function loadFiqh() {
    const saved = localStorage.getItem("prayerFiqh");
    fiqh.value = saved === "jafari" ? "jafari" : "sunni";
  }

  /**
   * Switch calculation method (Sunni/ISNA vs Shia Ja'fari) and refetch
   * prayer times immediately with the new method instead of waiting for
   * the next scheduled refresh.
   */
  function setFiqh(value) {
    fiqh.value = value === "jafari" ? "jafari" : "sunni";
    localStorage.setItem("prayerFiqh", fiqh.value);
    if (import.meta.client && latitude.value != null) fetchPrayerTimes();
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
        locationSource.value = "gps";
        calculateQibla(latitude.value, longitude.value);
        fetchPrayerTimes();
      },
      () => {
        fallbackLocation();
        fetchPrayerTimes();
      },
    );
  }

  // Lahore, Pakistan — used whenever geolocation is unavailable or denied.
  function fallbackLocation() {
    latitude.value = 31.5204;
    longitude.value = 74.3587;
    locationSource.value = "fallback";
    calculateQibla(latitude.value, longitude.value);
  }

  /** Re-request device location (e.g. after the user changes permission). */
  function refreshLocation() {
    if (!import.meta.client) return;
    getLocation();
  }

  /* ---------------- FETCH ---------------- */

  // Plain function (not `computed`) so it re-reads the real calendar date on
  // every call — a memoized computed would freeze on whatever day the store
  // was created, breaking the daily auto-refresh for any session left open
  // past midnight. Includes fiqh so switching calculation method doesn't
  // silently reuse a cached result computed with the other method.
  const getCacheKey = () =>
    `prayer_${latitude.value}_${longitude.value}_${fiqh.value}_${getTodayKey()}`;

  async function fetchPrayerTimes() {
    try {
      pending.value = true;
      error.value = null;

      const cacheKey = getCacheKey();
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        data.value = JSON.parse(cached);
        scheduleAutoRefresh();
        return;
      }

      data.value = await $fetch(
        `https://api.aladhan.com/v1/timings/${getTodayKey()}`,
        {
          params: {
            latitude: latitude.value,
            longitude: longitude.value,
            ...FIQH_PARAMS[fiqh.value],
          },
        },
      );

      localStorage.setItem(cacheKey, JSON.stringify(data.value));
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

  /* ---------------- COUNTDOWN (display only) ---------------- */

  function updateCountdown() {
    if (!data.value || !nextPrayer.value) return;

    const now = new Date();

    const [h, m] = data.value.data.timings[nextPrayer.value]
      .split(":")
      .map(Number);

    const target = new Date();
    target.setHours(h, m, 0, 0);

    if (target < now) target.setDate(target.getDate() + 1);

    const diff = target - now;

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

  /* ---------------- NOTIFICATION SCHEDULING ----------------
   * Fires via precise setTimeout per prayer instead of polling every
   * second, so it isn't relying on the 1s countdown tick to catch the
   * exact moment. Only works while the app/PWA stays open (foreground or
   * a backgrounded tab) — there's no push backend, so nothing fires once
   * the app is fully closed.
   */

  function showPrayerNotification(prayer, offsetMinutes = 0) {
    const title = offsetMinutes > 0 ? `🕌 ${prayer} soon` : `🕌 ${prayer} time`;
    const body =
      offsetMinutes > 0
        ? `${prayer} begins in ${offsetMinutes} minute${offsetMinutes === 1 ? "" : "s"}.`
        : `It's time for ${prayer} prayer.`;

    const options = {
      body,
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
      vibrate: [200, 100, 200],
      tag: `${prayer}-${offsetMinutes > 0 ? "reminder" : "time"}`,
      renotify: true,
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    } else if (typeof Notification !== "undefined") {
      new Notification(title, options);
    }
  }

  function clearNotificationTimers() {
    notificationTimers.forEach(clearTimeout);
    notificationTimers = [];
  }

  function scheduleNotifications() {
    clearNotificationTimers();

    if (!import.meta.client || !data.value) return;

    const settings = getSettings();
    if (!settings.notificationsEnabled) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

    const offset = getOffset();
    const now = new Date();

    prayerOrder.forEach((prayer) => {
      if (!settings.enabledPrayers?.[prayer]) return;

      const [h, m] = data.value.data.timings[prayer].split(":").map(Number);
      const target = new Date();
      target.setHours(h, m - offset, 0, 0);

      // Already passed today — this prayer's next occurrence is tomorrow.
      if (target <= now) target.setDate(target.getDate() + 1);

      const delay = target - now;
      // setTimeout delays are capped at ~24.8 days; a day+ out is safe here.
      const timer = setTimeout(() => {
        showPrayerNotification(prayer, offset);
        scheduleNotifications(); // roll this prayer forward to its next occurrence
      }, delay);

      notificationTimers.push(timer);
    });
  }

  /**
   * Call after changing notification settings (enable toggle, per-prayer
   * toggle, reminder offset) so the schedule updates immediately instead of
   * waiting for the next prayer-times fetch.
   */
  function refreshNotificationSchedule() {
    scheduleNotifications();
  }

  watch(data, scheduleNotifications);

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

  const imsakTime = computed(() => {
    return data.value?.data?.timings?.Imsak;
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
      loadFiqh();
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
    locationSource,
    refreshLocation,

    /* fiqh (calculation method) */
    fiqh,
    setFiqh,

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
    imsakTime,
    iftarTime,
    iftarCountdown,

    /* actions */
    fetchPrayerTimes,
    init,
    refreshNotificationSchedule,
  };
});
