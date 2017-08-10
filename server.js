const express = require('express');
const path = require('path');
const app = express();

require('dotenv').config();

var request = require('request');
 
var options = {
  url: 'https://kc.kobotoolbox.org/api/v1/data/54471',
  headers: {
    'Authorization': 'Token ' + process.env.KOBO_TOKEN
  }
};

function callback(error, response, body) {
  console.log(body);
}

app.get('/', function (req, res) {

	request(options, callback);
  // res.send('Hello World!')
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static('public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});