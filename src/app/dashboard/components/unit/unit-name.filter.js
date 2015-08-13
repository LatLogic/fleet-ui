(function () {
    'use strict';

    angular
        .module('app.dashboard.unit')
        .filter('llUnitName', llUnitName);

    /* ngInject */
    function llUnitName() {

        return function (value /*, opts */) {
            if (angular.isUndefined(value)) {
                return '';
            }
            return value.slice(0, value.lastIndexOf('.'));
        };
    }
})();
