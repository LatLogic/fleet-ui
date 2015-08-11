(function () {
    'use strict';

    angular
        .module('app.dashboard.unit')
        .directive('llUnit', llUnit);

    /* @ngInject */
    function llUnit() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/dashboard/components/unit/unit.html',
            scope: {
                model: '='
            },
            controller: llUnitController,
            controllerAs: 'vm',
            bindToController: true,
            link: link
        };

        /* ngInject */
        function llUnitController($scope) {
            var vm = this;

            // TODO: define scope variables/functions

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
