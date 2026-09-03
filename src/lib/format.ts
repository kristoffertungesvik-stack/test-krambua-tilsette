/**
 * Norwegian-formatted dates & times, per the handoff: "Onsdag 3. september",
 * "06.30–14.00", "07.24" — period, not colon, as the time separator.
 */

const DAY_NAMES = [
  "Måndag",
  "Tysdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Laurdag",
  "Sundag",
];

const DAY_NAMES_SHORT = ["Man", "Tys", "Ons", "Tor", "Fre", "Lau", "Sun"];

const MONTH_NAMES = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
];

/** dayIndex: 0 = Monday … 6 = Sunday */
export function dayName(dayIndex: number, short = false): string {
  return (short ? DAY_NAMES_SHORT : DAY_NAMES)[dayIndex] ?? "";
}

export function formatFullDate(date: Date): string {
  const day = DAY_NAMES[(date.getDay() + 6) % 7];
  return `${day} ${date.getDate()}. ${MONTH_NAMES[date.getMonth()]}`;
}

export function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}.${m}`;
}

/** ISO week number and Monday-start dates for the current week. */
export function currentWeek(): { weekNumber: number; monday: Date } {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - day);
  monday.setHours(0, 0, 0, 0);

  const target = new Date(monday);
  target.setDate(target.getDate() + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const diff = (target.getTime() - firstThursday.getTime()) / 86400000;
  const weekNumber = 1 + Math.round(diff / 7);

  return { weekNumber, monday };
}

export function weekDateLabel(dayIndex: number, monday: Date): string {
  const d = new Date(monday);
  d.setDate(monday.getDate() + dayIndex);
  return `${dayName(dayIndex, true)} ${d.getDate()}.`;
}

export function isToday(dayIndex: number, monday: Date): boolean {
  const d = new Date(monday);
  d.setDate(monday.getDate() + dayIndex);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function todayIndex(): number {
  return (new Date().getDay() + 6) % 7;
}
