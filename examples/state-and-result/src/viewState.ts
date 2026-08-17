import { assertNever } from "./assertNever.js";

/**
 * Illegal state bag `{ loading?; data?; error? }` allows contradictory
 * combinations. Use a `{ kind }` union instead.
 */
export type TicketViewState<T> =
  | { readonly kind: "loading" }
  | { readonly kind: "ready"; readonly data: T }
  | { readonly kind: "error"; readonly error: Error };

export function viewLabel<T>(state: TicketViewState<T>, show: (data: T) => string): string {
  switch (state.kind) {
    case "loading":
      return "loading";
    case "ready":
      return show(state.data);
    case "error":
      return "error";
    default:
      return assertNever(state);
  }
}
