(function () {
    'use strict';

    angular
        .module('app.dashboard.unit')
        .controller('UnitFileModalController', UnitFileModalController);

    /* @ngInject */
    function UnitFileModalController($interval, $log, $modalInstance, $scope, appConfig, model, timerModel, fleetService) {
        var vm = this;
        vm.model = model;
        vm.timerModel = timerModel;
        vm.current = vm.model;

        vm.onCloseClick = function() {
            $modalInstance.dismiss();
        };

        // bind all listeners
        bind([
            initRefreshInterval()
        ]);

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
        }

        function initRefreshInterval() {
            var promise = $interval(refreshState, appConfig.UNIT_REFRESH_DELAY);
            return function cancelRefreshInterval() {
                $log.debug('cancel unit refresh $interval');
                $interval.cancel(promise);
            };
        }

        function refreshState() {
            fleetService.getUnitFile(vm.model.name)
                .then(function(unit) {

                    // Update the model as well as current view
                    if (vm.model.name === vm.current.name) {
                        vm.current = vm.model = unit;
                    } else {
                        vm.model = unit;
                        vm.current = unit._timers[0];
                    }
                });
        }
    }
})();
