(function () {
    'use strict';

    angular
        .module('app.dashboard.unit')
        .directive('llUnit', llUnit);

    /* @ngInject */
    function llUnit(recursionHelper) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/dashboard/components/unit/unit.html',
            scope: {
                model: '='
            },
            controller: UnitController,
            controllerAs: 'vm',
            bindToController: true,
            compile: function(element) {
                return recursionHelper.compile(element, link);
            }
        };

        /* ngInject */
        function UnitController($scope) {
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
