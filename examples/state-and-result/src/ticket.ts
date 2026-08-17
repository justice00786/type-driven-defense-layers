/**
 * Layer 1 + Layer 2: `{ kind }` typestate whose payload differs by stage.
 * Phantom brands (`Ticket<S>`) are intentionally not used here.
 */
export type Ticket =
  | {
      readonly kind: "draft";
      readonly id: string;
      readonly title: string;
      readonly body: string;
    }
  | {
      readonly kind: "open";
      readonly id: string;
      readonly title: string;
      readonly assigneeId: string;
    }
  | {
      readonly kind: "closed";
      readonly id: string;
      readonly title: string;
      readonly resolution: string;
    };

export type DraftTicket = Extract<Ticket, { kind: "draft" }>;
export type OpenTicket = Extract<Ticket, { kind: "open" }>;
export type ClosedTicket = Extract<Ticket, { kind: "closed" }>;
