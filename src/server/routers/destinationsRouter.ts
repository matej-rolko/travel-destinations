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
    const result = await create(Destination, req.body);
    res.status(result.success ? 201 : 422).json(result);
});

//update
router.put("/:id", async (req, res) => {
    const result = await update(Destination, req.params.id, req.body);
    res.status(result.success ? 201 : 422).json(result);
});

//delete
router.delete("/:id", async (req, res) => {
    res.status(200).json(ok(await del(Destination, req.params.id)));
});
