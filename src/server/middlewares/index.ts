import { err } from "../../shared/result";
import type { RequestHandler } from "express";

export * from "./errorHandler";

export const logMiddleware: RequestHandler = (req, _res, next) => {
    // console.log(req);
    next();
};

export const unknownRouteMiddleware = (isjson: boolean): RequestHandler => {
    const msg = "Unknown route!";
    const code = 404;
    return (_, res, _next) => {
        if (isjson) {
            res.status(code).json(err(msg));
        } else {
            res.status(code).send(msg);
        }
    };
};
