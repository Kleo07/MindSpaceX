// server/routes/assessment.js
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// --- Model (reuse existing or keep in one place) ---
const assessmentSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true },
    email:  { type: String, index: true },
    goal: String,
    gender: String,
    age: Number,
    weight: Number,
    weightUnit: String,
    mood: String,
    moodEmoji: String,
    moodIndex: Number,
    helpBefore: String,
    distress: String,
    sleepQuality: String,
    medicationFrequency: String,
    otherSymptoms: [String],
    supportLevel: Number,
    expressionText: String,
  },
  { timestamps: true }
);

const Assessment =
  mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema);

// --- Upsert by either email or userId (whichever you have) ---
router.post('/upsert', async (req, res) => {
  try {
    const { userId, email, ...data } = req.body || {};
    if (!userId && !email) {
      return res.status(400).json({ ok: false, error: 'userId or email required' });
    }

    const query = userId ? { userId } : { email };
    const doc = await Assessment.findOneAndUpdate(
      query,
      { userId, email, ...data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ ok: true, data: doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

// --- Read by userId ---
router.get('/user/:userId', async (req, res) => {
  try {
    const doc = await Assessment.findOne({ userId: req.params.userId }).lean();
    res.json({ ok: true, data: doc || null });
  } catch {
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

// --- Read by email ---
router.get('/email/:email', async (req, res) => {
  try {
    const doc = await Assessment.findOne({ email: req.params.email }).lean();
    res.json({ ok: true, data: doc || null });
  } catch {
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

export default router;