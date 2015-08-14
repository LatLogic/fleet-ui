(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('filterService', filterService);

    /* ngInject */
    function filterService($log, $rootScope, $state, $stateParams) {
        var FILTER_KEY = 'filter.change';
        var DEFAULT_STATE = {
            'view-mode': 'machine'
        };

        // Listen for location changes
        $rootScope.$on('$stateChangeSuccess', _onStateChange);

        return {
            // TODO: list service methods
            getState: getState,
            pushState: pushState,
            clearState: clearState,
            addChangeListener: addChangeListener
        };

        function getState(includeUndefined) {
            var current = includeUndefined ?
                $stateParams : _getValidParams($stateParams);
            return angular.extend({}, DEFAULT_STATE, current);
        }

        function pushState(state) {
            var newState = angular.extend(getState(true), state);
            $state.go($state.current.name, newState);
        }

        function clearState() {
            $state.go($state.current.name, angular.copy(DEFAULT_STATE));
        }

        function addChangeListener(listener) {
            return $rootScope.$on(FILTER_KEY, function(event, selection) {
                listener(selection);
            });
        }

        function _fireChangeEvent() {
            $rootScope.$emit(FILTER_KEY, getState());
        }

        function _onStateChange() {
            $log.debug('filter changed', $stateParams);
            _fireChangeEvent();
        }

        function _getValidParams(params) {
            params = angular.copy(params);
            var keys = Object.keys(params);
            for (var i=keys.length-1; i>=0; i--) {
                var key = keys[i];
                if (!params[key]) {
                    delete params[key];
                }

            }
            return params;
        }
    }
})();
