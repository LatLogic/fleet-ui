(function () {
    'use strict';

    angular
        .module('app.dashboard.layout')
        .controller('DashboardMain', DashboardMain);

    /* @ngInject */
    function DashboardMain($interval, $log, $q, $scope, _, filterService, fleetService) {
        var MAX_MACHINE_SLOTS = 10;

        var vm = this;

        // query
        vm.query = {};

        // view state
        vm.loading = false;
        vm.autoRefresh = {
            enabled: true,
            delay: 15000
        };

        // view data
        vm.machines = [];
        vm.machineSlots = [];
        vm.units = [];

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

        vm.onUnitMachineClick = function(machine) {
            filterService.pushState({
                view: 'machine',
                keywords: machine.primaryIP
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
            var matchingUnits = machine.units.filter(vm.unitFilter);
            return machine.primaryIP.indexOf(vm.query.keywords)>=0 ||
                _.values(machine.metadata).join('').indexOf(vm.query.keywords)>=0 ||
                matchingUnits.length>0;
        };

        vm.unitFilter = function(unit) {
            if (!vm.query.keywords) {
                return true;
            }
            return unit.name.indexOf(vm.query.keywords)>=0 ||
                (unit.timers && unit.timers[0].name.indexOf(vm.query.keywords)>=0);
        };

        vm.onDropComplete = function(tgtSlot, srcSlot) {
            if (!srcSlot || !tgtSlot) {
                return;
            }
            swapSlots(tgtSlot, srcSlot);
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
            queryLazy();
        }

        function displayQuery() {
            vm.query = filterService.getState(false);
        }

        function query() {
            $q.all([
                fleetService.getMachines(),
                fleetService.getUnits(),
                fleetService.getState()
            ]).then(function(responses) {
                mergeData(responses[0], responses[1], responses[2]);
                vm.loading = false;
            });
        }

        var queryLazy = _.debounce(query, 1000);

        function mergeData(machines, units, states) {
            // Build list of units with related machine model
            vm.units = units
                .map(function(u) {

                    // Add machine and state information
                    return angular.extend(u, {
                        machine: angular.copy(machines)
                            .filter(function(m) {
                                return u.machineID === m.id;
                            })[0],
                        state: states.filter(function(s) {
                            return u.name===s.name;
                        })[0],
                        options: _.groupBy(u.options, 'section')
                    });
                });

            // Combine timers with their corresponding unit
            var nonTimers = vm.units.filter(function(u) {
                return !u.name.endsWith('.timer');
            });
            var timers = vm.units.filter(function(u) {
                return u.name.endsWith('.timer');
            });

            // Add timer information if applicable
            vm.units = nonTimers.map(function(u) {
                var matches = timers.filter(function(t) {
                    return t.name.split('.').slice(0, -1).join('.') === u.name.split('.').slice(0, -1).join('.');
                });
                if (matches.length > 0) {
                    return angular.extend(u, {
                        timers: matches
                    });
                }
                return u;
            });

            // Build list of machines with related unit model
            var machineList = machines.map(function(m) {
                return angular.extend(m, {
                    units: angular.copy(vm.units)
                        .filter(function(u) {
                            return u.machineID === m.id;
                        }).map(function(u) {
                            delete u.machine;  // remove circular dependency
                            return u;
                        })
                });
            });

            // Index by machine ID
            vm.machines = _.indexBy(machineList, 'id');

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
            if (vm.machineSlots.length < MAX_MACHINE_SLOTS) {
                for (var i=vm.machineSlots.length; i<=MAX_MACHINE_SLOTS; i++) {
                    vm.machineSlots.push({
                        order: i
                    });
                }
            }
        }

        // Sort by most units descending
        function compareMachineIds(a, b) {
            return vm.machines[b].units.length - vm.machines[a].units.length;
        }

        function registerAutoRefresh() {
            cancelAutoRefresh();
            if (vm.autoRefresh.enabled) {
                vm.autoRefresh.promise = $interval(queryLazy, vm.autoRefresh.delay);
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
