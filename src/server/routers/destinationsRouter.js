import express from "express";
import { create, getAll, getById, Models } from "../db";

const { Destination } = Models;

export const router = express.Router();

// get all
router.get("/", async (req, res) => {
    res.status(200).json(await getAll(Destination, req.query));
});

// get by id
router.get("/:id", async (req, res) => {
    res.status(200).json(await getById(Destination, req.params.id));
});

//create
router.post("/", async (req, res) => {
    res.status(201).json(await create(Destination, req.body));
});

//update
router.put("/:id", (req, res) => {
    // console.log("params", req.params);
    // res.send(req.params)
});

//delete
router.delete("/:id", (req, res) => {
    // console.log("params", req.params);
    // res.send('Hello World! This is so much better now!')
});
