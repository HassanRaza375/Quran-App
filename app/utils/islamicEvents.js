// Major Islamic dates, keyed by Hijri month/day. Widely-observed dates only —
// exact observance (especially Ramadan/Eid start, which depend on moon
// sighting) can differ by a day depending on local authority; this is a
// calculated reference, not a ruling. Keep in sync with the Ramadan-specific
// override in useRamadan.ts, which handles Ramadan's own start-date
// uncertainty separately.
export const ISLAMIC_EVENTS = [
  { month: 1, day: 1, name: "Islamic New Year", icon: "mdi-calendar-star" },
  { month: 1, day: 10, name: "Day of Ashura", icon: "mdi-star-four-points-outline" },
  { month: 3, day: 12, name: "Mawlid al-Nabi", icon: "mdi-star-crescent" },
  { month: 7, day: 27, name: "Isra and Mi'raj", icon: "mdi-star-crescent" },
  { month: 8, day: 15, name: "Laylat al-Bara'at", icon: "mdi-star-four-points-outline" },
  { month: 9, day: 1, name: "Start of Ramadan", icon: "mdi-moon-waning-crescent" },
  { month: 9, day: 21, name: "Laylat al-Qadr (possible night)", icon: "mdi-star-four-points-outline" },
  { month: 9, day: 23, name: "Laylat al-Qadr (possible night)", icon: "mdi-star-four-points-outline" },
  { month: 9, day: 25, name: "Laylat al-Qadr (possible night)", icon: "mdi-star-four-points-outline" },
  { month: 9, day: 27, name: "Laylat al-Qadr (possible night)", icon: "mdi-star-four-points-outline" },
  { month: 9, day: 29, name: "Laylat al-Qadr (possible night)", icon: "mdi-star-four-points-outline" },
  { month: 10, day: 1, name: "Eid al-Fitr", icon: "mdi-party-popper" },
  { month: 12, day: 8, name: "Start of Hajj", icon: "mdi-kaaba" },
  { month: 12, day: 9, name: "Day of Arafah", icon: "mdi-mountain" },
  { month: 12, day: 10, name: "Eid al-Adha", icon: "mdi-party-popper" },
];

export const getIslamicEvent = (hijriMonth, hijriDay) =>
  ISLAMIC_EVENTS.find((e) => e.month === hijriMonth && e.day === hijriDay) ?? null;
