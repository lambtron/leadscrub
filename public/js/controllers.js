'use strict';

leadscrub.controller('mainController',
  ['$scope', '$http', 'socket',
	function ($scope, $http, socket)
{
	// Initialize variables.
	var leads = $scope.leads = {
		emails: [], // Array of email addresses
		list: [], // Array of stacklead objects
		waiting: false,
		addEmail: function addEmail (email) {
			this.emails.push(email);
		},
		addLead: function addLead (lead) {
			this.list.push(lead);
		},
		scrubEmails: function scrubEmails () {
			// POST this.emails array to server.
			$http.post('/api/emails', this.emails)
			.success( function (data) {
				// Success!
				leads.waiting = true;
				console.log('Success: ');
				console.log(data);
				// Call socket after scrub emails is sent.
				// Receiving data from server via Socket.io.
				socket.of('/' + data.namespace, 'leads', function (data) {
					data.expand = false;	// Default is to be not expanded.
					$scope.leads.addLead(data);
					console.log('Receiving data from socket.io: ');
					console.log(data);
				});
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
}]);