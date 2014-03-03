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
			var lead = {
				person: {
					email: ''
				}
			};
			lead.person.email = email;

			this.list.push(lead);
			this.emails.push(email);
		},
		scrubEmails: function scrubEmails () {
			// POST this.emails array to server.
			console.log(this.emails);
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
		},
		removeAll: function removeAll () {
			this.emails.length = 0;
			this.list.length = 0;
		}
	};
}]);