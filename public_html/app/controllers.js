'use strict';

/* Controllers */

var movieControllers = angular.module('movieControllers', []);

movieControllers.controller('movieListCtrl', ['$scope', 'movie',
  function ($scope, movie) {
      $scope.movies = movie.getAll();
      $scope.rate = 4;
      console.debug($scope.movies);
      //$scope.phones = movie.query();
      $scope.orderProp = 'age';

      //console.debug($scope);

      $scope.SelectedPhone = {};

      $scope.ShowDetail = function (phone) {
          console.debug(phone);
          $scope.SelectedPhone = phone;
      }
  }]);

movieControllers.controller('movieDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function ($scope, $routeParams, Phone) {

      $scope.SelectedPhone = $scope.$parent.$parent.SelectedPhone;

      return;
      $scope.phone = Phone.get({ phoneId: $routeParams.phoneId }, function (phone) {
          $scope.mainImageUrl = phone.images[0];
      });

      $scope.setImage = function (imageUrl) {
          $scope.mainImageUrl = imageUrl;
      }
  }]);
