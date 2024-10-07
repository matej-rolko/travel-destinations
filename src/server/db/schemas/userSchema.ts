import mongoose from "mongoose";

const travelsSchema = new mongoose.Schema({
    destination_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: true
    },
    date_from: {
        type: Date,
        required: true
    },
    date_to: {
        type: Date,
        required: true
    }
});

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    travels: {
        type: [travelsSchema],
        default: []
    }
});

export const User = mongoose.model("User", usersSchema);