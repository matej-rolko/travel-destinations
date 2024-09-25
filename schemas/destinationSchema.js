import mongoose from "mongoose";
import env from 'dotenv';
env.config();

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error(err));


const destinationsSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  image_url: {
    type: String,
    required: false
  }
});

export const Destination = mongoose.model("Destination", destinationsSchema);