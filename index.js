const express = require('express');
const multer = require('multer');
const app = express();
const path = require('path');
const fs = require('fs');
const port = 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use(express.urlencoded({ extended: true })); // For URL-encoded data

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '/uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Submit JSON Data</title>
    </head>
    <body>
      <form action="/api/submit" method="POST">
        <textarea name="jsonData" rows="10" cols="50"></textarea>
        <button type="submit">Submit JSON</button>
      </form>
    </body>
    </html>
  `);
});

app.post('/api/submit', (req, res) => {
  const jsonData = req.body.jsonData;
  try {
    const parsedData = JSON.parse(jsonData);
    const filePath = path.join(__dirname, 'uploads', `data-${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2)); // Save JSON data to file
    const fileUrl = `https://${req.headers.host}/uploads/${path.basename(filePath)}`;
    res.send(`JSON data submitted successfully. View at <a href="${fileUrl}">${fileUrl}</a>`);
  } catch (error) {
    res.status(400).send("Failed to parse JSON data.");
  }
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

app.listen(() => {
  console.log(`Server running on http://localhost:${port}`);
});
