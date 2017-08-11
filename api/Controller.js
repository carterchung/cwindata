var express = require('express');
var router = express.Router();
var request = require('request');

// var bodyParser = require('body-parser');
// router.use(bodyParser.urlencoded({ extended: true }));

var data = require('../src/data.json');

router.get('/v1/data.json', function (req, res) {
	getKoboData();
    res.status(200).send(data);
});


const getKoboData = () => {
	var options = {
	 	url: 'https://kc.kobotoolbox.org/api/v1/data/54471',
	 	headers: {
			'Authorization': 'Token ' + process.env.KOBO_TOKEN
		}
	};
	request(options, (error, response, body) => {
		console.log(body);
	});
};

module.exports = router;