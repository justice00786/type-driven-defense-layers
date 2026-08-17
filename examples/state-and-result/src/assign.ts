import { assertNever } from "./assertNever.js";
import type { OpenTicket, Ticket } from "./ticket.js";

/**
 * Operation result: success / failure. Not a domain-state `{ kind }`.
 * Exceptions are reserved for invariant violations; expected failures use `{ ok: false }`.
 */
export type AssignResult =
  | { readonly ok: true; readonly ticket: OpenTicket }
  | { readonly ok: false; readonly reason: "not_open" | "already_assigned" };

export function assignTicket(ticket: Ticket, assigneeId: string): AssignResult {
  if (ticket.kind === "closed") {
    return { ok: false, reason: "not_open" };
  }
  if (ticket.kind === "open") {
    return { ok: false, reason: "already_assigned" };
  }
  return {
    ok: true,
    ticket: {
      kind: "open",
      id: ticket.id,
      title: ticket.title,
      assigneeId,
    },
  };
}

/** Early return — no `Either` / ROP chain. */
export function assignThenDescribe(
  ticket: Ticket,
  assigneeId: string,
):
  | { readonly ok: true; readonly summary: string }
  | { readonly ok: false; readonly reason: "not_open" | "already_assigned" } {
  const result = assignTicket(ticket, assigneeId);
  if (!result.ok) return result;
  return { ok: true, summary: describeTicket(result.ticket) };
}

export function describeTicket(ticket: Ticket): string {
  switch (ticket.kind) {
    case "draft":
      return `draft ${ticket.title}`;
    case "open":
      return `open ${ticket.title} -> ${ticket.assigneeId}`;
    case "closed":
      return `closed ${ticket.title}: ${ticket.resolution}`;
    default:
      return assertNever(ticket);
  }
}
