export function format12h(time) {
  if (!time) return "";

  // Extract HH:MM only (handles "05:12 (+05)")
  const match = time.match(/\d{1,2}:\d{2}/);
  if (!match) return "";

  const [h, m] = match[0].split(":").map(Number);

  const d = new Date();
  d.setHours(h, m, 0, 0);

  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
