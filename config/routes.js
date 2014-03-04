'use strict';

(function() {

/**
 * Import helpers ==============================================================
 */
var request = require('request')
	, HashIds = require('hashids');

// Initialize hashing variables.
var counter = Math.floor(Math.random() * 1000)
	, salt = Math.random().toString(36).substring(10)
	, hashIds = new HashIds(salt, 12);

// Public functions. ===========================================================
module.exports = function (app, io) {

	// API endpoints =============================================================
	app.post('/api/emails', function (req, res) {
		// Take the array of emails, feed it to Stacklead API.	
		// { namespace: 'asdadf', emails: [ 'andyjiang@gmail.com', 'andy@twilio.com' ] }
		var emails = req.body.emails;
		var namespace = req.body.namespace;

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
					callback: 'http://leadscrub.herokuapp.com/api/leads/' + namespace
					// callback: 'http://1141356e.ngrok.com/api/leads/' + namespace
				}
			};

			request(opts, function (err, r, body) {
				if (err)
					res.send(err, 400);

				console.log(body);
				res.send(body, 200);
			});
		}
	});

	app.post('/api/leads/:namespace', function (req, res) {
		// Receiving webhook from Stacklead.
		console.log(req.params.namespace);
		console.log(req.body.data);

		io.of('/' + req.params.namespace).emit('leads', req.body.data);
		res.send(req.body.data, 200);
	});

	// Respond with a uniquely generated hash that will serve as socket namespace.
	app.get('/api/namespace', function (req, res) {
		// Respond with namespace.
		var hash = hashIds.encrypt(counter);
		counter = counter + 1;

		res.send({namespace: hash}, 200);
	});

	// Application route =========================================================
	app.get('/*', function (req, res) {
    res.sendfile('index.html', {'root': './public/views/'});
  });
};

}());