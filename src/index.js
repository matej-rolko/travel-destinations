import express from "express";
import cors from "cors";
import { destinationsRouter } from "./destinationsRouter.js";

const PORT = 3003;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/destinations", destinationsRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
