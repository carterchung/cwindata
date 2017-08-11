const express = require('express');
const path = require('path');
const app = express();

require('dotenv').config();

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

var Controller = require('./api/Controller');
app.use('/api', Controller);

app.use(express.static('public'));

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('CWIN Dashboard listening on port 3000!')
});