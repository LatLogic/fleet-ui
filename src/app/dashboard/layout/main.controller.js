(function () {
    'use strict';

    angular
        .module('app.dashboard.layout')
        .controller('DashboardMain', DashboardMain);

    /* @ngInject */
    function DashboardMain($q, $scope, fleetService) {
        var vm = this;
        vm.machines = [];

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
                var machines = responses[0],
                    units = responses[1];
                vm.machines = machines
                    .map(function(m) {
                        return angular.extend(m, {
                            units: units.filter(function(u) {
                                return u.Machine.split('/')[0] === m.Machine;
                            })
                        });
                    });
            });
        }
    }
})();
