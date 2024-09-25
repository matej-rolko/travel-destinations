import express from "express";
import { create, getAll, getById } from "./dbOperations.js";
import { Destination } from './schemas/destinationSchema.js';

export const destinationsRouter = express.Router();

// get all
destinationsRouter.get('/', async (req, res, next) => {
    try {
        res.status(200).json(await getAll(Destination, req.query));
    } catch (error) {
        next(error);
    }
})

// get by id
destinationsRouter.get('/:id', async (req, res, next) => {
    try {
        res.status(200).json(await getById(Destination, req.params.id));
    } catch (error) {
        next(error);
    }
})

//create  
destinationsRouter.post('/', async (req, res) => {
    try {
        res.status(201).json(await create(Destination, req.body));
    } catch (error) {
        next(error);
    }
})

//update
destinationsRouter.put('/:id', (req, res) => {
    // console.log("params", req.params);
    // res.send(req.params)
})

//delete
destinationsRouter.delete('/:id', (req, res) => {
    // console.log("params", req.params);
    // res.send('Hello World! This is so much better now!')
})