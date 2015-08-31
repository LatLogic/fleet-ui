(function () {
    'use strict';

    angular
        .module('app.dashboard.layout')
        .controller('DashboardMain', DashboardMain);

    /* @ngInject */
    function DashboardMain($interval, $log, $q, $scope, _, filterService, fleetService) {
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

        vm.onUnitMachineClick = function(unit) {
            filterService.pushState({
                view: 'machine',
                keywords: unit.machine.IPAddress
            });
        };

        vm.onAutoRefreshClick = function() {
            vm.autoRefresh.enabled = !vm.autoRefresh.enabled;
            registerAutoRefresh();
        };

        vm.machineFilter = function(value) {
            if (!vm.query.keywords) {
                return true;
            }
            var matchingUnits = value.units.filter(vm.unitFilter);
            return value.IPAddress.indexOf(vm.query.keywords)>=0 ||
                value.Metadata.indexOf(vm.query.keywords)>=0 ||
                matchingUnits.length>0;
        };

        vm.unitFilter = function(value) {
            if (!vm.query.keywords) {
                return true;
            }
            return value.Unit.indexOf(vm.query.keywords)>=0 ||
                (value.timers && value.timers[0].Unit.indexOf(vm.query.keywords)>=0);
        };

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
                fleetService.getUnits()
            ]).then(function(responses) {
                mergeData(responses[0], responses[1]);
                vm.loading = false;
            });
        }

        var queryLazy = _.debounce(query, 1000);

        function mergeData(machines, units) {
            // Build list of units with related machine model
            vm.units = units
                .map(function(u) {
                    return angular.extend(u, {
                        machine: angular.copy(machines)
                            .filter(function(m) {
                                return u.Machine.split('/')[0] === m.Machine;
                            })[0]
                    });
                });

            // Combine timers with their corresponding unit
            var nonTimers = vm.units.filter(function(u) {
                return !u.Unit.endsWith('.timer');
            });
            var timers = vm.units.filter(function(u) {
                return u.Unit.endsWith('.timer');
            });

            vm.units = nonTimers.map(function(u) {
                var matches = timers.filter(function(t) {
                    return t.Unit.split('.').slice(0, -1).join('.') === u.Unit.split('.').slice(0, -1).join('.');
                });
                if (matches.length > 0) {
                    return angular.extend(u, {
                        timers: matches
                    });
                }
                return u;
            });

            // Build list of machines with related unit model
            vm.machines = machines.map(function(m) {
                return angular.extend(m, {
                    units: angular.copy(vm.units)
                        .filter(function(u) {
                            return u.Machine.split('/')[0] === m.Machine;
                        }).map(function(u) {
                            delete u.machine;  // remove circular dependency
                            return u;
                        }),
                    meta_dict: extractMetadata(m)
                });
            });
        }

        function extractMetadata(machine) {
            var list = machine.Metadata.split(',')
                .map(function(pair) {
                    var kv = pair.split('=');
                    return {
                        name: kv[0],
                        value: kv[1]
                    };
                });
            return _.indexBy(list, 'name');
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
