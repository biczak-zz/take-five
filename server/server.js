const { resolve, join } = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(resolve(join(__dirname, '../public'))));

app.use('/', (req, res) => {
  res.send('index.html');
});

app.listen(port, () => {
  console.log(`Lottery Number Generator is Live on Port: ${port}`);
});
