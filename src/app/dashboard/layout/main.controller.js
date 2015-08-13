(function () {
    'use strict';

    angular
        .module('app.dashboard.layout')
        .controller('DashboardMain', DashboardMain);

    /* @ngInject */
    function DashboardMain($q, $scope, fleetService) {
        var vm = this;
        vm.viewMode = 'machine';  // [unit|machine]
        vm.machines = [];
        vm.units = [];
        vm.filterText = '';

        // TODO: define scope variables/functions

        // bind all listeners
        bind([]);

        // activate the controller
        activate();

        function bind(registrations) {

            // Detach listeners properly
            $scope.$on('$destroy', function () {
                angular.forEach(registrations, function (unbind) {
                    unbind();
                });
            });
        }

        function activate() {
            $q.all([
                fleetService.getMachines(),
                fleetService.getUnits()
            ]).then(function(responses) {
                _mergeData(responses[0], responses[1]);
            });
        }

        function _mergeData(machines, units) {
            // Build list of units with related machine model
            vm.units = units
                .map(function(u) {
                    return angular.extend(u, {
                        machine: angular.copy(machines)
                            .filter(function(m) {
                                return u.Machine.split('/')[0] === m.Machine;
                            })[0]
                    });
                });

            // Combine timers with their corresponding unit
            var nonTimers = vm.units.filter(function(u) {
                return !u.Unit.endsWith('.timer');
            });
            var timers = vm.units.filter(function(u) {
                return u.Unit.endsWith('.timer');
            });

            vm.units = nonTimers.map(function(u) {
                var matches = timers.filter(function(t) {
                    return t.Unit.split('.').slice(0, -1).join('.') === u.Unit.split('.').slice(0, -1).join('.');
                });
                if (matches.length > 0) {
                    return angular.extend(u, {
                        timers: matches
                    });
                }
                return u;
            });
            //vm.units = _chunk(vm.units, 3);

            // Build list of machines with related unit model
            vm.machines = machines.map(function(m) {
                return angular.extend(m, {
                    units: angular.copy(vm.units)
                        .filter(function(u) {
                            return u.Machine.split('/')[0] === m.Machine;
                        }).map(function(u) {
                            delete u.machine;  // remove circular dependency
                            return u;
                        }),
                    meta_dict: _extractMetadata(m) // TODO make this a dict
                });
            });
            //vm.machines = _chunk(vm.machines, 3);
        }

        function _extractMetadata(machine) {
            return machine.Metadata.split(',')
                .map(function(pair) {
                    var kv = pair.split('=');
                    return {
                        key: kv[0],
                        value: kv[1]
                    };
                });
        }

        function _chunk(arr, size) {
            var newArr = [];
            for (var i=0; i<arr.length; i+=size) {
                newArr.push(arr.slice(i, i+size));
            }
            return newArr;
        }
    }
})();
