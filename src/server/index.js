import express from "express";
import cors from "cors";
import * as db from "./db/mongoose.js";
import { env } from "./env.js";
import { destinationsRouter, healthcheckRouter } from "./routers";
import {
    errorHandler,
    logMiddleware,
    unknownRouteMiddleware,
} from "./middlewares";
import { runServer } from "./utils/server.js";

// TODO:
// introduce ok() and err() functions to have uniform json responses

const { PORT } = env;

const APIRouter = express
    .Router()
    .use("/destinations", destinationsRouter)
    .use("/healthcheck", healthcheckRouter);

const setup = () =>
    express()
        // TODO: make this only for dev
        .use(logMiddleware)
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use(cors())
        .use("/api/v1", APIRouter)
        .use(unknownRouteMiddleware)
        .use(errorHandler);

(async () => {
    try {
        await db.connect();
        await runServer(setup(), PORT);
    } catch (e) {
        console.error(e);
    } finally {
        await db.disconnect();
    }
})();
