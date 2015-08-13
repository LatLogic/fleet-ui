(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('indicators', indicators);

    /* ngInject */
    function indicators() {

        return {
            getMachineIconClass: getMachineIconClass,
            getUnitIconClass: getUnitIconClass,
            getUnitActiveClass: getUnitActiveClass,
            getUnitLoadClass: getUnitLoadClass
        };

        function getMachineIconClass(machine) {
            if (machine.Metadata.indexOf('role=rds') >= 0) {
                return 'fa fa-database';
            } else if (machine.Metadata.indexOf('role=processing') >= 0) {
                return 'fa fa-cogs';
            }
        }

        function getUnitIconClass(unit) {
            return unit.Unit.endsWith('.timer') ? 'fa fa-clock-o' : 'fa fa-cog';
        }

        function getUnitActiveClass(unit) {
                switch (unit.Active) {
                    case 'active':
                        return 'success';
                    case 'activating':
                    case 'deactivating':
                        return 'info';
                    case 'inactive':
                    case 'failed':
                        return 'danger';
                    default:
                        return 'default';
                }
        }

        function getUnitLoadClass(unit) {
            return unit.Load === 'not-found' ? 'warning' : 'success';
        }
    }
})();
