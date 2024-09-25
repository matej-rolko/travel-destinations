import express from "express";
import cors from "cors";
import * as db from "./db/mongoose.js";
import { env } from "./env.js";
import { destinationsRouter } from "./routers";
import { errorHandler, logMiddleware } from "./middlewares";

const { PORT } = env;

const runServer = () => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    // TODO: make this only for dev
    app.use(logMiddleware);

    // TODO: add healthcheck route

    // TODO: move it under /api/v1/
    app.use("/destinations", destinationsRouter);

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
};

(async () => {
    try {
        await db.connect();
        runServer();
    } finally {
        await db.disconnect();
    }
})();
