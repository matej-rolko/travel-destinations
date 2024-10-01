import { Router } from "express";
import { connectionState } from "~/db/mongoose";
import { ok } from "$shared/result";

export { router as destinationsRouter } from "./destinationsRouter";

export const healthcheckRouter = Router()
    .get("/", (_, res) => {
        res.status(200).json(ok("Server is running!"));
    })
    .get("/db", (_, res) => {
        res.status(200).json(ok({ db: connectionState() }));
    });
