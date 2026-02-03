function canNotify(prayer) {
  const saved = localStorage.getItem("prayerSettings");
  if (!saved) return true;

  const settings = JSON.parse(saved);

  // Master switch
  if (settings.notificationsEnabled === false) return false;

  // Per-prayer toggle
  if (settings.enabledPrayers?.[prayer] === false) return false;

  return true;
}
