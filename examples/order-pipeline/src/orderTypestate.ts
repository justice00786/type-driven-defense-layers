import {
  type Money,
  type OrderId,
  type ParseError,
  isParseError,
  parseMoney,
  parseOrderId,
} from "./brands.js";

/** Phantom state tags for typestate (Layer 2). */
export type Draft = { readonly tag: "Draft" };
export type Placed = { readonly tag: "Placed" };
export type Paid = { readonly tag: "Paid" };

declare const OrderStateBrand: unique symbol;

export type Order<S> = {
  readonly [OrderStateBrand]: S;
  readonly id: OrderId;
  readonly amount: Money;
};

export type OrderState = Draft | Placed | Paid;

/** Runtime discriminated union for Layer 1 exhaustiveness demos. */
export type OrderView =
  | { readonly status: "Draft"; readonly id: OrderId; readonly amount: Money }
  | { readonly status: "Placed"; readonly id: OrderId; readonly amount: Money }
  | { readonly status: "Paid"; readonly id: OrderId; readonly amount: Money };

export type RawOrderInput = {
  readonly id: unknown;
  readonly amount: unknown;
};

export function createDraft(input: RawOrderInput): Order<Draft> | ParseError {
  const id = parseOrderId(input.id);
  if (isParseError(id)) return id;
  const amount = parseMoney(input.amount);
  if (isParseError(amount)) return amount;
  return { id, amount } as Order<Draft>;
}

export function place(order: Order<Draft>): Order<Placed> {
  return order as unknown as Order<Placed>;
}

export function pay(order: Order<Placed>): Order<Paid> {
  return order as unknown as Order<Paid>;
}

export function toView<S extends OrderState>(
  order: Order<S>,
  status: S["tag"],
): OrderView {
  return { status, id: order.id, amount: order.amount } as OrderView;
}

export function assertNever(x: never): never {
  throw new Error(`unreachable: ${JSON.stringify(x)}`);
}

/** Layer 1: exhaustiveness over OrderView. */
export function describeOrder(view: OrderView): string {
  switch (view.status) {
    case "Draft":
      return `draft ${view.id} (${view.amount})`;
    case "Placed":
      return `placed ${view.id} (${view.amount})`;
    case "Paid":
      return `paid ${view.id} (${view.amount})`;
    default:
      return assertNever(view);
  }
}

/** Boundary DTO shape (Layer 4 schema target). */
export type OrderBoundaryDto = {
  readonly id: string;
  readonly amount: number;
  readonly status: "Draft" | "Placed" | "Paid";
};

export function toBoundaryDto(view: OrderView): OrderBoundaryDto {
  return {
    id: view.id,
    amount: view.amount,
    status: view.status,
  };
}
