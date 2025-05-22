const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// MySQL connection configuration
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yugendb'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as ID', connection.threadId);
});

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for Live Server origin
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Example API route
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    res.json(results);
  });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { full_name, phone, email, message } = req.body;
  const query = 'INSERT INTO contacts (full_name, phone, email, message) VALUES (?, ?, ?, ?)';
  connection.query(query, [full_name, phone, email, message], (err, results) => {
    if (err) {
      console.error('Error saving contact:', err.stack);
      res.status(500).json({ error: 'Failed to save contact' });
      return;
    }
    res.json({ message: 'Contact saved successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});