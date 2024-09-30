import mongoose from "mongoose";
import { env } from "../env";

const { MONGO_URL } = env;

const mongooseLog = (state) => console.log(`mongoose event: ${state}`);

const conn = mongoose.connection;
conn.on("connected", () => mongooseLog("connected"));
conn.on("open", () => mongooseLog("open"));
conn.on("disconnected", () => mongooseLog("disconnected"));
conn.on("reconnected", () => mongooseLog("reconnected"));
conn.on("disconnecting", () => mongooseLog("disconnecting"));
conn.on("close", () => mongooseLog("close"));

export const connect = async () => {
    await mongoose.connect(MONGO_URL);
    // HACK: ugly hack to make loading the schemas after connection,
    // refactor later to a function returning schemas?
    import("./schemas/destinationSchema");
};
export const disconnect = async () => await mongoose.disconnect();

export const connectionState = () =>
    mongoose.STATES[mongoose.connection.readyState];
