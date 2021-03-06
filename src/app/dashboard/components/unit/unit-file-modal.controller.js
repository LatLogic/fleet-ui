(function () {
    'use strict';

    angular
        .module('app.dashboard.unit')
        .controller('UnitFileModalController', UnitFileModalController);

    /* @ngInject */
    function UnitFileModalController($interval, $log, $modalInstance, $scope, appConfig, fleetService, model, timerModel) {
        var vm = this;
        vm.model = model;
        vm.timerModel = timerModel;
        vm.current = vm.model;
        vm.originalOptions = null;

        vm.editing = false;

        vm.onEditClick = function() {
            vm.originalOptions = angular.copy(vm.current._sections);
            vm.editing = true;
        };

        vm.onSaveClick = function() {
            $log.debug('updating unit file', vm.current.name);
            fleetService.updateUnitFile(vm.current)
                .then(function() {
                    vm.originalOptions = null;
                    vm.editing = false;
                })
                .catch(function(error) {
                    $log.error('failed updating unit file', error);
                });
        };

        vm.onCancelClick = function() {
            cancelEdits();
        };

        vm.onCloseClick = function() {
            cancelEdits();
            $modalInstance.dismiss();
        };

        // bind all listeners
        bind([
            fleetService.addChangeListener(onDataChange),
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

        function cancelEdits() {
            if (vm.originalOptions) {
                vm.current._sections = vm.originalOptions;
            }
            vm.editing = false;
        }

        function onDataChange(data) {
            if (vm.editing) {
                return;
            }

            var modelMatches = data.unitFiles.filter(function(f) {
                return f.name === vm.model.name;
            });

            var timerMatches = [];
            if (vm.timerModel) {
                timerMatches = data.unitFiles.filter(function(f) {
                    return f.name === vm.timerModel.name
                });
            }

            if (modelMatches.length > 0) {
                vm.model = modelMatches[0];
            }

            if (timerMatches.length > 0) {
                vm.timerModel = timerMatches[0];
            }

            // Update the current view
            if (vm.model.name === vm.current.name) {
                vm.current = vm.model;
            } else {
                vm.current = vm.timerModel;
            }
        }

        function initRefreshInterval() {
            var promise = $interval(refreshState, appConfig.QUERY_INTERVAL);
            return function cancelRefreshInterval() {
                $log.debug('cancel unit refresh $interval');
                $interval.cancel(promise);
            };
        }

        function refreshState() {
            $log.debug('Refresh File', new Date().getTime());
            fleetService.queryFleetApi().then(onDataChange);
        }
    }
})();
