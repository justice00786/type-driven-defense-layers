/**
 * Two different `{ ok }` envelopes. Do not unify them.
 *
 * `FormRedisplay` is a UI redisplay envelope (optional message / field errors).
 * `CommandResult` is an operation result with a closed `reason` union.
 */
export type FormRedisplay = {
  readonly ok: boolean;
  readonly message?: string;
  readonly fieldErrors?: Readonly<Record<string, string>>;
};

export type CommandResult =
  | { readonly ok: true; readonly ticketId: string }
  | { readonly ok: false; readonly reason: "not_open" | "already_assigned" };

export function commandToRedisplay(result: CommandResult): FormRedisplay {
  if (result.ok) {
    return { ok: true, message: "assigned" };
  }
  return { ok: false, message: result.reason };
}
