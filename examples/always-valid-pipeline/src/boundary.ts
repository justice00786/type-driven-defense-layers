/** Layer 2: boundary parse. Result is ParsedInput, not Ticket. */

export type ParseFail = { readonly ok: false; readonly reason: string };
export type ParseOk<T> = { readonly ok: true; readonly value: T };
export type ParseResult<T> = ParseOk<T> | ParseFail;

/**
 * Schema-shaped input after a single boundary parse.
 * Do not treat this as the domain Ticket — factory `toTicket` mints that.
 */
export type ParsedInput = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
};

function fail(reason: string): ParseFail {
  return { ok: false, reason };
}

export function safeParseTicketInput(raw: unknown): ParseResult<ParsedInput> {
  if (typeof raw !== "object" || raw === null) {
    return fail("input must be an object");
  }
  if (!("id" in raw) || !("title" in raw) || !("body" in raw)) {
    return fail("input must have id, title, and body");
  }
  const { id, title, body } = raw;
  if (typeof id !== "string") {
    return fail("id must be a string");
  }
  const trimmedId = id.trim();
  if (!/^tkt_[a-z0-9]{8,32}$/.test(trimmedId)) {
    return fail("id must match tkt_[a-z0-9]{8,32}");
  }
  if (typeof title !== "string") {
    return fail("title must be a string");
  }
  const trimmedTitle = title.trim();
  if (trimmedTitle.length === 0 || trimmedTitle.length > 120) {
    return fail("title must be 1..120 characters");
  }
  if (typeof body !== "string") {
    return fail("body must be a string");
  }
  const trimmedBody = body.trim();
  if (trimmedBody.length === 0) {
    return fail("body must be non-empty");
  }
  return {
    ok: true,
    value: { id: trimmedId, title: trimmedTitle, body: trimmedBody },
  };
}
