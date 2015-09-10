(function () {
    'use strict';

    angular
        .module('app.dashboard.machine')
        .filter('llMachineIconClass', llMachineIconClass)
        .filter('llMachineSummaryState', llMachineSummaryState)
    ;

    /* ngInject */
    function llMachineIconClass() {
        return function(machine) {

            // Display special icons based on machine role
            try {
                if (machine.metadata.role.indexOf('processing') >= 0) {
                    return 'fa fa-cogs';
                } else if (machine.metadata.role === 'rds') {
                    return 'fa fa-database';
                } else if (machine.metadata.role === 'web') {
                    return 'fa fa-globe';
                }
            } catch (Exception) {
                // Ignore and use default icon
            }
            return 'fa fa-sitemap';
        };
    }

    /* ngInject */
    function llMachineSummaryState() {
        return function(machine) {
            if (!machine.units || machine.units.length === 0) {
                return 'default';
            }
            var inactive = machine.units.filter(function(u) {
                return u.currentState === 'inactive';
            });

            if (inactive.length === machine.units.length) {
                return 'inactive';
            }
            return inactive.length > 0 ? 'mixed' : 'active';
        };
    }
})();
