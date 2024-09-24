import { ObjectId } from "mongodb";
import {client} from "./dbConn.js"
export const CollectionsEnum = {
    Destinations: "Destinations",
    Users: "Users"
}

const dbName = "TravelDestinations"

export async function getAll(collection) {
    try {
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      const result = await client.db(dbName).collection(collection).find().toArray();
      console.log("result object", result);
      
      return result;
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }  
  }

  export async function getById(collection, id) {
    try {
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      const result = await client.db(dbName).collection(collection).findOne({_id: new ObjectId(id)});
      console.log("result object", result);
      
      return result;
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }  
  }

  export async function create(collection, data) {
    try {
        await client.connect();
        const result = await client.db(dbName).collection(collection).insertOne(data);
    } finally {
        
    }
  }