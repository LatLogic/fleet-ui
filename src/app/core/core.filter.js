(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('llInitial', llInitial);

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
