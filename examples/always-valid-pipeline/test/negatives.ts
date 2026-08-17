/**
 * Compile-time negatives for Parse once.
 * Included in `tsc --noEmit`. If a line stops erroring, typecheck fails.
 */
import { publish } from "../src/inner.js";
import type { ParsedInput } from "../src/boundary.js";

export function cannotPublishBoundaryType(parsed: ParsedInput): void {
  // @ts-expect-error ParsedInput is not Ticket — inner API rejects the boundary type
  publish(parsed);
}

export function cannotPublishUnknown(raw: unknown): void {
  // @ts-expect-error unknown is not Ticket — parse must happen at the boundary
  publish(raw);
}
