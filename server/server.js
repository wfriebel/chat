const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(publicPath));

app.get('/about', (req, res) => {
  res.send('GET /');
})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
})
