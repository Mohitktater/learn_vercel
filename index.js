const express = require('express');
const app = express();
const port = 3000; 
const fs = require('fs');
const path = require('path');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/search', (req, res) => { 
  const filePath = path.join(__dirname, '/api/search/search.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          res.status(500).json({ error: 'Failed to load data' });
      } else {
          const jsonData = JSON.parse(data);
          res.status(200).json(jsonData);
      }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
