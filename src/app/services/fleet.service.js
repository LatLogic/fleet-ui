(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('fleetService', fleetService);

    /* ngInject */
    function fleetService($http, $log) {

        return {
            getMachines: getMachines,
            getUnitFile: getUnitFile,
            getUnitFiles: getUnitFiles,
            getUnits: getUnits,
            loadUnit: loadUnit,
            unloadUnit: unloadUnit,
            startUnit: startUnit,
            stopUnit: stopUnit
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

        function getUnitFile(name) {
            return $http({
                method: 'GET',
                url: '/api/units/' + name
            }).then(function(response) {
                return _processUnitFile(response.data);
            });
        }

        function getUnitFiles() {
            return $http({
                method: 'GET',
                url: '/api/units'
            }).then(function(response) {
                var data = response.data.units || [];
                $log.debug('query unit files:', data.length);
                return data.map(_processUnitFile);
            });
        }

        function getUnits() {
            return $http({
                method: 'GET',
                url: '/api/state'
            }).then(function(response) {
                var data = response.data.states || [];
                $log.debug('query units:', data.length);
                return data;
            });
        }

        function loadUnit(name) {
            return _changeUnitState(name, 'loaded');
        }

        function unloadUnit(name) {
            return _changeUnitState(name, 'inactive');
        }

        function startUnit(name) {
            return _changeUnitState(name, 'launched');
        }

        function stopUnit(name) {
            return _changeUnitState(name, 'loaded');
        }

        function _changeUnitState(name, state) {
            return $http({
                method: 'PUT',
                url: '/api/units/' + name,
                data: {
                    desiredState: state
                }
            }).then(function(response) {
                var data = response.data;
                $log.debug('state change success', name, state, response.status);
                return data;
            }).catch(function(response) {
                $log.error('state change error', name, state, response.status);
            });
        }

        function _processUnitFile(file) {

            // Index options by section
            var sections = _.groupBy(file.options, 'section');
            return angular.extend(file, {
                _sections: sections
            });
        }
    }
})();
