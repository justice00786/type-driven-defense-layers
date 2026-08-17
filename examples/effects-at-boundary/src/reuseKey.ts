/**
 * Nominal stamp for a *reused* idempotency key.
 * Runtime truth is the unique-key store, not this brand.
 *
 * One-shot attempt tokens stay unbranded (`FreshToken`).
 */
declare const ReuseKeyBrand: unique symbol;
export type ReuseKey = string & { readonly [ReuseKeyBrand]: void };

/** New token per attempt. Not branded — branding would be theater. */
export type FreshToken = string;

/** Fingerprint → reuse key. Does not check uniqueness or prevent double effects. */
export function reuseKeyFromFingerprint(parts: readonly string[]): ReuseKey {
  return parts.join(":") as ReuseKey;
}

export function newFreshToken(): FreshToken {
  return crypto.randomUUID();
}

export type RememberResult = "inserted" | "duplicate";

/** Simulated UNIQUE constraint. This is the runtime guard. */
export function rememberReuse(key: ReuseKey, store: Set<string>): RememberResult {
  if (store.has(key)) return "duplicate";
  store.add(key);
  return "inserted";
}
