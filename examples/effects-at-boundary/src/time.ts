/** Layer 4: calendar day vs instant. Normalize at the boundary. */

export type ParseFail = { readonly ok: false; readonly reason: string };
export type ParseOk<T> = { readonly ok: true; readonly value: T };
export type ParseResult<T> = ParseOk<T> | ParseFail;

declare const CalendarDateBrand: unique symbol;
declare const InstantBrand: unique symbol;

/** Civil date `YYYY-MM-DD`. Not a clock instant. */
export type CalendarDate = string & { readonly [CalendarDateBrand]: void };

/** UTC instant as ISO-8601. Not a civil date. */
export type Instant = string & { readonly [InstantBrand]: void };

function fail(reason: string): ParseFail {
  return { ok: false, reason };
}

export function parseCalendarDate(raw: unknown): ParseResult<CalendarDate> {
  if (typeof raw !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return fail("calendar date must be YYYY-MM-DD");
  }
  const [yearText, monthText, dayText] = raw.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const utc = Date.UTC(year, month - 1, day);
  const valid =
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    new Date(utc).getUTCFullYear() === year &&
    new Date(utc).getUTCMonth() === month - 1 &&
    new Date(utc).getUTCDate() === day;
  if (!valid) {
    return fail("calendar date is not a real civil day");
  }
  return { ok: true, value: raw as CalendarDate };
}

export function parseInstant(raw: unknown): ParseResult<Instant> {
  if (typeof raw !== "string") {
    return fail("instant must be a string");
  }
  const ms = Date.parse(raw);
  if (Number.isNaN(ms)) {
    return fail("instant must be ISO-8601");
  }
  return { ok: true, value: new Date(ms).toISOString() as Instant };
}

export function daysBetween(from: CalendarDate, to: CalendarDate): number {
  const fromMs = Date.parse(`${from}T00:00:00Z`);
  const toMs = Date.parse(`${to}T00:00:00Z`);
  return Math.round((toMs - fromMs) / 86_400_000);
}

export function later(a: Instant, b: Instant): Instant {
  return Date.parse(a) >= Date.parse(b) ? a : b;
}
