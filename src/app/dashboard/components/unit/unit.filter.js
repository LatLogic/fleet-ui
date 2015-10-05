(function () {
    'use strict';

    angular
        .module('app.dashboard.unit')
        .filter('llUnitName', llUnitName)
        .filter('llUnitIconClass', llUnitIconClass)
        .filter('llUnitStatusClass', llUnitStatusClass)
        .filter('llUnitActiveState', llUnitActiveState)
        .filter('llUnitSubState', llUnitSubState)
        .filter('llUnitFileIconClass', llUnitFileIconClass)
        .filter('llUnitFileStatusClass', llUnitFileStatusClass)
    ;

    /* ngInject */
    function llUnitName() {
        return function(value) {
            if (angular.isUndefined(value)) {
                return '';
            }
            return value.slice(0, value.lastIndexOf('.'));
        };
    }

    /* ngInject */
    function llUnitIconClass() {
        return function(unit) {
            if (angular.isUndefined(unit) || !unit._timers) {
                return 'fa fa-cog';
            }
            return 'fa fa-clock-o';
        };
    }

    /* ngInject */
    function llUnitStatusClass() {
        return function(unit) {
            if (angular.isUndefined(unit)) {
                return 'default';
            }

            switch (unit.systemdActiveState.toLowerCase()) {
                case 'inactive':
                    return 'warning';
                default:
                case 'active':
                    return 'success';
            }
        };
    }

    /* ngInject */
    function llUnitActiveState() {
        return _getStateFilter('systemdActiveState');
    }

    /* ngInject */
    function llUnitSubState() {
        return _getStateFilter('systemdSubState');
    }

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

    function _getStateFilter(property) {
        return function(unit) {
            if (angular.isUndefined(unit)) {
                return;
            }
            return unit[property];
        };
    }
})();
