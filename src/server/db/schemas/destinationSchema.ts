import mongoose from "mongoose";

const destinationsSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    image_url: {
        type: String,
        required: false,
    },
});

export const Destination = mongoose.model("Destination", destinationsSchema);
