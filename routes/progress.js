// routes/progress.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Update or Insert progress
router.post('/update', async (req, res) => {
  const { email, question_id, solved, doubt, reattempt } = req.body;

  // Check if all fields are provided
  if (!email || !question_id || solved === undefined || doubt === undefined || reattempt === undefined) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const [existing] = await pool.promise().query(
      'SELECT * FROM progress WHERE email = ? AND question_id = ?',
      [email, question_id]
    );

    if (existing.length > 0) {
      await pool.promise().query(
        'UPDATE progress SET solved = ?, doubt = ?, reattempt = ? WHERE email = ? AND question_id = ?',
        [solved, doubt, reattempt, email, question_id]
      );
    } else {
      await pool.promise().query(
        'INSERT INTO progress (email, question_id, solved, doubt, reattempt) VALUES (?, ?, ?, ?, ?)',
        [email, question_id, solved, doubt, reattempt]
      );
    }

    res.json({ message: 'Progress updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
