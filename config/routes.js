'use strict';

(function() {

/**
 * Import helpers ==============================================================
 */
var request = require('request');


// Public functions. ===========================================================
module.exports = function (app) {

	// API endpoints =============================================================
	app.post('/api/emails', function (req, res) {
		// Take the array of emails, feed it to Stacklead API.

		request({
		  uri: "https://stacklead.com/api/",
		  method: "POST",
		  timeout: 10000,
		  followRedirect: true,
		  maxRedirects: 10,
		  qs: {
		  	api_key: '945a974a20',
				delivery_method: 'webhook',
				email: ''	
		  },
		}, function(error, response, body) {
		  console.log(body);
			res.send(data, 200);
		});
	});

	// Application route =========================================================
	app.get('/*', function (req, res) {
    res.sendfile('index.html', {'root': './public/views/'});
  });
};

}());