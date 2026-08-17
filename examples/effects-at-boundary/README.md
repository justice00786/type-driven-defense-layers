# effects-at-boundary

Layer 4 demo: time types, nominal reuse keys, and at-least-once handlers.

These are **three independent lessons**, not one pipeline. Ticket vocabulary is shared with the other catalog packages only as nouns.

## Run

```bash
npm ci
npm run typecheck
npm test
```

## Lessons

1. **Time** — `CalendarDate` (civil `YYYY-MM-DD`) and `Instant` (UTC ISO-8601) are different brands. Display labels and clock math do not share a `string` / `Date`. Normalize at the boundary (`parseCalendarDate` / `parseInstant`).
2. **ReuseKey** — Brand a key only on the path that *reuses* the same fingerprint. One-shot attempt tokens stay a plain `FreshToken`. The brand does not validate and does not stop double side effects. The `Set` (stand-in for a UNIQUE constraint) does.
3. **Inbox** — After the event id is accepted, the handler must not throw (including `assertNever`). Exhaustiveness is `satisfies never` with a `return`. Unknown actions are ignored: no side effect, no throw.

## Throw vs no-throw

This package forbids throw **after accept**. Pure-function `assertNever` in `state-and-result` still throws. See [../README.md](../README.md).

## What it does not claim

- A `ReuseKey` brand does **not** mean double side effects cannot happen.
- `FreshToken` is a plain `string`, so a `ReuseKey` is assignable to it. The protected direction is the other way (fresh token is not a reuse key).
- This is not a network, queue, or database. The store is in-memory.

## Layout

| Path | Role |
| --- | --- |
| `src/time.ts` | `CalendarDate` vs `Instant` |
| `src/reuseKey.ts` | nominal `ReuseKey` + unique-key store |
| `src/inbox.ts` | accept then handle without throw |
| `test/negatives.ts` | `@ts-expect-error` mix-ups |
