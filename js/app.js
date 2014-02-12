'use strict';

/* App Module */

var mixandmatchApp = angular.module('mixandmatchApp', [
		'ngRoute',
        'ngCookies',
        'mixandmatchControllers',
        'mixandmatchFilters',
        'mixandmatchServices',
        'mixandmatchDirectives'
    ]).run(function ($rootScope, $location, $cookies) {
        $rootScope.location = $location;
        $rootScope.loggedInUserName = $cookies.userName;
    });

mixandmatchApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl'
            }).
            when('/logout', {
                templateUrl: 'partials/login.html',
                controller: 'LogoutCtrl'
            }).
            when('/listdates', {
                templateUrl: 'partials/listDates.html',
                controller: 'ListDatesCtrl',
                resolve: {
                    _userDetails: ['Session', function (Session) {
                        return Session.verifySession();
                    }]
                }
            }).
            when('/mydates', {
                templateUrl: 'partials/myDates.html',
                controller: 'MyDatesCtrl',
                resolve: {
                    _userDetails: ['Session', function (Session) {
                        return Session.verifySession();
                    }]
                }
            }).
            when('/newdate', {
                templateUrl: 'partials/newDate.html',
                controller: 'NewDateCtrl',
                resolve: {
                    _userDetails: ['Session', function (Session) {
                        return Session.verifySession();
                    }]
                }
            }).
            otherwise({
                redirectTo: '/login'
            });
    }]);
