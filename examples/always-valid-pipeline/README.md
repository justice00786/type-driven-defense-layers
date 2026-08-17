# always-valid-pipeline

Layer 2 demo: parse once at the boundary, then pass only Always-Valid `Ticket`.

This package does **not** share types with the other ticket-vocabulary examples.
It is a different encoding of the same nouns.

## Run

```bash
npm ci
npm run typecheck
npm test
```

## What it blocks

- `unknown` reaching `publish`
- `ParsedInput` (schema-shaped boundary type) being used as `Ticket`
- Empty / malformed fields at the boundary

Parse once is encoded in the **signature**: `publish(ticket: Ticket)` cannot take `ParsedInput` or `unknown`. See `test/negatives.ts`. ROP, if any, stays outside the inner API: [envelopes-and-control.md](../envelopes-and-control.md).

## What it does not block

- `brandTicketId("not-a-ticket")` compiles. Branding is a name stamp, not validation.
- Branding every `string` also compiles. That is a design anti-pattern, not a type error.

## Contrast with `order-pipeline`

`order-pipeline` parses `unknown` straight into branded `OrderId` / `Money`.
This demo inserts an explicit boundary type (`ParsedInput`) and a factory (`toTicket`) so the schema result and the domain type stay distinct.

## Layout

| Path | Role |
| --- | --- |
| `src/boundary.ts` | `unknown` → `{ ok }` + `ParsedInput` |
| `src/ticket.ts` | `toTicket` mints Always-Valid `Ticket`; `brandTicketId` is nominal only |
| `src/inner.ts` | `publish(ticket: Ticket)` — no re-parse |
| `test/negatives.ts` | `@ts-expect-error` for inner API misuse |
