'use strict';

/* Controllers */

var mixandmatchControllers = angular.module('mixandmatchControllers', []);

mixandmatchControllers.controller('LoginCtrl', ['$scope', '$location', '$cookies', 'Session',
    function ($scope, $location, $cookies, Session) {

        $scope.update = function (user) {
            Session.loginUser.post({userName: user.name, userPassword: user.password}, function (_result) {
                if (_result.status == "error") {
                    $scope.loginForm.$error.loginfailed = true;
                    $scope.errorMessage = "Anmeldung fehlgeschlagen";
                } else {
                    $scope.loginForm.$error.loginfailed = false;
                    $cookies.guid = _result.guid;
                    $cookies.userName = user.name;
                    $location.path("/listdates");
                }
            });
        };

    }]);

mixandmatchControllers.controller('LogoutCtrl', ['$scope', '$location', '$cookies', 'Session',
    function ($scope, $location, $cookies, Session) {

        Session.logoutUser.query({guid: $cookies.guid}, function (_result) {
            if (_result.status == "success") {
                delete $cookies.userName;
                delete $cookies.guid;
            }
            $location.path("/login");
        });

    }]);

mixandmatchControllers.controller('ListDatesCtrl', ['$scope', '$location', '$cookies', 'DateItems', 'Utilities', 'Session', '_userDetails',
        function ($scope, $location, $cookies, DateItems, Utilities, Session, _userDetails) {
            $scope.userDetails = _userDetails;
            $scope.search = {};

            //derefered inline calling example:
            //Session.verifySession().then(function(_result) { ... });

            $scope.timeOptions = [
                {key: 'allday', value: 'Ganzer Tag'},
                {key: '11:00', value: '11:00 Uhr'},
                {key: '11:15', value: '11:15 Uhr'},
                {key: '11:30', value: '11:30 Uhr'},
                {key: '11:45', value: '11:45 Uhr'},
                {key: '12:00', value: '12:00 Uhr'},
                {key: '12:15', value: '12:15 Uhr'},
                {key: '12:30', value: '12:30 Uhr'},
                {key: '12:45', value: '12:45 Uhr'},
                {key: '13:00', value: '13:00 Uhr'},
            ];

            $scope.search.time = 'allday';

            $scope.searchdates = function (_search) {
                delete $scope.dateItems;
                delete $scope.resultMessage;
                $scope.loaderIcon = true;
                var _dateTimeStart = 0
                var _dateTimeEnd = 0;

                if (_search.time == 'allday') {
                    _dateTimeStart = Utilities.convertDate(_search.date, '00:00');
                    _dateTimeEnd = Utilities.convertDate(_search.date, '23:59');
                } else {
                    _dateTimeStart = Utilities.convertDate(_search.date, _search.time);
                    _dateTimeEnd = _dateTimeStart;
                }

                if (!Utilities._.isUndefined(_dateTimeStart) &&
                    _dateTimeStart > 0 && !Utilities._.isUndefined(_dateTimeEnd) &&
                    _dateTimeEnd > 0) {
                    DateItems.fetchDateItemsByRange.query({guid: $cookies.guid, dateTimeStart: _dateTimeStart, dateTimeEnd: _dateTimeEnd}, function (_result) {
                        $scope.loaderIcon = false;
                        if (_result.status == "success" && _result.dateItems.length > 0) {
                            $scope.dateItems = _result.dateItems;
                        } else {
                            $scope.resultMessage = 'Leider keine Termine gefunden.';
                        }
                    });
                }
            };

            $scope.addAttendee = function (_dateItem) {
                DateItems.addAttendee.query({guid: $cookies.guid, dateGuid: _dateItem.guid, userName: $cookies.userName}, function (_result) {
                    if (_result.status == "success") {
                        _dateItem.attendees = _result.newDateItem.attendees;
                    } else {
                        $scope.resultMessage = 'Konnte nicht umbuchen';
                    }
                });
            };

            $scope.removeAttendee = function (_dateItem) {
                DateItems.removeAttendee.query({guid: $cookies.guid, dateGuid: _dateItem.guid, userName: $cookies.userName}, function (_result) {
                    if (_result.status == "success") {
                        _dateItem.attendees = _result.newDateItem.attendees;
                    } else {
                        $scope.resultMessage = 'Konnte nicht umbuchen';
                    }
                });
            };

            $scope.containsUser = function (_dateItem) {
                return (_.isUndefined(_.find(_dateItem.attendees, function (_attendee) {
                    return _attendee.userName == $cookies.userName;
                }))) ? false : true;
            };

        }]);

