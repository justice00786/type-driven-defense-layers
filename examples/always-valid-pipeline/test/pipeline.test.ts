import { describe, expect, it } from "vitest";
import { safeParseTicketInput } from "../src/boundary.js";
import { publish } from "../src/inner.js";
import { toTicket } from "../src/ticket.js";

const validRaw = {
  id: "tkt_abcdef12",
  title: " Printer jam ",
  body: " Cannot print on floor 3. ",
};

describe("boundary parse", () => {
  it("rejects non-objects", () => {
    const result = safeParseTicketInput("nope");
    expect(result.ok).toBe(false);
  });

  it("rejects malformed ids", () => {
    const result = safeParseTicketInput({
      ...validRaw,
      id: "TICKET-1",
    });
    expect(result.ok).toBe(false);
  });

  it("rejects empty titles", () => {
    const result = safeParseTicketInput({ ...validRaw, title: "   " });
    expect(result.ok).toBe(false);
  });

  it("accepts and normalizes valid input", () => {
    const result = safeParseTicketInput(validRaw);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual({
      id: "tkt_abcdef12",
      title: "Printer jam",
      body: "Cannot print on floor 3.",
    });
  });
});

describe("factory then inner", () => {
  it("publishes an Always-Valid ticket without re-parsing", () => {
    const parsed = safeParseTicketInput(validRaw);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const ticket = toTicket(parsed.value);
    expect(publish(ticket).publishedId).toBe("tkt_abcdef12");
  });
});
