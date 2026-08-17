/**
 * Default message is a fixed string. Do not put `JSON.stringify(value)`,
 * discriminants, or other payload into the message (PII / internal state).
 *
 * Pure-function exhaustiveness **does throw**. That is allowed here.
 * After an inbox accept (see `effects-at-boundary`), throw is forbidden —
 * including this helper. The two rules are context-specific.
 */
export function assertNever(_value: never): never {
  throw new Error("Unexpected value");
}
