/**
 * Unknown widget kinds: warn and return null.
 * Do not throw. Do not treat the unknown kind as a successful render.
 */
export type KnownWidget =
  | { readonly kind: "text"; readonly value: string }
  | { readonly kind: "count"; readonly n: number };

export function renderWidget(
  input: KnownWidget | { readonly kind: string },
): string | null {
  if (input.kind === "text" && "value" in input && typeof input.value === "string") {
    return input.value;
  }
  if (input.kind === "count" && "n" in input && typeof input.n === "number") {
    return String(input.n);
  }
  console.warn("unknown widget kind");
  return null;
}
