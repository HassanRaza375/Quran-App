function canNotify(prayer) {
  const settings = JSON.parse(localStorage.getItem("prayerSettings") || "{}");

  if (!settings.notificationsEnabled) return false;
  if (!settings.enabledPrayers?.[prayer]) return false;

  return Notification.permission === "granted";
}
