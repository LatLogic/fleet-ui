(function () {
    'use strict';

    angular
        .module('app.dashboard.unit')
        .filter('llUnitFileIconClass', llUnitFileIconClass)
        .filter('llUnitFileStatusClass', llUnitFileStatusClass)
    ;

    /* ngInject */
    function llUnitFileIconClass() {
        return function(file) {
            if (angular.isUndefined(file) || !file.name.endsWith('.timer')) {
                return 'fa fa-cog';
            }
            return 'fa fa-clock-o';
        };
    }

    /* ngInject */
    function llUnitFileStatusClass() {
        return function (file) {
            if (angular.isUndefined(file)) {
                return 'default';
            }

            var state = file.currentState || file.desiredState;
            switch (state.toLowerCase()) {
                case 'inactive':
                    return 'warning';
                case 'launched':
                    return 'success';
                default:
                case 'loaded':
                    return 'default';
            }
        };
    }
})();
