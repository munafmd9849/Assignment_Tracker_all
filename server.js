const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve frontend files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));



// Connect using environment variables from Render
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432 // Railway often uses 3306
});
const PORT = process.env.PORT || 5432;

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connected to MySQL (Railway)');
  }
});

// ✅ Register user by email
app.post('/api/user', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const query = `INSERT IGNORE INTO users (email) VALUES (?)`;
  db.query(query, [email], (err) => {
    if (err) {
      console.error('❌ Error inserting user:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log(`✅ User registered or already exists: ${email}`);
    res.json({ success: true });
  });
});

// ✅ Get user progress
app.get('/api/progress', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const query = `SELECT question_id, solved, doubt, reattempt FROM progress WHERE email = ?`;
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('❌ Error fetching progress:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// ✅ Update or insert user progress
app.post('/api/progress', (req, res) => {
  const { email, question_id, solved, doubt, reattempt } = req.body;
  if (!email || !question_id) return res.status(400).json({ error: 'Missing fields' });

  const query = `
    INSERT INTO progress (email, question_id, solved, doubt, reattempt)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      solved = VALUES(solved),
      doubt = VALUES(doubt),
      reattempt = VALUES(reattempt)
  `;

  db.query(query, [email, question_id, solved || 0, doubt || 0, reattempt || 0], (err) => {
    if (err) {
      console.error('❌ Error saving progress:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log(`✅ Progress saved for ${email} - Q${question_id}`);
    res.json({ success: true });
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});