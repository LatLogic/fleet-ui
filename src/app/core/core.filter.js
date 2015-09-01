(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('llHumanize', llHumanize)
        .filter('llInitial', llInitial)
    ;

    /* ngInject */
    function llHumanize() {

        return function (value) {
            if (angular.isUndefined(value)) {
                return '';
            }
            return value.split(/[_\-\.]+/).join(' ');
        };
    }

    /* ngInject */
    function llInitial() {

        return function (value) {
            if (angular.isUndefined(value)) {
                return '';
            }
            return value.toUpperCase()[0];
        };
    }
})();
