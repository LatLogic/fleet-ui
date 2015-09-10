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
            if (angular.isUndefined(unit) || !unit.timers) {
                return 'fa fa-cog';
            }
            return 'fa fa-clock-o';
        };
    }

    /* ngInject */
    function llUnitActiveState() {
        return _getStateFilter('systemdActiveState', 'currentState');
    }

    /* ngInject */
    function llUnitLoadState() {
        return _getStateFilter('systemdLoadState', 'currentState');
    }

    /* ngInject */
    function llUnitSubState() {
        return _getStateFilter('systemdSubState', 'currentState');
    }

    function _getStateFilter(property, fallbackProperty) {
        return function(unit, ignoreTimer) {
            if (angular.isUndefined(unit)) {
                return undefined;
            }
            if (ignoreTimer || !unit.timers) {
                return _getStateValue(unit, property) ||
                    _getValue(unit, fallbackProperty);
            }
            return _getStateValue(unit.timers[0], property) ||
                _getValue(unit.timers[0], fallbackProperty);
        };
    }

    function _getStateValue(unit, property) {
        if (angular.isUndefined(unit.state)) {
            return undefined;
        }
        return unit.state[property];
    }

    function _getValue(unit, property) {
        return unit[property];
    }
})();
