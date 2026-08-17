import { describe, expect, it, vi } from "vitest";
import { assignThenDescribe, assignTicket, describeTicket } from "../src/assign.js";
import { commandToRedisplay } from "../src/envelopes.js";
import { renderWidget } from "../src/softFallback.js";
import { viewLabel } from "../src/viewState.js";
import type { Ticket } from "../src/ticket.js";

const draft: Ticket = {
  kind: "draft",
  id: "tkt_abcdef12",
  title: "Printer jam",
  body: "Cannot print on floor 3.",
};

describe("assignTicket { ok }", () => {
  it("opens a draft", () => {
    const result = assignTicket(draft, "alice");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.ticket.kind).toBe("open");
    expect(result.ticket.assigneeId).toBe("alice");
  });

  it("rejects an already open ticket", () => {
    const opened = assignTicket(draft, "alice");
    if (!opened.ok) return;
    const again = assignTicket(opened.ticket, "bob");
    expect(again).toEqual({ ok: false, reason: "already_assigned" });
  });

  it("rejects a closed ticket", () => {
    const closed: Ticket = {
      kind: "closed",
      id: draft.id,
      title: draft.title,
      resolution: "replaced printer",
    };
    expect(assignTicket(closed, "alice")).toEqual({
      ok: false,
      reason: "not_open",
    });
  });

  it("early-returns on failure without an Either chain", () => {
    const closed: Ticket = {
      kind: "closed",
      id: draft.id,
      title: draft.title,
      resolution: "replaced printer",
    };
    expect(assignThenDescribe(closed, "alice")).toEqual({
      ok: false,
      reason: "not_open",
    });
  });
});

describe("exhaustiveness", () => {
  it("describes each kind", () => {
    expect(describeTicket(draft)).toBe("draft Printer jam");
  });
});

describe("view state", () => {
  it("labels a ready state", () => {
    expect(viewLabel({ kind: "ready", data: draft }, (t) => t.title)).toBe(
      "Printer jam",
    );
  });
});

describe("envelopes", () => {
  it("maps a command failure into a redisplay envelope", () => {
    expect(commandToRedisplay({ ok: false, reason: "not_open" })).toEqual({
      ok: false,
      message: "not_open",
    });
  });
});

describe("soft-fallback", () => {
  it("renders known widgets", () => {
    expect(renderWidget({ kind: "text", value: "hi" })).toBe("hi");
    expect(renderWidget({ kind: "count", n: 3 })).toBe("3");
  });

  it("warns and returns null for unknown kinds", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(renderWidget({ kind: "sparkline" })).toBe(null);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
