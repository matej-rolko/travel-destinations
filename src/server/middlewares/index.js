export { errorHandler } from "./errorHandler.js";

export const logMiddleware = (req, _res, next) => {
    console.log(req);
    next();
};
