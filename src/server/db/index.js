import { ObjectId } from "mongodb";
import { db } from "./client.js";

export const Collections = {
    Destinations: "Destinations",
    Users: "Users",
};

export async function getAll(collection) {
    // Send a ping to confirm a successful connection
    const result = await db.collection(collection).find().toArray();
    console.log("result object", result);

    return result;
}

export async function getById(collection, id) {
    // Send a ping to confirm a successful connection
    const result = await db
        .collection(collection)
        // FIXME: this signature is deprecated
        .findOne({ _id: new ObjectId(id) });
    console.log("result object", result);

    return result;
}

export async function create(collection, data) {
    return await db.collection(collection).insertOne(data);
}
