import express from "express";
import cors from "cors";
import { destinationsRouter } from "./routers";
import * as db from "./db/mongoose.js";
import { env } from "./env.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const { PORT } = env;

const runServer = async () => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    app.use("/destinations", destinationsRouter);

    app.use(errorMiddleware);
    
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
};

(async () => {
    try {
        await db.connect();
        await runServer();
    } finally {
        await db.disconnect();
    }
})();
