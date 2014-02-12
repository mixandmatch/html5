'use strict';

/* Services */

var mixandmatchServices = angular.module('mixandmatchServices', ['ngResource']);

mixandmatchServices.factory('Session', ['$resource', '$q', '$cookies', '$location', 
	function($resource, $q, $cookies, $location){
		return {
			loginUser: $resource('/service/loginUser', {}, {
				post: {method:'POST'}
			}),
			getUserDetails: $resource('/service/getUserDetails/:guid/:userName', {}, {
				query: {method:'GET', params:{guid:'', userName:''}, isArray:false}
			}),
			logoutUser: $resource('/service/logoutUser/:guid', {}, {
				query: {method:'GET', params:{guid:''}, isArray:false}
			}),
			verifySession: function(){
				var _deferred = $q.defer();
				if(angular.isUndefined($cookies.guid) || $cookies.guid == '' || angular.isUndefined($cookies.userName) || $cookies.userName == ''){
					delete $cookies.guid;
					delete $cookies.userName;
					_deferred.reject();
					console.log("GUID / Username missing.");
					$location.path("/login");
				} else {
					var _query = $resource('/service/getUserDetails/:guid/:userName', {guid:'', userName:''});
					var _result = _query.get({userName: $cookies.userName, guid: $cookies.guid}, function () {
						if(angular.isDefined(_result) && _result.status == 'success'){
							_deferred.resolve(_result.userDetails);
						} else {
							_deferred.reject();
							console.log("Userdetails missing.");
							$location.path("/login");
						}
					});					
				}

				return _deferred.promise;
			}
		}
	}]);

mixandmatchServices.factory('DateItems', ['$resource',
	function($resource){
		return {
			fetchDateItemsByRange: $resource('/service/fetchDateItemsByRange/:guid/:dateTimeStart/:dateTimeEnd', {}, {
				query: {method:'GET', params:{guid:'', dateTimeStart:'', dateTimeEnd:''}, isArray:false}
			}),
            fetchDateItemsByOwnerName: $resource('/service/fetchDateItemsByOwnerName/:guid/:ownerName', {}, {
                query: {method:'GET', params:{guid:'', ownerName:''}, isArray:false}
            }),
            addDateItem: $resource('/service/addDateItem', {}, {
                post: {method:'POST'}
            }),
            deleteDateItem: $resource('/service/deleteDateItem/:guid/:dateGuid', {}, {
                query: {method:'GET', params:{guid:'', dateGuid:''}, isArray:false}
            }),
            addAttendee: $resource('/service/addAttendee/:guid/:dateGuid/:userName', {}, {
                query: {method:'GET', params:{guid:'', dateGuid:'', userName:''}, isArray:false}
            }),
            removeAttendee: $resource('/service/removeAttendee/:guid/:dateGuid/:userName', {}, {
                query: {method:'GET', params:{guid:'', dateGuid:'', userName:''}, isArray:false}
            })
		}
	}]);
	
mixandmatchServices.factory('Utilities', function() {
        return {
            convertDate: function(_date, _time){
                var _dateArray = _date.split('.');
                var _timeArray = _time.split(':');
                //month is zero based in js
                var _seconds = new Date(_dateArray[2], _dateArray[1] - 1, _dateArray[0], _timeArray[0], _timeArray[1], 0, 0).getTime();
                if(_seconds > 0){
                    return _seconds;
                } else {
                    return 0;
                }
            },
            //reference to underscore
            _: window._
        };
    });	
