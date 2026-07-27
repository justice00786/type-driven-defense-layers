/**
 * Minimal interpreter for `schemas/order-boundary.schema.json`.
 * Keeps the JSON Schema file as the single source of truth without adding a
 * schema-validator dependency (demo stays on TypeScript + vitest + fast-check).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type OrderBoundarySchema = {
  readonly type: "object";
  readonly additionalProperties: boolean;
  readonly required: readonly string[];
  readonly properties: {
    readonly id: { readonly type: "string"; readonly pattern: string };
    readonly amount: { readonly type: "integer"; readonly minimum: number };
    readonly status: { readonly type: "string"; readonly enum: readonly string[] };
  };
};

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export function loadOrderBoundarySchema(): OrderBoundarySchema {
  const raw = readFileSync(
    join(root, "schemas/order-boundary.schema.json"),
    "utf8",
  );
  return JSON.parse(raw) as OrderBoundarySchema;
}

export function matchesOrderBoundarySchema(
  schema: OrderBoundarySchema,
  value: unknown,
): boolean {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  const keys = Object.keys(v);

  if (schema.additionalProperties === false) {
    const allowed = new Set(Object.keys(schema.properties));
    if (keys.some((k) => !allowed.has(k))) return false;
  }

  for (const key of schema.required) {
    if (!(key in v)) return false;
  }

  const id = v.id;
  if (typeof id !== "string") return false;
  if (!new RegExp(schema.properties.id.pattern).test(id)) return false;

  const amount = v.amount;
  if (typeof amount !== "number" || !Number.isInteger(amount)) return false;
  if (amount < schema.properties.amount.minimum) return false;

  const status = v.status;
  if (typeof status !== "string") return false;
  if (!schema.properties.status.enum.includes(status)) return false;

  return true;
}
