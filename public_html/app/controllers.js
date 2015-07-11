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
        
        $scope.getMovieLengthString = function(len) {
            if(!len)
                return undefined;
            
            var hours = parseInt(len / 60);
            var minutes = len % 60;
            
            return "Duration " + hours + ":" + (minutes<10?'0'+minutes:minutes);
        }
        
        $scope.getFileSizeString = function(size) {
            if(!size)
                return undefined;
            
            size = parseFloat(size);
            
            var SizeMap = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            
            var SizeMapPos = 0;
            
            while(size >= 1024 && SizeMapPos < SizeMap.length) {
                size = parseFloat(size / 1024);
                
                SizeMapPos++;
            }
            
            if(size >= 10)
                size = size - size % 1;
            else
                size = parseInt(size*100)/100;
            
            return size + ' ' + SizeMap[SizeMapPos];
        }
        
        $scope.playingMovie = undefined;
        
        $scope.playMovie = function (movie) {
            $scope.playingMovie = movie;
            
            var whiteListExt = ['mkv'];
            
            if(whiteListExt.indexOf(movie.ext) === -1) {
                alert('Not support media');
                return;
            }
            
            window.open(movie.file_path, 'play_movie', 'fullscreen=1, location=no');
            
            //$("#viewMovieModal").modal('show');
        }

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
