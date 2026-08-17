import type { Ticket, TicketId } from "./ticket.js";

/**
 * Inner layer: Ticket only. Parse once — this function does not accept
 * `ParsedInput` or `unknown`, and does not re-check id/title/body.
 */
export function publish(ticket: Ticket): { readonly publishedId: TicketId } {
  return { publishedId: ticket.id };
}
