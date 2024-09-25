import mongoose from "mongoose";
import { env } from "../env.js";

const { MONGO_URL } = env;

export const connect = async () => await mongoose.connect(MONGO_URL);
export const disconnect = async () => await mongoose.disconnect();
