// server/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// tiny marker + request log
app.use((req, res, next) => {
  res.setHeader('X-Server', 'msx-api');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// health
app.get('/api/health', (_req, res) => res.json({ ok: true, status: 'UP' }));

// --- Mongoose model ---
const assessmentSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true, unique: true, sparse: true },
    email: String,

    // assessment fields (add more as you need)
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

// --- Routes ---
app.post('/api/assessment/upsert', async (req, res) => {
  try {
    const { userId, email, ...rest } = req.body || {};
    if (!userId || !email) {
      return res.status(400).json({ ok: false, error: 'userId and email are required' });
    }

    const doc = await Assessment.findOneAndUpdate(
      { userId },
      { userId, email, ...rest },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ ok: true, data: doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

app.get('/api/assessment/:userId', async (req, res) => {
  try {
    const doc = await Assessment.findOne({ userId: req.params.userId }).lean();
    res.json({ ok: true, data: doc || null });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

// --- Boot ---
const PORT = Number(process.env.PORT || 5050);
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI in server .env');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 API on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB error:', err);
    process.exit(1);
  });