import express from "express";
import { getAll, create, update, del, getById, Models } from "~/db";
import { ok } from "$shared/result";

const { User } = Models;

export const router = express.Router();

// get all
router.get("/", async (req, res) => {
    res.status(200).json(ok(await getAll(User, req.query)));
});

// get by id
router.get("/:id", async (req, res) => {
    res.status(200).json(ok(await getById(User, req.params.id)));
});

//create
router.post("/", async (req, res) => {
    res.status(201).json(ok(await create(User, req.body)));
});

//update
router.put("/:id", async (req, res) => {
    const result = await update(User, req.params.id, req.body);
    res.status(result.success ? 201 : 422).json(result);
});

//delete
router.delete("/:id", async (req, res) => {
    res.status(200).json(ok(await del(User, req.params.id)));
});
