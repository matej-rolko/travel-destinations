import express from "express";
import { getAll, create, update, del, getById, Models } from "~/db";
import { ok } from "$shared/result";
import { authMiddleware } from "~/middlewares/auth";
import mongoose from "mongoose";

const { User, Destination } = Models;

export const router = express.Router().use(authMiddleware);

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

//create a travel in user and a destination for it
router.post("/:id/travels", async (req, res) => {
    const destObj = {
        address: req.body.address,
        country: req.body.country,
        title: req.body.title,
        description: req.body.description,
        image_url: req.body.image_url,
    };
    const newDest = await create(Destination, destObj);

    // Check if the destination creation was successful
    if (!newDest.success) {
        return res.status(422).json(newDest); // Return validation error if destination creation fails
    }

    // console.log("new destination: ", newDest.data.id);
    const travObj: {
        destination_id: mongoose.Schema.Types.ObjectId;
        date_from: Date;
        date_to: Date;
    } = {
        destination_id: newDest.data.id,
        date_from: req.body.date_from,
        date_to: req.body.date_to,
    };
    let newUser = await getById(User, req.params.id);
    if (!newUser) {
        return res.status(404).json({ error: "User not found" });
    }
    newUser.travels = [...newUser.travels, travObj];
    res.status(201).json(ok(await update(User, req.params.id, newUser)));
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
