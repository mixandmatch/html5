'use strict';

/* Directives */

var directives = angular.module('mixandmatchDirectives', []);

directives.directive('navigation', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/navigation.html'
    };
});

directives.directive('mmdatepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datepicker({
                dateFormat: 'dd.mm.yy',
                firstDay: 1,
                monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                dayNamesMin: ['So', 'Mo', 'Die', 'Mi', 'Do', 'Fr', 'Sa'],
                onSelect: function (date) {
                	ngModelCtrl.$setViewValue(date);
                    scope.$apply();
                }
            });
        }
    };
});

directives.directive('dpaddnewdate', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datepicker({
                dateFormat: 'dd.mm.yy',
                firstDay: 1,
                monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                dayNamesMin: ['So', 'Mo', 'Die', 'Mi', 'Do', 'Fr', 'Sa'],
                onSelect: function (date) {
                    scope.addnewdate.date = date;
                    scope.$apply();
                }
            });
        }
    };
});