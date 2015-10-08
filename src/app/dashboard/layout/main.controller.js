(function () {
    'use strict';

    angular
        .module('app.dashboard.layout')
        .controller('DashboardMain', DashboardMain);

    /* @ngInject */
    function DashboardMain($interval, $log, $modal, $scope, _, appConfig, filterService, fleetService) {
        var vm = this;

        // query
        vm.query = {};

        // view state
        vm.loading = false;
        vm.autoRefresh = {
            enabled: true,
            delay: appConfig.QUERY_INTERVAL
        };

        // view data
        vm.machines = [];
        vm.units = [];
        vm.unitFiles = [];
        vm.metadataHeaders = [];

        vm.onKeywordsChange = function() {
            // TODO angular client-side filtering for now
            filterService.pushState({
                keywords: vm.query.keywords
            });
        };

        vm.onClearKeywordsClick = function() {
            filterService.pushState({
                keywords: undefined
            });
        };

        vm.onUnitFileViewModeClick = function() {
            filterService.pushState({
                view: 'unit-file'
            });
        };

        vm.onMachineViewModeClick = function() {
            filterService.pushState({
                view: 'machine'
            });
        };

        vm.onUnitViewModeClick = function() {
            filterService.pushState({
                view: 'unit'
            });
        };

        vm.onUnitMachineClick = function($event, machine) {
            $event.stopPropagation();
            filterService.pushState({
                keywords: machine.primaryIP,
                view: 'unit'
            });
        };

        vm.onUnitFileClick = function(file, timerFile) {
            $log.debug('opening modal for', file.name);
            var modal = $modal.open({
                templateUrl: 'app/dashboard/components/unit/unit-file-modal.html',
                controller: 'UnitFileModalController as vm',
                windowClass: 'll-unit-file-modal',
                size: 'lg',
                resolve: {
                    model: function() {
                        return file;
                    },
                    timerModel: function() {
                        return timerFile;
                    }
                }
            });

            modal.result.then(function() {
                $log.debug('modal closed');
            });
        };

        vm.onAutoRefreshClick = function() {
            vm.autoRefresh.enabled = !vm.autoRefresh.enabled;
            registerAutoRefresh();
        };

        vm.machineFilter = function(machine) {
            var matchingUnits = machine._units.filter(vm.unitFilter);
            return machine.primaryIP.indexOf(vm.query.keywords)>=0 ||
                _.values(machine.metadata).join('').indexOf(vm.query.keywords)>=0 ||
                matchingUnits.length>0;
        };

        vm.unitFilter = function(unit) {
            var text = vm.query.keywords;
            if (!text) {
                return true;
            }
            return unit.name.indexOf(text)>=0 || unit.hash.indexOf(text)>=0 ||
                (unit._timers && unit._timers[0].name.indexOf(text)>=0) ||
                (unit._machine && (unit._machine.primaryIP.indexOf(text)>=0 || unit._machine.id.indexOf(text)>=0));
        };

        vm.onDropComplete = function(tgtSlot, srcSlot) {
            if (!srcSlot || !tgtSlot) {
                return;
            }
            swapSlots(tgtSlot, srcSlot);
        };

        vm.slotFilledFilter = function(slot) {
            return slot && slot.machineId;
        };

        function swapSlots(to, from) {
            var swap = angular.copy(to);
            to.machineId = from.machineId;
            to.expanded = from.expanded;
            from.machineId = swap.machineId;
            from.expanded = swap.expanded;
        }

        function activate() {
            displayQuery();

            vm.loading = true;
            query();

            registerAutoRefresh();
        }

        function onFilterChange() {
            displayQuery();
            vm.loading = true;
            query();
        }

        function displayQuery() {
            vm.query = filterService.getState(false);
        }

        function query() {
            $log.debug('Refresh Main', new Date().getTime());
            fleetService.queryFleetApi()
                .then(function(data) {
                    vm.machines = data.machines;
                    vm.unitFiles = data.unitFiles;
                    vm.units = data.units;
                    vm.metadataHeaders = buildMetadataHeaders(vm.machines);

                    vm.loading = false;
                });
        }

        function buildMetadataHeaders(machines) {

            // Gather all possible metadata fields across all machines
            var allFields = [].concat.apply([], machines.map(function(m) {
                return _.keys(m.metadata);
            }));

            // Return the unique set of fields
            return _.uniq(allFields);
        }

        function registerAutoRefresh() {
            cancelAutoRefresh();
            if (vm.autoRefresh.enabled) {
                vm.autoRefresh.promise = $interval(query, vm.autoRefresh.delay);
            }
        }

        function cancelAutoRefresh() {
            if (vm.autoRefresh.promise) {
                $log.debug('cancel auto-refresh $interval');
                $interval.cancel(vm.autoRefresh.promise);
                vm.autoRefresh.promise = undefined;
            }
        }

        // bind all listeners and cleanup
        bind([
            filterService.addChangeListener(onFilterChange),
            cancelAutoRefresh
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
    }
})();
