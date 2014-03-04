leadscrub.config( ['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.
  when('/:namespace', {
    templateUrl: 'public/views/pages/page.html',
    controller: 'mainController'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);