import { daysBetween, later, type CalendarDate, type Instant } from "../src/time.js";
import { rememberReuse, type FreshToken } from "../src/reuseKey.js";

export function cannotPassInstantAsCalendarDate(
  instant: Instant,
  day: CalendarDate,
): number {
  // @ts-expect-error Instant is not CalendarDate
  return daysBetween(instant, day);
}

export function cannotPassCalendarDateAsInstant(
  day: CalendarDate,
  instant: Instant,
): Instant {
  // @ts-expect-error CalendarDate is not Instant
  return later(day, instant);
}

export function cannotPassFreshTokenAsReuseKey(token: FreshToken): "inserted" | "duplicate" {
  // @ts-expect-error one-shot FreshToken is not a ReuseKey
  return rememberReuse(token, new Set());
}
