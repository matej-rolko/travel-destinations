/** @typedef {import('./result.d.ts').okOverload} okOverload */
/** @typedef {import('./result.d.ts').errOverload} errOverload */

/**
 * @type okOverload
 */
export const ok = (ok) => {
    if (ok === undefined) return { success: true };
    return {
        success: true,
        data: ok,
    };
};
/**
 * @type errOverload
 */
export const err = (err) => {
    if (err === undefined) return { success: false };
    console.log(err);
    return {
        success: false,
        error: err,
    };
};
