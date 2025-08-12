// server/models/UserData.js
import mongoose from "mongoose";

const UserDataSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // ID nga Clerk
  gender: String,
  sleepQuality: String,
  wellnessScore: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("UserData", UserDataSchema);