(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('fleetService', fleetService);

    /* ngInject */
    function fleetService($http, $log) {

        return {
            getMachines: getMachines,
            getUnits: getUnits,
            getState: getState
        };

        function getMachines() {
            return $http({
                method: 'GET',
                url: '/api/machines'
            }).then(function(response) {
                var data = response.data.machines || [];
                $log.debug('query machines:', data.length);
                return data;
            });
        }

        function getUnits() {
            return $http({
                method: 'GET',
                url: '/api/units'
            }).then(function(response) {
                var data = response.data.units || [];
                $log.debug('query units:', data.length);
                return data;
            });
        }

        function getState() {
            return $http({
                method: 'GET',
                url: '/api/state'
            }).then(function(response) {
                var data = response.data.states || [];
                $log.debug('query states:', data.length);
                return data;
            });
        }
    }
})();
