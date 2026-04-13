import { Temporal, toTemporalInstant } from "@js-temporal/polyfill";

// biome-ignore lint/suspicious/noExplicitAny: Polyfill
(Date.prototype as any).toTemporalInstant = toTemporalInstant;

export function dateToZonedDateTime(date: Date, timeZone?: string): Temporal.ZonedDateTime {
  return Temporal.ZonedDateTime.from({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    millisecond: date.getMilliseconds(),
    timeZone,
  });
}

export function zonedDateTimeToDate(zdt: Temporal.ZonedDateTime): Date {
  return new Date(zdt.toString({ timeZoneName: "never" }));
}

export function renderDateTime(date: Date | string | undefined, timeZone: string) {
  if (!date) {
    return "";
  }
  if (typeof date === "string") {
    date = new Date(date);
  }
  console.log({ date });
  const zdt = toTemporalInstant.apply(date).toZonedDateTimeISO(timeZone);
  return zdt.toLocaleString(undefined, { timeZoneName: "long" });
}
