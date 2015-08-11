(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('fleetService', fleetService);

    /* ngInject */
    function fleetService($http, $log) {

        return {
            getMachines: getMachines,
            getUnits: getUnits
        };

        function getMachines() {
            return $http({
                method: 'GET',
                url: '/api/v1/machines'
            }).then(function(response) {
                $log.debug('Machines:', response.data.length);
                return response.data;
            });
        }

        function getUnits() {
            return $http({
                method: 'GET',
                url: '/api/v1/units'
            }).then(function(response) {
                $log.debug('Units:', response.data.length);
                return response.data;
            });
        }
    }
})();
