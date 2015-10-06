(function () {
    'use strict';

    angular
        .module('app.dashboard.unit')
        .directive('llUnitFileContents', llUnitFileContents);

    /* @ngInject */
    function llUnitFileContents() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/dashboard/components/unit/unit-file-contents.html',
            scope: {
                model: '='
            },
            controller: UnitFileContentsController,
            controllerAs: 'vm',
            bindToController: true,
            link: link
        };

        /* ngInject */
        function UnitFileContentsController($scope) {
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
