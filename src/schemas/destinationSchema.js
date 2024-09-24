import mongoose from "mongoose";

const destinationsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  }
});

export const Destination = mongoose.model("Destination", destinationsSchema);