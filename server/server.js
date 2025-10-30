const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); // <-- এটা যোগ করো
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// public/ ফোল্ডার সার্ভ করো
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB কানেকশন
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB কানেক্টেড'))
  .catch(err => console.error('MongoDB এরর:', err));

// স্কিমা
const submissionSchema = new mongoose.Schema({
  input_text: String,
  result: Object,
  created_at: { type: Date, default: Date.now }
});
const Submission = mongoose.model('Submission', submissionSchema);

// হোম রুট
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// API: প্রসেস
app.post('/api/process', async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'টেক্সট দাও!' });
  
  const result = {
    length: text.length,
    words: text.split(/\s+/).filter(w => w).length,
    uppercase: text.toUpperCase(),
    reversed: text.split('').reverse().join('')
  };

  try {
    await new Submission({ input_text: text.trim(), result }).save();
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'সেভ হয়নি' });
  }
});

// API: হিস্ট্রি
app.get('/api/history', async (req, res) => {
  try {
    const history = await Submission.find().sort({ created_at: -1 }).limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'হিস্ট্রি লোড হয়নি' });
  }
});

app.listen(PORT, () => {
  console.log(`সার্ভার চলছে: http://localhost:${PORT}`);
});
