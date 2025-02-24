const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    const filePath = path.join(__dirname, 'search.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to load data' });
        } else {
            const jsonData = JSON.parse(data);
            res.status(200).json(jsonData);
        }
    });
};
