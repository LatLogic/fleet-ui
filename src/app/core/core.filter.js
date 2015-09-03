(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('llHumanize', llHumanize)
        .filter('llInitial', llInitial)
        .filter('llObjectKeys', llObjectKeys)
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

    /* ngInject */
    function llObjectKeys() {
        return function (options) {
            if (angular.isUndefined(options)) {
                return [];
            }
            return Object.keys(options);
        };
    }

})();
