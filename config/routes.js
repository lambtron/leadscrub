'use strict';

(function() {

/**
 * Import helpers ==============================================================
 */
var request = require('request');

// Public functions. ===========================================================
module.exports = function (app, io) {

	// API endpoints =============================================================
	app.post('/api/emails', function (req, res) {
		// Take the array of emails, feed it to Stacklead API.	
		var emails = req.body; // [ 'andyjiang@gmail.com', 'andy@twilio.com' ]

		// Iterate through array and send a request.
		for ( var i = 0; i < emails.length; i++ ) {
			var opts = {
				uri: "https://stacklead.com/api/leads",
			  method: "POST",
			  timeout: 10000,
			  followRedirect: true,
			  maxRedirects: 10,
			  qs: {
			  	api_key: '945a974a20',
					delivery_method: 'webhook',
					email: emails[i],
					callback: 'http://leadscrub.herokuapp.com/api/leads'
			  }
			};

			request(opts, function (err, res, body) {
				if (err)
					res.send(err, 400);

				console.log(body);
			});
		}

		res.send(200);
	});

	app.post('/api/leads', function (req, res) {
		// Receiving webhook from Stacklead.
		console.log(req.body.data);

		io.of('/').emit('leads', req.body.data);
		res.send(req.body.data, 200);
	});

	// Application route =========================================================
	app.get('/*', function (req, res) {
    res.sendfile('index.html', {'root': './public/views/'});
  });
};

}());