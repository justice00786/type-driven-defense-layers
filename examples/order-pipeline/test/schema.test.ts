import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("boundary schema artifact", () => {
  it("loads schemas/order-boundary.schema.json", () => {
    const raw = readFileSync(
      join(root, "schemas/order-boundary.schema.json"),
      "utf8",
    );
    const schema = JSON.parse(raw) as {
      type: string;
      required: string[];
      properties: Record<string, unknown>;
    };
    expect(schema.type).toBe("object");
    expect(schema.required).toEqual(["id", "amount", "status"]);
    expect(schema.properties).toHaveProperty("id");
  });
});
