import { err } from "$shared/result";
import { type Handler } from "express";
import { AuthErrors, extractToken, type User, verifyToken } from "~/lib/auth";

export type AuthCtx = {
    user: User;
};
export type Context = {
    auth: AuthCtx;
};

type RequestWithAuthCtx = Request & {
    context: Context;
};

export const authMiddleware: Handler = async (req, res, next) => {
    const token = await extractToken(req.headers);
    if (token == null) {
        console.warn("Authentication failed: no token");
        res.status(401).json(err(AuthErrors.wrongToken));
        return;
    }
    const user = await verifyToken(token);
    if (!user.success) {
        console.warn(`Authentication failed: ${user.error}`);
        res.status(403).json(err(user.error));
        return;
    }
    (req as unknown as RequestWithAuthCtx).context = {
        auth: { user: user.data },
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
