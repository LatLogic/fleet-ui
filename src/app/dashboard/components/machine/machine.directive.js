(function () {
    'use strict';

    angular
        .module('app.dashboard.machine')
        .directive('llMachine', llMachine);

    /* @ngInject */
    function llMachine() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/dashboard/components/machine/machine.html',
            scope: {
                model: '='
            },
            controller: MachineController,
            controllerAs: 'vm',
            bindToController: true,
            link: link
        };

        /* ngInject */
        function MachineController($scope) {
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
