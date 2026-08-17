/**
 * After an event id is accepted (dedup insert), the handler must not throw —
 * including `assertNever`. Exhaustiveness is compile-time (`satisfies never`).
 *
 * Unknown actions are a soft-fail: no side effect, no throw.
 */
export type InboxAction =
  | { readonly type: "assign"; readonly assigneeId: string }
  | { readonly type: "close"; readonly resolution: string };

export type InboxEvent = {
  readonly id: string;
  readonly action: InboxAction;
};

export type InboxStore = {
  readonly accepted: Set<string>;
  readonly sideEffects: string[];
};

export type HandleResult =
  | { readonly status: "accepted" }
  | { readonly status: "duplicate" }
  | { readonly status: "ignored" };

export function createInboxStore(): InboxStore {
  return { accepted: new Set(), sideEffects: [] };
}

function acceptEvent(id: string, store: InboxStore): "inserted" | "duplicate" {
  if (store.accepted.has(id)) return "duplicate";
  store.accepted.add(id);
  return "inserted";
}

function applyAction(action: InboxAction, store: InboxStore): void {
  switch (action.type) {
    case "assign":
      store.sideEffects.push(`assign:${action.assigneeId}`);
      return;
    case "close":
      store.sideEffects.push(`close:${action.resolution}`);
      return;
    default: {
      action satisfies never;
      return;
    }
  }
}

export function handleInboxEvent(event: InboxEvent, store: InboxStore): HandleResult {
  if (acceptEvent(event.id, store) === "duplicate") {
    return { status: "duplicate" };
  }
  applyAction(event.action, store);
  return { status: "accepted" };
}

/** Wire-shaped action whose `type` is not yet a closed union. */
export function handleUnknownAction(
  event: { readonly id: string; readonly action: { readonly type: string } },
  store: InboxStore,
): HandleResult {
  if (acceptEvent(event.id, store) === "duplicate") {
    return { status: "duplicate" };
  }
  if (event.action.type === "assign" && "assigneeId" in event.action) {
    const assigneeId = event.action.assigneeId;
    if (typeof assigneeId === "string") {
      applyAction({ type: "assign", assigneeId }, store);
      return { status: "accepted" };
    }
  }
  if (event.action.type === "close" && "resolution" in event.action) {
    const resolution = event.action.resolution;
    if (typeof resolution === "string") {
      applyAction({ type: "close", resolution }, store);
      return { status: "accepted" };
    }
  }
  return { status: "ignored" };
}
