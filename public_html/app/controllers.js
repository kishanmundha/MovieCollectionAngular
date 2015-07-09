'use strict';

/* Controllers */

var movieControllers = angular.module('movieControllers', []);

movieControllers.controller('movieListCtrl', ['$scope', 'movie',
    function($scope, movie) {
        $scope.movies = movie.getAll();

        $scope.orderByOptions = [
            { "text" : "Name", "value" : "name"},
            { "text" : "Imdb rating", "value" : "-imdb_rate" },
            { "text" : "Year", "value" : "-year" }
        ];
        
        $scope.movieOrderBy = "-imdb_rate";

        $scope.movieTypes = [
            "hollywood",
            "bollywood",
            "tollywood"
        ];
        
        $scope.movieLanguages = [
            "hindi",
            "english",
            "other"
        ];

        $scope.filterTypes = [];
        $scope.filterLang = [];
        
        $scope.isFilterMode = function() {
            return $scope.query || $scope.filterTypes.length !== 0 || $scope.filterLang.length !== 0;
        }

        $scope.filterMovies = function() {
            return function(item) {
                if($scope.filterTypes.length !== 0 && $scope.filterTypes.indexOf(item.type) === -1) {
                    return false;
                }
                
                if($scope.filterLang.length !== 0) {
                    if(!item.lang) {
                        return false;
                    }
                    
                    var found = false;
                    for(var i=0; i<item.lang.length; i++) {
                        if($scope.filterLang.indexOf(item.lang[i]) !== -1) {
                            found = true;
                            break;
                        }
                    }
                    
                    if(!found)
                        return false;
                }
                
                return true;
                //return item.name === criteria.name;
            };
        };

        $scope.SelectedPhone = {};

        $scope.ShowDetail = function(phone) {
            console.debug(phone);
            $scope.SelectedPhone = phone;
        }
    }]);

movieControllers.controller('movieDetailCtrl', ['$scope', '$routeParams', 'Phone',
    function($scope, $routeParams, Phone) {

        $scope.SelectedPhone = $scope.$parent.$parent.SelectedPhone;

        return;
        $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
            $scope.mainImageUrl = phone.images[0];
        });

        $scope.setImage = function(imageUrl) {
            $scope.mainImageUrl = imageUrl;
        }
    }]);
