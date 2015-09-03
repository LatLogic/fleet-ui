(function () {
    'use strict';

    angular
        .module('app.dashboard.unit')
        .controller('UnitDetailController', UnitDetailController);

    /* @ngInject */
    function UnitDetailController($modalInstance, $scope, model) {
        var vm = this;
        vm.model = model;

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
            // TODO: initialization of data
        }
    }
})();