mixandmatchControllers.controller('MyDatesCtrl', ['$scope', '$location', '$cookies', 'DateItems', 'Utilities', 'Session', '_userDetails',
    function ($scope, $location, $cookies, DateItems, Utilities, Session, _userDetails) {
        $scope.userDetails = _userDetails;

        $scope.loaderIcon = true;
        DateItems.fetchDateItemsByOwnerName.query({guid: $cookies.guid, ownerName: $cookies.userName}, function (_result) {
            $scope.loaderIcon = false;
            if (_result.status == "success" && _result.dateItems.length > 0) {
                $scope.dateItems = _result.dateItems;
            } else {
                $scope.resultMessage = 'Leider keine Termine gefunden.';
            }
        });

        $scope.deleteDateItem = function (_dateItem) {
            DateItems.deleteDateItem.query({guid: $cookies.guid, dateGuid: _dateItem.guid}, function (_result) {
                if (_result.status == "success") {
                    $scope.loaderIcon = true;
                    delete $scope.dateItems;
                    DateItems.fetchDateItemsByOwnerName.query({guid: $cookies.guid, ownerName: $cookies.userName}, function (_result) {
                        $scope.loaderIcon = false;
                        if (_result.status == "success" && _result.dateItems.length > 0) {
                            $scope.dateItems = _result.dateItems;
                        } else {
                            $scope.resultMessage = 'Leider keine Termine gefunden.';
                        }
                    });
                    $scope.resultMessage = 'Termin wurde gelöscht';
                } else {
                    $scope.resultMessage = 'Konnte Termin nicht löschen';
                }
            });
        };

    }]);

mixandmatchControllers.controller('NewDateCtrl', ['$scope', '$location', '$cookies', 'DateItems', 'Utilities', 'Session', '_userDetails',
        function ($scope, $location, $cookies, DateItems, Utilities, Session, _userDetails) {
            $scope.userDetails = _userDetails;
            $scope.successMessage = false;
            $scope.errorMessage = false;
            $scope.addnewdate = {};

            $scope.timeOptions = [
                {key: '11:00', value: '11:00 Uhr'},
                {key: '11:15', value: '11:15 Uhr'},
                {key: '11:30', value: '11:30 Uhr'},
                {key: '11:45', value: '11:45 Uhr'},
                {key: '12:00', value: '12:00 Uhr'},
                {key: '12:15', value: '12:15 Uhr'},
                {key: '12:30', value: '12:30 Uhr'},
                {key: '12:45', value: '12:45 Uhr'},
                {key: '13:00', value: '13:00 Uhr'},
            ];

            $scope.addnewdate.time = '12:00';

            $scope.locationOptions = [
                {key: 'Unterföhring Haus 1', value: 'Unterföhring Haus 1'},
                {key: 'Unterföhring Haus 2', value: 'Unterföhring Haus 2'},
                {key: 'Metafinanz', value: 'Metafinanz'},
                {key: 'Neuperlach', value: 'Neuperlach'}
            ];

            $scope.addnewdate.location = 'Metafinanz';

            $scope.adddate = function (addnewdate) {
                var _timestamp = Utilities.convertDate(addnewdate.date, addnewdate.time);
                if(_timestamp > 0){
                    DateItems.addDateItem.post({guid: $cookies.guid, userName: $cookies.userName, location: addnewdate.location, dateTime: _timestamp}, function(_result){
                        if (_result.status == "success") {
                            $scope.successMessage = "Termin wurde erstellt";
                            $scope.errorMessage = false;;
                        } else {
                            $scope.successMessage = false;
                            $scope.errorMessage = "Termin konnte leider nicht erstellt werden";
                        }
                    });
                }
            };

        }]);