(function () {
    'use strict';

    angular
        .module('app.dashboard.unitFile')
        .controller('UnitFileDetailController', UnitFileDetailController);

    /* @ngInject */
    function UnitFileDetailController($interval, $modalInstance, $scope, model, fleetService) {
        var vm = this;
        vm.model = model;

        vm.onLoadClick = function() {
            fleetService.loadUnit(vm.model.name);
        };

        vm.onUnloadClick = function() {
            fleetService.unloadUnit(vm.model.name);
        };

        vm.onStartClick = function() {
            fleetService.startUnit(vm.model.name);
        };

        vm.onStopClick = function() {
            fleetService.stopUnit(vm.model.name);
        };

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
            refreshState();
            $interval(refreshState, 5000);
        }

        function refreshState() {
            fleetService.getUnitFile(vm.model.name)
                .then(function(unit) {
                    vm.model = unit;
                });
        }
    }
})();