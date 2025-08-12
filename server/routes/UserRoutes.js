// server/routes/userRoutes.js
import express from "express";
import UserData from "../models/UserData.js";
import { requireAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();

// 📌 Merr të dhënat e një user-i
router.get("/", requireAuth(), async (req, res) => {
  try {
    const user = await UserData.findOne({ clerkId: req.auth.userId });
    res.json(user || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Ruaj ose përditëso të dhëna
router.post("/", requireAuth(), async (req, res) => {
  try {
    const { gender, sleepQuality, wellnessScore } = req.body;
    const user = await UserData.findOneAndUpdate(
      { clerkId: req.auth.userId },
      { gender, sleepQuality, wellnessScore },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;