import express from "express";
import { create, getAll, getById, Models, update, del } from "~/db";
import { ok } from "$shared/result";

const { Destination } = Models;

export const router = express.Router();

// get all
router.get("/", async (req, res) => {
    res.status(200).json(ok(await getAll(Destination, req.query)));
});

// get by id
router.get("/:id", async (req, res) => {
    res.status(200).json(ok(await getById(Destination, req.params.id)));
});

//create
router.post("/", async (req, res) => {
    res.status(201).json(ok(await create(Destination, req.body)));
});

//update
router.put("/:id", async (req, res) => {
    res.status(200).json(ok(await update(Destination, req.params.id, req.body)))
});

//delete
router.delete("/:id", async (req, res) => {
    res.status(200).json(ok(await del(Destination, req.params.id)))
});
