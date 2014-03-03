'use strict';

leadscrub.controller('mainController',
  ['$scope', '$http',
	function ($scope, $http)
{
	// Initialize variables.
	var leads = $scope.leads = {
		emails: [], // Array of email addresses
		list: [], // Array of stacklead objects
		addEmail: function addLead (email) {
			// Add email to list.
			var lead = {};
			lead.person.email = email;
			this.list.push(lead);
			this.emails.push(email);
		},
		scrubEmails: function scrubEmails () {
			// POST this.emails array to server.
			$http.post('/api/emails', this.emails)
			.success( function (data) {
				// Success!
				console.log('Success: ' + data);
				leads.list = data;
			})
			.error( function (data) {
				// Error.
				console.log('Error: ' + data);
			});
		}
	};
}]);