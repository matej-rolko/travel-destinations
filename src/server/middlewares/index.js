export * from "./errorHandler.js";

export const logMiddleware = (req, _res, next) => {
    console.log(req);
    next();
};

export const unknownRouteMiddleware = (_, res) => res.sendStatus(404);
