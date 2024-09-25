import express from "express";
import { create, getAll, getById } from "../db";
import { Destination } from '../db/schemas/destinationSchema.js';

export const router = express.Router();

// get all
router.get('/', async (req, res, next) => {
    try {
        res.status(200).json(await getAll(Destination, req.query));
    } catch (error) {
        next(error);
    }
})

// get by id
router.get('/:id', async (req, res, next) => {
    try {
        res.status(200).json(await getById(Destination, req.params.id));
    } catch (error) {
        next(error);
    }
})

//create  
router.post('/', async (req, res) => {
    try {
        res.status(201).json(await create(Destination, req.body));
    } catch (error) {
        next(error);
    }
})

//update
router.put('/:id', (req, res) => {
    // console.log("params", req.params);
    // res.send(req.params)
})

//delete
router.delete('/:id', (req, res) => {
    // console.log("params", req.params);
    // res.send('Hello World! This is so much better now!')
})
