'use strict';

/* Services */

var movieServices = angular.module('movieServices', ['ngResource']);

movieServices.service('browser', ['$window', function($window) {

     return function() {

         var userAgent = $window.navigator.userAgent;

        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};

        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
       };

       return 'unknown';
    }

}]);

movieServices.factory('movie', ['browser', function(browser) {
        
        var movie_list = undefined;
        
        var makeMovieList = function() {
            movie_list = [];
            
            //movie_list.push("kishan");
            
            for(var i=0; i<window.json_data.directories.length; i++) {
                addMovieFromDir(window.json_data.directories[i], 'movies');
            }
        }
        
        var addMovieFromDir = function(dir, dir_path) {
            dir_path = dir_path || '';
            
            console.debug('fetching movie list from "' + (dir_path + '/' + dir.name || 'no name') + '"');
            
            if(dir.movies !== undefined) {
                for(var i=0; i<dir.movies.length; i++) {
                    //console.debug('\tadding movie in list "' + (dir.movies[i].name || 'no name') + '"');
                    
                    var movie = dir.movies[i];
                    
                    movie.imdb_rate = movie.imdb_rate || 1;
                    movie.year = movie.year || 1900;
                    
                    movie.rate = movie.imdb_rate / 2;
                    
                    movie.file_path = dir_path + '/' + dir.name + '/' + movie.file_name;
                    
                    movie_list.push(movie);
                }
            }
            
            // sub directories
            if(dir.directories !== undefined) {
                for(var i=0; i<dir.directories.length; i++) {
                    addMovieFromDir(dir.directories[i]);
                }
            }
        }
        
        var getAll = function() {
            if(movie_list === undefined)
                makeMovieList();
            
            return movie_list;
        }
        
        var getIMDBJson = function(imdb_id) {
            return imdb_id;
        }
        
        var getWhiteListExt = function () {
            var browser_name = browser();
            
            var whiteListExt = window.supported_media && window.supported_media[browser_name];
            
            whiteListExt = whiteListExt || [];
            
            return whiteListExt;
        }
        
        var getTypes = function() {
            if(movie_list === undefined)
                makeMovieList();
            
            var a = [];
            
            for(var i=0; i<movie_list.length; i++) {
                if(movie_list[i].types && movie_list[i].types.length > 0) {
                    for(var j=0; j<movie_list[i].types.length; j++) {
                        if(a.indexOf(movie_list[i].types[j]) === -1) {
                            a.push(movie_list[i].types[j]);
                        }
                    }
                }
            }
            
            return a;
        }

        return {
            //query: {method:'GET', isArray:true}
            getAll : getAll,
            getIMDBJson : getIMDBJson,
            getWhiteListExt : getWhiteListExt,
            getTypes : getTypes
        };
}]);

