const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory
app.set('view engine', 'ejs'); // Set EJS as the templating engine

// Database setup
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS emails (email_id INTEGER PRIMARY KEY AUTOINCREMENT, email_name TEXT NOT NULL, email_addr TEXT NOT NULL, email_time DATETIME DEFAULT CURRENT_TIMESTAMP, email_msg TEXT NOT NULL)');
      db.run('CREATE TABLE IF NOT EXISTS events (event_id INTEGER PRIMARY KEY AUTOINCREMENT, event_date TEXT NOT NULL, event_name TEXT NOT NULL, event_location TEXT NOT NULL)');
      db.run('CREATE TABLE IF NOT EXISTS stages (stage_id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INTEGER, stage_type TEXT NOT NULL, stage_description TEXT NOT NULL, FOREIGN KEY (event_id) REFERENCES events (event_id))');
      db.run('CREATE TABLE IF NOT EXISTS lineups (lineup_id INTEGER PRIMARY KEY AUTOINCREMENT, stage_id INTEGER, lineup_participant TEXT NOT NULL, lineup_description TEXT NOT NULL, FOREIGN KEY (stage_id) REFERENCES stages (stage_id))');
    });
  }
});

// Serve the index page from the root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Routes for other pages
app.get('/lineup', (req, res) => {
  res.sendFile(__dirname + '/public/lineup.html');
});

app.get('/stages', (req, res) => {
  res.sendFile(__dirname + '/public/stages.html');
});

app.get('/festival_info', (req, res) => {
  res.sendFile(__dirname + '/public/festival_info.html');
});

app.get('/faq', (req, res) => {
  res.sendFile(__dirname + '/public/faq.html');
});

app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/public/contact.html');
});

// Handle form submissions
app.post('/submit-form', (req, res) => {
  const { name, email, message } = req.body;
  db.run('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', [name, email, message], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    res.redirect('/submit-response.html');
  });
});

// Serve the submission response page
app.get('/submit-response.html', (req, res) => {
  res.sendFile(__dirname + '/public/submit-response.html');
});

// AJAX search endpoint
app.post('/search', (req, res) => {
  const searchTerm = req.body.searchTerm;
  db.all('SELECT * FROM contacts WHERE name LIKE ?', [`%${searchTerm}%`], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
