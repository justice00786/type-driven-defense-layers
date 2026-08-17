import { viewLabel } from "../src/viewState.js";
import { assignTicket } from "../src/assign.js";
import type { Ticket } from "../src/ticket.js";

export function draftHasNoAssignee(ticket: Ticket): string {
  if (ticket.kind === "draft") {
    // @ts-expect-error draft has no assigneeId — payload differs by stage
    return ticket.assigneeId;
  }
  if (ticket.kind === "open") return ticket.assigneeId;
  return ticket.resolution;
}

export function bagIsNotViewState(): string {
  const bag = { loading: true, data: "x", error: new Error("e") };
  // @ts-expect-error optional bag is not a kind-tagged view state
  return viewLabel(bag, (data) => data);
}

export function commandResultIsNotKindTagged(): void {
  const result = assignTicket(
    { kind: "draft", id: "tkt_1", title: "jam", body: "floor 3" },
    "alice",
  );
  function needsDraft(ticket: { kind: "draft" }): void {
    void ticket;
  }
  // @ts-expect-error { ok } operation result is not a { kind } ticket
  needsDraft(result);
}
