'use strict';

/* App Module */

var movieApp = angular.module('movieApp', [
  //'ngRoute',
  //'phonecatAnimations',

  'movieControllers',
  //'phonecatFilters',
  'movieServices',
  'checklist-model',
  'ui.bootstrap'
]);

//movieApp.config(['$routeProvider',
//  function($routeProvider) {
//    $routeProvider.
//      when('/movies', {
//        templateUrl: 'partials/movie-list.html',
//        controller: 'movieListCtrl'
//      }).
//      when('/phones/:phoneId', {
//        templateUrl: 'partials/phone-detail.html',
//        controller: 'PhoneDetailCtrl'
//      }).
//      otherwise({
//        redirectTo: '/movies'
//      });
//  }]);
