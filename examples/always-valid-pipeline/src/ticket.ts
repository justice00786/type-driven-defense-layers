import type { ParsedInput } from "./boundary.js";

/** Nominal ticket identity. Minted only after boundary parse. */
declare const TicketIdBrand: unique symbol;
export type TicketId = string & { readonly [TicketIdBrand]: void };

declare const TicketNominal: unique symbol;

/**
 * Always-Valid domain ticket. Distinct from ParsedInput:
 * the phantom field is added only by `toTicket`.
 */
export type Ticket = {
  readonly [TicketNominal]: void;
  readonly id: TicketId;
  readonly title: string;
  readonly body: string;
};

/**
 * Factory: boundary type → Always-Valid Ticket.
 * Brand is a post-normalization refinement. This function does not re-parse.
 * `as TicketId` / `as Ticket` here is the minting point, not an inner-layer escape.
 */
export function toTicket(parsed: ParsedInput): Ticket {
  return {
    id: parsed.id as TicketId,
    title: parsed.title,
    body: parsed.body,
  } as Ticket;
}

/**
 * Nominal stamp only. Does not validate format or uniqueness.
 * Using this as a substitute for `safeParseTicketInput` compiles and is wrong.
 */
export function brandTicketId(raw: string): TicketId {
  return raw as TicketId;
}
