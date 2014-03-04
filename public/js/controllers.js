'use strict';

leadscrub.controller('mainController',
  ['$scope', '$http', 'socket', '$routeParams', '$location',
	function ($scope, $http, socket, $routeParams, $location)
{
	// Initialize variables.
	var leads = $scope.leads = {
		emails: [], // Array of email addresses
		list: [], // Array of stacklead objects
		namespace: $routeParams.namespace,
		waiting: false,
		addEmail: function addEmail (email) {
			this.emails.push(email);
		},
		addLead: function addLead (lead) {
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
				leads.waiting = true;
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

	// Receiving data from server via Socket.io.
	socket.of('/' + $routeParams.namespace, 'leads', function (data) {
		data.expand = false;	// Default is to be not expanded.
		$scope.leads.addLead(data);
		console.log('Receiving data from socket.io: ');
		console.log(data);
	});
}]);