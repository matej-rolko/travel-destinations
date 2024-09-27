import { err } from "../../shared/result.js";

export * from "./errorHandler.js";

export const logMiddleware = (req, _res, next) => {
    console.log(req);
    next();
};

export const unknownRouteMiddleware = (isjson) => {
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
