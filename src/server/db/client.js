import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "../env.js";

const { MONGO_URL } = env;

const client = new MongoClient(MONGO_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

export const connect = async () => await client.connect();
export const disconnect = async () => await client.close();

export const db = client.db("TravelDestinations");
