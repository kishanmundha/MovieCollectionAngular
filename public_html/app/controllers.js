'use strict';

/* Controllers */

var movieControllers = angular.module('movieControllers', []);

movieControllers.controller('movieListCtrl', ['$scope', 'movie', '$http', '$window', '$translate', '$filter',
    function($scope, movie, $http, $window, $translate, $filter) {
        
        /**
         * Set data in session storage
         * @param {String} key
         * @param {Object} value
         * @returns {null}
         */
        $scope.setSessionValue = function(key, value) {
            if (window.sessionStorage) {
                window.sessionStorage[key] = value;
            }
        };

        /**
         * Get data from session storage
         * @param {String} key
         * @returns {Object}
         */
        $scope.getSessionValue = function(key) {
            return window.sessionStorage && window.sessionStorage[key];
        };

        /**
         * Language
         */
        $scope.lang = $scope.getSessionValue('lang') || 'en';
        $translate.use($scope.lang);
        
        /**
         * Change current language
         * @param {String} lang
         * @returns {null}
         */
        $scope.changeLang = function(lang) {
            $translate.use(lang);
            $scope.setSessionValue('lang', lang);
        };

        $scope.movies = movie.getAll();

        $scope.orderByOptions = [
            {"text": {"en": "Name", "hi": "नाम"}, "value": "name"},
            {"text": {"en": "Imdb rating", "hi": "IMDB रेटिंग"}, "value": "-imdb_rate"},
            {"text": {"en": "Year", "hi": "वर्ष"}, "value": "-year"},
            {"text": {"en": "Duration", "hi": "अवधि"}, "value": "-length"},
            {"text": {"en": "Duration ASC", "hi": "अवधि आरोही"}, "value": "length"}
        ];

        $scope.movieOrderBy = $scope.getSessionValue('orderby') || "-imdb_rate";

        $scope.movieRegions = [
            "hollywood",
            "bollywood",
            "tollywood",
            "gujrati"
        ];

        $scope.movieTypes = movie.getTypes();

        $scope.movieLanguages = [
            "hindi",
            "english",
            "other"
        ];

        $scope.videoQualities = [
            {"id": "hd", "text": "high definition"},
            {"id": "sd", "text": "standard definition"}
        ];

        $scope.filterRegions = [];
        $scope.filterTypes = [];
        $scope.filterLang = [];
        $scope.filterVideoQuality = [];
        $scope.filterSubtitles = false;
        $scope.filterOther = {
            "unwatchedOnly": false
        };
        
        var getFilterFromCache = function() {
            return JSON.parse($scope.getSessionValue('filterObj') || "{}");
        };
        
        var setFilterToCache = function(obj) {
            $scope.setSessionValue('filterObj', JSON.stringify(obj))
        };
        
        /// store value in session
        $scope.$watch('filterOther.unwatchedOnly', function() {
            var obj = getFilterFromCache();
            obj.filterOther = $scope.filterOther;
            
            setFilterToCache(obj);
        });
        
        (function() {
            var obj = getFilterFromCache();
            $scope.filterOther = obj.filterOther || {};
        })();

        /**
         * Get filter mode status
         * @returns {Boolean}
         */
        $scope.isFilterMode = function() {
            return $scope.query
                    || $scope.filterRegions.length !== 0
                    || $scope.filterTypes.length !== 0
                    || $scope.filterLang.length !== 0
                    || $scope.filterVideoQuality.length !== 0
                    || $scope.filterSubtitles === true
                    || $scope.filterOther.unwatchedOnly === true
                    ;
        };

        /**
         * Custom filter
         * @returns {Function}
         */
        $scope.filterMovies = function() {
            return function(item) {
                if($scope.filterOther.unwatchedOnly === true && item.watched === true) {
                    return false;
                }
                
                if ($scope.filterRegions.length !== 0 && $scope.filterRegions.indexOf(item.region) === -1) {
                    return false;
                }

                if ($scope.filterTypes.length !== 0) {
                    if (!item.types) {
                        return false;
                    }

                    var found = false;
                    for (var i = 0; i < item.types.length; i++) {
                        if ($scope.filterTypes.indexOf(item.types[i]) !== -1) {
                            found = true;
                            break;
                        }
                    }

                    if (!found)
                        return false;
                }

                if ($scope.filterLang.length !== 0) {
                    if (!item.lang) {
                        return false;
                    }

                    var found = false;
                    for (var i = 0; i < item.lang.length; i++) {
                        if ($scope.filterLang.indexOf(item.lang[i]) !== -1) {
                            found = true;
                            break;
                        }
                    }

                    if (!found)
                        return false;
                }

                if ($scope.filterVideoQuality.length !== 0) {
                    if (!item.quality || $scope.filterVideoQuality.indexOf(item.quality.video) === -1)
                        return false;
                }

                if ($scope.filterSubtitles === true && item.subtitles !== true) {
                    return false;
                }

                return true;
                //return item.name === criteria.name;
            };
        };

        /////////////////

        $scope.LangOptions = [
            {"text": "English", "value": "en"},
            {"text": "हिन्दी", "value": "hi"}
        ];

        $scope.displayLimitOptions = [
            {"text": 8, "value": 8},
            {"text": 10, "value": 10},
            {"text": 20, "value": 20},
            {"text": 50, "value": 50}
        ];

        $scope.startFrom = 0;
        $scope.displayLimit = ($scope.getSessionValue('dlimit') && parseInt($scope.getSessionValue('dlimit'))) || 10;
        $scope.currentPage = 1;

        /**
         * Current page change event
         * @returns {null}
         */
        $scope.currentPageChange = function() {
            $scope.startFrom = ($scope.currentPage - 1) * $scope.displayLimit;
        };

        /**
         * Get status string to display in footer
         * @returns {String}
         */
        $scope.getStatusString = function() {
            if (!$scope.isFilterMode()) {
                //return "Total movies : " + $scope.movies.length;
                return ($scope.startFrom + 1) + "-" + Math.min(($scope.startFrom + $scope.displayLimit), $scope.movies.length) + " / " + $scope.movies.length;
            }
            else {
                var len = ($filter('filter')(
                        $filter('filter')($scope.movies, {'name': $scope.query}),
                        $scope.filterMovies()
                        )).length;

                return ($scope.startFrom + 1) + "-" + Math.min(($scope.startFrom + $scope.displayLimit), len) + " / " + len;

                //return "Showing movies "
                //        + len
                //        + " of " + $scope.movies.length;
            }
        };

        /**
         * Get string for movie length
         * @param {int} len
         * @returns {String}
         */
        $scope.getMovieLengthString = function(len) {
            if (!len)
                return undefined;

            var hours = parseInt(len / 60);
            var minutes = len % 60;

            return hours + ":" + (minutes < 10 ? '0' + minutes : minutes);
        };
        
        /**
         * Get string of file size
         * @param {long} size
         * @returns {String}
         */
        $scope.getFileSizeString = function(size) {
            if (!size)
                return undefined;

            size = parseFloat(size);

            var SizeMap = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

            var SizeMapPos = 0;

            while (size >= 1024 && SizeMapPos < SizeMap.length) {
                size = parseFloat(size / 1024);

                SizeMapPos++;
            }

            if (size >= 10)
                size = size - size % 1;
            else
                size = parseInt(size * 100) / 100;

            return size + ' ' + SizeMap[SizeMapPos];
        };
        
        /**
         * Get comma seprated languages list
         * @param {Array} arr
         * @returns {String}
         */
        $scope.getArrayJoinString_Lang = function(arr) {
            if( Object.prototype.toString.call( arr ) !== '[object Array]' )
                return '';
            
            var a = [];
            for(var i=0; i<arr.length; i++) {
                a.push($filter('translate')(arr[i]));
            }
            
            return a.join(', ');
        };

        /**
         * Play movie
         * @param {MovieObject} m
         * @returns {null}
         */
        $scope.playMovie = function(m) {
            var whiteListExt = movie.getWhiteListExt();

            if (whiteListExt.indexOf(m.ext) === -1) {
                alert('Not support media');
                return;
            }

            window.open(m.file_path, 'play_movie', 'fullscreen=1, location=no');

            //$("#viewMovieModal").modal('show');
        };

        $scope.toggleFilterArea = function() {
            $("#filterBodyArea").toggleClass("filter-body-area");
            $("#toggleFilterAreaBtn").toggleClass("glyphicon-collapse-down");
            $("#toggleFilterAreaBtn").toggleClass("glyphicon-collapse-up");
        };

        $scope.openIMDBLink = function(imdb_id) {
            if (!imdb_id)
                return;

            return $window.open('http://www.imdb.com/title/' + imdb_id + '/', '_blank');
        };

        $scope.showIMDBData = function(imdb_id) {
            if (!imdb_id)
                return;

            return;
            $http.jsonp('http://app.imdb.com/title/maindetails?tconst=' + imdb_id).success(function(data) {
                console.debug(data);
            }).error(function(data) {
                console.debug(data);
            });
        };

        /**
         * Custome search filter
         * @param {MovieObject} m
         * @returns {Boolean}
         */
        $scope.search = function(m) {
            if ($scope.query === undefined || $scope.query.length === 0) {
                return true;
            }

            var m_name = m.name || 'No name';
            var m_name2 = m.name || 'No name';

            m_name = m_name[$scope.lang] || m_name;
            m_name2 = m_name2['en'] || m_name2;

            return m_name.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1
                    || m_name2.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1
                    ;
        };
        
//        $scope._orderBy = function(m) {
//
//            if($scope.movieOrderBy !== 'name') {
//                return m[$scope.movieOrderBy];
//            }
//            else {
//                return (m[name] && m[name][$scope.lang]) || m[name];
//            }
//        }
        
        $scope.showMoreOptions = function() {
            $('#moreSettingsModal').modal('show');
        };

        $scope.init = function() {

        };
    }
]);

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
movieControllers.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
});