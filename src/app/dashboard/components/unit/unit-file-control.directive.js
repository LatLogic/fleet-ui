(function () {
    'use strict';

    angular
        .module('app.dashboard.unit')
        .directive('llUnitFileControl', llUnitFileControl);

    /* @ngInject */
    function llUnitFileControl() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/dashboard/components/unit/unit-file-control.html',
            scope: {
                model: '='
            },
            controller: UnitFileControlController,
            controllerAs: 'vm',
            bindToController: true,
            link: link
        };

        /* ngInject */
        function UnitFileControlController($scope, fleetService) {
            var vm = this;

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

            function activate() {
                // TODO: initialization of data
            }

            function bind(registrations) {

                // Detach listeners properly
                $scope.$on('$destroy', function () {
                    angular.forEach(registrations, function (unbind) {
                        unbind();
                    });
                });
            }
        }

        function link(scope, element, attributes, controller) {
            // perform DOM manipulation/binding here
        }
    }
})();
