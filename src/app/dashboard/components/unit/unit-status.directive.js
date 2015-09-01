(function () {
    'use strict';

    angular
        .module('app.dashboard.unit')
        .directive('llUnitStatus', llUnitStatus);

    /* @ngInject */
    function llUnitStatus() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/dashboard/components/unit/unit-status.html',
            scope: {
                model: '='
                // TODO unitState
            },
            controller: UnitStatusController,
            controllerAs: 'vm',
            bindToController: true,
            link: link
        };

        /* ngInject */
        function UnitStatusController($scope) {
            var vm = this;

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
