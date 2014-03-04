'use strict';

leadscrub.controller('mainController',
  ['$scope', '$http', 'socket',
	function ($scope, $http, socket)
{
	// Initialize variables.
	var leads = $scope.leads = {
		emails: [], // Array of email addresses
		list: [], // Array of stacklead objects
		namespace: '',
		addEmail: function addEmail (email) {
			// Add email to list.
			// var lead = {
			// 	person: {
			// 		email: ''
			// 	}
			// };
			// lead.person.email = email;

			// this.list.push(lead);
			this.emails.push(email);
		},
		addLead: function addLead (lead) {
			console.log(lead);
			this.list.push(lead);
		},
		scrubEmails: function scrubEmails () {
			// POST this.emails array to server.
			var postLoad = {};
			postLoad.namespace = this.namespace;
			postLoad.emails = this.emails;

			$http.post('/api/emails', postLoad)
			.success( function (data) {
				// Success!
				console.log('Success: ' + data);
			})
			.error( function (data) {
				// Error.
				console.log('Error: ' + data);
			});
		},
		removeAll: function removeAll () {
			this.emails.length = 0;
			this.list.length = 0;
		}
	};

	// On load, send GET to server to retrieve socket namespace.
	$http.get('/api/namespace')
	.success( function (data) {
		console.log('Success: ');
		console.log(data);
		leads.namespace = data.namespace;
	})
	.error( function (data) {
		console.log('Error: ' + data);
	});

	// Receiving data from server via Socket.io.
	socket.of('/' + leads.namespace, 'leads', function (data) {
		data.expand = false;	// Default is to be not expanded.
		$scope.leads.addLead(data);
		console.log('Receiving data from socket.io: ');
		console.log(data);
	});
}]);