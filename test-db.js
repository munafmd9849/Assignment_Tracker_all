// test-db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Munafmd@7407',
  database: 'question_tracker'
});

pool.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('MySQL Error:', err);
  } else {
    console.log('MySQL Connected! Result:', results);
  }
});
