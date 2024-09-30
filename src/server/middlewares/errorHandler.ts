import { err } from "../../shared/result";
import { env } from "../env";

const { NODE_ENV } = env;

export const errorHandler = async (error, _req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    const statusCode = error.status || 500;
    const message = error.message || "Internal Server Error";

    console.error(`Error: ${message}, Status: ${statusCode}`);

    res.status(statusCode).json(
        err({
            message: message,
            ...(NODE_ENV === "development" && { stack: error.stack }), // should display stack only if in dev env
        }),
    );
};
