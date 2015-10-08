(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('fleetService', fleetService);

    /* ngInject */
    function fleetService($http, $log, $q, $rootScope, _, appConfig) {
        var EVENT_KEY = "fleet.change";

        return {
            addChangeListener: addChangeListener,
            // Throttle queries to keep from spamming the API
            queryFleetApi: _.throttle(queryFleetApi, appConfig.QUERY_INTERVAL),
            getUnitFile: getUnitFile,
            loadUnit: loadUnit,
            unloadUnit: unloadUnit,
            startUnit: startUnit,
            stopUnit: stopUnit
        };

        function addChangeListener(listener) {
            return $rootScope.$on(EVENT_KEY, function(event, data) {
                listener(data);
            });
        }

        function queryFleetApi() {
            $log.debug('Query', new Date().getTime());

            return $q.all([
                getMachines(),
                getUnitFiles(),
                getUnits()
            ]).then(function(responses) {
                var data = _mergeData(responses[0], responses[1], responses[2]);
                _fireChangeEvent(data);
                return data;
            });
        }

        function _mergeData(machines, files, units) {
            var unitFilesByName = _.indexBy(files, 'name');
            var machinesById = _.indexBy(machines, 'id');

            // The data return object
            var data = {
                unitFiles: files
            };

            units = units.map(function(state) {
                return angular.extend(state, {
                    _file: unitFilesByName[state.name],
                    _machine: angular.copy(machinesById[state.machineID])
                });
            });

            // Link timers with their corresponding unit
            var nonTimers = units.filter(function(u) {
                return !appConfig.IS_TIMER(u.name);
            });
            var timers = units.filter(function(u) {
                return appConfig.IS_TIMER(u.name);
            });

            // Add timer information if applicable
            data.units = nonTimers.map(function(u) {
                var matches = timers.filter(function(t) {
                    return appConfig.IS_PAIRED(t.name, u.name);
                });
                if (matches.length > 0) {
                    return angular.extend(u, {
                        _timers: matches
                    });
                }
                return u;
            });

            // Build list of machines with related unit model
            data.machines = machines.map(function(m) {
                return angular.extend(m, {
                    _units: angular.copy(data.units)
                        .filter(function(u) {
                            return u.machineID === m.id;
                        }).map(function(u) {
                            delete u._machine;  // remove circular dependency
                            return u;
                        })
                });
            });

            return data;
        }

        function _fireChangeEvent(data) {
            $rootScope.$emit(EVENT_KEY, data);
        }

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
