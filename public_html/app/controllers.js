'use strict';

/* Controllers */

var movieControllers = angular.module('movieControllers', []);

movieControllers.controller('movieListCtrl', ['$scope', 'movie', '$http', '$window',
    function($scope, movie, $http, $window) {

        $scope.movies = movie.getAll();

        $scope.orderByOptions = [
            { "text" : "Name", "value" : "name"},
            { "text" : "Imdb rating", "value" : "-imdb_rate" },
            { "text" : "Year", "value" : "-year" },
            { "text" : "Duration", "value" : "length" },
            { "text" : "Duration DESC", "value" : "-length" }
        ];
        
        $scope.movieOrderBy = "-imdb_rate";

        $scope.movieRegions = [
            "hollywood",
            "bollywood",
            "tollywood"
        ];
        
        $scope.movieTypes = movie.getTypes();
        
        $scope.movieLanguages = [
            "hindi",
            "english",
            "other"
        ];
        
        $scope.videoQualities = [
            {"id" : "hd", "text" : "high defination"},
            {"id" : "sd", "text" : "standard defination"}
        ];

        $scope.filterRegions = [];
        $scope.filterTypes = [];
        $scope.filterLang = [];
        $scope.filterVideoQuality = [];
        $scope.filterSubtitles = false;
        
        $scope.isFilterMode = function() {
            return $scope.query
                    || $scope.filterRegions.length !== 0
                    || $scope.filterTypes.length !== 0
                    || $scope.filterLang.length !== 0
                    || $scope.filterVideoQuality.length !== 0
                    || $scope.filterSubtitles === true
            ;
        }

        $scope.filterMovies = function() {
            return function(item) {
                if($scope.filterRegions.length !== 0 && $scope.filterRegions.indexOf(item.region) === -1) {
                    return false;
                }
                
                if($scope.filterTypes.length !== 0) {
                    if(!item.types) {
                        return false;
                    }
                    
                    var found = false;
                    for(var i=0; i<item.types.length; i++) {
                        if($scope.filterTypes.indexOf(item.types[i]) !== -1) {
                            found = true;
                            break;
                        }
                    }
                    
                    if(!found)
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
                
                if($scope.filterVideoQuality.length !== 0) {
                    if(!item.quality || $scope.filterVideoQuality.indexOf(item.quality.video) === -1)
                        return false;
                }
                
                if($scope.filterSubtitles === true && item.subtitles !== true) {
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
            
            return hours + ":" + (minutes<10?'0'+minutes:minutes);
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
        
        $scope.playMovie = function (m) {
            var whiteListExt = movie.getWhiteListExt();

            if(whiteListExt.indexOf(m.ext) === -1) {
                alert('Not support media');
                return;
            }
            
            window.open(m.file_path, 'play_movie', 'fullscreen=1, location=no');
            
            //$("#viewMovieModal").modal('show');
        }
        
        $scope.toggleFilterArea = function() {
            $("#filterBodyArea").toggleClass("filter-body-area");
            $("#toggleFilterAreaBtn").toggleClass("glyphicon-collapse-down");
            $("#toggleFilterAreaBtn").toggleClass("glyphicon-collapse-up");
        }
        
        $scope.openIMDBLink = function (imdb_id) {
            if(!imdb_id)
                return;
            
            return $window.open('http://www.imdb.com/title/' + imdb_id + '/', '_blank');
        }
        
        $scope.showIMDBData = function (imdb_id) {
            if(!imdb_id)
                return;

            return;
            $http.jsonp('http://app.imdb.com/title/maindetails?tconst=' + imdb_id).success(function(data) {
                console.debug(data);
            }).error(function(data) {
                console.debug(data);
            });
        }

        $scope.init = function () {
            
        }
    }]);

