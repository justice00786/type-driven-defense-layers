import { describe, expect, it } from "vitest";
import {
  createInboxStore,
  handleInboxEvent,
  handleUnknownAction,
} from "../src/inbox.js";
import { newFreshToken, rememberReuse, reuseKeyFromFingerprint } from "../src/reuseKey.js";
import { daysBetween, later, parseCalendarDate, parseInstant } from "../src/time.js";

describe("time", () => {
  it("parses a civil date and rejects a non-day", () => {
    const ok = parseCalendarDate("2026-08-17");
    expect(ok.ok).toBe(true);
    expect(parseCalendarDate("2026-02-30").ok).toBe(false);
    expect(parseCalendarDate("2026-08-17T00:00:00Z").ok).toBe(false);
  });

  it("parses an instant and computes later", () => {
    const a = parseInstant("2026-08-17T01:00:00Z");
    const b = parseInstant("2026-08-17T03:00:00.000Z");
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    expect(later(a.value, b.value)).toBe("2026-08-17T03:00:00.000Z");
  });

  it("counts whole days between calendar dates", () => {
    const from = parseCalendarDate("2026-08-17");
    const to = parseCalendarDate("2026-08-20");
    expect(from.ok && to.ok).toBe(true);
    if (!from.ok || !to.ok) return;
    expect(daysBetween(from.value, to.value)).toBe(3);
  });
});

describe("reuse key", () => {
  it("treats the same fingerprint as a duplicate at the store", () => {
    const key = reuseKeyFromFingerprint(["ticket", "tkt_abcdef12", "assign"]);
    const store = new Set<string>();
    expect(rememberReuse(key, store)).toBe("inserted");
    expect(rememberReuse(key, store)).toBe("duplicate");
  });

  it("issues a new unbranded token per attempt", () => {
    expect(newFreshToken()).not.toBe(newFreshToken());
  });
});

describe("inbox at-least-once", () => {
  it("records a side effect once", () => {
    const store = createInboxStore();
    const event = {
      id: "evt_1",
      action: { type: "assign" as const, assigneeId: "alice" },
    };
    expect(handleInboxEvent(event, store)).toEqual({ status: "accepted" });
    expect(handleInboxEvent(event, store)).toEqual({ status: "duplicate" });
    expect(store.sideEffects).toEqual(["assign:alice"]);
  });

  it("ignores unknown actions without throwing or applying effects", () => {
    const store = createInboxStore();
    expect(
      handleUnknownAction({ id: "evt_2", action: { type: "explode" } }, store),
    ).toEqual({ status: "ignored" });
    expect(store.sideEffects).toEqual([]);
    expect(
      handleUnknownAction({ id: "evt_2", action: { type: "explode" } }, store),
    ).toEqual({ status: "duplicate" });
  });
});
