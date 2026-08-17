# state-and-result

Layer 1 demo: `{ kind }` vs `{ ok }`, illegal state bags, and soft-fallback.

Ticket here is a **discriminated union whose fields change by stage**. It does not share types with `always-valid-pipeline`.

## Run

```bash
npm ci
npm run typecheck
npm test
```

## What it blocks

- Reading `assigneeId` on `draft` (payload differs by stage — this is the contrast with `order-pipeline`'s phantom `Order<S>`, where the payload is the same across states)
- Passing an optional bag `{ loading?; data?; error? }` where a `{ kind }` view state is required
- Treating an `{ ok }` command result as a `{ kind }` ticket
- Unhandled `Ticket` variants in `describeTicket` (`assertNever`)

## Throw vs no-throw

`assertNever` **does throw**. That is correct for this pure-function exhaustiveness demo.

After an inbox event has been accepted, throw is forbidden — including `assertNever`. That rule lives in `effects-at-boundary`. Neither rule replaces the other.

## What it does not block

- Constructing `{ loading: true, data, error }` as a loose object (it compiles). The defense is refusing to *use* that bag as `TicketViewState`.
- Unknown widget `kind` values. `renderWidget` warns and returns `null` — it does not throw, and it does not count as a successful render.

## `{ ok }` vs `{ kind }`

- `{ kind }` — domain / view variants (draft / open / closed; loading / ready / error). No success/failure semantics.
- `{ ok }` — operation success or failure (`assignTicket`), with a closed `reason` union.
- `FormRedisplay` is a third envelope (optional `message` / `fieldErrors`) for UI redisplay. Do not merge it with `CommandResult`.

Failures use `{ ok: false }` and early return (`if (!result.ok) return result`). There is no `Either` chain.

## Layout

| Path | Role |
| --- | --- |
| `src/ticket.ts` | `{ kind }` typestate with stage-specific fields |
| `src/assign.ts` | `{ ok }` result + early return + `assertNever` describe |
| `src/viewState.ts` | `{ kind }` view state instead of an optional bag |
| `src/envelopes.ts` | redisplay envelope vs command result |
| `src/softFallback.ts` | unknown widget → warn + `null` |
| `src/assertNever.ts` | fixed message `Unexpected value` |
| `test/negatives.ts` | `@ts-expect-error` cases |
