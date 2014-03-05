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
		var emails = req.body;

		// Generate namespace.
		var namespace = hashIds.encrypt(counter);
		counter = counter + 1;

		// Register socket.io connection for new namespace.
		io.of('/' + namespace);

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
					// callback: 'http://3bc71287.ngrok.com/api/leads/' + namespace
				}
			};

			request(opts, function (err, r, body) {
				if (err)
					res.send(err, 400);

				console.log(body);

				var load = {};
				load.body = body;
				load.namespace = namespace;
				res.send(load, 200);
			});
		}
	});

	app.post('/api/leads/:namespace', function (req, res) {
		// Receiving webhook from Stacklead.
		console.log(req.params.namespace);
		console.log(req.body.data);

		io.of('/' + req.params.namespace).emit('leads', req.body.data);
	});

	// Application routes ========================================================
	app.get('/', function (req, res) {
    res.sendfile('index.html', {'root': './public/views/'});
  });
};

}());