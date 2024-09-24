import express from "express";
import cors from "cors";
import { destinationsRouter } from "./destinationsRouter.js";

const app = express()
const port = 3003

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

app.use("/destinations", destinationsRouter);

app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})