import { Router } from "express";
import { connectionState } from "../db/mongoose.js";

export { router as destinationsRouter } from "./destinationsRouter.js";

export const healthcheckRouter = Router()
    .get("/", (_, res) => {
        res.status(200).json("Server is running!");
    })
    .get("/db", (_, res) => {
        res.status(200).json({ db: connectionState() });
    });
