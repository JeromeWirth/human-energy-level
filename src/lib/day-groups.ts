import { EnergyEvent } from "./types";

export interface DayGroup {
  label: string;
  events: EnergyEvent[];
}

export function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function isToday(timestamp: number): boolean {
  return startOfDay(new Date(timestamp)) === startOfDay(new Date());
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function dayLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const dd = pad(date.getDate());
  const mm = pad(date.getMonth() + 1);

  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86_400_000
  );
  if (diffDays === 0) return `Today, ${dd}.${mm}.`;
  if (diffDays === 1) return `Yesterday, ${dd}.${mm}.`;
  return `${dd}.${mm}.${date.getFullYear()}`;
}

/** Groups events (already sorted newest-first) into day buckets, newest day first. */
export function groupEventsByDay(events: EnergyEvent[]): DayGroup[] {
  const groups: DayGroup[] = [];
  const indexByKey = new Map<string, number>();

  for (const event of events) {
    const key = String(startOfDay(new Date(event.timestamp)));
    let index = indexByKey.get(key);
    if (index === undefined) {
      index = groups.length;
      indexByKey.set(key, index);
      groups.push({ label: dayLabel(event.timestamp), events: [] });
    }
    groups[index].events.push(event);
  }

  return groups;
}
