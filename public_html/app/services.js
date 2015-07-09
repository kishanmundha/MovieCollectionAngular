'use strict';

/* Services */

var movieServices = angular.module('movieServices', ['ngResource']);

movieServices.factory('movie', function() {
        
        var movie_list = undefined;
        
        var makeMovieList = function() {
            movie_list = [];
            
            //movie_list.push("kishan");
            
            for(var i=0; i<window.json_data.directories.length; i++) {
                addMovieFromDir(window.json_data.directories[i]);
            }
        }
        
        var addMovieFromDir = function(dir) {
            console.debug('fetching movie list from "' + (dir.name || 'no name') + '"');
            
            if(dir.movies !== undefined) {
                for(var i=0; i<dir.movies.length; i++) {
                    console.debug('\tadding movie in list "' + (dir.movies[i].name || 'no name') + '"');
                    
                    movie_list.push(dir.movies[i]);
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

        return {
            //query: {method:'GET', isArray:true}
            getAll : getAll
        };
});
