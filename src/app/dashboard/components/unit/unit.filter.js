(function () {
    'use strict';

    angular
        .module('app.dashboard.unit')
        .filter('llUnitName', llUnitName)
        .filter('llUnitIconClass', llUnitIconClass)
        .filter('llUnitActiveState', llUnitActiveState)
        .filter('llUnitLoadState', llUnitLoadState)
        .filter('llUnitSubState', llUnitSubState)
    ;

    /* ngInject */
    function llUnitName() {
        return function (value) {
            if (angular.isUndefined(value)) {
                return '';
            }
            return value.slice(0, value.lastIndexOf('.'));
        };
    }

    /* ngInject */
    function llUnitIconClass() {
        return function (unit) {
            if (angular.isUndefined(unit) || !unit.timers) {
                return 'fa fa-cog';
            }
            return 'fa fa-clock-o';
        };
    }

    /* ngInject */
    function llUnitActiveState() {
        return _getStateFilter('systemdActiveState');
    }

    /* ngInject */
    function llUnitLoadState() {
        return _getStateFilter('systemdLoadState');
    }

    /* ngInject */
    function llUnitSubState() {
        return _getStateFilter('systemdSubState');
    }

    function _getStateFilter(property) {
        return function (unit, ignoreTimer) {
            if (angular.isUndefined(unit)) {
                return '';
            }
            if (ignoreTimer || !unit.timers) {
                return _getValue(unit, property);
            }
            return _getValue(unit.timers[0], property);
        };
    }

    function _getValue(unit, property) {
        if (angular.isUndefined(unit.state)) {
            return '';
        }
        return unit.state[property];
    }
})();
