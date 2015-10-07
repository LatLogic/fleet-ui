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
        vm.machineSlots = [];
        vm.units = [];
        vm.unitFiles = [];

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
                view: 'unitFile'
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
                keywords: machine.primaryIP
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

        vm.machineFilter = function(slot) {
            if (!vm.query.keywords || !slot.machineId) {
                return true;
            }
            var machine = vm.machines[slot.machineId];
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

                    if (vm.machineSlots.length === 0) {
                        vm.machineSlots = Object.keys(vm.machines)
                            .sort(compareMachineIds)
                            .map(function(id, index) {
                                return {
                                    order: index,
                                    machineId: id
                                };
                            });
                    }
                    if (vm.machineSlots.length < appConfig.MAX_MACHINE_SLOTS) {
                        for (var i=vm.machineSlots.length; i<appConfig.MAX_MACHINE_SLOTS; i++) {
                            vm.machineSlots.push({
                                order: i
                            });
                        }
                    }

                    vm.loading = false;
                });
        }

        // Sort by most units descending
        function compareMachineIds(a, b) {
            return vm.machines[b]._units.length - vm.machines[a]._units.length;
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
