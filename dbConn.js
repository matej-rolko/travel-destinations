import { MongoClient, ServerApiVersion } from "mongodb";
const uri = "mongodb+srv://matejrolko2:2582o5205M@cluster0.igcrx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export {client};