import express from "express";
import { CollectionsEnum, getAll, getById } from "./dbOperations.js";

export const destinationsRouter = express.Router();

// get all
destinationsRouter.get('/', async (req, res) => {
    try {
        const result = await getAll(CollectionsEnum.Destinations);
        res.send(result);
    } catch (error) {
        handleError(res, error);
    }
})
  
// get by id
destinationsRouter.get('/:id', async (req, res) => {
    try {
        const result = await getById(CollectionsEnum.Destinations, req.params.id);
        res.send(result);
    } catch (error) {
        handleError(res, error);
    }
})

//create  
destinationsRouter.post('/', (req, res) => {
      console.log("params", req.params);
      
      res.send(req.body)
})

//update
destinationsRouter.put('/:id', (req, res) => {
    console.log("params", req.params);
    res.send(req.params)
})

//delete
destinationsRouter.delete('/:id', (req, res) => {
    console.log("params", req.params);
    
    res.send('Hello World! This is so much better now!')
})

function handleError(res, error) {
    if(error.name === "BSONError") {
        res.status(400).json({message: "Wrong id length! Use 24 character hex string format."});
    } else {
        res.status(500).json({message: "An error occurred!"});
    }
}