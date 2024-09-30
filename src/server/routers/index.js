import { Router } from "express";
import { connectionState } from "../db/mongoose.js";
import { ok } from "../../shared/result.js";

export { router as destinationsRouter } from "./destinationsRouter.js";

export const healthcheckRouter = Router()
    .get("/", (_, res) => {
        res.status(200).json(ok("Server is running!"));
    })
    .get("/db", (_, res) => {
        res.status(200).json(ok({ db: connectionState() }));
    });
