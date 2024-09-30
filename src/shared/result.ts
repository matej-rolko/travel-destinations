export type Ok<T = void> = T extends never
    ? never
    : T extends void
      ? { success: true }
      : { success: true; data: T };

export type Err<T = void> = T extends never
    ? never
    : T extends void
      ? { success: false }
      : { success: false; error: T };

/**
 * Discriminated union representing result of an operation
 *
 * can be either `{success: true, data: O}` or `{success: false, error: E}`
 *
 * providing `void` in one of positions make the payload (`data` or `error`) removed from that variant
 *
 * similarly, providing `never` makes that variant removed entirely
 */
export type Result<O = void, E = void> = Ok<O> | Err<E>;

type okOverload = {
    <T>(ok: T): Ok<T>;
    (ok?: undefined): Ok;
};

type errOverload = {
    <T>(err: T): Err<T>;
    (err?: undefined): Err;
};

// res as sep val due to TS being weird.

export const ok: okOverload = <T>(ok?: T) => {
    if (ok === undefined) return { success: true } satisfies Ok;
    const res = {
        success: true,
        data: ok,
    } satisfies { success: true; data: T };
    return res;
};

export const err: errOverload = <T>(err?: T) => {
    if (err === undefined) return { success: false } satisfies Err;
    console.log(err);
    const res = {
        success: false,
        error: err,
    } satisfies { success: false; error: T };
    return res;
};
