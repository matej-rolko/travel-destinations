import { err } from "$shared/result";
import { type Handler } from "express";
import {
    AuthErrors,
    extractToken,
    type UserWithToken,
    verifyToken,
} from "~/lib/auth";
import { Models } from "~/db";

export type AuthCtx = UserWithToken;
export type Context = {
    auth: AuthCtx;
};

type RequestWithAuthCtx = Request & {
    context: Context;
};

export const authMiddleware: Handler = async (req, res, next) => {
    const token = extractToken(req.headers);
    if (token == null) {
        console.warn("Authentication failed: no token");
        res.status(401).json(err(AuthErrors.wrongToken));
        return;
    }
    const result = await verifyToken(Models.User, token);
    if (!result.success) {
        console.warn(`Authentication failed: ${result.error}`);
        res.status(403).json(result);
        return;
    }
    (req as unknown as RequestWithAuthCtx).context = {
        auth: result.data,
    };
    next();
};

export const extractAuthCtx = (req: Request): AuthCtx => {
    const ctx = (req as Request & { context?: Context })?.context;
    if (!ctx)
        throw new Error(
            "extractAuthCtx used in route without auth ctx! Use authMiddleware if you want to have auth ctx",
        );
    return ctx.auth;
};
