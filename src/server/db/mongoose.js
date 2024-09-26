import mongoose from "mongoose";
import { env } from "../env.js";

const { MONGO_URL } = env;

export const connect = async () => {
    await mongoose.connect(MONGO_URL);
    console.log("test");
    // HACK: ugly hack to make loading the schemas after connection,
    // refactor later to a function returning schemas?
    import("./schemas/destinationSchema.js");
};
export const disconnect = async () => await mongoose.disconnect();

export const connectionState = () =>
    mongoose.STATES[mongoose.connection.readyState];
