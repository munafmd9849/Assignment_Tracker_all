const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Munafmd@7407', // put your password here if needed
  database: 'assignment_tracker'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('✅ MySQL connected!');
  }
});

module.exports = db;
