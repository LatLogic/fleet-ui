(function () {
    'use strict';

    angular
        .module('app.dashboard.layout')
        .controller('DashboardMain', DashboardMain);

    /* @ngInject */
    function DashboardMain($q, $scope, fleetService) {
        var vm = this;
        vm.viewMode = 'unit';  // 'machine'
        vm.machines = [];
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

            // Build list of machines with related unit model
            vm.machines = machines
                .map(function(m) {
                    return angular.extend(m, {
                        units: angular.copy(units)
                            .filter(function(u) {
                                return u.Machine.split('/')[0] === m.Machine;
                            }).map(function(u) {
                                delete u.machine;  // remove circular dependency
                                return u;
                            })
                    });
                });
        }
    }
})();
