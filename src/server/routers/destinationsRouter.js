import express from "express";
import { Collections, getAll, getById } from "../db";

export const router = express.Router();

// get all
router.get("/", async (req, res) => {
    try {
        const result = await getAll(Collections.Destinations);
        res.send(result);
    } catch (error) {
        handleError(res, error);
    }
});

// get by id
router.get("/:id", async (req, res) => {
    try {
        const result = await getById(Collections.Destinations, req.params.id);
        res.send(result);
    } catch (error) {
        handleError(res, error);
    }
});

//create
router.post("/", (req, res) => {
    console.log("params", req.params);

    res.send(req.body);
});

//update
router.put("/:id", (req, res) => {
    console.log("params", req.params);
    res.send(req.params);
});

//delete
router.delete("/:id", (req, res) => {
    console.log("params", req.params);

    res.send("Hello World! This is so much better now!");
});

function handleError(res, error) {
    if (error.name === "BSONError") {
        res.status(400).json({
            message: "Wrong id length! Use 24 character hex string format.",
        });
    } else {
        res.status(500).json({ message: "An error occurred!" });
    }
}
